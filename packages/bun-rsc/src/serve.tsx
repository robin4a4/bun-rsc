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
  resolveSrc,
  resolveServerFileFromFilePath,
} from "./utils";

import { Layout } from "./Layout";

const port = 8080;

const __bun__module_map__ = new Map();

const router = new Bun.FileSystemRouter({
	style: "nextjs",
	dir: resolveSrc("views"),
});

const server = Bun.serve({
  port,
  async fetch(request) {
    const match = router.match(request.url);
    if (match) {
      const searchParams = new URLSearchParams(match.query);

      const serverFilePath = resolveServerFileFromFilePath(match.filePath)

      const PageModule = await import(
        `${serverFilePath}${
            // Invalidate cached module on every request in dev mode
            // WARNING: can cause memory leaks for long-running dev servers!
            process.env.NODE_ENV === "development"
              ? `?invalidate=${Date.now()}`
              : ""
        }}`
      );

      // Render the Page component and send the query params as props.
      const Page = createElement(
        PageModule.default,
        Object.fromEntries(searchParams)
      );

      /**
       * Return server component directly if requested via AJAX.
       */
      if (searchParams.get("ajasxRSC") === "true") {
        const clientComponentMap = await readMap(rscClientComponentMapUrl);

        const rscStream = ReactServerDomServer.renderToReadableStream(
          Page,
          clientComponentMap
        );
        return new Response(rscStream, {
          // "Content-type" based on https://github.com/facebook/react/blob/main/fixtures/flight/server/global.js#L159
          headers: {
            "Content-type": "text/x-component",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } else {
      /**
       * Return an SSR'd HTML page if requested via browser.
       */
        // @ts-ignore
        global.__webpack_chunk_load__ = async function (moduleId) {
          const mod = await import(combineUrl(process.cwd(), moduleId));
          __bun__module_map__.set(moduleId, mod);
          return mod;
        };
        // @ts-ignore
        global.__webpack_require__ = function (moduleId) {
          return __bun__module_map__.get(moduleId);
        };

        const clientComponentMap = await readMap(ssrClientComponentMapUrl);

        const rscStream = ReactServerDomServer.renderToReadableStream(
          Page,
          clientComponentMap
        );

        const rscComponent =
          await ReactServerDomClient.createFromReadableStream(rscStream);

        const ssrStream = await ReactDOMServer.renderToReadableStream(
          Layout({ children: rscComponent }),
          {
            bootstrapModules: ["/dist/client/bun-rsc/src/router.rsc.js"],
            bootstrapScriptContent: `global = window;
              global.__CURRENT_ROUTE__ = "${request.url}";  

              const __bun__module_map__ = new Map();
  
              global.__webpack_chunk_load__ = async function(moduleId) {
                  const mod = await import(moduleId);
                  __bun__module_map__.set(moduleId, mod);
                  return mod;
              };
      
              global.__webpack_require__ = function(moduleId) {
                  // TODO: handle non-default exports
                  console.log("require", moduleId)
                  return __bun__module_map__.get(moduleId);
              };`,
          }
        );
        return new Response(ssrStream, {
          headers: { "Content-type": "text/html" },
        });
      }
    }
    const { pathname, searchParams } = new URL(request.url);

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
      
    }

    return new Response("404!");
  },
});

console.log(`Listening on ${server.port}`);
