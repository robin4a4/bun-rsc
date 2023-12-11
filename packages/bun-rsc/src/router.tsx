// @ts-expect-error Module '"react"' has no exported member 'use'.
import { StrictMode, useEffect, useState, use, startTransition } from "react";
import { createRoot } from "react-dom/client";
import {
  /* FOR FRAMEWORK DEVS */ createFromFetch,
  // @ts-ignore
} from "react-server-dom-webpack/client";

// @ts-expect-error
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Router />
  </StrictMode>
);

let callbacks = [];
// @ts-expect-error Property 'router' does not exist on type 'Window & typeof globalThis'.
window.router = {
  navigate(/** @type {string} */ url) {
    window.history.replaceState({}, "", url);
    callbacks.forEach((cb) => cb());
  },
};

function Router() {
  const [url, setUrl] = useState("/rsc" + window.location.search);

  useEffect(() => {
    function handleNavigate() {
      startTransition(() => {
        setUrl("/rsc" + window.location.search);
      });
    }
    callbacks.push(handleNavigate);
    window.addEventListener("popstate", handleNavigate);
    return () => {
      callbacks.splice(callbacks.indexOf(handleNavigate), 1);
      window.removeEventListener("popstate", handleNavigate);
    };
  }, []);

  return (
    <>
      <ServerOutput url={url} />
    </>
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
