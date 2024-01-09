import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { type BuildArtifact, BuildConfig, type BunPlugin } from "bun";
import postcss from "postcss";
import recursive from "recursive-readdir";
import { ClientEntry } from "./types.js";
import { combineUrl } from "./utils/common-utils.js";
import {
	bunBuildDirectory,
	resolveClientDist,
	resolveDist,
	resolveRoot,
	resolveSrc,
	rscClientComponentMapUrl,
	serverActionMapUrl,
	ssrClientComponentMapUrl,
	writeMap,
} from "./utils/server-utils.js";
// @ts-ignore
import * as ReactServerDomServer from "react-server-dom-webpack/server.browser";

const TSXTranspiler = new Bun.Transpiler({ loader: "tsx" });
const TSTranspiler = new Bun.Transpiler({ loader: "ts" });

const clientDist = resolveClientDist();

function isClientComponentModule(code: string) {
	return code.startsWith('"use client"') || code.startsWith("'use client'");
}

function isServerActionModule(code: string) {
	return code.startsWith('"use server"') || code.startsWith("'use server'");
}

/**
 * Build all server and client components with esbuild
 */
export async function build() {
	const rscClientComponentMap: Record<string, ClientEntry> = {};
	const ssrClientComponentMap: Record<string, ClientEntry> = {};
	const serverActionMap: Record<string, ClientEntry> = {};

	const clientEntryPoints = new Set<string>();
	const serverActionEntryPoints = new Set<string>();

	console.log("💿 Building server components");
	const serverDist = resolveDist("server/");
	if (!fs.existsSync(serverDist)) {
		await fs.promises.mkdir(serverDist, { recursive: true });
	}

	// Build server components
	const entrypoints = await recursive(resolveSrc("pages"));

	const serverBuildPlugins: BunPlugin[] = [
		{
			name: "build-client-components-and-server-actions",
			setup(build) {
				build.onLoad({ filter: /\.(ts|tsx)$/ }, async ({ path }) => {
					const code = await Bun.file(path).text();
					const root = process.cwd();
					const srcSplit = root.split("/");
					const currentDirectoryName = combineUrl(
						srcSplit[srcSplit.length - 1],
						path.replace(root, ""),
					);
					if (isClientComponentModule(code)) {
						// if it is a client component, return a reference to the client bundle
						clientEntryPoints.add(path);

						const outputKey = combineUrl(
							`/${bunBuildDirectory}/client`,
							currentDirectoryName,
						);

						const moduleExports = TSXTranspiler.scan(code).exports;
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
					}
					if (isServerActionModule(code)) {
						serverActionEntryPoints.add(path);

						const outputKey = combineUrl(
							`/${bunBuildDirectory}/server`,
							currentDirectoryName,
						);
						const moduleExports = TSTranspiler.scan(code).exports;
						let refCode = "";
						for (const exp of moduleExports) {
							const id =
								exp === "default"
									? `${outputKey}#default`
									: `${outputKey}#${exp}`;
							refCode += `export${exp === "default" ? " default " : " "}const ${
								exp === "default" ? "default" : exp
							} = ${ReactServerDomServer.registerServerReference({}, outputKey, exp)}`;
							const chunkId = outputKey
								.replace(".tsx", ".js")
								.replace(".ts", ".js");

							serverActionMap[id] = {
								id: chunkId,
								chunks: [chunkId],
								name: exp,
							};
						}
						console.log(refCode, serverActionMap);
						return {
							contents: refCode,
							loader: "js",
						};
					}

					// If not a client component, return the original code
					return {
						contents: code,
						loader: "tsx",
					};
				});
			},
		},
	];

	const serverBuildResult = await Bun.build({
		target: "bun",
		sourcemap: "none",
		splitting: true,
		format: "esm",
		entrypoints,
		outdir: serverDist,
		plugins: serverBuildPlugins,
	});
	if (!serverBuildResult.success) {
		console.log("[BUN RSC] Server build success: ❌");
		console.log(serverBuildResult.logs);
	}

	if (!fs.existsSync(clientDist)) {
		await fs.promises.mkdir(clientDist, { recursive: true });
	}

	if (clientEntryPoints.size > 0) {
		console.log("💪 Building server actions");
	}

	const serverActionResults = await Bun.build({
		format: "esm",
		entrypoints: [...serverActionEntryPoints],
		target: "browser",
		sourcemap: "none",
		splitting: true,
		outdir: serverDist,
	});
	if (!serverActionResults.success) {
		console.log("[BUN RSC] Server actions build success: ❌");
		console.log(serverActionResults.logs);
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
	await writeMap(serverActionMapUrl, serverActionMap);

	/**
	 * Parse CSS files with postcss
	 */
	async function parseCSS(files: BuildArtifact[]) {
		const cssFiles = files.filter((f) => f.path.endsWith(".css"));
		const manifest: Array<string> = [];
		try {
			const postcssConfig = await import(resolveRoot("postcss.config.js"));
			const postcssConfigPlugins = Object.entries(postcssConfig.plugins).map(
				([name, options]) => {
					const plugin = require(name);
					return plugin(options);
				},
			);
			for (const f of cssFiles) {
				const rawCSS = await Bun.file(f.path).text();
				const result = await postcss(postcssConfigPlugins).process(rawCSS, {
					from: f.path,
				});
				await Bun.write(f.path, result.css);
				const fileName = f.path.replace(resolveRoot(""), "/");
				manifest.push(fileName);
			}
			await Bun.write(resolveDist("manifest.json"), JSON.stringify(manifest));
		} catch (e) {
			console.log(e);
		}
	}

	parseCSS(serverBuildResult.outputs);
}
