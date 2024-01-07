import { type PropsWithChildren, Suspense } from "react";

export function Layout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Future of React</title>
				<script src="https://cdn.tailwindcss.com"></script>
			</head>
			<body>{children}</body>
		</html>
	);
}
