import Counter from "../components/Counter";

export default async function Salut() {
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(1000);

    return <>
        <h1>SALUT</h1>
        <a href="/">Home</a>
        <a href="/salut">Salut</a>
        <a href="/pouet">pouet</a>

        <Counter />
    </>
} 