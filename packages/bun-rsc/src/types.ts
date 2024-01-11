export type ClientEntry = {
	id: string;
	chunks: string[];
	name: string;
};

export type SsrTranslationEntry = Record<string, ClientEntry>;

export type QueryDefaultType =
	| Record<string, unknown>
	| Record<string, unknown>[]
	| null;

export type Params = {
	[key: string]: string | string[] | undefined;
};

export type ViewProps = {
	searchParams: URLSearchParams;
	params?: Params;
};

export type Meta = {
	title: string;
	description: string;
	icon: string;
};

export type RequestType = {
	request: Request;
	searchParams?: URLSearchParams;
	params?: Params;
};
export type MiddlewareType = (
	request: RequestType,
) => Promise<Response | null | undefined>;

export type BootstrapType = () => void;
