import fs from "node:fs";
import dtsPlugin from "bun-plugin-dts";
import { log } from "../utils/server";
const start = Date.now();

log.title();
log.i("Building Bun RSC");
fs.rmSync("./dist", { recursive: true });

log.i("Building server conditions exports");
await Bun.build({
	entrypoints: ["./src/exports/server-condition-export.ts"],
	format: "esm",
	outdir: "./dist/serve",
	external: ["gradient-string", "picocolors"],
	conditions: ["react-server"],
});

log.i("Building the types");
await Bun.build({
	entrypoints: ["./src/types/external.ts"],
	format: "esm",
	outdir: "./dist/serve",
	plugins: [dtsPlugin()],
});

// Use bun to build the rest of the files
log.i("Building the router export");
await Bun.build({
	entrypoints: ["./src/client/router.tsx"],
	format: "esm",
	external: ["react", "react-dom", "react-server-dom-webpack"],
	outdir: "./dist/router",
});

await Bun.build({
	entrypoints: ["./src/exports/client-condition-export.ts"],
	format: "esm",
	external: ["react", "react-dom", "react-server-dom-webpack"],
	outdir: "./dist/serve",
});

log.i("Building the cli");
const results = await Bun.build({
	entrypoints: ["./src/exports/cli.ts"],
	outdir: "./dist/build",
	external: [
		"react",
		"react-dom",
		"react-server-dom-webpack",
		"gradient-string",
		"picocolors",
	],
	splitting: true,
});

if (results.success) {
	log.s(`Build success in ${Date.now() - start} ms`, true);
} else log.e("Build failed");

if (!results.success) {
	console.log(results.logs);
}
