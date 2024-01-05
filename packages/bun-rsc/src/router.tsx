// @ts-expect-error
import { startTransition, useEffect, use, useState } from "react";
import { hydrateRoot } from "react-dom/client";
// @ts-expect-error
import {createFromFetch} from "react-server-dom-webpack/client";
import { Layout } from "./Layout";
import { combineUrl } from "./utils";

hydrateRoot(document, <Router/>);
const queryParam = new URLSearchParams({
  ajasxRSC: "true",
});
function Router() {
  const [url, setUrl] = useState(window.location.href + "?" + queryParam.toString());

  useEffect(() => {
    function navigate(url: string) {
      startTransition(() => {
        setUrl(combineUrl(window.location.origin, url) + "?" + queryParam.toString());
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
    }

    window.addEventListener("click", clickHandler, true);
    
    const popstateHandler = () => {
      // When the user presses Back/Forward, call our custom logic too.
      navigate(window.location.pathname);
    }
    window.addEventListener("popstate", popstateHandler);

    return () => {
      window.removeEventListener("click", clickHandler, true);
      window.removeEventListener("popstate", popstateHandler);
    };
  }, []);

  return (
    <Layout>
      <ServerOutput url={url} />
    </Layout>
  );
}

const initialCache = new Map();

function ServerOutput({ url }: { url: string }) {
  const [cache, setCache] = useState(initialCache);
  if (!cache.has(url)) {
    cache.set(url, createFromFetch(fetch(url)));
  }
  const lazyJsx = cache.get(url);
  return use(lazyJsx);
}
