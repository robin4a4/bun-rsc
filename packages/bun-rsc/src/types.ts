export type ClientEntry = {
	id: string;
	chunks: string[];
	name: string;
};

export type SsrTranslationEntry = Record<string, ClientEntry>;
