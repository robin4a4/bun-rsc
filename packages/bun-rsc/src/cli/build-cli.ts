import dts from "bun-plugin-dts";
import fs from "node:fs";

console.log("Building Bun RSC");
fs.rmSync("./dist", { recursive: true });

const results = await Bun.build({
	entrypoints: ["./src/cli/cli.ts", "./src/types.ts", "./src/exports/index.ts"],
	plugins: [dts()],
	outdir: "./dist",
	external: ["react", "react-dom"],
	splitting: true,
});

console.log("[BUN RSC] BUN RSC build success:", results.success ? "✅" : "❌");
if (!results.success) {
	console.log(results.logs);
}
