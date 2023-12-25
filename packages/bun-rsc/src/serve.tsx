// @ts-ignore
import * as ReactServerDom from "react-server-dom-webpack/server.browser";
// @ts-ignore
import { createFromReadableStream } from "react-server-dom-webpack/client";
// @ts-ignore
import { createElement, use } from "react";
import ReactDOMServer from "react-dom/server";
import {
  combineUrl,
  readClientComponentMap,
  resolveClientDist,
  resolveServerDist,
} from "./utils";
import { Layout } from "./Layout";

const port = 8080;

const __bun__module_map__ = new Map();

const server = Bun.serve({
  port,
  async fetch(request) {
    const { pathname, searchParams } = new URL(request.url);
    if (pathname === "/rsc") {
      const PageModule = await import(
        resolveServerDist(
          `index.js${
            // Invalidate cached module on every request in dev mode
            // WARNING: can cause memory leaks for long-running dev servers!
            process.env.NODE_ENV === "development"
              ? `?invalidate=${Date.now()}`
              : ""
          }`
        )
      );

      // Render the Page component and send the query params as props.
      const Page = createElement(
        PageModule.default,
        Object.fromEntries(searchParams)
      );

      const clientComponentMap = await readClientComponentMap();
      const stream = ReactServerDom.renderToReadableStream(
        Page,
        clientComponentMap
      );
      return new Response(stream, {
        // "Content-type" based on https://github.com/facebook/react/blob/main/fixtures/flight/server/global.js#L159
        headers: {
          "Content-type": "text/x-component",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    if (pathname.startsWith("/dist/client")) {
      const filePath = pathname.replace("/dist/client/", "");
      const contents = Bun.file(resolveClientDist(filePath));
      return new Response(contents, {
        headers: {
          "Content-Type": "application/javascript",
        },
      });
    }

    // Serve HTML homepage that fetches and renders the server component.
    if (pathname.startsWith("/")) {
      global.__webpack_chunk_load__ = async function(moduleId) {
        const mod = await import(combineUrl(process.cwd(), moduleId));
        __bun__module_map__.set(moduleId, mod);
        return mod;
    };

    global.__webpack_require__ = function(moduleId) {
        // TODO: handle non-default exports
        console.log("require", moduleId)
        return __bun__module_map__.get(moduleId);
    };

      const PageModule = await import(
        resolveServerDist(
          `index.js${
            // Invalidate cached module on every request in dev mode
            // WARNING: can cause memory leaks for long-running dev servers!
            process.env.NODE_ENV === "development"
              ? `?invalidate=${Date.now()}`
              : ""
          }`
        )
      );

      // Render the Page component and send the query params as props.
      const Page = createElement(
        PageModule.default,
        Object.fromEntries(searchParams)
      );

      const clientComponentMap = await readClientComponentMap();

      const ssrMetadata = clientComponentMap["/dist/client/example/components/Counter.tsx#default"];
      const translationMap = {
        [ssrMetadata.id]: {
          '*': ssrMetadata,
        },
      };
      const stream = ReactServerDom.renderToReadableStream(
        Page,
        clientComponentMap
      );

      const response = createFromReadableStream(stream, {
        ssrManifest: {
          moduleMap: translationMap,
          moduleLoading: {
            prefix: '/',
          }
        },
      });

      function ClientRoot() {
        return <Layout>{use(response)}</Layout>;
      }

      const ssrStream = await ReactDOMServer.renderToReadableStream(
        <ClientRoot />,
        {
            bootstrapScripts: ["/dist/client/bun-rsc/src/router.js"],
            bootstrapScriptContent: `global = window;

            const __bun__module_map__ = new Map();
    
            // we just use webpack's function names to avoid forking react
            global.__webpack_chunk_load__ = async function(moduleId) {
                const mod = await import(moduleId);
                __bun__module_map__.set(moduleId, mod);
                return mod;
            };
    
            global.__webpack_require__ = function(moduleId) {
                // TODO: handle non-default exports
                console.log("require", moduleId)
                return __bun__module_map__.get(moduleId);
            };`
        }
      );
      return new Response(ssrStream, {
        headers: { "Content-type": "text/html" },
      });
    }

    return new Response("404!");
  },
});

console.log(`Listening on ${server.port}`);
