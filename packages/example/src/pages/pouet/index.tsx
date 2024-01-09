import Counter from "../../actions.tsx";

export default async function Pouet() {
    return <>
        <h1>POUET</h1>
        <a href="/">Home</a>
        <a href="/salut">Salut</a>
        <a href="/pouet">pouet</a>
        <form action={Counter}>
            <input type="text" name="text" />
            <button type="submit">Add</button>
        </form>
    </>
} 