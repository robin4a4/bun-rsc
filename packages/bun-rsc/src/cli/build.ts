console.log("Building Bun RSC");
const results = await Bun.build({
	entrypoints: ["./src/cli/cli.ts"],
	outdir: "./dist",
	external: ["react", "react-dom"],
	splitting: true,
});

console.log("[BUN RSC] BUN RSC build success:", results.success ? "✅" : "❌");
if (!results.success) {
	console.log(results.logs);
}
