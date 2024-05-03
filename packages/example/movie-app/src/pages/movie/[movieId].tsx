import {
  Carousel,
  CarouselCreditsList,
  CarouselMoviesList,
} from "../../components/Carousel";
import { Header } from "../../components/Header";
import { RootLayout } from "../../components/layout";
import { getMovieDetail } from "../../getData";

export const meta = {
  title: "Movie",
  description: "Movie detail page",
};

export async function Page({ params }: { params: { movieId: string } }) {
  const [currentMovie, credits, similarMovies] = await getMovieDetail(
    Number.parseInt(params.movieId)
  );

  return (
    <RootLayout>
      <Header movie={currentMovie} type="detail" />
      <section className="p-4 md:p-8">
        <h2 className="text-4xl my-8 text-zinc-200">Credits</h2>
        <div className="w-full max-w-full">
          <Carousel>
            <CarouselCreditsList
              credits={credits.cast.filter(
                (member) => member.known_for_department === "Acting"
              )}
            />
          </Carousel>
        </div>
      </section>
      <section className="p-4 md:p-8">
        <h2 className="text-4xl my-8 text-zinc-200">Similar movies</h2>
        <div className="w-full max-w-full">
          <Carousel>
            <CarouselMoviesList movies={similarMovies.results} />
          </Carousel>
        </div>
      </section>
    </RootLayout>
  );
}
