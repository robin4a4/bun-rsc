// @ts-ignore
import * as ReactServerDomServer from "react-server-dom-webpack/server.browser";
// @ts-ignore
import * as ReactServerDomClient from "react-server-dom-webpack/client";
// @ts-ignore
import { createElement } from "react";
import ReactDOMServer from "react-dom/server";
import {
  rscClientComponentMapUrl,
  ssrClientComponentMapUrl,
  combineUrl,
  readMap,
  resolveClientDist,
  resolveServerDist,
} from "./utils";

import { Layout } from "./Layout";

const port = 8080;

const __bun__module_map__ = new Map();


function stringifyJSX(key: string, value: any) {
    if (value === Symbol.for("react.element")) {
      // We can't pass a symbol, so pass our magic string instead.
      return "$RE"; // Could be arbitrary. I picked RE for React Element.
    } else if (typeof value === "string" && value.startsWith("$")) {
      // To avoid clashes, prepend an extra $ to any string already starting with $.
      return "$" + value;
    } else {
      return value;
    }
  }

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

      const clientComponentMap = await readMap(rscClientComponentMapUrl);
      const stream = ReactServerDomServer.renderToReadableStream(
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
      // @ts-ignore
      global.__webpack_chunk_load__ = async function(moduleId) {
        console.log(combineUrl(process.cwd(), moduleId))
          const mod = await import(combineUrl(process.cwd(), moduleId));
          __bun__module_map__.set(moduleId, mod);
          return mod;
      };
      // @ts-ignore
      global.__webpack_require__ = function(moduleId) {
          console.log("require", moduleId, __bun__module_map__.get(moduleId))
          return __bun__module_map__.get(moduleId)
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

      const clientComponentMap = await readMap(ssrClientComponentMapUrl);
      // const ssrTranslationMap = await readMap(ssrTranslationMapUrl);

      const rscStream = ReactServerDomServer.renderToReadableStream(
        Page,
        clientComponentMap
      );

      const rscComponent = await ReactServerDomClient.createFromReadableStream(rscStream);

      const clientJSXString = JSON.stringify(
        Layout({children: rscComponent}), stringifyJSX
      )

      const ssrStream = await ReactDOMServer.renderToReadableStream(
        Layout(rscComponent),
        {
            bootstrapModules: ["/dist/client/bun-rsc/src/router.rsc.js"],
            bootstrapScriptContent: `global = window;

            const __bun__module_map__ = new Map();
            window.__INITIAL_CLIENT_JSX_STRING__ = ${JSON.stringify(clientJSXString)};

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
