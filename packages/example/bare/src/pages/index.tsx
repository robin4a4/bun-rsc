import { Suspense } from "react";

import Counter from "../components/Counter";
import { addTodo } from "../actions.ts";

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
		<main>
			<h1>Hello, world!</h1>
			<section>
				<h2>Counter:</h2>
				<Counter />
			</section>
			<section>
				<h2>Form:</h2>
				<p>{currentTodos}</p>
				<form action={addTodo}>
					<input type="text" name="todo" />
					<button type="submit">Add</button>
				</form>
			</section>
			<section>
				<h2>Data:</h2>
				<Suspense fallback={<div>Loading...</div>}>
					<Data />
				</Suspense>
			</section>
		</main>
	);
}

export async function Data() {
	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));
	await sleep(1000);
	return "test";
	const data = await fetch("https://jsonplaceholder.typicode.com/todos/1").then(
		(res) => res.json(),
	);
	return <p>{data.title}</p>;
}
