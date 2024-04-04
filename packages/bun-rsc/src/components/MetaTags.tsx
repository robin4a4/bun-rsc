import type { Meta } from "../types/external";

export function MetaTags({ meta }: { meta: Meta }) {
	return (
		<>
			<title>{meta?.title ?? "My app"}</title>
			<meta name="description" content={meta?.description} />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			{meta?.icon ? <link rel="icon" href={`./public/${meta?.icon}`} /> : null}
		</>
	);
}
