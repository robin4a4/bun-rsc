import type { Meta } from "../types";

export function MetaTags({ meta }: { meta: Meta }) {
	return (
		<>
			<title>{meta?.title ?? "My app"}</title>
			<meta name="description" content={meta?.description} />
			{meta?.icon ? <link rel="icon" href={`./public/${meta?.icon}`} /> : null}
		</>
	);
}
