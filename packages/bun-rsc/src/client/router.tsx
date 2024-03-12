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
import { BUN_RSC_SPECIFIC_KEYWORD, combineUrl } from "../utils/common";
import { BASE_RSC_SERVER_URL } from "../utils/common";
import { clientLiveReload } from "../ws/client";
import { globalCache } from "./cache";
import { callServer } from "./call-server";
import { useRouterState } from "./hooks";

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
				setRscUrl(
					`${combineUrl(
						BASE_RSC_SERVER_URL,
						combineUrl(BUN_RSC_SPECIFIC_KEYWORD, url),
					)}?${queryParam.toString()}`,
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

		return () => {
			window.removeEventListener("click", clickHandler, true);
			window.removeEventListener("popstate", popstateHandler);
		};
	}, []);

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
	if (!globalCache.has(url)) {
		const fetchPromise = fetch(url);
		data =
			routerState === 0
				? createFromReadableStream(rscStream, { callServer: callServer })
				: createFromFetch(fetchPromise, { callServer });
		globalCache.set(url, data);
	}
	useEffect(() => {
		const rscPageMetaString = document.querySelector("#rsc-page-meta")!.getAttribute("value");
		if (rscPageMetaString && rscPageMetaString !== window.__SSR_META_STRING__) {
			const rscPageMeta = JSON.parse(rscPageMetaString);
			document.title = rscPageMeta.title;
			document.querySelector("meta[name=description]")!.setAttribute("content", rscPageMeta.description);
		}
	}, []);
	const lazyJsx = globalCache.get(url);
	return use(lazyJsx);
}
