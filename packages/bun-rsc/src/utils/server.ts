/// <reference types="react/experimental" />

import gradient from "gradient-string";
import pc from "picocolors";
import { type RscMap } from "../types/internal.ts";
import { BUN_RSC_SPECIFIC_KEYWORD_STATICS, combineUrl } from "./common";
import { BootstrapType, MiddlewareType } from "../types/external.ts";

export const root = process.cwd();
export const src = `${process.cwd()}/src`;
export const dist = `${process.cwd()}/${BUN_RSC_SPECIFIC_KEYWORD_STATICS}`;

export function resolveRoot(path: string) {
	return combineUrl(root, path);
}

export function resolveSrc(path: string) {
	return combineUrl(src, path);
}

export function resolveDist(path: string) {
	return combineUrl(dist, path);
}

export function resolveClientComponentsDist(path?: string) {
	return combineUrl(resolveDist("client-components/"), path ?? "");
}

export function resolveServerComponentsDist(path?: string) {
	return combineUrl(resolveDist("server-components/"), path ?? "");
}

export function resolveServerActionsDist(path?: string) {
	return combineUrl(resolveDist("server-actions/"), path ?? "");
}

export function resolveServerFileFromFilePath(filePath: string) {
	const filePathAfterSrc = filePath
		.substring(src.length)
		.replace("/pages/", "")
		.replace(".tsx", ".js");
	return resolveServerComponentsDist(filePathAfterSrc);
}

export const rscClientComponentMapUrl = resolveDist(
	"clientComponentMap.rsc.json",
);
export const ssrClientComponentMapUrl = resolveDist(
	"clientComponentMap.ssr.json",
);

export const serverActionsMapUrl = resolveDist("serverActionsMap.json");
export const ssrTranslationMapUrl = resolveDist("ssrTranslationMap.json");

export async function writeMap(mapUrl: string, bundleMap: RscMap) {
	await Bun.write(mapUrl, JSON.stringify(bundleMap));
}

export async function readMap(mapUrl: string) {
	const bundleMap = await Bun.file(mapUrl).text();
	return JSON.parse(bundleMap) as RscMap;
}

export function createClientComponentsModuleId(path: string) {
	const root = process.cwd();
	const srcSplit = root.split("/");
	const currentDirectoryName = combineUrl(
		srcSplit[srcSplit.length - 1],
		path.replace(root, ""),
	);
	const moduleId = combineUrl(
		`/${BUN_RSC_SPECIFIC_KEYWORD_STATICS}/client-components`,
		currentDirectoryName,
	);
	return moduleId;
}

export function createServerActionsModuleId(path: string) {
	const root = process.cwd();
	const formattedPath = path.replace(combineUrl(root, "src"), "");
	const moduleId = combineUrl(
		`/${BUN_RSC_SPECIFIC_KEYWORD_STATICS}/server-actions`,
		formattedPath,
	);
	return moduleId;
}

function isUnicodeSupported() {
	if (process.platform !== "win32") {
		return process.env.TERM !== "linux"; // Linux console (kernel)
	}

	return (
		Boolean(process.env.WT_SESSION) || // Windows Terminal
		Boolean(process.env.TERMINUS_SUBLIME) || // Terminus (<0.2.27)
		process.env.ConEmuTask === "{cmd::Cmder}" || // ConEmu and cmder
		process.env.TERM_PROGRAM === "Terminus-Sublime" ||
		process.env.TERM_PROGRAM === "vscode" ||
		process.env.TERM === "xterm-256color" ||
		process.env.TERM === "alacritty" ||
		process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm"
	);
}

const unicode = isUnicodeSupported();
const s = (c: string, fallback: string) => (unicode ? c : fallback);
const S_ITEM_FILLED = s("◆", "*");
const S_ITEM = s("◇", "o");

const S_BAR_START = s("┌", "T");
const S_BAR = s("│", "|");
const S_BAR_END = s("└", "—");

const S_CONNECT_LEFT = s("├", "+");

const S_ERROR = s("▲", "!");

export const log = {
	title() {
		console.log("\n");
		console.log(
			S_BAR_START,
			S_ITEM_FILLED,
			pc.bold(gradient.morning("BUN-RSC")),
		);
	},
	i(string: string, isEnd = false) {
		console.log(S_BAR);
		console.log(
			isEnd ? S_BAR_END : S_CONNECT_LEFT,
			isEnd ? S_ITEM_FILLED : S_ITEM,
			string,
		);
		if (isEnd) console.log("\n");
	},
	s(string: string, isEnd = false) {
		console.log(S_BAR);
		console.log(
			isEnd ? S_BAR_END : S_CONNECT_LEFT,
			isEnd ? S_ITEM_FILLED : S_ITEM,
			pc.green(string),
		);
		if (isEnd) console.log("\n");
	},
	w(string: string, isEnd = false) {
		console.log(S_BAR);
		console.log(
			isEnd ? S_BAR_END : S_CONNECT_LEFT,
			isEnd ? S_ITEM_FILLED : S_ITEM,
			pc.yellow(string),
		);
		if (isEnd) console.log("\n");
	},
	e(string: string) {
		console.log(S_BAR);
		console.log(S_BAR_END, S_ERROR, pc.red(string));
		console.log("\n");
	},
};

export function getServerHeaders(contentType = "text/html") {
	const headers = new Headers();
	headers.set("Content-Type", contentType);
	if (process.env.NODE_ENV === "development") {
		headers.set("Access-Control-Allow-Origin", "*");
	}
	return headers;
}

export async function runBootstrap() {
	const bootstrapSrcPath = "src/bootstrap.ts";
	const bootstrapFile = Bun.file(bootstrapSrcPath);
	const bootstrapExists = await bootstrapFile.exists();

	if (bootstrapExists) {
		const bootstrapModule = (await import(
			`${process.cwd()}/${bootstrapSrcPath}`
		)) as { default: BootstrapType };

		if (
			bootstrapModule.default &&
			typeof bootstrapModule.default === "function"
		)
			bootstrapModule.default();
	}
}

export async function getMiddleware() {
	let middleware: MiddlewareType | null = null;
	const middlewareSrcPath = "src/middleware.ts";
	const middlewareFile = Bun.file(middlewareSrcPath);
	const middlewareExists = await middlewareFile.exists();

	if (middlewareExists) {
		const middlewareModule = (await import(
			`${process.cwd()}/${middlewareSrcPath}`
		)) as { default: MiddlewareType };

		middleware = middlewareModule.default;
	}
	return middleware;
}
