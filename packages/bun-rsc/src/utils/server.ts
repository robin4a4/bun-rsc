/// <reference types="react/experimental" />
import { combineUrl } from "./common";

export const BUN_RSC_SPECIFIC_KEYWORD = "__BUN_RSC";
export const ACTIONS_ROUTE_PREFIX = `/${BUN_RSC_SPECIFIC_KEYWORD}/actions/`;
export const RSC_CONTENT_TYPE = "text/x-component";

export const root = process.cwd();
export const src = `${process.cwd()}/src`;
export const dist = `${process.cwd()}/${BUN_RSC_SPECIFIC_KEYWORD}`;
export const staticDir = `dist/${BUN_RSC_SPECIFIC_KEYWORD}`;

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

export const serverActionMapUrl = resolveDist("serverActionMap.json");
export const ssrTranslationMapUrl = resolveDist("ssrTranslationMap.json");

export async function writeMap(
	mapUrl: string,
	bundleMap: Record<string, unknown>,
) {
	await Bun.write(mapUrl, JSON.stringify(bundleMap));
}

export async function readMap(mapUrl: string) {
	const bundleMap = await Bun.file(mapUrl).text();
	return JSON.parse(bundleMap);
}

export function createModuleId(path: string, type: "client" | "server") {
	const root = process.cwd();
	const srcSplit = root.split("/");
	const currentDirectoryName = combineUrl(
		srcSplit[srcSplit.length - 1],
		path.replace(root, ""),
	);
	const moduleId = combineUrl(
		`/${BUN_RSC_SPECIFIC_KEYWORD}/${type}`,
		currentDirectoryName,
	);
	return moduleId;
}

export function createClientModuleId(path: string) {
	return createModuleId(path, "client");
}

export function createServerModuleId(path: string) {
	return createModuleId(path, "server");
}
