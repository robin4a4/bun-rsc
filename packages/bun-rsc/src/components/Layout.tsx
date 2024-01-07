import { type PropsWithChildren, Suspense } from "react";

export function Layout({ children, manifest }: PropsWithChildren<{manifest: Array<string>}>) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Future of React</title>
				{manifest.map((path) => {
					if (path.endsWith(".css")) {
						return <link key={path} rel="stylesheet" href={path} />;
					}
					return null;
				})}
			</head>
			<body>{children}</body>
		</html>
	);
}
