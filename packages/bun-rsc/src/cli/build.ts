await Bun.build({
	entrypoints: ["./cli.ts"],
	outdir: "../../dist",
	splitting: true,
});
