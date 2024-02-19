"use client";

import { addStuff } from "../../sub2/actions-deux.ts";

export function ClientFormDeux() {
	return (
		<form action={addStuff}>
			<input type="text" name="text" />
			<button type="submit">Add</button>
		</form>
	);
}
