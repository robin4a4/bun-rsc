import type { ReactNode } from "react";
import type { Meta, PageProps } from "./external.ts";

export type RscMapEntry = {
	id: string;
	chunks: string[];
	name: string;
};

export type RscMap = Record<string, RscMapEntry>;
export type ClientRscMap = { ssr: RscMap; rsc: RscMap };

export type PageModule = {
	meta: Meta;
	Page: (props: PageProps) => Promise<ReactNode>;
};

export type ActionModule = Record<
	string,
	(formData: FormData) => Promise<void>
>;
