import { useState } from "react";
import { useActionReceivedEvent } from "./events";

export function useRouterState() {
  const [routerState, setRouterState] = useState(0);
  console.log({ routerState });
  useActionReceivedEvent(() => {
    setRouterState((c) => c + 1);
  });

  return routerState;
}
