import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {
	resolveClientDist,
	resolveDist,
	resolveSrc,
	writeClientComponentMap,
} from "./utils.js";
import { resolve } from "node:dns";

const isDebug = true
const transpiler = new Bun.Transpiler({ loader: "tsx" })

const USE_CLIENT_ANNOTATIONS = ['"use client"', "'use client'"];
const JSX_EXTS = [".tsx"];
const relativeOrAbsolutePathRegex = /^\.{0,2}\//;
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
					build.onLoad({ filter: /\.(ts|tsx)$/ }, async (args) => {
						const code = await Bun.file(args.path).text()
						if (!isClientComponent(code)) {
							// if not a client component, just return the code and let it be bundled
							return {
								contents: code,
								loader: "tsx",
							}
						}

						// if it is a client component, return a reference to the client bundle
						const outputKey = clientDist
						// const outputKey = args.path.slice(appRoot.length)

						if (isDebug) console.log("outputKey", outputKey)

						const moduleExports = transpiler.scan(code).exports
						if (isDebug) console.log("exports", moduleExports)

						let refCode = ""
						for (const exp of moduleExports) {
							if (exp === "default") {
								refCode += `\nexport default { $$typeof: Symbol.for("react.client.reference"), $$async: false, $$id: "${outputKey}#default", name: "default" }`
							} else {
								refCode += `\nexport const ${exp} = { $$typeof: Symbol.for("react.client.reference"), $$async: false, $$id: "${outputKey}#${exp}", name: "${exp}" }`
							}
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
	// await writeClientComponentMap(clientComponentMap);
}

build()