import dts from "bun-plugin-dts";
import fs from "node:fs";
import * as esbuild from "esbuild";

console.log("Building Bun RSC");
fs.rmSync("./dist", { recursive: true });

// We need to use esbuild to build the serve-rsc file using the react-server condition since
// bun does not support conditions yet, see: https://github.com/oven-sh/bun/issues/4370
await esbuild.build({
	entryPoints: ["./src/serve-rsc.tsx", "./src/exports/index.ts"],
	bundle: true,
	format: "esm",
	outdir: "./dist/serve",
	conditions: ["react-server"],
});

// Use bun to build the rest of the files
const results = await Bun.build({
	entrypoints: ["./src/cli/cli.ts"],
	plugins: [dts()],
	outdir: "./dist/build",
	splitting: true,
});

console.log("[BUN RSC] BUN RSC build success:", results.success ? "✅" : "❌");
if (!results.success) {
	console.log(results.logs);
}
