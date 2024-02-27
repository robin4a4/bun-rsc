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
import { BUN_RSC_SPECIFIC_KEYWORD, combineUrl } from "../utils/common";
import { BASE_RSC_SERVER_URL } from "../utils/common";
import { clientLiveReload } from "../ws/client";
import { callServer } from "../references/create-server-reference-client";
import { rscStream } from "../html-stream/client";

let data;

hydrateRoot(document, <Router />);

if (process.env.MODE === "development") clientLiveReload();

const queryParam = new URLSearchParams(window.location.search);

function Router() {
	const [rscUrl, setRscUrl] = useState<string | null>(null);

	useEffect(() => {
		function navigate(url: string) {
			startTransition(() => {
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

	return <ServerOutput url={rscUrl} />;
}

const initialCache = new Map();

function ServerOutput({ url }: { url: string | null }): ReactNode {
	const [cache, setCache] = useState(initialCache);
	if (!cache.has(url)) {
		data = url
			? createFromFetch(fetch(url), { callServer })
			: createFromReadableStream(rscStream, { callServer });
		cache.set(url, data); // TODO the callserver breaks suspsense
	}
	const lazyJsx = cache.get(url);
	return use(lazyJsx);
}
