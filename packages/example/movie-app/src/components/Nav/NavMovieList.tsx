import { ChevronBottomIcon } from "../../icons";
import { TMDBMovie } from "../../types";

function NavMobieItem({ movie }: { movie: TMDBMovie }) {
  return (
    <li className="py-2 flex gap-4 items-center relative">
      <img
        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
        alt={movie.title}
        className="w-10 h-14 rounded-lg"
        width={48}
        height={64}
      />
      <a
        href={`/movie/${movie.id}`}
        className="text-zinc-400 hover:text-zinc-200 transition"
      >
        {movie.title}
        <div className="absolute inset-0" />
      </a>
    </li>
  );
}

export function NavMovieList({ movies }: { movies: Array<TMDBMovie> }) {
  return (
    <ul className="flex flex-col overflow-y-scroll">
      {movies.slice(0, 3).map((movie) => (
        <NavMobieItem key={movie.id} movie={movie} />
      ))}
      <details className="group">
        <summary className="py-2 flex gap-4 items-center relative w-full">
          <div className="text-zinc-500 font-semibold flex justify-between w-full">
            More
            <ChevronBottomIcon className="group-open:rotate-180 transition" />
          </div>
          <div className="absolute inset-0" />
        </summary>
        <ul className="flex flex-col gap-2">
          {movies.slice(3).map((movie) => (
            <NavMobieItem key={movie.id} movie={movie} />
          ))}
        </ul>
      </details>
    </ul>
  );
}
