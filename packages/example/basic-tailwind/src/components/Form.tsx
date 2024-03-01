"use client";
import { addTodo } from "../actions";
import { useFormStatus } from "react-dom";

function FormContent() {
	const status = useFormStatus();
	return (
		<div className="flex items-center gap-4">
			<input
				className="border border-slate-300 rounded-lg flex-1 p-2"
				type="text"
				name="todo"
			/>
			<button
				disabled={status.pending}
				className="bg-blue-500 disabled:bg-slate-300 rounded-lg px-4 py-2 text-white"
				type="submit"
			>
				Add
			</button>
		</div>
	);
}

export function Form() {
	return (
		<form action={addTodo}>
			<FormContent />
		</form>
	);
}
