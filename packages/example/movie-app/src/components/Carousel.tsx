"use client";

import { formatDate } from "../formatDate";
import { ArrowLeftIcon, ArrowRightIcon, StarMicroIcon } from "../icons";
import { TMDBMovie, TMDBMovieCredits } from "../types";
import { useRef } from "react";

const CAROUSEL_GAP = 2;
const REM_TO_PX = 16;

export function CarouselMoviesList({ movies }: { movies: TMDBMovie[] }) {
  return (
    <>
      {movies.slice(0, 10).map((movie) => (
        <li
          key={movie.id}
          className="snap-center relative shrink-0 min-w-72 max-w-72 h-96 rounded-lg overflow-hidden first:ml-4 last:mr-4 md:first:ml-8 md:last:mr-8"
        >
          <img
            src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
            alt={movie.title}
            width={312}
            height={468}
            className="rounded-xl object-cover w-full h-full"
          />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-dark/90 to-dark" />
          <div className="absolute inset-0 flex flex-col justify-end gap-2 p-4">
            <h3 className="font-thin text-2xl text-white">
              <a href={`/movie/${movie.id}`}>
                {movie.title}
                <div className="absolute inset-0" />
              </a>
            </h3>
            <p className="text-sm text-zinc-400">
              {formatDate(movie.release_date)} •{" "}
              <span className="font-bold inline-flex gap-2 items-center">
                {movie.vote_average} <StarMicroIcon />
              </span>
            </p>
          </div>
        </li>
      ))}
    </>
  );
}

export function CarouselCreditsList({
  credits,
}: {
  credits: TMDBMovieCredits[];
}) {
  return (
    <>
      {credits.slice(0, 10).map((credit) => (
        <li
          key={credit.id}
          className="snap-center relative shrink-0 min-w-72 max-w-72 h-96 rounded-lg overflow-hidden first:ml-4 last:mr-4 md:first:ml-8 md:last:mr-8"
        >
          <img
            src={`https://image.tmdb.org/t/p/w780${credit.profile_path}`}
            alt={credit.name}
            width={312}
            height={468}
            className="rounded-xl object-cover w-full h-full"
          />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-dark/90 to-dark" />
          <div className="absolute inset-0 flex flex-col justify-end gap-2 p-4">
            <h3 className="font-thin text-2xl text-white">{credit.name}</h3>
            <p className="text-sm text-zinc-400">{credit.character}</p>
          </div>
        </li>
      ))}
    </>
  );
}

export function Carousel({ children }: { children: React.ReactNode }) {
  const carouselRef = useRef<HTMLUListElement>(null);

  const swipe = (direction: "left" | "right") => {
    if (!carouselRef.current || !carouselRef.current.children[0]) return;
    carouselRef.current.scrollBy({
      left:
        (carouselRef.current.children[0].clientWidth +
          CAROUSEL_GAP * REM_TO_PX) *
        (direction === "left" ? -1 : 1),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative overflow-hidden opacity-0 motion-safe:animate-fadeIn -ml-4 md:-ml-8 w-[calc(100%+2rem)] md:w-[calc(100%+4rem)]">
      <ul
        className="flex w-full overflow-x-auto snap-proximity snap-x pb-6"
        style={{
          gap: `${CAROUSEL_GAP}rem`,
        }}
        ref={carouselRef}
      >
        {children}
      </ul>
      <div className="flex items-center gap-2 justify-end mr-4 md:mr-8">
        <button
          type="button"
          className="w-9 h-9 rounded-lg bg-darker grid place-content-center text-zinc-200"
          onClick={() => swipe("left")}
        >
          <ArrowLeftIcon />
        </button>
        <button
          type="button"
          className="w-9 h-9 rounded-lg bg-darker grid place-content-center text-zinc-200"
          onClick={() => swipe("right")}
        >
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}

export function CarouselSkeleton() {
  return (
    <div className="relative w-full overflow-hidden">
      <ul
        className="flex w-full overflow-x-auto snap-mandatory snap-x pb-6"
        style={{
          gap: `${CAROUSEL_GAP}rem`,
        }}
      >
        {[...Array(5)].map((_, index) => (
          <li
            key={index}
            className="min-w-72 max-w-72 h-96 rounded-lg overflow-hidden animate-pulse"
          >
            <div className="bg-zinc-800 w-full h-full rounded-xl" />
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 justify-end">
        <button
          type="button"
          className="w-9 h-9 rounded-lg bg-darker grid place-content-center text-zinc-200"
        >
          <ArrowLeftIcon />
        </button>
        <button
          type="button"
          className="w-9 h-9 rounded-lg bg-darker grid place-content-center text-zinc-200"
        >
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}
