import { useEffect } from "react";

export function dispatchEvent<TDetail extends Record<string, unknown>>(
	type: string,
	eventInit?: TDetail,
) {
	const event = new CustomEvent(type, eventInit);
	window.dispatchEvent(event);
}

const CustomEvents = {
	ACTION_RECEIVED: "ACTION_RECEIVED",
} as const;

export function dispatchActionReceivedEvent() {
	dispatchEvent(CustomEvents.ACTION_RECEIVED);
}

export function useListenEvent(
	type: keyof typeof CustomEvents,
	listener: (event: Event) => void,
) {
	useEffect(() => {
		window.addEventListener(type, listener);
		return () => {
			window.removeEventListener(type, listener);
		};
	}, [type, listener]);
}

export function useActionReceivedEvent(listener: (event: Event) => void) {
	useListenEvent(CustomEvents.ACTION_RECEIVED, listener);
}
