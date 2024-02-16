import { createElement } from "react";
// @ts-ignore
import * as ReactServerDOMServer from "react-server-dom-webpack/server.edge";
import {
	readMap,
	resolveDist,
	resolveServerFileFromFilePath,
	resolveSrc,
	rscClientComponentMapUrl,
	serverActionsMapUrl,
	ssrClientComponentMapUrl,
} from "../utils/server.ts";

import { Layout } from "../components/Layout.tsx";
import type {
	BootstrapType,
	Meta,
	MiddlewareType,
	PageProps,
} from "../types/external";
import type { ActionModule, PageModule } from "../types/internal.ts";
import {
	BUN_RSC_SPECIFIC_KEYWORD,
	RSC_CONTENT_TYPE,
	combineUrl,
} from "../utils/common.ts";
import { log } from "../utils/server.ts";

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
	const ssrRequestUrl = request.url
		.replace(`${BUN_RSC_SPECIFIC_KEYWORD}/`, "")
		.replace(`${BUN_RSC_SPECIFIC_KEYWORD}`, "");
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
		if (request.method === "POST") {
			const formData = await request.formData();
			const serverActionsMap = await readMap(serverActionsMapUrl);
			const actionArgs = await ReactServerDOMServer.decodeReply(
				formData,
				serverActionsMap,
			);
			const actionId = decodeURIComponent(match.query.actionId);
			const action = serverActionsMap[actionId];
			if (action) {
				const actionModuleUrl = combineUrl(process.cwd(), action.id);
				const actionModule = (await import(actionModuleUrl)) as ActionModule;
				await actionModule[action.name](actionArgs[0]);
			}
		}
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

		try {
			const PageModule = (await import(
				`${serverFilePath}${
					// Invalidate cached module on every request in dev mode
					// WARNING: can cause memory leaks for long-running dev servers!
					process.env.NODE_ENV === "development"
						? `?invalidate=${Date.now()}`
						: ""
				}}`
			)) as PageModule;
			const PageComponent = PageModule.Page;
			const pageMeta: Meta = PageModule.meta;
			const props: PageProps = {
				searchParams,
				params,
			};
			// Render the Page component and send the query params as props.
			const Page = (
				<Layout meta={pageMeta} cssManifest={manifest}>
					{createElement(PageComponent, props)}
				</Layout>
			);

			const map =
				searchParams.get("ssr") === "true"
					? ssrClientComponentMapUrl
					: rscClientComponentMapUrl;

			const clientComponentMap = await readMap(map);
			const rscStream = ReactServerDOMServer.renderToReadableStream(
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

	return new Response("404!");
}
