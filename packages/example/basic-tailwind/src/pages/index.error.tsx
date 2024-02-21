import '../global.css'

export function Error({ error }) {
	return (
		<div className="bg-red-500 text-white">Error: {error.message}</div>
	);
}
