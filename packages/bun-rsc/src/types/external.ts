export type Params = {
	[key: string]: string | string[] | undefined;
};

export type PageProps = {
	searchParams: URLSearchParams;
	params?: Params;
};

export type Meta = {
	title: string;
	description: string;
	icon?: string;
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
