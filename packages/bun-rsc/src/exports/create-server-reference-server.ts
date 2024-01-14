import {
	registerServerReference,
	// @ts-ignore
} from "react-server-dom-webpack/server.browser";

export function createServerReferenceServer(id: string, exp: string) {
	return registerServerReference({}, id, exp);
}
