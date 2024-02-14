import { ClientForm } from "../../components/ClientForm.tsx";
import Counter from "../../components/Counter.tsx";

export async function Page() {
	return (
		<>
			<h1>POUET</h1>
			<a href="/">Home</a>
			<a href="/salut">Salut</a>
			<a href="/pouet">pouet</a>
			<ClientForm />
			<Counter />
		</>
	);
}
