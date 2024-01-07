import { WebSocketServer } from "ws";
import { refreshPort } from "./utils/common-utils";

export function createWebSocketServer() {
	const wsServer = new WebSocketServer({
		port: refreshPort,
	});

	const sockets: Set<WebSocket> = new Set();

	wsServer.on("connection", (ws) => {
		// @ts-ignore
		sockets.add(ws);
		ws.on("close", () => {
			// @ts-ignore
			sockets.delete(ws);
		});

		ws.send("connected");
	});

	return sockets;
}
