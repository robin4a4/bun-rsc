"use client";
import { useFormStatus } from "react-dom";

export function FormContent() {
	const status = useFormStatus();
	return (
		<div className="flex items-center gap-4">
			<input
				className="border border-green-300 rounded-lg flex-1 p-2"
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
