import { startTransition, type ReactNode } from "react";

import { refreshPort } from "./const";
import { getRscUrl } from "../client/utils";

import {
	createFromFetch,
	// @ts-expect-error
} from "react-server-dom-webpack/client";

function reloadStylesheet(): void {
	const links = document.getElementsByTagName("link");
	for (const link of links) {
		if (link.rel === "stylesheet") {
			const href = link.getAttribute("href");
			if (href) {
				link.setAttribute("href", `${href}?timestamp=${Date.now()}`);
			}
		}
	}
}

/**
 * Taken from https://github.com/bholmesdev/simple-rsc/blob/main/app/utils/dev/live-reload.js
 */
export function clientLiveReload(
	callServer: (id: string, args: unknown[]) => Promise<unknown>,
	updateRscPayload: ((rscPayload: ReactNode) => void) | null,
) {
	let socket: WebSocket;
	// @ts-ignore
	let reconnectionTimerId: Timeout;

	// Construct the WebSocket url from the current
	// page origin.
	const requestUrl = `ws://localhost:${refreshPort}/`;

	const log = (message: string) => {
		console.info("[refresh] ", message);
	};

	const refresh = async () => {
		console.log("IN REFETCH");
		const refetchResult = await createFromFetch(
			fetch(
				getRscUrl(
					window.location.pathname,
					new URLSearchParams(window.location.search),
				),
			),
			{ callServer },
		);
		console.log("REFETCHED", refetchResult);
		startTransition(() => {
			console.log("UPDATING", updateRscPayload);
			if (updateRscPayload) updateRscPayload(refetchResult);
		});
		reloadStylesheet();
	};

	/**
	 * Create WebSocket, connect to the server and
	 * listen for refresh events.
	 */
	const connect = (callback: () => void) => {
		if (socket) {
			socket.close();
		}

		socket = new WebSocket(requestUrl);

		// When the connection opens, execute the callback.
		socket.addEventListener("open", callback);

		socket.addEventListener("message", (event) => {
			if (event.data === "refresh") {
				log("refreshing...");
				setTimeout(() => {
					refresh();
				}, 400);
			}
		});

		// Handle when the WebSocket closes. We log
		// the loss of connection and set a timer to
		// start the connection again after a second.
		socket.addEventListener("close", () => {
			log("connection lost - reconnecting...");

			clearTimeout(reconnectionTimerId);

			reconnectionTimerId = setTimeout(() => {
				connect(refresh);
			}, 1000);
		});
	};

	connect(() => {
		console.log("Live reload connected on", requestUrl);
	});
}
