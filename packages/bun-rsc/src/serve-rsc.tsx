// @ts-ignore
import { createElement } from "react";
// @ts-ignore
import * as ReactServerDomServer from "react-server-dom-webpack/server.edge";
import {
	BUN_RSC_SPECIFIC_KEYWORD,
	RSC_CONTENT_TYPE,
	readMap,
	resolveDist,
	resolveServerFileFromFilePath,
	resolveSrc,
	rscClientComponentMapUrl,
} from "./utils/server.ts";

import { Layout } from "./components/Layout.tsx";
import { BootstrapType, Meta, MiddlewareType } from "./types.ts";
import { log } from "./utils/common.ts";

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

export async function serveRSC(request: Request) {
	const ssrRequestUrl = request.url.replace(`${BUN_RSC_SPECIFIC_KEYWORD}/`, "");
	const match = router.match(ssrRequestUrl);
	let manifestString = "";
	let manifest: Array<string> = [];
	try {
		manifestString = await Bun.file(resolveDist("css-manifest.json")).text();
		manifest = JSON.parse(manifestString);
	} catch (e) {
		log.w("No css manifest found");
	}
	if (match) {
		log.i(`Match found for url: ${ssrRequestUrl}`);
		const searchParams = new URLSearchParams(match.query);
		const params = match.params;

		if (middleware) {
			log.i("Running middleware");
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
		console.log(serverFilePath);
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
			console.log(PageModule);
			const PageComponent = PageModule.Page;
			const pageMeta: Meta = PageModule.meta;
			const searchParamsObject = Object.fromEntries(searchParams);
			// biome-ignore lint/performance/noDelete: <explanation>
			delete searchParamsObject.ajaxRSC;
			const props = {
				searchParams: searchParamsObject,
				params,
			};
			console.log(props);
			// Render the Page component and send the query params as props.
			const Page = (
				<Layout meta={pageMeta} cssManifest={manifest}>
					{createElement(PageComponent, props)}
				</Layout>
			);
			console.log(Page);
			const clientComponentMap = await readMap(rscClientComponentMapUrl);
			console.log(clientComponentMap);
			const rscStream = ReactServerDomServer.renderToReadableStream(
				Page,
				clientComponentMap,
			);
			console.log("stream", rscStream);
			return new Response(rscStream, {
				// "Content-type" based on https://github.com/facebook/react/blob/main/fixtures/flight/server/global.js#L159
				headers: {
					"Content-type": RSC_CONTENT_TYPE,
					"Access-Control-Allow-Origin": "*",
				},
			});
		} catch (error: unknown) {
			console.error(error);
		}
	}

	return new Response("404!");
}
