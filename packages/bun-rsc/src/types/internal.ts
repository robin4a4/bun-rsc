import { type ReactNode } from "react";
import { Meta, PageProps } from "./external.ts";

export type RscMapEntry = {
	id: string;
	chunks: string[];
	name: string;
};

export type RscMap = Record<string, RscMapEntry>;

export type PageModule = {
	meta: Meta;
	Page: (props: PageProps) => Promise<ReactNode>;
};

export type ActionModule = Record<
	string,
	(formData: FormData) => Promise<void>
>;
