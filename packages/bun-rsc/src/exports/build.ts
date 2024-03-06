import fs from "node:fs";
import dts from 'bun-plugin-dts'
import { log } from "../utils/server";
const start = Date.now();

log.title();
log.i("Building Bun RSC");
fs.rmSync("./dist", { recursive: true });
const serveDist = "./dist/serve";
const routerDist = "./dist/router";
const buildDist = "./dist/build";
if (!fs.existsSync(serveDist)) {
  await fs.promises.mkdir(serveDist, { recursive: true });
}
if (!fs.existsSync(routerDist)) {
  await fs.promises.mkdir(routerDist, { recursive: true });
}
if (!fs.existsSync(buildDist)) {
  await fs.promises.mkdir(buildDist, { recursive: true });
}

log.i("Building the types using esbuild");
await Bun.build({
  entrypoints: ["./src/types/external.ts"],
  format: "esm",
  outdir: "./dist/serve",
  plugins: [dts()],
});

log.i("Building the router export using Bun");
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

log.i("Building the cli using Bun");
const results = await Bun.build({
  entrypoints: ["./src/exports/cli/rsc.ts", "./src/exports/cli/ssr.ts", "./src/exports/cli/dev.ts", "./src/exports/cli/build.ts"],
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
