import {type MiddlewareType} from "bun-rsc";

const middleware: MiddlewareType = async ({request, searchParams}) => {
	if (false)
		return new Response("Not sdkjfhsdkfjhk", { status: 404 })
};

export default middleware;