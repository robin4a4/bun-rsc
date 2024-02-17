#!/usr/bin/env bun
import { $ } from "bun";
import fs from "node:fs";
import { cac } from "cac";
import packageJson from "../package.json";
import { build } from "./build";
import { createWebSocketServer } from "./ws/server";

/*
 Huge hack to get around the fact that bun does not support conditions yet
 We want to use react-server condition for the rsc server and classic react for the ssr server
 If conditions were supported we would have react be a dependency of the consumer app and run
 the serve rsc command with the react-server condition
*/
// @ts-ignore
import { serveRSC } from "../dist/serve/server-condition-export";

import { serveSSR } from "./servers/ssr";
import { log, runBootstrap } from "./utils/server";

const cli = cac("bun-rsc");

// Dev server
cli.command("dev:rsc").action(async () => {
	log.i("Starting rsc dev server on port 3001");
	try {
		const sockets = createWebSocketServer();
		await build();
		const devServerRSC = Bun.serve({ port: 3001, fetch: serveRSC });

		fs.watch("./src", { recursive: true }, async (event, filename) => {
			await build();
			devServerRSC.reload({ fetch: serveRSC });
			for (const socket of sockets) {
				socket.send("refresh");
			}
			log.i(`Detected ${event} in ${filename}`);
		});
	} catch (e: unknown) {
		log.e(`error when starting dev server:\n${e}`);
		process.exit(1);
	}
});

cli.command("dev:ssr").action(async () => {
	log.i("Starting ssr dev server on port 3000");
	try {
		const devServerSSR = Bun.serve({ port: 3000, fetch: serveSSR });
		fs.watch("./src", { recursive: true }, async (event, filename) => {
			devServerSSR.reload({ fetch: serveSSR });
		});
	} catch (e: unknown) {
		log.e(`error when starting dev server:\n${e}`);
		process.exit(1);
	}
});

cli.command("dev").action(async () => {
	log.title();
	await runBootstrap();
	await $`concurrently "MODE=development bun-rsc dev:ssr" "MODE=development bun-rsc dev:rsc" --raw --kill-others`;
});

// Build command
cli.command("build").action(async () => {
	log.title();
	await build();
});

// Serve command
cli.command("serve-ssr").action(async () => {
	log.title();
	await runBootstrap();
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
