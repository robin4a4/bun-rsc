import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {
	clientComponentMapUrl,
  combineUrl,
  resolveDist,
  resolveSrc,
  ssrTranslationMapUrl,
  writeMap,
} from "./utils.js";
import { ClientEntry, SsrTranslationEntry } from "./types.js";
import { BuildConfig } from "bun";

const transpiler = new Bun.Transpiler({ loader: "tsx" });

const clientDistRSC = resolveDist("client/rsc");
const clientDistSSR = resolveDist("client/ssr");

function isClientComponent(code: string) {
  return code.startsWith('"use client"') || code.startsWith("'use client'");
}

/**
 * Build all server and client components with esbuild
 */
export async function build() {
  const clientComponentMap: Record<string, ClientEntry> = {};
  const ssrTranslationMap: Record<string, SsrTranslationEntry> = {};

  const clientEntryPoints = new Set<string>();

  console.log("💿 Building server components");
  const serverDist = resolveDist("server/");
  if (!fs.existsSync(serverDist)) {
    await fs.promises.mkdir(serverDist, { recursive: true });
  }

  // Build server components
  await Bun.build({
    target: "bun",
    sourcemap: "none",
    splitting: true,
    format: "esm",
    entrypoints: [resolveSrc("views/index.tsx")],
    outdir: serverDist,
    plugins: [
      {
        name: "build-server-components",
        setup(build) {
          build.onLoad({ filter: /\.(ts|tsx)$/ }, async ({ path }) => {
            const code = await Bun.file(path).text();
            if (!isClientComponent(code)) {
              // if not a client component, just return the code and let it be bundled
              return {
                contents: code,
                loader: "tsx",
              };
            }
            clientEntryPoints.add(path);

            // if it is a client component, return a reference to the client bundle
            const root = process.cwd();
            const srcSplit = root.split("/");
            const currentDirectoryName = combineUrl(
              srcSplit[srcSplit.length - 1],
              path.replace(root, "")
            );
            const rscOutputKey = combineUrl(
              "/dist/client/rsc",
              currentDirectoryName
            );
            const ssrOutputKey = combineUrl(
              "/dist/client/ssr",
              currentDirectoryName
            );

            const moduleExports = transpiler.scan(code).exports;
            let refCode = "";
            for (const exp of moduleExports) {
              let rscId = null;
              let ssrId = null;
              if (exp === "default") {
                rscId = `${rscOutputKey}#default`;
                ssrId = `${ssrOutputKey}#default`;
                refCode += `\nexport default { $$typeof: Symbol.for("react.client.reference"), $$async: false, $$id: "${rscId}", name: "default" }`;
              } else {
                rscId = `${rscOutputKey}#${exp}`;
                refCode += `\nexport const ${exp} = { $$typeof: Symbol.for("react.client.reference"), $$async: false, $$id: "${rscId}", name: "${exp}" }`;
                ssrId = `${ssrOutputKey}#${exp}`;
              }
              clientComponentMap[rscId] = {
                id: rscOutputKey.replace(".tsx", ".js").replace(".ts", ".js"),
                chunks: [
                  rscOutputKey.replace(".tsx", ".js").replace(".ts", ".js"),
                ],
                name: exp,
              };
              clientComponentMap[ssrId] = {
                id: ssrOutputKey.replace(".tsx", ".js").replace(".ts", ".js"),
                chunks: [
                  ssrOutputKey.replace(".tsx", ".js").replace(".ts", ".js"),
                ],
                name: exp,
              };
			  ssrTranslationMap[rscId] = {
				[exp]: clientComponentMap[ssrId]
			  }
            }

            return {
              contents: refCode,
              loader: "js",
            };
          });
        },
      },
    ],
  });

  if (!fs.existsSync(clientDistRSC)) {
    await fs.promises.mkdir(clientDistRSC, { recursive: true });
  }

  if (!fs.existsSync(clientDistSSR)) {
    await fs.promises.mkdir(clientDistSSR, { recursive: true });
  }

  if (clientEntryPoints.size > 0) {
    console.log("🏝 Building client components");
  }

  const clientBuildOptions: BuildConfig = {
    format: "esm",
    entrypoints: [
      ...clientEntryPoints,
      fileURLToPath(new URL("router.tsx", import.meta.url)),
    ],
    outdir: clientDistRSC,
    target: "browser",
    sourcemap: "none",
    splitting: true,
  };

  // Build client components for CSR
  await Bun.build(clientBuildOptions);

  // Build client components for SSR
  await Bun.build({
    ...clientBuildOptions,
    external: ["react", "react-dom"],
  });

  // // Write mapping from client-side component ID to chunk
  // // This is read by the server when generating the RSC stream.
  await writeMap(clientComponentMapUrl, clientComponentMap);
  await writeMap(ssrTranslationMapUrl, ssrTranslationMap);
}

build();
