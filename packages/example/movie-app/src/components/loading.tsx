import { CarouselSkeleton } from "./Carousel";
import { HeaderSkeleton } from "./Header";

export default function Loading() {
  return (
    <>
      <HeaderSkeleton />
      <section className="p-4 md:p-8">
        <h2 className="text-4xl my-8 text-zinc-200">Credits</h2>
        <CarouselSkeleton />
      </section>
    </>
  );
}
