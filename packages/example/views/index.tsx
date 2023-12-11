import Counter from "./Counter";

export default async function Home() {

    const data = await fetch("https://jsonplaceholder.typicode.com/todos").then(res => res.json());
    return <>
        <h1>Home yes tu ne reves pas</h1>
        <Counter />
        {data.map((todo: any) => {
            return <p>{todo.title}</p>
        })}
    </>
} 