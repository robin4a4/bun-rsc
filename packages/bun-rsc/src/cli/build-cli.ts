import dts from "bun-plugin-dts";
import fs from "node:fs";
import * as esbuild from "esbuild";
import { log } from "../utils/common";

log.title();
log.i("Building Bun RSC");
fs.rmSync("./dist", { recursive: true });

// We need to use esbuild to build the serve-rsc file using the react-server condition since
// bun does not support conditions yet, see: https://github.com/oven-sh/bun/issues/4370
log.i("Building serve-rsc and exports using Esbuild");
await esbuild.build({
	entryPoints: ["./src/serve-rsc.tsx", "./src/exports/index.ts"],
	bundle: true,
	format: "esm",
	outdir: "./dist/serve",
	jsx: "preserve",
	conditions: ["react-server"],
});

// Use bun to build the rest of the files
log.i("Building the cli using Bun");
const results = await Bun.build({
	entrypoints: ["./src/cli/cli.ts"],
	plugins: [dts()],
	outdir: "./dist/build",
	splitting: true,
});

if (results.success) {
	log.s("Build success", true);
} else log.e("Build failed");

if (!results.success) {
	console.log(results.logs);
}
