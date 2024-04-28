import fs from "node:fs";
import { unlink } from "node:fs/promises";
import { $ } from "bun";
import * as esbuild from "esbuild";
import postcss from "postcss";
import recursive from "recursive-readdir";
import type { ClientRscMap, RscMap } from "../types/internal";
import { combineUrl } from "../utils/common";
import {
  clientComponentMapUrl,
  dist,
  log,
  resolveClientComponentsDist,
  resolveDist,
  resolveRoot,
  resolveServerActionsDist,
  resolveServerComponentsDist,
  resolveSrc,
  serverActionsMapUrl,
  writeMap,
} from "../utils/server";
import {
  replaceClientCodeWithServerReferences,
  replaceServerCodeWithClientReferences,
  replaceServerCodeWithServerReferences,
} from "./replaceReferences";

const __bun__module_map__ = new Map();

const __webpack_chunk_load__ = async (moduleId: string) => {
  const mod = await import(combineUrl(process.cwd(), moduleId));
  __bun__module_map__.set(moduleId, mod);
  return mod;
};
// @ts-ignore
global.__webpack_chunk_load__ = __webpack_chunk_load__;

const __webpack_require__ = (moduleId: string) =>
  __bun__module_map__.get(moduleId);
// @ts-ignore
global.__webpack_require__ = __webpack_require__;

const clientComponentsDist = resolveClientComponentsDist();
const serverComponentsDist = resolveServerComponentsDist();
const serverActionsDist = resolveServerActionsDist();

function isClientComponentModule(code: string) {
  return code.startsWith('"use client"') || code.startsWith("'use client'");
}

function isServerActionModule(code: string) {
  return code.startsWith('"use server"') || code.startsWith("'use server'");
}

/**
 * ========================================================================
 * Build all server and client components with esbuild
 * ========================================================================
 * */
