"use client";

import { useState } from "react";

export function Counter() {
	const [count, setCount] = useState(0);
	return (
		<div className="flex items-center justify-between border border-slate-300 rounded-lg">
			<button
				className="p-4 font-bold grid place-content-center"
				onClick={() => setCount(count - 1)}
			>
				-
			</button>
			<span>{count}</span>
			<button
				className="p-4 font-bold grid place-content-center"
				onClick={() => setCount(count + 1)}
			>
				+
			</button>
		</div>
	);
}
