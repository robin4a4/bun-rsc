// @ts-ignore
import * as ReactServerDom from "react-server-dom-webpack/server.browser";
import { createElement } from "react";
import { readClientComponentMap, resolveClientDist, resolveServerDist } from "./utils";

const port = 8080;

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
                    }`,
                )
            );
        
            // Render the Page component and send the query params as props.
            const Page = createElement(
                PageModule.default,
                Object.fromEntries(searchParams),
            );
        
            const clientComponentMap = await readClientComponentMap();
            const stream = ReactServerDom.renderToReadableStream(
                Page,
                clientComponentMap,
            );
            return new Response(stream, {
                // "Content-type" based on https://github.com/facebook/react/blob/main/fixtures/flight/server/global.js#L159
                headers: {
                    "Content-type": "text/x-component",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        }
        // Serve HTML homepage that fetches and renders the server component.
        if (pathname === "/") {
            const html = Bun.file(
                new URL("./template/index.html", import.meta.url),
            );
            return new Response(html, {
                headers: { "Content-type": "text/html" },
            });
        };

        if (pathname.startsWith("/dist/client")) {
            const filePath = pathname.replace("/dist/client/", "");
            const contents = Bun.file(
                resolveClientDist(filePath),
            );
            return new Response(contents, {
                headers: {
                    "Content-Type": "application/javascript",
                },
            });
        }

        return new Response("404!");
    }
})

console.log(`Listening on ${server.port}`);