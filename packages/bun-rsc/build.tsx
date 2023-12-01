import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {
	resolveClientDist,
	resolveDist,
	resolveSrc,
	writeClientComponentMap,
} from "./utils.js";

const USE_CLIENT_ANNOTATIONS = ['"use client"', "'use client'"];
const JSX_EXTS = [".jsx", ".tsx"];
const relativeOrAbsolutePathRegex = /^\.{0,2}\//;

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

	await Bun.build({
		format: "esm",
		entrypoints: [resolveSrc("views/index.tsx")],
		outdir: serverDist,
        external: ["react", "react-dom", "react-server-dom-webpack"],
		// plugins: [
		// 	{
		// 		name: "resolve-client-imports",
		// 		setup(build) {
		// 			// Intercept component imports to find client entry points
		// 			build.onResolve(
		// 				{ filter: relativeOrAbsolutePathRegex },
		// 				async ({ path }) => {
		// 					for (const jsxExt of JSX_EXTS) {
		// 						// Note: assumes file extension is omitted
		// 						// i.e. import paths are './Component', not './Component.jsx'
		// 						const absoluteSrc = new URL(resolveSrc(path) + jsxExt);

		// 						if (fs.existsSync(absoluteSrc)) {
		// 							// Check for `"use client"` annotation. Short circuit if not found.
		// 							const contents = await fs.promises.readFile(
		// 								absoluteSrc,
		// 								"utf-8",
		// 							);
		// 							if (
		// 								!USE_CLIENT_ANNOTATIONS.some((annotation) =>
		// 									contents.startsWith(annotation),
		// 								)
		// 							)
		// 								return;

		// 							clientEntryPoints.add(fileURLToPath(absoluteSrc));
		// 							const absoluteDist = new URL(resolveClientDist(path) + ".js");

		// 							// Path the browser will import this client-side component from.
		// 							// This will be fulfilled by the server router.
		// 							// @see './index.js'
		// 							const id = `/dist/client/${path}.js`;

		// 							clientComponentMap[id] = {
		// 								id,
		// 								chunks: [],
		// 								name: "default", // TODO support named exports
		// 								async: true,
		// 							};
		// 							console.log(absoluteDist.href);
		// 							console.log(getClientComponentModule(id, absoluteDist.href));
		// 							return {
		// 								// Encode the client component module in the import URL.
		// 								// This is a... wacky solution to avoid import middleware.
		// 								path: `data:text/javascript,${encodeURIComponent(
		// 									getClientComponentModule(id, absoluteDist.href),
		// 								)}`,
		// 								external: true,
		// 							};
		// 						}
		// 					}
		// 				},
		// 			);
		// 		},
		// 	},
		// ],
	});
	// console.log(clientComponentMap);
	// const clientDist = resolveDist("client/");
	// if (!fs.existsSync(clientDist)) {
	// 	await fs.promises.mkdir(clientDist, { recursive: true });
	// }

	// if (clientEntryPoints.size > 0) {
	// 	console.log("🏝 Building client components");
	// }

	// await Bun.build({
	// 	format: "esm",
	// 	entrypoints: [
	// 		...clientEntryPoints,
	// 		"./router.jsx",
	// 	],
	// 	outdir: fileURLToPath(clientDist),
	// 	splitting: true,
	// });

	// // Write mapping from client-side component ID to chunk
	// // This is read by the server when generating the RSC stream.
	// await writeClientComponentMap(clientComponentMap);
}

build()