export async function build() {
  log.i(`Mode ${process.env.MODE} 🏞`);
  const buildStartDate = Date.now();

  fs.rmSync(dist, { recursive: true });

  const clientComponentMap: ClientRscMap = { ssr: {}, rsc: {} };
  const serverActionsMap: RscMap = {};

  const clientEntryPoints = new Set<string>();
  const serverActionEntryPoints = new Set<string>();
  log.i("Building server components 💿");
  if (!fs.existsSync(serverComponentsDist)) {
    await fs.promises.mkdir(serverComponentsDist, { recursive: true });
  }
  if (!fs.existsSync(serverActionsDist)) {
    await fs.promises.mkdir(serverActionsDist, { recursive: true });
  }

  /**
   * -------------------------------------------------------------------------------------
   * Build server components and scan client components (currently also scans
   * "server server-actions", but should be after the building of "client server-actions")
   * -------------------------------------------------------------------------------------
   * */
  const serverComponentsBuildEntrypoints = await recursive(resolveSrc("pages"));

  const serverComponentsBuildResult = await esbuild.build({
    entryPoints: serverComponentsBuildEntrypoints,
    outdir: serverComponentsDist,
    format: "esm",
    bundle: true,
    splitting: true,
    external: ["bun-rsc", "react", "react-dom", "bun:sqlite", "node:fs"],
    plugins: [
      {
        name: "build-client-components-and-server-actions",
        setup(build) {
          build.onLoad({ filter: /\.(ts|tsx)$/ }, async ({ path }) => {
            const code = await Bun.file(path).text();

            if (isClientComponentModule(code)) {
              // if it is a client component, return a reference to the client component bundle
              clientEntryPoints.add(path);
              return {
                contents: replaceServerCodeWithClientReferences(
                  path,
                  code,
                  clientComponentMap,
                  buildStartDate
                ),
                loader: "js",
              };
            }

            if (isServerActionModule(code)) {
              serverActionEntryPoints.add(path);

              return {
                contents: replaceServerCodeWithServerReferences(
                  path,
                  code,
                  serverActionsMap
                ),
                loader: "ts",
              };
            }

            // If not a client component, return the original code
            return {
              contents: code,
              loader: "tsx",
            };
          });
        },
      },
    ],
  });
  if (serverComponentsBuildResult.errors.length > 0) {
    log.e("Server build failed");
    console.log(serverComponentsBuildResult.errors);
    throw new Error("Server build failed");
  }

  /**
   * -------------------------------------------------------------------------------------
   * Build client components and "server server-actions"
   * -------------------------------------------------------------------------------------
   * */
  if (!fs.existsSync(clientComponentsDist)) {
    await fs.promises.mkdir(clientComponentsDist, { recursive: true });
  }

  log.i("Building client 🏝");

  // Create router.tsx file to be build along the client components
  // It will allow every client stuff to share the same version of react
  await $`echo "import 'bun-rsc/router'" > ${combineUrl(
    process.cwd(),
    "src/router.tsx"
  )}`;
  const clientBuildOptions: esbuild.BuildOptions = {
    entryPoints: [...clientEntryPoints, "./src/router.tsx"],
    outdir: clientComponentsDist,
    splitting: true,
    format: "esm",
    bundle: true,
    define: {
      "process.env.MODE": JSON.stringify(process.env.MODE ?? "development"),
      "process.env.BUN_RSC_SERVER_URL": JSON.stringify(
        process.env.BUN_RSC_SERVER_URL ?? "http://localhost:3001"
      ),
    },
    minify: process.env.MODE === "production",
    plugins: [
      {
        name: "server-actions",
        setup(build) {
          build.onLoad({ filter: /\.(ts|tsx)$/ }, async ({ path }) => {
            const code = await Bun.file(path).text();

            if (isServerActionModule(code)) {
              serverActionEntryPoints.add(path);

              return {
                contents: replaceClientCodeWithServerReferences(
                  path,
                  code,
                  serverActionsMap
                ),
                loader: "js",
              };
            }

            // If not a server action, return the original code
            return {
              contents: code,
              loader: "tsx",
            };
          });
        },
      },
    ],
  };

  // Build client components for CSR
  const csrResults = await esbuild.build({
    ...clientBuildOptions,
    entryNames: `[dir]/[name]-${buildStartDate}.rsc`,
  });
  if (csrResults.errors.length > 0) {
    log.e("CSR build failed");
    console.log(csrResults.errors);
    throw new Error("CSR build failed");
  }
  const ssrResults = await esbuild.build({
    ...clientBuildOptions,
    external: ["react", "react-dom"],
    entryNames: `[dir]/[name]-${buildStartDate}.ssr`,
  });
  if (ssrResults.errors.length > 0) {
    log.e("SSR build failed");
    console.log(ssrResults.errors);
    throw new Error("SSR build failed");
  }
  // remove useless ssr file (i am sure there is a better way to do this inside esbuild i am just lazy)
  await unlink(resolveClientComponentsDist(`router-${buildStartDate}.ssr.js`));

  // rename router file to be used by the server
  await fs.promises.rename(
    resolveClientComponentsDist(`router-${buildStartDate}.rsc.js`),
    resolveClientComponentsDist("__bun_rsc_router.js")
  );

  if (serverActionEntryPoints.size > 0) {
    log.i("Building server actions 💪");
    const serverActionResults = await esbuild.build({
      format: "esm",
      entryPoints: [...serverActionEntryPoints],
      splitting: true,
      bundle: true,
      outdir: serverActionsDist,
      outbase: "src",
      external: ["bun:sqlite", "node:fs"],
      define: {
        "process.env.MODE": JSON.stringify(process.env.MODE),
        "process.env.BUN_RSC_SERVER_URL": JSON.stringify(
          process.env.BUN_RSC_SERVER_URL ?? "http://localhost:3001"
        ),
      },
    });
    if (serverActionResults.errors.length > 0) {
      log.e("Server actions build failed");
      console.log(serverActionResults.errors);
      throw new Error("Server actions build failed");
    }
  }

  /**
   * -------------------------------------------------------------------------------------
   * Write module maps used by the server to resolve client components and server actions
   * -------------------------------------------------------------------------------------
   * */
  await writeMap(clientComponentMapUrl, clientComponentMap);
  await writeMap(serverActionsMapUrl, serverActionsMap);

  /**
   * -------------------------------------------------------------------------------------
   * Parse built CSS files with PostCSS
   * -------------------------------------------------------------------------------------
   * */
  async function parseCSS(files: Array<string>) {
    const cssFiles = files.filter((f) => f.endsWith(".css"));
    const manifest: Array<string> = [];
    let postcssConfig = null;
    try {
      postcssConfig = await import(resolveRoot("postcss.config.js"));
    } catch (e) {
      log.i("No postcss.config.js found, continuing without PostCSS parsing");
    }
    if (!postcssConfig) return;

    log.i("Parsing CSS files with PostCSS 🎨");
    try {
      const postcssConfigPlugins = Object.entries(postcssConfig.plugins).map(
        ([name, options]) => {
          const plugin = require(name);
          return plugin(options);
        }
      );
      for (const f of cssFiles) {
        const rawCSS = await Bun.file(f).text();
        const result = await postcss(postcssConfigPlugins).process(rawCSS, {
          from: f,
        });
        await Bun.write(f, result.css);
        const fileName = f.replace(resolveRoot(""), "/");
        manifest.push(fileName);
      }
      await Bun.write(
        resolveDist("css-manifest.json"),
        JSON.stringify(manifest)
      );
    } catch (e) {
      console.log(e);
    }
  }
  function getAllCssFiles(filesArray: Array<string>, root: string) {
    const files = fs.readdirSync(root);
    for (const file of files) {
      const filePath = combineUrl(root, file);
      const fileStat = fs.statSync(filePath);

      if (fileStat.isDirectory()) {
        getAllCssFiles(filesArray, filePath);
      } else if (file.endsWith(".css")) {
        filesArray.push(filePath);
      }
    }

    return filesArray;
  }

  const cssFiles = getAllCssFiles([], resolveServerComponentsDist());
  await parseCSS(cssFiles);

  log.s(
    `Build success in ${Date.now() - buildStartDate} ms`,
    process.env.MODE !== "development"
  );
  await fs.unlinkSync(combineUrl(process.cwd(), "src/router.tsx"));
}
