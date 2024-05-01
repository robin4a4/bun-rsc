import type { Meta } from "bun-rsc";
import { Alert } from "../components/Alert";
import { Carousel, CarouselMoviesList } from "../components/Carousel";
import { Header } from "../components/Header";
import { RootLayout } from "../components/layout";
import { getUpcomingMovies } from "../getData";
import "../global.css";

export const meta: Meta = {
  title: "Robin x Fleet | Technical test",
  description: "Movie app for Robin x Fleet technical test",
};

export async function Page() {
  const nowPlayingMovies = await getUpcomingMovies();

  const [firstNowPlayingMovie, ...restNowPlayingMovies] =
    nowPlayingMovies.results;

  if (!firstNowPlayingMovie) {
    return <Alert>No movies found</Alert>;
  }
  return (
    <RootLayout>
      <Header movie={firstNowPlayingMovie} type="homepage" />
      <section className="p-4 md:p-8">
        <h2 className="text-4xl my-8 text-zinc-200">Now playing</h2>
        <div className="w-full max-w-full">
          <Carousel>
            <CarouselMoviesList movies={restNowPlayingMovies} />
          </Carousel>
        </div>
      </section>
    </RootLayout>
  );
}
