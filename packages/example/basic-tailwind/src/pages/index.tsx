import "../global.css";
import { Counter } from "../components/Counter.tsx";
import { Nav } from "../components/Nav.tsx";

export const meta = {
	title: "Home",
	description: "My app description",
};

export async function Page() {
	return (
		<main className="pt-8 bg-slate-100 h-screen">
			<Nav currentRoute="home" />
			<section className="container mx-auto flex flex-col gap-4">
				<h1 className="text-xl font-bold">Hello, world!</h1>
				<section className="bg-white rounded-lg shadow-lg p-4 flex flex-col gap-4">
					<h2>Counter:</h2>
					<Counter />
				</section>
			</section>
		</main>
	);
}
