import { type PropsWithChildren } from "react";
import { Meta } from "../types";
import { MetaTags } from "./MetaTags";
import { CssTags } from "./CssTags";
import { BUN_RSC_SPECIFIC_KEYWORD_STATICS } from "../utils/common";

export function Layout({
	children,
	meta,
	cssManifest,
}: PropsWithChildren<{ meta: Meta; cssManifest: Array<string> }>) {
	return (
		<html lang="en">
			<head>
				<MetaTags meta={meta} />
				<CssTags manifest={cssManifest} />
			</head>
			<body>{children}</body>
		</html>
	);
}
