import { startTransition, useState } from "react";
import { useActionReceivedEvent } from "./events";

export function useRouterState() {
	const [routerState, setRouterState] = useState(0);
	useActionReceivedEvent(() => {
		startTransition(() => {
			setRouterState((c) => c + 1);
		});
	});

	return [routerState, setRouterState] as const;
}
