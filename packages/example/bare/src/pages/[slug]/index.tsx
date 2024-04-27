import type { PageProps } from "bun-rsc";

export const meta = {
  title: "Second page",
  description: "My app description",
};

export async function Page({ params }: PageProps) {
  return (
    <main>
      <h1>Second page: {params?.slug}</h1>
    </main>
  );
}
