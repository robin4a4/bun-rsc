import Counter from "../components/Counter";
import '../global.css'

export const meta = {
	title: "HOME",
	description: "My app description",
}

export default async function Home() {
	return (
		<>
			<h1 className="bg-green-500 border border-green-500">Home yes tu ne reves pas salut de outf</h1>
			<a href="/">Home</a>
			<a href="/salut">Salut</a>
			<a href="/pouet">pouet</a>
			<Counter />
		</>
	);
}
