import { type ReactNode, use } from "react";
// @ts-ignore
import ReactDOMServer from "react-dom/server.edge";
// @ts-ignore
import * as ReactServerDomClient from "react-server-dom-webpack/client";
import { injectRSCPayload } from "../html-stream/server";
import {
	getMiddleware,
	getServerHeaders,
	log,
	resolveDist,
	resolveServerFileFromFilePath,
	resolveSrc,
} from "../utils/server";

import { Layout } from "../components/Layout";
import type { PageModule } from "../types/internal";
import {
	BASE_RSC_SERVER_URL,
	BUN_RSC_SPECIFIC_KEYWORD,
	BUN_RSC_SPECIFIC_KEYWORD_STATICS,
	combineUrl,
} from "../utils/common";

const router = new Bun.FileSystemRouter({
	style: "nextjs",
	dir: resolveSrc("pages"),
});

const middleware = await getMiddleware();

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
		try {
			log.i(`Match found for url: ${request.url}`);

			const searchParams = new URLSearchParams(match.query);
			const params = match.params;
			const serverFilePath = resolveServerFileFromFilePath(match.filePath);
			if (middleware) {
				log.i("Running middleware");
				const middlewareResponse = await middleware({
					request,
					params,
					searchParams,
				});

				if (middlewareResponse) {
					return middlewareResponse;
				}
			}

			const PageModule = (await import(
				`${serverFilePath}${
					// Invalidate cached module on every request in dev mode
					// WARNING: can cause memory leaks for long-running dev servers!
					process.env.MODE === "development" ? `?invalidate=${Date.now()}` : ""
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
			// Fork the stream
			const [s1, s2] = rscStream.tee();

			const rscComponent = ReactServerDomClient.createFromReadableStream(s1, {
				ssrManifest: {
					moduleMap: null,
					moduleLoading: null,
				},
			});
			function ClientRoot() {
				return use(rscComponent) as ReactNode;
			}

			const ssrStream = await ReactDOMServer.renderToReadableStream(
				<Layout meta={pageMeta} cssManifest={manifest}>
					<ClientRoot />
				</Layout>,
				{
					bootstrapModules: [
						`/${BUN_RSC_SPECIFIC_KEYWORD_STATICS}/client-components/__bun_rsc_router.js`,
					],
					bootstrapScriptContent: `global = window;
					global.__CURRENT_ROUTE__ = "${request.url}";  
					global.__MANIFEST_STRING__ = ${JSON.stringify(manifestString)};
					global.__SSR_META_STRING__ = ${JSON.stringify(
						JSON.stringify(pageMeta),
					)};
						
				  const __bun__module_map__ = new Map();
	  
				  global.__webpack_chunk_load__ = async function(moduleId) {
					  const mod = await import(moduleId);
					  __bun__module_map__.set(moduleId, mod);
					  return mod;
				  };
		  
				  global.__webpack_require__ = function(moduleId) {
					  return __bun__module_map__.get(moduleId);
				  };`,
				},
			);

			return new Response(ssrStream.pipeThrough(injectRSCPayload(s2)), {
				headers: getServerHeaders(),
			});
		} catch (error: unknown) {
			log.e(String(error));
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
