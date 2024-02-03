import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { type BuildArtifact, BuildConfig } from "bun";
import postcss from "postcss";
import recursive from "recursive-readdir";
import { ClientEntry } from "./types.js";
import { combineUrl, log } from "./utils/common.js";
import {
	BUN_RSC_SPECIFIC_KEYWORD,
	createClientModuleId,
	createServerModuleId,
	dist,
	resolveClientDist,
	resolveDist,
	resolveRoot,
	resolveServerDist,
	resolveSrc,
	rscClientComponentMapUrl,
	serverActionMapUrl,
	ssrClientComponentMapUrl,
	writeMap,
} from "./utils/server.js";

const __bun__module_map__ = new Map();

// @ts-ignore
const __webpack_chunk_load__ = async (moduleId) => {
	const mod = await import(combineUrl(process.cwd(), moduleId));
	__bun__module_map__.set(moduleId, mod);
	return mod;
};
// @ts-ignore
global.__webpack_chunk_load__ = __webpack_chunk_load__;
// @ts-ignore
const __webpack_require__ = (moduleId) => __bun__module_map__.get(moduleId);
// @ts-ignore
global.__webpack_require__ = __webpack_require__;

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
 * ========================================================================
 * Build all server and client components with esbuild
 * ========================================================================
 * */
