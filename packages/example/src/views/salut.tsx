import Counter from "../components/Counter";
import { Todos } from "../components/Todos";
import { Suspense } from "react";

export default async function Salut() {
    return <>
        <h1>SALUT</h1>
        <a href="/">Home</a>
        <a href="/salut">Salut</a>
        <a href="/pouet">pouet</a>
        <Suspense fallback={<div>Loading...</div>}>
            <Todos />
        </Suspense>

        <Counter />
    </>
} 