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
	// @ts-expect-error
} from "react-server-dom-webpack/client";
import { Layout } from "../components/Layout";
import { rscStream } from "../html-stream/client";
import { getCacheKey } from "../utils/common";
import { clientLiveReload } from "../ws/client";
import { callServer } from "./call-server";
import { getRscUrl } from "./utils";

window.__BUN_RSC_CACHE__ = new Map();

const initialRscPayload = createFromReadableStream(rscStream, {
	callServer,
}) as Thenable<ReactNode>;

const initialRscUrl = getRscUrl(
	window.location.pathname,
	new URLSearchParams(window.location.search),
);
const initialCacheKey = getCacheKey(initialRscUrl);
window.__BUN_RSC_CACHE__.set(initialCacheKey, initialRscPayload);

hydrateRoot(document, <Router initialRscPayload={initialRscPayload} />);

function Router({
	initialRscPayload,
}: { initialRscPayload: Thenable<ReactNode> }) {
	const [rscPayload, setRscPayload] = useState(initialRscPayload);
	window.__UPDATE_RSC_PAYLOAD__ = setRscPayload;
	useEffect(() => {
		function navigate(url: string) {
			const [baseUrl, search] = url.split("?");
			const rscUrl = getRscUrl(baseUrl, new URLSearchParams(search));
			const cacheKey = getCacheKey(rscUrl);
			startTransition(() => {
				if (!window.__BUN_RSC_CACHE__.has(cacheKey)) {
					const newRscPayload = createFromFetch(fetch(rscUrl), {
						callServer,
					}) as Thenable<ReactNode>;
					window.__BUN_RSC_CACHE__.set(cacheKey, newRscPayload);
				}
				setRscPayload(
					window.__BUN_RSC_CACHE__.get(cacheKey) as Thenable<ReactNode>,
				);
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
		let socket: WebSocket | null = null;
		if (process.env.MODE === "development") socket = clientLiveReload();

		return () => {
			if (socket) {
				socket.removeAllListeners();
			}
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
			{use(rscPayload)}
		</Layout>
	);
}
