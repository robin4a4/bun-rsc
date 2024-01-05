import Counter from "../components/Counter";

export default async function Home() {
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(1000);
    const data = await fetch("https://jsonplaceholder.typicode.com/todos").then(res => res.json());
    return <>
        <h1>Home yes tu ne reves pas</h1>
        <a href="/">Home</a>
        <a href="/salut">Salut</a>
        <a href="/pouet">pouet</a>
        <Counter />
        {data.map((todo: any) => {
            return <p>{todo.title}</p>
        })}
    </>
} 