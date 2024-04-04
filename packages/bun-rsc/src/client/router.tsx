import {
	type ReactNode,
	type Thenable,
	startTransition,
	use,
	useEffect,
	useState,
} from "react";
import { hydrateRoot } from "react-dom/client";
import {
	createFromFetch,
	createFromReadableStream,
	encodeReply,
	// @ts-expect-error
} from "react-server-dom-webpack/client";
import { Layout } from "../components/Layout";
import { rscStream } from "../html-stream/client";
import {
	BASE_RSC_SERVER_URL,
	BUN_RSC_SPECIFIC_KEYWORD,
	RSC_CONTENT_TYPE,
	combineUrl,
	getCacheKey,
} from "../utils/common";
import { clientLiveReload } from "../ws/client";
import { getRscUrl } from "./utils";

window.__BUN_RSC_CACHE__ = new Map();

let updateRscPayload: ((rscPayload: ReactNode) => void) | null = null;

export const callServer = async (id: string, args: unknown[]) => {
	const url = `${combineUrl(
		BASE_RSC_SERVER_URL,
		combineUrl(BUN_RSC_SPECIFIC_KEYWORD, window.location.pathname),
	)}?actionId=${encodeURIComponent(id)}`;

	let requestOpts: Pick<RequestInit, "headers" | "body">;
	if (!Array.isArray(args) || args.some((a) => a instanceof FormData)) {
		requestOpts = {
			headers: { accept: RSC_CONTENT_TYPE },
			body: await encodeReply(args),
		};
	} else {
		requestOpts = {
			headers: {
				accept: RSC_CONTENT_TYPE,
				"content-type": "application/json",
			},
			body: JSON.stringify(args),
		};
	}

	const actionResult = await createFromFetch(
		fetch(url, {
			method: "POST",
			...requestOpts,
		}),
		{ callServer },
	);
	startTransition(() => {
		updateRscPayload(actionResult);
	});
	return actionResult;
};

const initialRscPayload = createFromReadableStream(rscStream, {
	callServer,
}) as Thenable<ReactNode>;

hydrateRoot(document, <Router initialRscPayload={initialRscPayload} />);

function Router({
	initialRscPayload,
}: { initialRscPayload: Thenable<ReactNode> }) {
	const [rscPayload, setRscPayload] = useState(use(initialRscPayload));
	console.log("RENDER", rscPayload);
	updateRscPayload = setRscPayload;
	useEffect(() => {
		function navigate(url: string) {
			const cacheKey = getCacheKey(url);
			startTransition(() => {
				if (!window.__BUN_RSC_CACHE__.has(cacheKey)) {
					const [baseUrl, search] = url.split("?");
					const newRscPayload = createFromFetch(
						fetch(getRscUrl(baseUrl, new URLSearchParams(search))),
						{
							callServer,
						},
					) as Thenable<ReactNode>;
					window.__BUN_RSC_CACHE__.set(cacheKey, use(newRscPayload));
				}
				setRscPayload(window.__BUN_RSC_CACHE__.get(cacheKey) as ReactNode);
			});
		}

		const clickHandler: EventListenerOrEventListenerObject = (event) => {
			const target = event.target as HTMLAnchorElement;
			// Only listen to link clicks.
			if (target.tagName !== "A") {
				return;
			}
			// Ignore "open in a new tab".
			// @ts-ignore
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
				return;
			}
			// Ignore external URLs.
			const href = target.getAttribute("href");
			if (!href?.startsWith("/")) {
				return;
			}
			// Prevent the browser from reloading the page but update the URL.
			event.preventDefault();
			window.history.pushState(null, "", href);
			navigate(href);
		};

		window.addEventListener("click", clickHandler, true);

		const popstateHandler = () => {
			// When the user presses Back/Forward, call our custom logic too.
			navigate(window.location.pathname);
		};
		window.addEventListener("popstate", popstateHandler);

		const rscPageMetaString = document
			.querySelector("#rsc-page-meta")
			?.getAttribute("value");
		if (rscPageMetaString && rscPageMetaString !== window.__SSR_META_STRING__) {
			const rscPageMeta = JSON.parse(rscPageMetaString);
			document.title = rscPageMeta.title;
			document
				.querySelector("meta[name=description]")
				?.setAttribute("content", rscPageMeta.description);
		}

		if (process.env.MODE === "development")
			clientLiveReload(callServer, setRscPayload);

		return () => {
			window.removeEventListener("click", clickHandler, true);
			window.removeEventListener("popstate", popstateHandler);
		};
	}, []);

	const manifest = window.__MANIFEST_STRING__
		? JSON.parse(window.__MANIFEST_STRING__)
		: [];
	return (
		<Layout
			meta={JSON.parse(window.__SSR_META_STRING__)}
			cssManifest={manifest}
		>
			{rscPayload}
		</Layout>
	);
}
