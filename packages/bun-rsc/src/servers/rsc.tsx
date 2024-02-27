import { createElement } from "react";
// @ts-ignore
import * as ReactServerDOMServer from "react-server-dom-webpack/server.edge";
import {
	clientComponentMapUrl,
	getMiddleware,
	getServerHeaders,
	readMap,
	resolveDist,
	resolveServerFileFromFilePath,
	resolveSrc,
	serverActionsMapUrl,
} from "../utils/server.ts";

import { Layout } from "../components/Layout.tsx";
import type { Meta, PageProps } from "../types/external";
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

const middleware = await getMiddleware();

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
		const searchParams = new URLSearchParams(match.query);
		const params = match.params;
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
		if (request.method === "POST") {
			const formData = await request.formData();
			const serverActionsMap = await readMap(serverActionsMapUrl);
			const actionArgs = await ReactServerDOMServer.decodeReply(
				formData,
				serverActionsMap,
			);
			const actionId = decodeURIComponent(match.query.actionId);
			const action = serverActionsMap[actionId];
			console.log("ACTION", action);
			if (action) {
				const actionModuleUrl = combineUrl(process.cwd(), action.id);
				const actionModule = (await import(actionModuleUrl)) as ActionModule;
				await actionModule[action.name](actionArgs[0]);
			}
		}
		log.i(`Match found for url: ${ssrRequestUrl}`);
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

			const map = await readMap(clientComponentMapUrl);
			const clientComponentMap =
				searchParams.get("ssr") === "true" ? map.ssr : map.rsc;
			const rscStream = ReactServerDOMServer.renderToReadableStream(
				Page,
				clientComponentMap,
			);

			return new Response(rscStream, {
				headers: getServerHeaders(RSC_CONTENT_TYPE),
			});
		} catch (error: unknown) {
			console.error(error);
		}
	}

	return new Response("404!");
}
