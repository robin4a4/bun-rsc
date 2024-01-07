import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { BuildConfig, type BunPlugin } from "bun";
import recursive from "recursive-readdir";
import { ClientEntry } from "./types.js";
import { combineUrl } from "./utils/common-utils.js";
import {
	resolveRoot,
	resolveDist,
	resolveSrc,
	rscClientComponentMapUrl,
	ssrClientComponentMapUrl,
	writeMap,
} from "./utils/server-utils.js";
import postcss from "postcss";

const transpiler = new Bun.Transpiler({ loader: "tsx" });

const clientDist = resolveDist("client");

function isClientComponent(code: string) {
	return code.startsWith('"use client"') || code.startsWith("'use client'");
}

let postcssPlugin: BunPlugin | null = null;
try {
	const postcssConfig = await import(resolveRoot("postcss.config.js"));
	postcssPlugin = {
		name: 'postcss',
		setup(build) {
		  // Listen for file load events with a filter for CSS files
		  build.onLoad({ filter: /\.css$/ }, async (args) => {
			console.log("onLoad")
			// Read the content of the CSS file
			const rawCode = await Bun.file(args.path).text();
			console.log(rawCode)
			// Process the CSS content using postcss
			const result = await postcss([
			  // Add other postcss plugins if needed
			  ...(postcssConfig.plugins || []),
			]).process(rawCode, {
			  from: args.path,
			});
			console.log(result.css)
			// Return the processed CSS content and set the loader to 'css'
			return { contents: result.css };
		  });
		},
	  };
} catch (e) {
	console.log("No postcss config found")
}

/**
 * Build all server and client components with esbuild
 */
export async function build() {
	const rscClientComponentMap: Record<string, ClientEntry> = {};
	const ssrClientComponentMap: Record<string, ClientEntry> = {};

	const clientEntryPoints = new Set<string>();

	console.log("💿 Building server components");
	const serverDist = resolveDist("server/");
	if (!fs.existsSync(serverDist)) {
		await fs.promises.mkdir(serverDist, { recursive: true });
	}

	// Build server components
	const entrypoints = await recursive(resolveSrc("views"));
	
	const serverBuildPlugins: BunPlugin[] = [
		{
		name: "build-server-components",
		setup(build) {
			build.onLoad({ filter: /\.(ts|tsx)$/ }, async ({ path }) => {
				const code = await Bun.file(path).text();
				if (!isClientComponent(code)) {
					// if not a client component, just return the code and let it be bundled
					return {
						contents: code,
						loader: "tsx",
					};
				}
				clientEntryPoints.add(path);

				// if it is a client component, return a reference to the client bundle
				const root = process.cwd();
				const srcSplit = root.split("/");
				const currentDirectoryName = combineUrl(
					srcSplit[srcSplit.length - 1],
					path.replace(root, ""),
				);
				const outputKey = combineUrl("/dist/client", currentDirectoryName);

				const moduleExports = transpiler.scan(code).exports;
				let refCode = "";
				for (const exp of moduleExports) {
					let id = null;
					if (exp === "default") {
						id = `${outputKey}#default`;
						refCode += `\nexport default { $$typeof: Symbol.for("react.client.reference"), $$async: false, $$id: "${id}", name: "default" }`;
					} else {
						id = `${outputKey}#${exp}`;
						refCode += `\nexport const ${exp} = { $$typeof: Symbol.for("react.client.reference"), $$async: false, $$id: "${id}", name: "${exp}" }`;
					}
					const rscChunkId = outputKey
						.replace(".tsx", ".rsc.js")
						.replace(".ts", ".rsc.js");
					rscClientComponentMap[id] = {
						id: rscChunkId,
						chunks: [rscChunkId],
						name: exp,
					};
					const ssrChunkId = outputKey
						.replace(".tsx", ".ssr.js")
						.replace(".ts", ".ssr.js");
					ssrClientComponentMap[id] = {
						id: ssrChunkId,
						chunks: [ssrChunkId],
						name: exp,
					};
				}

				return {
					contents: refCode,
					loader: "js",
				};
			});
		},
	}]
	if (postcssPlugin) {
		serverBuildPlugins.push(postcssPlugin)
	}
	await Bun.build({
		target: "bun",
		sourcemap: "none",
		splitting: true,
		format: "esm",
		entrypoints,
		outdir: serverDist,
		plugins: serverBuildPlugins,
	});

	if (!fs.existsSync(clientDist)) {
		await fs.promises.mkdir(clientDist, { recursive: true });
	}

	if (clientEntryPoints.size > 0) {
		console.log("🏝 Building client components");
	}

	const clientBuildOptions: BuildConfig = {
		format: "esm",
		entrypoints: [
			...clientEntryPoints,
			fileURLToPath(new URL("../src/router.tsx", import.meta.url)),
		],
		target: "browser",
		sourcemap: "none",
		splitting: true,
		outdir: clientDist,
	};

	// Build client components for CSR
	const csrResults = await Bun.build({
		...clientBuildOptions,
		naming: "[dir]/[name].rsc.[ext]",
	});
	if (!csrResults.success) {
		console.log("[BUN RSC] CSR build success: ❌");
		console.log(csrResults.logs);
	}

	// Build client components for SSR. React is externalized to avoid duplication and hooks errors at stream generation time.
	const ssrResults = await Bun.build({
		...clientBuildOptions,
		naming: "[dir]/[name].ssr.[ext]",
		external: ["react", "react-dom"],
	});
	if (!ssrResults.success) {
		console.log("[BUN RSC] SSR build success: ❌");
		console.log(ssrResults.logs);
	}

	// Write the client component maps
	await writeMap(rscClientComponentMapUrl, rscClientComponentMap);
	await writeMap(ssrClientComponentMapUrl, ssrClientComponentMap);
}
