import { Suspense } from "react";
import { NavContent, NavContentSkeleton } from "../components/Nav/NavContent";
import { ChevronBottomIcon } from "../icons";

const Logo = () => (
  <a href="/" className="flex items-center gap-2 text-white">
    Logo
  </a>
);

export async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="bg-darker md:py-4 md:flex h-screen w-screen relative">
      <details className="md:hidden p-4 group sticky top-0 bg-darker z-20">
        <summary className="flex w-full justify-between items-center text-white">
          <Logo />
          <ChevronBottomIcon className="group-open:rotate-180 transition" />
        </summary>
        <div className="px-2 pt-6 pb-2">
          <Suspense fallback={<NavContentSkeleton />}>
            <NavContent />
          </Suspense>
        </div>
      </details>
      <aside className="hidden md:block w-96 h-full overflow-y-auto relative">
        <div className="sticky top-0 bg-darker z-10 p-4">
          <Logo />
        </div>
        <Suspense fallback={<NavContentSkeleton />}>
          <NavContent />
        </Suspense>
      </aside>
      <main className="flex-1 md:rounded-l-2xl bg-dark overflow-y-auto">
        {children}
      </main>
    </section>
  );
}
