import { ClientRscMap, RscMap } from "../types/internal";
import { createModuleId } from "../utils/server";

const TSXTranspiler = new Bun.Transpiler({ loader: "tsx" });
const TSTranspiler = new Bun.Transpiler({ loader: "ts" });

export function replaceServerCodeWithClientReferences(
  path: string,
  code: string,
  clientComponentMap: ClientRscMap
) {
  const moduleExports = TSXTranspiler.scan(code).exports;
  const moduleId = createModuleId(path, "client");

  // Here we make the consumer app import the client apis that we expose in the exports folder
  // A similar approach would have been to just write the object:
  //
  // `export default { $$typeof: Symbol.for("react.client.reference"), $$async: false, $$id: "${id}", name: "default" }`
  //
  // I just like complicated things (and also using the real apis that react provides instead of forking them)
  let refCode =
    "import {createClientReference} from 'bun-rsc/server-condition-export'\n";
  for (const exp of moduleExports) {
    let id = null;
    if (exp === "default") {
      id = `${moduleId}#default`;
      refCode += `export default createClientReference("${id}", "default")`;
    } else {
      id = `${moduleId}#${exp}`;
      refCode += `export const ${exp} = createClientReference("${id}", "${exp}")`;
    }
    const rscChunkId = moduleId
      .replace(".tsx", ".rsc.js")
      .replace(".ts", ".rsc.js");
    clientComponentMap.rsc[id] = {
      id: rscChunkId,
      chunks: [rscChunkId],
      name: exp,
    };
    const ssrChunkId = moduleId
      .replace(".tsx", ".ssr.js")
      .replace(".ts", ".ssr.js");
    clientComponentMap.ssr[id] = {
      id: ssrChunkId,
      chunks: [ssrChunkId],
      name: exp,
    };
  }
  return refCode;
}

export function replaceServerCodeWithServerReferences(
  path: string,
  code: string,
  serverActionMap: RscMap
) {
  const moduleExports = TSTranspiler.scan(code).exports;
  const moduleId = createModuleId(path, "server");
  // here we make the consumer app import the server actions api that we expose in the exports folder
  let refCode = `import {createServerReferenceServer} from 'bun-rsc/server-condition-export'

    ${code}`;
  for (const exp of moduleExports) {
    refCode += `if (typeof ${exp} === 'function') createServerReferenceServer(${exp}, "${moduleId}", "${exp}")`;
    const serverActionChunkId = moduleId.replace(".ts", ".js");
    serverActionMap[`${moduleId}#${exp}`] = {
      id: serverActionChunkId,
      chunks: [serverActionChunkId],
      name: exp,
    };
  }

  return refCode;
}

export function replaceClientCodeWithServerReferences(
  path: string,
  code: string,
  serverActionsMap: RscMap
) {
  const moduleExports = TSXTranspiler.scan(code).exports;
  const moduleId = createModuleId(path, "server");

  let refCode = `import {createServerReferenceClient} from "bun-rsc/client-condition-export"`;
  for (const exp of moduleExports) {
    const id = exp === "default" ? `${moduleId}#default` : `${moduleId}#${exp}`;
    refCode += `
                                  export${
                                    exp === "default" ? " default " : " "
                                  }const ${exp} = createServerReferenceClient("${id}")
                                  `;
    const chunkId = moduleId.replace(".tsx", ".js").replace(".ts", ".js");

    serverActionsMap[id] = {
      id: chunkId,
      chunks: [chunkId],
      name: exp,
    };
  }

  return refCode;
}
