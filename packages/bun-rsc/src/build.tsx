import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {
	resolveDist,
	resolveSrc,
	writeClientComponentMap,
} from "./utils.js";

const isDebug = true
const transpiler = new Bun.Transpiler({ loader: "tsx" })

const clientDist = resolveDist("client/");

function isClientComponent(code: string) {
	return code.startsWith('"use client"') || code.startsWith("'use client'")
}

/**
 * Build all server and client components with esbuild
 */
export async function build() {
	/**
	 * Mapping from client-side component ID to React metadata.
	 * This is read by the server when generating the RSC stream.
	 * @type {Record<string, any>}
	 */
	const clientComponentMap = {};

	/**
	 * Discovered client modules to bundle with esbuild separately.
	 * @type {Set<string>}
	 */
	const clientEntryPoints = new Set<string>();

	console.log("💿 Building server components");
	const serverDist = resolveDist("server/");
	if (!fs.existsSync(serverDist)) {
		await fs.promises.mkdir(serverDist, { recursive: true });
	}
	
	const result = await Bun.build({
		format: "esm",
		entrypoints: [resolveSrc("views/index.tsx")],
		outdir: serverDist,
        external: ["react", "react-dom", "react-server-dom-webpack"],
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
						const root = resolveSrc("")
						const outputKey = path.replace(root, "")
						
						if (isDebug) console.log("outputKey", outputKey)

						const moduleExports = transpiler.scan(code).exports
						if (isDebug) console.log("exports", moduleExports)

						let refCode = ""
						for (const exp of moduleExports) {
							let id = null
							if (exp === "default") {
								id = `${outputKey}#default`
								refCode += `\nexport default { $$typeof: Symbol.for("react.client.reference"), $$async: false, $$id: "${id}", name: "default" }`
							} else {
								id = `${outputKey}#${exp}`
								refCode += `\nexport const ${exp} = { $$typeof: Symbol.for("react.client.reference"), $$async: false, $$id: "${id}", name: "${exp}" }`
							}
							clientComponentMap[`${outputKey}#${exp}`] = {
								id: id.replace(".tsx", ".js").replace(".ts", ".js"),
								chunks: [id.replace(".tsx", ".js").replace(".ts", ".js")],
								name: exp, // TODO support named exports
							};
						}

						if (isDebug) console.log("generated code", refCode)

						return {
							contents: refCode,
							loader: "js",
						}
					})
				},
			},
		],
	});

	console.log(result)
	// console.log(clientComponentMap);
	if (!fs.existsSync(clientDist)) {
		await fs.promises.mkdir(clientDist, { recursive: true });
	}

	if (clientEntryPoints.size > 0) {
		console.log("🏝 Building client components");
	}

	await Bun.build({
		format: "esm",
		entrypoints: [
			...clientEntryPoints,
			fileURLToPath(new URL("router.tsx", import.meta.url)),
		],
		outdir: clientDist,
		splitting: true,
	});

	// // Write mapping from client-side component ID to chunk
	// // This is read by the server when generating the RSC stream.
	await writeClientComponentMap(clientComponentMap);
}

build()