"use client";
import { addTodo } from "../actions";
import { FormContent } from "./FormContent";

export function ClientForm() {
	return (
		<form action={addTodo}>
			<FormContent />
		</form>
	);
}
