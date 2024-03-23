import { createElement } from "react";
// @ts-ignore
import * as ReactServerDOMServer from "react-server-dom-webpack/server.edge";
import {
	clientComponentMapUrl,
	getMiddleware,
	getServerHeaders,
	readMap,
	resolveServerFileFromFilePath,
	resolveSrc,
	serverActionsMapUrl,
} from "../utils/server";

import type { Meta, PageProps } from "../types/external";
import type { ActionModule, PageModule } from "../types/internal";
import {
	BUN_RSC_SPECIFIC_KEYWORD,
	RSC_CONTENT_TYPE,
	combineUrl,
} from "../utils/common";
import { log } from "../utils/server";

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
			if (action) {
				const actionModuleUrl = combineUrl(process.cwd(), action.id);
				const actionModule = (await import(actionModuleUrl)) as ActionModule;
				await actionModule[action.name](actionArgs[0]);
			}
		}
		log.i(`Match found for url: ${ssrRequestUrl}`);
		const serverFilePath = resolveServerFileFromFilePath(match.filePath);

		try {
			const modulePath =
				process.env.MODE === "development"
					? `${serverFilePath}?invalidate=${Date.now()}`
					: serverFilePath;
			const PageModule = (await import(modulePath)) as PageModule;
			const PageComponent = PageModule.Page;
			const pageMeta: Meta = PageModule.meta;
			const props: PageProps = {
				searchParams,
				params,
			};
			// Render the Page component and send the query params as props.
			const Page = (
				<>
					{createElement(PageComponent, props)}
					<input
						id="rsc-page-meta"
						type="hidden"
						value={JSON.stringify(pageMeta)}
					/>
				</>
			);

			const map = await readMap(clientComponentMapUrl);
			const clientComponentMap =
				searchParams.get("ssr") === "true" ? map.ssr : map.rsc;
			const rscStream = ReactServerDOMServer.renderToReadableStream(
				Page,
				clientComponentMap,
			);

			const baseServerHeaders = getServerHeaders(RSC_CONTENT_TYPE);
			baseServerHeaders.set("X-Page-Meta", JSON.stringify(pageMeta));
			return new Response(rscStream, {
				headers: baseServerHeaders,
			});
		} catch (error: unknown) {
			console.error(error);
		}
	}

	return new Response("404!");
}
