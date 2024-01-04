import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {
	combineUrl,
	resolveDist,
	resolveSrc,
	writeClientComponentMap,
} from "./utils.js";
import { ClientEntry } from "./types.js";

const isDebug = true
const transpiler = new Bun.Transpiler({ loader: "tsx" })

const clientDistRSC = resolveDist("client/rsc");
const clientDistSSR = resolveDist("client/ssr");

function isClientComponent(code: string) {
	return code.startsWith('"use client"') || code.startsWith("'use client'")
}

/**
 * Build all server and client components with esbuild
 */
export async function build() {

	const clientComponentMap: Record<string, ClientEntry> = {};

	const clientEntryPoints = new Set<string>();

	console.log("💿 Building server components");
	const serverDist = resolveDist("server/");
	if (!fs.existsSync(serverDist)) {
		await fs.promises.mkdir(serverDist, { recursive: true });
	}
	
	await Bun.build({
		target: "bun",
		sourcemap: "none",
		splitting: true,
		format: "esm",
		entrypoints: [resolveSrc("views/index.tsx")],
		outdir: serverDist,
		plugins: [
			{
				name: "rsc-server",
				setup(build) {
					build.onLoad({ filter: /\.(ts|tsx)$/ }, async ({path}) => {
						const code = await Bun.file(path).text()
						if (!isClientComponent(code)) {
							// if not a client component, just return the code and let it be bundled
							return {
								contents: code,
								loader: "tsx",
							}
						}
						clientEntryPoints.add(path)

						// if it is a client component, return a reference to the client bundle
						const root = process.cwd()
						const srcSplit = root.split("/")
						const currentDirectoryName = combineUrl(srcSplit[srcSplit.length - 1], path.replace(root, ""))
						const rscOutputKey = combineUrl("/dist/client/rsc", currentDirectoryName)
						
						const moduleExports = transpiler.scan(code).exports
						let refCode = ""
						for (const exp of moduleExports) {
							let id = null
							if (exp === "default") {
								id = `${rscOutputKey}#default`
								refCode += `\nexport default { $$typeof: Symbol.for("react.client.reference"), $$async: false, $$id: "${id}", name: "default" }`
							} else {
								id = `${rscOutputKey}#${exp}`
								refCode += `\nexport const ${exp} = { $$typeof: Symbol.for("react.client.reference"), $$async: false, $$id: "${id}", name: "${exp}" }`
							}
							clientComponentMap[id] = {
								id: rscOutputKey.replace(".tsx", ".js").replace(".ts", ".js"),
								chunks: [rscOutputKey.replace(".tsx", ".js").replace(".ts", ".js")],
								name: exp, // TODO support named exports
							};
						}

						return {
							contents: refCode,
							loader: "js",
						}
					})
				},
			},
		],
	});

	if (!fs.existsSync(clientDistRSC)) {
		await fs.promises.mkdir(clientDistRSC, { recursive: true });
	}

	if (!fs.existsSync(clientDistSSR)) {
		await fs.promises.mkdir(clientDistSSR, { recursive: true });
	}

	if (clientEntryPoints.size > 0) {
		console.log("🏝 Building client components");
	}

	// Build client components for CSR
	await Bun.build({
		format: "esm",
		entrypoints: [
			...clientEntryPoints,
			fileURLToPath(new URL("router.tsx", import.meta.url)),
		],
		outdir: clientDistRSC,
		target: "browser",
		sourcemap: "none",
		splitting: true,
	});
	
	// Build client components for SSR
	await Bun.build({
		format: "esm",
		entrypoints: [
			...clientEntryPoints,
			fileURLToPath(new URL("router.tsx", import.meta.url)),
		],
		outdir: clientDistSSR,
		target: "browser",
		sourcemap: "none",
		splitting: true,
		external: ["react", "react-dom"],
	});

	// // Write mapping from client-side component ID to chunk
	// // This is read by the server when generating the RSC stream.
	await writeClientComponentMap(clientComponentMap);
}

build()