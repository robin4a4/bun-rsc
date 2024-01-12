export function StaticTags({ manifest }: { manifest: Array<string> }) {
	return (
		<>
			{manifest.map((path) => {
				if (path.endsWith(".css")) {
					return <link key={path} rel="stylesheet" href={path} />;
				}
				return null;
			})}
		</>
	);
}
