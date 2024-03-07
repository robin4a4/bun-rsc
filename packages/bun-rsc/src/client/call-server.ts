import {
	createFromFetch,
	encodeReply,
	// @ts-ignore
} from "react-server-dom-webpack/client";

import {
	BUN_RSC_SPECIFIC_KEYWORD,
	RSC_CONTENT_TYPE,
	combineUrl,
} from "../utils/common";
import { BASE_RSC_SERVER_URL } from "../utils/common";
import { globalCache } from "./cache";
import { dispatchActionReceivedEvent } from "./events";

export const callServer = async (id: string, args: unknown[]) => {
	const url = `${combineUrl(
		BASE_RSC_SERVER_URL,
		combineUrl(BUN_RSC_SPECIFIC_KEYWORD, window.location.pathname),
	)}?actionId=${encodeURIComponent(id)}`;

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

	const actionResultPromise = createFromFetch(responsePromise, { callServer });

	globalCache.set(window.location.href, actionResultPromise);

	const actionResult = await actionResultPromise;
	dispatchActionReceivedEvent();
	return actionResult;
};
