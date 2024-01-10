/// <reference types="react/experimental" />

import { combineUrl } from "./common-utils";
import { createFromFetch, encodeReply } from "react-server-dom-webpack/client";

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

export async function writeMap(mapUrl: string, bundleMap: Record<string, any>) {
	await Bun.write(mapUrl, JSON.stringify(bundleMap));
}

export async function readMap(mapUrl: string) {
	const bundleMap = await Bun.file(mapUrl).text();
	return JSON.parse(bundleMap);
}

export const callServer = async (id: string, args: any[]) => {
	const url = ACTIONS_ROUTE_PREFIX + encodeURIComponent(id);

	let requestOpts: Pick<RequestInit, "headers" | "body">;
	if (!Array.isArray(args) || args.some((a) => a instanceof FormData)) {
		requestOpts = {
			headers: { accept: RSC_CONTENT_TYPE },
			body: await encodeReply(args),
		};
	} else {
		requestOpts = {
			headers: {
				accept: RSC_CONTENT_TYPE,
				"content-type": "application/json",
			},
			body: JSON.stringify(args),
		};
	}

	const responsePromise = fetch(url, {
		method: "POST",
		...requestOpts,
	});

	const { actionResult } = await createFromFetch(responsePromise);

	return actionResult;
};
