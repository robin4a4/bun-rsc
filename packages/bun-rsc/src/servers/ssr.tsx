import { use, type ReactNode } from "react";
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

import type { PageModule } from "../types/internal.ts";
import {
	BUN_RSC_SPECIFIC_KEYWORD,
	BUN_RSC_SPECIFIC_KEYWORD_STATICS,
	BASE_RSC_SERVER_URL,
	combineUrl,
} from "../utils/common.ts";
import { Layout } from "../components/Layout.tsx";

const router = new Bun.FileSystemRouter({
	style: "nextjs",
	dir: resolveSrc("pages"),
});

export async function serveSSR(request: Request) {
	const match = router.match(request.url);
	let manifestString = "";
	try {
		manifestString = await Bun.file(resolveDist("css-manifest.json")).text();
	} catch (e) {
		log.w("No css manifest found");
	}
	if (match) {
		try {
			log.i(`Match found for url: ${request.url}`);
			const searchParams = new URLSearchParams(match.query);
			const serverFilePath = resolveServerFileFromFilePath(match.filePath);

			const PageModule = (await import(
				`${serverFilePath}${
					// Invalidate cached module on every request in dev mode
					// WARNING: can cause memory leaks for long-running dev servers!
					process.env.NODE_ENV === "development"
						? `?invalidate=${Date.now()}`
						: ""
				}}`
			)) as PageModule;

			const pageMeta = PageModule.meta;
			const rscUrl = `${combineUrl(
				BASE_RSC_SERVER_URL,
				combineUrl(BUN_RSC_SPECIFIC_KEYWORD, match.pathname.split("?")[0]),
			)}?ssr=true&${searchParams.toString()}`;
			log.i(`Fetching rsc at : ${rscUrl}`);

			const rscStream = await fetch(rscUrl).then((response) => {
				if (!response.body) {
					throw new Error(`Failed to fetch rsc at ${rscUrl}`);
				}
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
		} catch (error: unknown) {
			const serverFileErrorPath = resolveServerFileFromFilePath(
				`${match.filePath.split(".")[0]}.error.js`,
			);
			let manifestString = "";
			let manifest: Array<string> = [];
			try {
				manifestString = await Bun.file(
					resolveDist("css-manifest.json"),
				).text();
				manifest = JSON.parse(manifestString);
			} catch (e) {
				log.w("No css manifest found");
			}
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
					cssManifest={manifest}
				>
					{ErrorPageComponent({ error })}
				</Layout>
			);
			const ssrStream = await ReactDOMServer.renderToReadableStream(
				<ErrorPage />,
			);
			return new Response(ssrStream, {
				headers: { "Content-type": "text/html" },
			});
		}
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
