import { Suspense } from "react";

import Counter from "../components/Counter";
import { addTodo } from "../actions.ts";
import {db} from "../db.ts";

export const meta = {
	title: "Home",
	description: "My app description",
};

export async function Page() {
	return (
		<main>
			<h1>Hello, world!</h1>
			<section>
				<h2>Counter:</h2>
				<Counter />
			</section>
			<section>
				<h2>Todos:</h2>
				<form action={addTodo}>
					<input type="text" name="text" />
					<button type="submit">Add</button>
				</form>
				<Suspense fallback={<div>Loading...</div>}>
					<Todos />
				</Suspense>
			</section>
		</main>
	);
}

async function Todos() {
	const query = db.query("SELECT * FROM todos");
	const todos = query.all() as { id: number, text: string }[];

	return <ul>
			{todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
		</ul>
}
