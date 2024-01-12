// @ts-ignore
import { createElement, ReactNode, use } from "react";
import ReactDOMServer from "react-dom/server";
// @ts-ignore
import * as ReactServerDomClient from "react-server-dom-webpack/client";
// @ts-ignore
import * as ReactServerDomServer from "react-server-dom-webpack/server.browser";
import {
	BUN_RSC_SPECIFIC_KEYWORD,
	RSC_CONTENT_TYPE,
	readMap,
	resolveDist,
	resolveServerFileFromFilePath,
	resolveSrc,
	rscClientComponentMapUrl,
	ssrClientComponentMapUrl,
} from "./utils/server.ts";

import { Layout } from "./components/Layout";
import { BootstrapType, Meta, MiddlewareType } from "./types.ts";
import { combineUrl } from "./utils/common.ts";

const __bun__module_map__ = new Map();

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

export async function serve(request: Request) {
	const match = router.match(request.url);
	let manifestString = "";
	let manifest: Array<string> = [];
	try {
		manifestString = await Bun.file(resolveDist("manifest.json")).text();
		manifest = JSON.parse(manifestString);
	} catch (e) {
		console.log("No manifest found.");
	}
	if (match) {
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
		try {
			const PageModule = await import(
				`${serverFilePath}${
					// Invalidate cached module on every request in dev mode
					// WARNING: can cause memory leaks for long-running dev servers!
					process.env.NODE_ENV === "development"
						? `?invalidate=${Date.now()}`
						: ""
				}}`
			);

			const PageComponent = PageModule.Page;
			const pageMeta: Meta = PageModule.meta;
			const searchParamsObject = Object.fromEntries(searchParams);
			// biome-ignore lint/performance/noDelete: <explanation>
			delete searchParamsObject.ajaxRSC;
			const props = {
				searchParams: searchParamsObject,
				params,
			};

			// Render the Page component and send the query params as props.
			const Page = (
				<Layout meta={pageMeta} manifest={manifest}>
					{createElement(PageComponent, props)}
				</Layout>
			);

			/**
			 * Return server component directly if requested via AJAX.
			 */
			if (searchParams.get("ajaxRSC") === "true") {
				const clientComponentMap = await readMap(rscClientComponentMapUrl);

				const rscStream = ReactServerDomServer.renderToReadableStream(
					Page,
					clientComponentMap,
				);
				return new Response(rscStream, {
					// "Content-type" based on https://github.com/facebook/react/blob/main/fixtures/flight/server/global.js#L159
					headers: {
						"Content-type": RSC_CONTENT_TYPE,
						"Access-Control-Allow-Origin": "*",
					},
				});
			}
			/**
			 * Return an SSR'd HTML page if requested via browser.
			 */
			// @ts-ignore
			global.__webpack_chunk_load__ = async (moduleId) => {
				const mod = await import(combineUrl(process.cwd(), moduleId));
				__bun__module_map__.set(moduleId, mod);
				return mod;
			};
			// @ts-ignore
			global.__webpack_require__ = (moduleId) =>
				__bun__module_map__.get(moduleId);

			const clientComponentMap = await readMap(ssrClientComponentMapUrl);

			const rscStream = ReactServerDomServer.renderToReadableStream(
				Page,
				clientComponentMap,
			);

			const rscComponent =
				ReactServerDomClient.createFromReadableStream(rscStream);

			function ClientRoot() {
				return use(rscComponent) as ReactNode;
			}
			// Hack retrieved from Marz "this is a temporary hack to only render a single 'frame'"
			const abortController = new AbortController();
			const ssrStream = await ReactDOMServer.renderToReadableStream(
				<ClientRoot />,
				{
					bootstrapModules: [
						`/${BUN_RSC_SPECIFIC_KEYWORD}/client/bun-rsc/src/router.rsc.js`,
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
		} catch (error: unknown) {
			console.error(error);
			const ErrorPageModule = await import(
				`${serverFileErrorPath}${
					// Invalidate cached module on every request in dev mode
					// WARNING: can cause memory leaks for long-running dev servers!
					process.env.NODE_ENV === "development"
						? `?invalidate=${Date.now()}`
						: ""
				}}`
			);

			const ErrorPageComponent = ErrorPageModule.Error;

			// Render the Page component and send the query params as props.
			const ErrorPage = () => (
				<Layout
					meta={{
						title: "Error",
						description: "Error",
					}}
					manifest={manifest}
				>
					{ErrorPageComponent({ error })}
				</Layout>
			);
			console.log(ErrorPage);
			const ssrStream = await ReactDOMServer.renderToReadableStream(
				<ErrorPage />,
			);
			return new Response(ssrStream, {
				headers: { "Content-type": "text/html" },
			});
		}
	}
	const { pathname } = new URL(request.url);

	if (pathname.startsWith(`/${BUN_RSC_SPECIFIC_KEYWORD}`)) {
		const filePath = pathname.replace(`/${BUN_RSC_SPECIFIC_KEYWORD}`, "");
		const contents = Bun.file(resolveDist(filePath));
		return new Response(contents, {
			headers: {
				"Content-Type": contents.type,
			},
		});
	}

	return new Response("404!");
}
