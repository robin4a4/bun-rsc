import fs from "node:fs";
import { cac } from "cac";
import { build } from "../build";
import { serve } from "../serve";
import { createWebSocketServer } from "../ws-server";

const cli = cac("bun-rsc");

const port = 3000;

// Dev server
cli.command("dev").action(async () => {
	try {
		const sockets = createWebSocketServer();
		await build();
		const devServer = Bun.serve({ port, fetch: serve });

		fs.watch("./src", { recursive: true }, async (event, filename) => {
			await build();
			devServer.reload({ fetch: serve });
			for (const socket of sockets) {
				socket.send("refresh");
			}
			console.log(`[BUN RSC] - Detected ${event} in ${filename}`);
		});
	} catch (e: any) {
		console.log(`error when starting dev server:\n${e.stack}`);
		process.exit(1);
	}
});

// Build command
cli.command("build").action(async () => {
	await build();
});

// Serve command
cli.command("serve").action(async () => {
	const server = Bun.serve({
		port,
		fetch: serve,
	});

	console.log(`Listening on ${server.port}`);
});
