import { combineUrl } from "./common-utils";

export const root = process.cwd();
export const src = `${process.cwd()}/src`;
export const dist = `${process.cwd()}/__BUN_RSC`;

export function resolveRoot(path: string) {
	return combineUrl(root, path);
}

export function resolveSrc(path: string) {
	return combineUrl(src, path);
}

export function resolveDist(path: string) {
	return combineUrl(dist, path);
}

export function resolveClientDist(path?: string) {
	return combineUrl(resolveDist("client/"), path ?? "");
}

export function resolveServerDist(path?: string) {
	return combineUrl(resolveDist("server/"), path ?? "");
}

export function resolveServerFileFromFilePath(filePath: string) {
	const filePathAfterSrc = filePath
		.substring(src.length)
		.replace("/pages/", "")
		.replace(".tsx", ".js");
	return resolveServerDist(filePathAfterSrc);
}

export const rscClientComponentMapUrl = resolveDist(
	"clientComponentMap.rsc.json",
);
export const ssrClientComponentMapUrl = resolveDist(
	"clientComponentMap.ssr.json",
);

export const serverActionMapUrl = resolveDist(
	"serverActionMap.json",
);
export const ssrTranslationMapUrl = resolveDist("ssrTranslationMap.json");

export async function writeMap(mapUrl: string, bundleMap: Record<string, any>) {
	await Bun.write(mapUrl, JSON.stringify(bundleMap));
}

export async function readMap(mapUrl: string) {
	const bundleMap = await Bun.file(mapUrl).text();
	return JSON.parse(bundleMap);
}
