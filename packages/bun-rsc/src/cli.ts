#!/usr/bin/env bun
import fs from "node:fs";
import { cac } from "cac";
import packageJson from "../package.json";
import { build } from "./build";
import { createWebSocketServer } from "./ws/server";

/*
 Huge hack to get around the fact that bun does not support conditions yet
 We want to use react-server condition for the rsc server and classic react for the ssr server
 If conditions were supported we would have react be a dependency of  the consumer app and run
 the serve rsc command with the react-server condition
*/
// @ts-ignore
import { serveRSC } from "../dist/serve/serve-rsc";

import { serveSSR } from "./serve-ssr";
import { log } from "./utils/server";

const cli = cac("bun-rsc");

// Dev server
// cli.command("dev").action(async () => {
// 	console.log("[BUN RSC] Starting dev server");
// 	try {
// 		const sockets = createWebSocketServer();
// 		await build();
// 		const devServerRSC = Bun.serve({ port, fetch: serveRSC });
// 		const devServerSSR = Bun.serve({ port, fetch: serveSSR });

// 		fs.watch("./src", { recursive: true }, async (event, filename) => {
// 			await build();
// 			devServerRSC.reload({ fetch: serveRSC });
// 			devServerSSR.reload({ fetch: serveSSR });
// 			for (const socket of sockets) {
// 				socket.send("refresh");
// 			}
// 			console.log(`[BUN RSC] - Detected ${event} in ${filename}`);
// 		});
// 	} catch (e: unknown) {
// 		console.log(`error when starting dev server:\n${e}`);
// 		process.exit(1);
// 	}
// });

// Build command
cli.command("build").action(async () => {
	log.title();
	log.i("Building your app");
	await build();
});

// Serve command
cli.command("serve-ssr").action(async () => {
	log.title();
	const server = Bun.serve({
		port: 3000,
		fetch: serveSSR,
	});
	log.i(`SSR server listening on ${server.port}`);
});

cli.command("serve-rsc").action(async () => {
	log.title();
	const server = Bun.serve({
		port: 3001,
		fetch: serveRSC,
	});
	log.i(`RSC server listening on ${server.port}`);
});

cli.help();
cli.version(packageJson.version);
cli.parse();