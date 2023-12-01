
export default async function Home() {

    const data = await fetch("https://jsonplaceholder.typicode.com/todos").then(res => res.json());
    return <>
        <h1>Home</h1>
        <p>
            This is a <a href="https://bunjs.org">Bun.js</a> application.
        </p>
        {data.map((todo) => {
            return <p>{todo.title}</p>
        })}
    </>
} 