export {};

declare global {
	interface Window {
		__SSR_META_STRING__: string;
		__RSC_META_STRING__: string;
		__MANIFEST_STRING__: string;
		__BUN_RSC_CACHE__: Map<string, unknown>;
	}
}
