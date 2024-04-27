export const BUN_RSC_SPECIFIC_KEYWORD = "__BUN_RSC";
export const BUN_RSC_SPECIFIC_KEYWORD_STATICS = "__bun_rsc";
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

export const BASE_RSC_SERVER_URL =
  process.env.MODE === "development"
    ? "http://localhost:3001"
    : `http://${process.env.BASE_RSC_SERVER_URL}:3001` ?? "";

export function getCacheKey(url: string) {
  const urlObj = new URL(url.replace(`/${BUN_RSC_SPECIFIC_KEYWORD}`, ""));
  return urlObj.search ? urlObj.pathname + urlObj.search : urlObj.pathname;
}
