import {
	createFromFetch,
	encodeReply,
	createServerReference,
	// @ts-ignore
} from "react-server-dom-webpack/client";

import {
	ACTIONS_ROUTE_PREFIX,
	RSC_CONTENT_TYPE,
	combineUrl,
} from "../utils/common";

const callServer = async (id: string, args: unknown[]) => {
	const url = combineUrl(
		"http://localhost:3001",
		combineUrl(ACTIONS_ROUTE_PREFIX, encodeURIComponent(id)),
	);

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

export const createServerReferenceClient = (id: string) => {
	// See: https://github.com/facebook/react/pull/26632
	return createServerReference(id, callServer);
};
