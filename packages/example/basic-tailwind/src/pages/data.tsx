import { Suspense } from "react";

import "../global.css";
import Counter from "../components/Counter.tsx";
import {addTodo} from "../actions.ts";
import {FormContent} from "../components/FormContent.tsx";
import {Nav} from "../components/Nav.tsx";
import {PageProps} from "bun-rsc";

export const meta = {
	title: "Data page",
	description: "Page of the app that fetches some data",
};

export async function Page() {
	return (
		<main className="pt-8 bg-slate-100 h-screen">
            <Nav currentRoute="data"/>
			<section className="container mx-auto flex flex-col gap-4">
				<section className="bg-white rounded-lg shadow-lg p-4 flex flex-col gap-4">
					<h2>Data:</h2>
					<Suspense fallback={<div>Loading...</div>}>
						<Data />
					</Suspense>
				</section>
			</section>
		</main>
	);
}

async function Data() {
	// fake latency
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const data = await fetch("https://jsonplaceholder.typicode.com/todos/1").then(
		(res) => res.json(),
	);
	return <p>{data.title}</p>;
}
