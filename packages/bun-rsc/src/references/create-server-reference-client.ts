import {
  createServerReference,
  // @ts-ignore
} from "react-server-dom-webpack/client";

import { callServer } from "../client/call-server";

export const createServerReferenceClient = (id: string) => {
  // See: https://github.com/facebook/react/pull/26632
  return createServerReference(id, callServer);
};
