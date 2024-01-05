export const src = process.cwd()
export const dist = process.cwd() + "/dist"


export function combineUrl(path1: string, path2: string) {
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

export const clientComponentMapUrl = resolveDist("clientComponentMap.json")
export const ssrTranslationMapUrl = resolveDist("ssrTranslationMap.json")

export async function writeMap(mapUrl: string, bundleMap: Record<string, any>) {
  await Bun.write(mapUrl, JSON.stringify(bundleMap));
}

export async function readMap(mapUrl: string) {
  const bundleMap = await Bun.file(mapUrl).text();
  return JSON.parse(bundleMap);
}