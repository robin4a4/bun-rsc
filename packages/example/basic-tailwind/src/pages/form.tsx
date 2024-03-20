import "../global.css";
import { addTodo } from "../actions.ts";
import { FormContent } from "../components/FormContent.tsx";
import { Nav } from "../components/Nav.tsx";
import { ClientForm } from "../components/ClientForm.tsx";

export const meta = {
	title: "Form page",
	description: "Page of the app that has a form to add todos",
};

export async function Page() {
	const currentTodosFile = Bun.file(`${process.cwd()}/todos.txt`);
	let currentTodos = ["No todos yet"];
	if (await currentTodosFile.exists()) {
		currentTodos = (await currentTodosFile.text()).split("\n");
	}
	return (
		<main className="pt-8 bg-slate-100 h-screen">
			<Nav currentRoute="form" />
			<section className="container mx-auto flex flex-col gap-4">
				<section className="bg-white rounded-lg shadow-lg p-4 flex flex-col gap-4">
					<h2>Form:</h2>
					<h3>Server form</h3>
					<form action={addTodo}>
						<FormContent />
					</form>
					<h3>Client form</h3>
					<ClientForm />
					<ul className="pl-4">{currentTodos.map((todo) => <li key={todo} className="list-disc">{todo}</li>)}</ul>
				</section>
			</section>
		</main>
	);
}
