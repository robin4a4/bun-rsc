// @ts-ignore
import { createElement, use } from "react";
import ReactDOMServer from "react-dom/server";
// @ts-ignore
import * as ReactServerDomClient from "react-server-dom-webpack/client";
// @ts-ignore
import * as ReactServerDomServer from "react-server-dom-webpack/server.browser";
import {
	readMap,
	resolveClientDist,
	resolveDist,
	resolveServerFileFromFilePath,
	resolveSrc,
	rscClientComponentMapUrl,
	ssrClientComponentMapUrl,
} from "./utils/server-utils";

import { Layout } from "./components/Layout";
import { combineUrl } from "./utils/common-utils";

const __bun__module_map__ = new Map();

const router = new Bun.FileSystemRouter({
	style: "nextjs",
	dir: resolveSrc("views"),
});

export async function serve(request: Request) {
	const match = router.match(request.url);
	let manifestString = "";
	let manifest: Array<string> = []
	try {
		manifestString = await Bun.file(resolveDist("manifest.json")).text();
		manifest = JSON.parse(manifestString);
	} catch(e) {
		console.log("No manifest found.")
	}
	if (match) {
		const searchParams = new URLSearchParams(match.query);

		const serverFilePath = resolveServerFileFromFilePath(match.filePath);

		const PageModule = await import(
			`${serverFilePath}${
				// Invalidate cached module on every request in dev mode
				// WARNING: can cause memory leaks for long-running dev servers!
				process.env.NODE_ENV === "development"
					? `?invalidate=${Date.now()}`
					: ""
			}}`
		);

		// Render the Page component and send the query params as props.
		const Page = createElement(
			PageModule.default,
			Object.fromEntries(searchParams),
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
					"Content-type": "text/x-component",
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
			return <Layout manifest={manifest}>{use(rscComponent)}</Layout>;
		}
		// Hack retrieved from Marz "this is a temporary hack to only render a single 'frame'"
		const abortController = new AbortController();
		const ssrStream = await ReactDOMServer.renderToReadableStream(
			<ClientRoot />,
			{
				bootstrapModules: ["/dist/client/bun-rsc/src/router.rsc.js"],
				bootstrapScriptContent: `global = window;
              global.__CURRENT_ROUTE__ = "${request.url}";  
				global.__MANIFEST_STRING__ = ${JSON.stringify(manifestString)};
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
	}
	const { pathname } = new URL(request.url);

	if (pathname.startsWith("/dist")) {
		const filePath = pathname.replace("/dist", "");
		const contents = Bun.file(resolveDist(filePath));
		return new Response(contents, {
			headers: {
				"Content-Type": contents.type,
			},
		});
	}

	return new Response("404!");
}
