import { Suspense } from "react";

import "../global.css";
import Counter from "../components/Counter.tsx";
import {addTodo} from "../actions.ts";
import {FormContent} from "../components/FormContent.tsx";

export const meta = {
	title: "Home",
	description: "My app description",
};

export async function Page() {
	const currentTodosFile = Bun.file(`${process.cwd()}/todos.txt`);
	let currentTodos = "No todos yet";
	if (await currentTodosFile.exists()) {
		currentTodos = await currentTodosFile.text();
	}
	return (
		<main className="pt-8 bg-slate-100">
			<section className="container mx-auto flex flex-col gap-4">
				<h1 className="text-xl font-bold">Hello, world!</h1>
				<section className="bg-white rounded-lg shadow-lg p-4 flex flex-col gap-4">
					<h2>Counter:</h2>
					<Counter />
				</section>
				<section className="bg-white rounded-lg shadow-lg p-4 flex flex-col gap-4">
					<h2>Form:</h2>
					<p>{currentTodos}</p>
					<form action={addTodo}>
						<FormContent />
					</form>
				</section>
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

	// const data = await fetch("https://jsonplaceholder.typicode.com/todos/1").then(
	// 	(res) => res.json(),
	// );
	const data = {
		title: "Data",
	};
	return <p>{data.title}</p>;
}
