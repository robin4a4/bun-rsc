export const src = process.cwd()
export const dist = process.cwd() + "/dist"


function combineUrl(path1: string, path2: string) {
    if (path1.endsWith("/")) {
        path1 = path1.substring(0, path1.length - 1);
    }
    if (path2.startsWith("/")) {
        path2 = path2.substring(1);
    }
    return path1 + "/" + path2;
}


export function resolveSrc(path: string) {
  return combineUrl(src, path);
}

export function resolveDist(path: string) {
  return combineUrl(dist, path);
}

export function resolveClientDist(path: string) {
  return combineUrl(resolveDist("client/"), path);
}

export function resolveServerDist(path: string) {
  return combineUrl(resolveDist("server/"), path);
}

export const clientComponentMapUrl = resolveDist("clientComponentMap.json");

export async function writeClientComponentMap(bundleMap: Record<string, any>) {
  await Bun.write(clientComponentMapUrl, JSON.stringify(bundleMap));
}

export async function readClientComponentMap() {
  const bundleMap = await Bun.file(clientComponentMapUrl).text();
  return JSON.parse(bundleMap);
}
