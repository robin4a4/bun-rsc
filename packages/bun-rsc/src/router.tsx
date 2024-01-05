// @ts-expect-error
import { startTransition, useEffect, use, useState } from "react";
import { hydrateRoot } from "react-dom/client";
// @ts-expect-error Module '"react-server-dom-webpack"' don't have types
import {createFromFetch} from "react-server-dom-webpack/client";
import { Layout } from "./Layout";

hydrateRoot(document, <Router/>);

let callbacks: Array<(...args: any) => any> = [];
// @ts-expect-error Property 'router' does not exist on type 'Window & typeof globalThis'.
window.router = {
  navigate(url: string) {
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
