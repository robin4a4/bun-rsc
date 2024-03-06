#!/usr/bin/env bun
import { $ } from "bun";
import { cac } from "cac";
import { log, runBootstrap } from "../../utils/server";
import packageJson from "../../../package.json";

const cli = cac("bun-rsc");

cli.command("dev").action(async () => {
  log.title();
  await runBootstrap();
  await $`concurrently "MODE=development bun-rsc dev:ssr" "MODE=development bunx --conditions='react-server' bun-rsc dev:rsc" --raw --kill-others`;
});

cli.help();
cli.version(packageJson.version);
cli.parse();
