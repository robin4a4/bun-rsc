import { type PropsWithChildren } from "react";
import { Meta } from "../types";
import { MetaTags } from "./MetaTags";
import { Statics } from "./Statics";

export function Layout({
	children,
	meta,
	manifest,
}: PropsWithChildren<{ meta: Meta; manifest: Array<string> }>) {
	return (
		<html lang="en">
			<head>
				<MetaTags meta={meta} />
				<Statics manifest={manifest} />
			</head>
			<body>{children}</body>
		</html>
	);
}
