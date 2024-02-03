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
import { combineUrl } from "./utils/common.ts";

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
	const match = router.match(combineUrl(BUN_RSC_SPECIFIC_KEYWORD, request.url));
	let manifestString = "";
	let manifest: Array<string> = [];
	try {
		manifestString = await Bun.file(resolveDist("css-manifest.json")).text();
		manifest = JSON.parse(manifestString);
	} catch (e) {
		console.log("No manifest found.");
	}
	if (match) {
		console.log("[BUN RSC]", match);
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
				<Layout meta={pageMeta} cssManifest={manifest}>
					{createElement(PageComponent, props)}
				</Layout>
			);

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
		} catch (error: unknown) {
			console.error(error);
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
