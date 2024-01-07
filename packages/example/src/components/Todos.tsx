export async function Todos() {
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(1000);
    const data = await fetch("https://jsonplaceholder.typicode.com/todos").then(res => res.json());
    return (<>
            {data.map((todo: any) => {
                return <p>{todo.title}</p>
            })}
        </>
    )
}