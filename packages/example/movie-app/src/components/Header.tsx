import { ArrowRightIcon, StarMicroIcon } from "../icons";
import { TMDBMovie } from "../types";
import { LinkButton } from "./Button";
import { formatDate } from "../formatDate";

export function Header({
  movie,
  type,
}: {
  movie: TMDBMovie;
  type: "homepage" | "detail";
}) {
  return (
    <header className="md:h-1/2 relative opacity-0 motion-safe:animate-fadeIn">
      <img
        src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
        alt={movie.title}
        width={1920}
        height={1080}
        className="object-cover w-full h-full"
      />
      <div className="hidden md:block md:absolute inset-0 bg-gradient-to-b from-transparent to-dark" />
      <div className="md:absolute inset-0 flex justify-end p-4 md:p-8 flex-col gap-4 ">
        <h1 className="text-4xl md:text-8xl tracking-wider font-thin text-white/80">
          {movie.title}
        </h1>
        <p className="text-white/70 md:w-1/2">
          {formatDate(movie.release_date)} •{" "}
          <span className="font-bold inline-flex gap-2 items-center">
            {movie.vote_average} <StarMicroIcon />
          </span>
        </p>
        <p className="text-white/70 md:w-1/2">
          {type === "homepage" && <>{movie.overview.split(".")[0]}.</>}
          {type === "detail" && movie.overview}
        </p>
        {type === "homepage" && (
          <LinkButton href={`/movie/${movie.id}`}>
            See more
            <ArrowRightIcon />
          </LinkButton>
        )}
      </div>
    </header>
  );
}

export function HeaderSkeleton() {
  return (
    <header className="md:h-1/2 relative">
      <div className="md:absolute inset-0 flex justify-end p-4 md:p-8 flex-col gap-4">
        <div className="animate-pulse bg-zinc-800 w-full h-96 rounded-lg" />
        <div className="animate-pulse bg-zinc-800 w-2/3 h-24 rounded-lg" />
        <div className="animate-pulse bg-zinc-800 w-1/3 h-4 rounded-lg" />
        <div className="animate-pulse bg-zinc-800 w-1/2 h-8 rounded-lg" />
        <div className="animate-pulse bg-zinc-800 w-16 h-8 rounded-lg" />
      </div>
    </header>
  );
}
