import { type ReactNode, type Thenable, startTransition } from "react";
import {
	createFromFetch,
	encodeReply,
	// @ts-expect-error
} from "react-server-dom-webpack/client";
import {
	BASE_RSC_SERVER_URL,
	BUN_RSC_SPECIFIC_KEYWORD,
	RSC_CONTENT_TYPE,
	combineUrl,
	getCacheKey,
} from "../utils/common";

export const callServer = async (id: string, args: unknown[]) => {
	const baseUrl = combineUrl(
		BASE_RSC_SERVER_URL,
		combineUrl(BUN_RSC_SPECIFIC_KEYWORD, window.location.pathname),
	);
	const url = `${baseUrl}?actionId=${encodeURIComponent(id)}`;

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

	const actionResult = createFromFetch(
		fetch(url, {
			method: "POST",
			...requestOpts,
		}),
		{ callServer },
	) as Thenable<ReactNode>;
	const cacheKey = getCacheKey(baseUrl);
	startTransition(() => {
		if (window.__UPDATE_RSC_PAYLOAD__) {
			window.__BUN_RSC_CACHE__.set(cacheKey, actionResult);
			window.__UPDATE_RSC_PAYLOAD__(actionResult);
		}
	});
	return actionResult;
};
