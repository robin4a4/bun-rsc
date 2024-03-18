import {
	type ReactNode,
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
import {
	BUN_RSC_SPECIFIC_KEYWORD,
	combineUrl,
	getCacheKey,
} from "../utils/common";
import { BASE_RSC_SERVER_URL } from "../utils/common";
import { clientLiveReload } from "../ws/client";
import { callServer } from "./call-server";
import { useRouterState } from "./hooks";

window.__BUN_RSC_CACHE__ = new Map();

let data: unknown;

hydrateRoot(document, <Router />);

if (process.env.MODE === "development") clientLiveReload();

const queryParam = new URLSearchParams(window.location.search);

function Router() {
	const [rscUrl, setRscUrl] = useState(window.location.href);
	const [routerState, setRouterState] = useRouterState();
	useEffect(() => {
		function navigate(url: string) {
			startTransition(() => {
				setRouterState((prev) => prev + 1);
				const baseUrl = combineUrl(
					BASE_RSC_SERVER_URL,
					combineUrl(BUN_RSC_SPECIFIC_KEYWORD, url),
				);
				const hasQueryParam = queryParam.length > 0;
				const rscUrl = hasQueryParam
					? `${baseUrl}?${queryParam.toString()}`
					: baseUrl;
				setRscUrl(rscUrl);
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

		return () => {
			window.removeEventListener("click", clickHandler, true);
			window.removeEventListener("popstate", popstateHandler);
		};
	}, [setRouterState]);

	return (
		<Layout
			meta={JSON.parse(window.__SSR_META_STRING__)}
			cssManifest={JSON.parse(window.__MANIFEST_STRING__)}
		>
			<ServerOutput key={routerState} routerState={routerState} url={rscUrl} />
		</Layout>
	);
}

function ServerOutput({
	url,
	routerState,
}: { url: string; routerState: number }): ReactNode {
	const cacheKey = getCacheKey(url);
	console.log("cacheKey", cacheKey, routerState);
	if (!window.__BUN_RSC_CACHE__.has(cacheKey)) {
		data =
			routerState === 0
				? createFromReadableStream(rscStream, { callServer: callServer })
				: createFromFetch(fetch(url), { callServer });
		window.__BUN_RSC_CACHE__.set(cacheKey, data);
	}
	useEffect(() => {
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
	}, []);
	const lazyJsx = window.__BUN_RSC_CACHE__.get(cacheKey);
	// @ts-ignore
	return use(lazyJsx);
}
