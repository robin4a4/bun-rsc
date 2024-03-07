#!/usr/bin/env bun
import fs from "node:fs";
import { cac } from "cac";
import packageJson from "../../../package.json";
import { serveSSR } from "../../server/ssr";
import { log, runBootstrap } from "../../utils/server";

const cli = cac("bun-rsc");

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

cli.command("serve-ssr").action(async () => {
	log.title();
	await runBootstrap();
	const server = Bun.serve({
		port: 3000,
		fetch: serveSSR,
	});
	log.i(`SSR server listening on ${server.port}`);
});

cli.help();
cli.version(packageJson.version);
cli.parse();
