export const BUN_RSC_SPECIFIC_KEYWORD = "__BUN_RSC";
export const BUN_RSC_SPECIFIC_KEYWORD_STATICS = "__BUN_RSC_STATICS";
export const ACTIONS_ROUTE_PREFIX = `/${BUN_RSC_SPECIFIC_KEYWORD}/__actions/`;
export const RSC_CONTENT_TYPE = "text/x-component";

export function combineUrl(path1: string, path2: string) {
	let firstPath = path1;
	let secondPath = path2;
	if (path1.endsWith("/")) {
		firstPath = path1.substring(0, path1.length - 1);
	}
	if (path2.startsWith("/")) {
		secondPath = path2.substring(1);
	}
	return `${firstPath}/${secondPath}`;
}
