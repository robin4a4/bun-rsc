#!/usr/bin/env bun
import { cac } from "cac";
import packageJson from "../../../package.json";
import { build } from "../../build";

import { log } from "../../utils/server";

const cli = cac("bun-rsc-build");

cli.command("build").action(async () => {
	log.title();
	await build();
});

cli.help();
cli.version(packageJson.version);
cli.parse();
