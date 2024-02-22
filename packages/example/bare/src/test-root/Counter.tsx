"use client"

import { useState } from "react";

export default function Counter3() {
    const [count, setCount] = useState(0);
    return <>
        <h1>Counter</h1>
        <p>
            <button onClick={() => setCount(count - 1)}>-</button>
            <span>{count}</span>
            <button onClick={() => setCount(count + 1)}>+</button>
        </p>
    </>
}