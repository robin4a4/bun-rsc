import { addTodo } from "../../actions.ts";

export async function Page() {
	return (
		<>
			<h1>POUET</h1>
			<a href="/">Home</a>
			<a href="/salut">Salut</a>
			<a href="/pouet">pouet</a>
			<form action={addTodo}>
				<input type="text" name="text" />
				<button type="submit">Add</button>
			</form>
		</>
	);
}
