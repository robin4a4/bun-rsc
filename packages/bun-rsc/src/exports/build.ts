import fs from "node:fs";
import * as esbuild from "esbuild";
import { log } from "../utils/server";
import { dtsPlugin } from "esbuild-plugin-d.ts";
// import dtsPlugin from "bun-plugin-dts";
const start = Date.now();

log.title();
log.i("Building Bun RSC");
fs.rmSync("./dist", { recursive: true });

// We need to use esbuild to build the serve-rsc file using the react-server condition since
// bun does not support conditions yet, see: https://github.com/oven-sh/bun/issues/4370
log.i("Building server conditions exports using esbuild");
await esbuild.build({
	entryPoints: ["./src/exports/server-condition-export.ts"],
	bundle: true,
	format: "esm",
	outdir: "./dist/serve",
	jsx: "preserve",
	conditions: ["react-server"],
});

// use esbuild to build the types because the eslint dts plugin is 4x times faster than the bun dts plugin
log.i("Building the types using esbuild");
await esbuild.build({
	entryPoints: ["./src/types.ts"],
	bundle: true,
	format: "esm",
	outdir: "./dist/serve",
	plugins: [dtsPlugin()],
});

// Use bun to build the rest of the files
log.i("Building the client condition exports using Bun");
await Bun.build({
	entrypoints: ["./src/exports/client-condition-export.ts"],
	format: "esm",
	external: ["react", "react-dom"],
	outdir: "./dist/serve",
});

log.i("Building the cli using Bun");
const results = await Bun.build({
	entrypoints: ["./src/cli.ts"],
	outdir: "./dist/build",
	external: ["react", "react-dom"],
	splitting: true,
});

if (results.success) {
	log.s(`Build success in ${Date.now() - start} ms`, true);
} else log.e("Build failed");

if (!results.success) {
	console.log(results.logs);
}
