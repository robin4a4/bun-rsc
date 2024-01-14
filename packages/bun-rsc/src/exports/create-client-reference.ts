import {
	registerClientReference,
	// @ts-ignore
} from "react-server-dom-webpack/server.browser";

export function createClientReference(id: string, exp: string) {
	return registerClientReference({}, id, exp);
}
