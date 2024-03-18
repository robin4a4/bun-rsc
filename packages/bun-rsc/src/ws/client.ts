import { dispatchActionReceivedEvent } from "../client/events";
import { refreshPort } from "./const";

/**
 * Taken from https://github.com/bholmesdev/simple-rsc/blob/main/app/utils/dev/live-reload.js
 */
export function clientLiveReload() {
	let socket: WebSocket;
	// @ts-ignore
	let reconnectionTimerId: Timeout;

	// Construct the WebSocket url from the current
	// page origin.
	const requestUrl = `ws://localhost:${refreshPort}/`;

	const log = (message: string) => {
		console.info("[refresh] ", message);
	};

	const refresh = () => {
		setTimeout(() => {
			window.__BUN_RSC_CACHE__.clear();
			dispatchActionReceivedEvent();
		}, 500);
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
				refresh();
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
