export function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-red-500 bg-red-950 text-red-200 p-4 rounded-lg m-4">
      <p>{children}</p>
    </div>
  );
}