export async function build() {
	fs.rmSync(dist, { recursive: true });

	const rscClientComponentMap: Record<string, ClientEntry> = {};
	const ssrClientComponentMap: Record<string, ClientEntry> = {};
	const serverActionMap: Record<string, ClientEntry> = {};

	const clientEntryPoints = new Set<string>();
	const serverActionEntryPoints = new Set<string>();
	log.i("💿 Building server components");
	const serverDist = resolveServerDist();
	if (!fs.existsSync(serverDist)) {
		await fs.promises.mkdir(serverDist, { recursive: true });
	}

	/**
	 * -------------------------------------------------------------------------------------
	 * Build server components and scan client components (currently also scans
	 * "server server-actions", but should be after the building of "client server-actions")
	 * -------------------------------------------------------------------------------------
	 * */
	const serverBuildEntrypoints = await recursive(resolveSrc("pages"));

	const serverBuildResult = await Bun.build({
		target: "bun",
		sourcemap: "none",
		splitting: true,
		format: "esm",
		entrypoints: serverBuildEntrypoints,
		outdir: serverDist,
		external: ["bun-rsc"],
		plugins: [
			{
				name: "build-client-components-and-server-actions",
				setup(build) {
					build.onLoad({ filter: /\.(ts|tsx)$/ }, async ({ path }) => {
						const code = await Bun.file(path).text();

						if (isClientComponentModule(code)) {
							// if it is a client component, return a reference to the client component bundle
							clientEntryPoints.add(path);

							const moduleExports = TSXTranspiler.scan(code).exports;
							const moduleId = createClientModuleId(path);
							// Here we make the consumer app import the client apis that we expose in the exports folder
							// A similar approach would have been to just write the object:
							//
							// `export default { $$typeof: Symbol.for("react.client.reference"), $$async: false, $$id: "${id}", name: "default" }`
							//
							// I just like complicated things
							let refCode = "import {createClientReference} from 'bun-rsc'\n";
							for (const exp of moduleExports) {
								let id = null;
								if (exp === "default") {
									id = `${moduleId}#default`;
									refCode += `export default createClientReference("${id}", "default")`;
								} else {
									id = `${moduleId}#${exp}`;
									refCode += `export const ${exp} = createClientReference("${id}", "${exp}")`;
								}
								const rscChunkId = moduleId
									.replace(".tsx", ".rsc.js")
									.replace(".ts", ".rsc.js");
								rscClientComponentMap[id] = {
									id: rscChunkId,
									chunks: [rscChunkId],
									name: exp,
								};
								const ssrChunkId = moduleId
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
							// if it is a server action, return a reference to the server action bundle
							serverActionEntryPoints.add(path);

							const moduleExports = TSTranspiler.scan(code).exports;
							const moduleId = createServerModuleId(path);
							// here we make the consumer app import the server actions api that we expose in the exports folder
							let refCode = `import {createServerReferenceServer} from 'bun-rsc'

							${code}`;
							for (const exp of moduleExports) {
								const id = `${moduleId}#${exp}`;
								refCode += `if (typeof ${exp} === 'function') createServerReferenceServer(${exp}, "${id}", "${exp}")`;
								const serverActionChunkId = moduleId.replace(".ts", ".js");
								serverActionMap[id] = {
									id: serverActionChunkId,
									chunks: [serverActionChunkId],
									name: exp,
								};
							}
							return {
								contents: refCode,
								loader: "ts",
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
		],
	});
	if (!serverBuildResult.success) {
		log.e("Server build failed");
		console.log(serverBuildResult.logs);
	}

	/**
	 * -------------------------------------------------------------------------------------
	 * Build client components and "server server-actions"
	 * -------------------------------------------------------------------------------------
	 * */
	if (!fs.existsSync(clientDist)) {
		await fs.promises.mkdir(clientDist, { recursive: true });
	}

	if (serverActionEntryPoints.size > 0) {
		log.i("💪 Building server actions");

		const serverActionResults = await Bun.build({
			format: "esm",
			entrypoints: [...serverActionEntryPoints],
			target: "browser",
			sourcemap: "none",
			splitting: true,
			outdir: serverDist,
			external: ["react", "react-dom"],
		});
		if (!serverActionResults.success) {
			log.e("Server actions build failed");
			console.log(serverActionResults.logs);
		}
	}

	if (clientEntryPoints.size > 0) {
		log.i("🏝 Building client components");

		const clientBuildOptions: BuildConfig = {
			format: "esm",
			entrypoints: [
				...clientEntryPoints,
				fileURLToPath(new URL("../../src/router.tsx", import.meta.url)),
			],
			target: "browser",
			sourcemap: "none",
			splitting: true,
			outdir: clientDist,
			plugins: [
				{
					/* WILL NOT WORK IF THE SERVER ACTIONS ARE STILL MODIFIED IN THE SERVER PAGES BUILD */
					name: "server-actions",
					setup(build) {
						build.onLoad({ filter: /\.(ts|tsx)$/ }, async ({ path }) => {
							const code = await Bun.file(path).text();
							const root = process.cwd();
							const srcSplit = root.split("/");
							const currentDirectoryName = combineUrl(
								srcSplit[srcSplit.length - 1],
								path.replace(root, ""),
							);

							if (isServerActionModule(code)) {
								serverActionEntryPoints.add(path);

								const outputKey = combineUrl(
									`/${BUN_RSC_SPECIFIC_KEYWORD}/server`,
									currentDirectoryName,
								);
								const currentDirectoryNameSplit =
									currentDirectoryName.split("/");
								const pathToServerRoot = currentDirectoryNameSplit
									.map(() => "..")
									.join("/");
								console.log(pathToServerRoot);
								const moduleExports = TSTranspiler.scan(code).exports;

								let refCode = `import {createServerReferenceClient} from "bun-rsc"`;
								for (const exp of moduleExports) {
									const id =
										exp === "default"
											? `${outputKey}#default`
											: `${outputKey}#${exp}`;
									refCode += `
												export${
													exp === "default" ? " default " : " "
												}const ${exp} = createServerReferenceClient("${id}")
												`;
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
			],
		};
		// Build client components for CSR
		const csrResults = await Bun.build({
			...clientBuildOptions,
			naming: "[dir]/[name].rsc.[ext]",
		});
		if (!csrResults.success) {
			log.e("CSR build failed");
			console.log(csrResults.logs);
		}

		// Build client components for SSR. React is externalized to avoid duplication and hooks errors at stream generation time.
		const ssrResults = await Bun.build({
			...clientBuildOptions,
			naming: "[dir]/[name].ssr.[ext]",
			external: ["react", "react-dom"],
		});
		if (!ssrResults.success) {
			log.e("SSR build failed");
			console.log(ssrResults.logs);
		}
	}

	/**
	 * -------------------------------------------------------------------------------------
	 * Write module maps used by the server to resolve client components and server actions
	 * -------------------------------------------------------------------------------------
	 * */
	await writeMap(rscClientComponentMapUrl, rscClientComponentMap);
	await writeMap(ssrClientComponentMapUrl, ssrClientComponentMap);
	await writeMap(serverActionMapUrl, serverActionMap);

	/**
	 * -------------------------------------------------------------------------------------
	 * Parse built CSS files with PostCSS
	 * -------------------------------------------------------------------------------------
	 * */
	async function parseCSS(files: BuildArtifact[]) {
		log.i("🎨 Parsing CSS files with PostCSS");
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
			await Bun.write(
				resolveDist("css-manifest.json"),
				JSON.stringify(manifest),
			);
		} catch (e) {
			console.log(e);
		}
	}

	parseCSS(serverBuildResult.outputs);
}
