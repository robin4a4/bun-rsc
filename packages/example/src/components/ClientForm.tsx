"use client";

import { addTodo } from "../actions.ts";

export function ClientForm() {
	return (
		<form action={addTodo}>
			<input type="text" name="text" />
			<button type="submit">Add</button>
		</form>
	);
}
