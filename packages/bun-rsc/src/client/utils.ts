import {BASE_RSC_SERVER_URL, BUN_RSC_SPECIFIC_KEYWORD, combineUrl} from "../utils/common";

export function getRscUrl(url: string, queryParam?: URLSearchParams) {
    const baseUrl = combineUrl(
        BASE_RSC_SERVER_URL,
        combineUrl(BUN_RSC_SPECIFIC_KEYWORD, url),
    );
    const hasQueryParam = queryParam && queryParam.length > 0;
    return hasQueryParam
        ? `${baseUrl}?${queryParam.toString()}`
        : baseUrl;
}