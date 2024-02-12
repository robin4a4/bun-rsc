// @ts-ignore
import { use } from "react";
// @ts-ignore
import ReactDOMServer from "react-dom/server.edge";
// @ts-ignore
import * as ReactServerDomClient from "react-server-dom-webpack/client";
import {
	log,
	resolveDist,
	resolveServerFileFromFilePath,
	resolveSrc,
} from "../utils/server.ts";

import { BootstrapType, MiddlewareType } from "../types/external";
import {
	BUN_RSC_SPECIFIC_KEYWORD,
	BUN_RSC_SPECIFIC_KEYWORD_STATICS,
	combineUrl,
} from "../utils/common.ts";

const router = new Bun.FileSystemRouter({
	style: "nextjs",
	dir: resolveSrc("pages"),
});

const bootstrapSrcPath = "src/bootstrap.ts";
const bootstrapFile = Bun.file(bootstrapSrcPath);
const bootstrapExists = await bootstrapFile.exists();

if (bootstrapExists) {
	const bootstrapModule = (await import(
		`${process.cwd()}/${bootstrapSrcPath}`
	)) as { default: BootstrapType };

	if (bootstrapModule.default && typeof bootstrapModule.default === "function")
		bootstrapModule.default();
}

let middleware: MiddlewareType | null = null;
const middlewareSrcPath = "src/middleware.ts";
const middlewareFile = Bun.file(middlewareSrcPath);
const middlewareExists = await middlewareFile.exists();

if (middlewareExists) {
	const middlewareModule = (await import(
		`${process.cwd()}/${middlewareSrcPath}`
	)) as { default: MiddlewareType };

	middleware = middlewareModule.default;
}

export async function serveSSR(request: Request) {
	const match = router.match(request.url);
	let manifestString = "";
	let manifest: Array<string> = [];
	try {
		manifestString = await Bun.file(resolveDist("css-manifest.json")).text();
		manifest = JSON.parse(manifestString);
	} catch (e) {
		log.w("No css manifest found");
	}
	if (match) {
		log.i(`Match found for url: ${request.url}`);
		const searchParams = new URLSearchParams(match.query);
		const params = match.params;

		if (middleware) {
			const middlewareResponse = await middleware({
				request,
				params: match.params,
				searchParams,
			});
			if (middlewareResponse) {
				return middlewareResponse;
			}
		}
		const serverFilePath = resolveServerFileFromFilePath(match.filePath);
		const serverFileErrorPath = resolveServerFileFromFilePath(
			`${match.filePath.split(".")[0]}.error.js`,
		);
		// try {
		const PageModule = await import(
			`${serverFilePath}${
				// Invalidate cached module on every request in dev mode
				// WARNING: can cause memory leaks for long-running dev servers!
				process.env.NODE_ENV === "development"
					? `?invalidate=${Date.now()}`
					: ""
			}}`
		);

		const pageMeta = PageModule.meta;
		const rscUrl = `${combineUrl(
			"http://localhost:3001",
			combineUrl(BUN_RSC_SPECIFIC_KEYWORD, match.pathname.split("?")[0]),
		)}?ssr=true&${searchParams.toString()}`;
		log.i(`Fetching rsc at : ${rscUrl}`);

		const rscStream = await fetch(rscUrl).then((response) => {
			// @ts-ignore
			const reader = response.body.getReader();

			return new ReadableStream({
				async start(controller) {
					while (true) {
						const { done, value } = await reader.read();
						if (done) {
							break;
						}
						controller.enqueue(value);
					}

					controller.close();
					reader.releaseLock();
				},
			});
		});

		const rscComponent = ReactServerDomClient.createFromReadableStream(
			rscStream,
			{
				ssrManifest: {
					moduleMap: null,
					moduleLoading: null,
				},
			},
		);
		function ClientRoot() {
			// @ts-ignore
			return use(rscComponent) as ReactNode;
		}
		// Hack retrieved from Marz "this is a temporary hack to only render a single 'frame'"
		const abortController = new AbortController();

		const ssrStream = await ReactDOMServer.renderToReadableStream(
			<ClientRoot />,
			{
				bootstrapModules: [
					`/${BUN_RSC_SPECIFIC_KEYWORD_STATICS}/client-components/bun-rsc/src/router.rsc.js`,
				],
				bootstrapScriptContent: `global = window;
					global.__CURRENT_ROUTE__ = "${request.url}";  
					global.__MANIFEST_STRING__ = ${JSON.stringify(manifestString)};
					global.__META_STRING__ = ${JSON.stringify(JSON.stringify(pageMeta))};
						
				  const __bun__module_map__ = new Map();
	  
				  global.__webpack_chunk_load__ = async function(moduleId) {
					  const mod = await import(moduleId);
					  __bun__module_map__.set(moduleId, mod);
					  return mod;
				  };
		  
				  global.__webpack_require__ = function(moduleId) {
					  return __bun__module_map__.get(moduleId);
				  };`,
				signal: abortController.signal,
				onError() {},
			},
		);
		abortController.abort();
		return new Response(ssrStream, {
			headers: { "Content-type": "text/html" },
		});
		// } catch (error: unknown) {
		// 	const ErrorPageModule = await import(
		// 		`${serverFileErrorPath}${
		// 			// Invalidate cached module on every request in dev mode
		// 			// WARNING: can cause memory leaks for long-running dev servers!
		// 			process.env.NODE_ENV === "development"
		// 				? `?invalidate=${Date.now()}`
		// 				: ""
		// 		}}`
		// 	);

		// 	const ErrorPageComponent = ErrorPageModule.Error;

		// 	// Render the Page component and send the query params as props.
		// 	const ErrorPage = () => (
		// 		<Layout
		// 			meta={{
		// 				title: "Error",
		// 				description: "Error",
		// 			}}
		// 			cssManifest={manifest}
		// 		>
		// 			{ErrorPageComponent({ error })}
		// 		</Layout>
		// 	);
		// 	const ssrStream = await ReactDOMServer.renderToReadableStream(
		// 		<ErrorPage />,
		// 	);
		// 	return new Response(ssrStream, {
		// 		headers: { "Content-type": "text/html" },
		// 	});
		// }
	}
	const { pathname } = new URL(request.url);

	if (pathname.startsWith(`/${BUN_RSC_SPECIFIC_KEYWORD_STATICS}`)) {
		const filePath = pathname.replace(
			`/${BUN_RSC_SPECIFIC_KEYWORD_STATICS}`,
			"",
		);
		const contents = Bun.file(resolveDist(filePath));
		return new Response(contents, {
			headers: {
				"Content-Type": contents.type,
			},
		});
	}

	return new Response("404!");
}
