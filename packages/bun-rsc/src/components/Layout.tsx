import { type PropsWithChildren } from "react";
import { Meta } from "../types";
import { BUN_RSC_SPECIFIC_KEYWORD_STATICS } from "../utils/common";
import { CssTags } from "./CssTags";
import { MetaTags } from "./MetaTags";

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
