import {
  registerServerReference,
  // @ts-ignore
} from "react-server-dom-webpack/server.browser";

export function createServerReferenceServer(
  fn: (...args: unknown[]) => unknown,
  id: string,
  exp: string
) {
  registerServerReference(fn, id, exp);
}
