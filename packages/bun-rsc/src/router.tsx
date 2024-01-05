// @ts-expect-error
import { startTransition, useEffect, use, useState } from "react";
import { hydrateRoot } from "react-dom/client";
// @ts-expect-error Module '"react-server-dom-webpack"' don't have types
import {createFromFetch} from "react-server-dom-webpack/client";

hydrateRoot(document, getInitialJSX());

function parseJSX(key: string, value: any) {
  if (value === "$RE") {
    // This is our special marker we added on the server.
    // Restore the Symbol to tell React that this is valid JSX.
    return Symbol.for("react.element");
  } else if (typeof value === "string" && value.startsWith("$$")) {
    // This is a string starting with $. Remove the extra $ added by the server.
    return value.slice(1);
  } else {
    return value;
  }
}

function getInitialJSX() {
  // @ts-ignore
  const clientJSX = JSON.parse(window.__INITIAL_CLIENT_JSX_STRING__, parseJSX);
  console.log(clientJSX)
  return clientJSX;
}

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
