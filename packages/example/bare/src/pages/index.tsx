import {Suspense} from "react";
import { type PageProps } from "bun-rsc";

import Counter from "../components/Counter";
import {ClientForm} from "../components/ClientForm.tsx";
import {Data} from "../components/Data.tsx";

export const meta = {
	title: "Home",
	description: "My app description",
};

export async function Page({ searchParams }: PageProps) {
	return (
		<>
			<h1 className="bg-yellow-500 border border-green-500">
				Hello, world!
			</h1>
			<section>
				Counter:
				<Counter />
			</section>
			<section>
				Form:
				<ClientForm/>
			</section>
			<section>
				Data:
				<Suspense fallback={<div>Loading...</div>}>
					<Data />
				</Suspense>
			</section>
		</>
	);
}
