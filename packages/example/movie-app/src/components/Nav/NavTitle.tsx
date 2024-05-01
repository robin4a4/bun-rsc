export function NavTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-zinc-500 font-semibold flex items-center gap-2 mb-2">
      {children}
    </h2>
  );
}
