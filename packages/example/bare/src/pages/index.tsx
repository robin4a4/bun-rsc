import { Suspense } from "react";
import { type PageProps } from "bun-rsc";

import Counter from "../components/Counter";
import { Data } from "../components/Data.tsx";
import { addTodo } from "../actions.ts";

export const meta = {
	title: "Home",
	description: "My app description",
};

export async function Page({ searchParams }: PageProps) {
	return (
		<>
			<h1 className="bg-yellow-500 border border-green-500">Hello, world!</h1>
			<section>
				Counter:
				<Counter />
			</section>
			<section>
				Form:
				<form action={addTodo}>
					<input type="text" name="text" />
					<button type="submit">Add</button>
				</form>
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
