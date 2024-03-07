#!/usr/bin/env bun
import { $ } from "bun";
import { cac } from "cac";
import packageJson from "../../../package.json";
import { log, runBootstrap } from "../../utils/server";

const cli = cac("bun-rsc-dev");

cli.command("dev").action(async () => {
	log.title();
	await runBootstrap();
	await $`concurrently "MODE=development bun-rsc-ssr dev" "MODE=development bunx --conditions='react-server' bun-rsc-rsc dev" --raw --kill-others`;
});

cli.help();
cli.version(packageJson.version);
cli.parse();
