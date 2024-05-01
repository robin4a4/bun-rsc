import { Alert } from "./Alert";

export function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 text-white">
      <h1 className="text-4xl">An error occurred</h1>
      <Alert>{error.message}</Alert>
      <button
        className="px-4 py-2 text-white bg-red-500 rounded-md"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
