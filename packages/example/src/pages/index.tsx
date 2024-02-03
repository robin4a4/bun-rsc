import Counter from "../components/Counter";
import Counter2 from "../components/sub1/Counter2";
import Counter3 from "../sub2/Counter3";
import "../global.css";

import { PageProps } from "bun-rsc";

export const meta = {
	title: "HOME",
	description: "My app description",
};

export async function Page({ searchParams }: PageProps) {
	return (
		<>
			<h1 className="bg-green-500 border border-green-500">
				Home yes tu ne reves pas salut de outf
			</h1>
			<a href="/">Home</a>
			<a href="/salut">Salut</a>
			<a href="/pouet">pouet</a>
			<Counter />
			<Counter2 />
			<Counter3 />
		</>
	);
}
