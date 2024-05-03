import { cache } from "react";
import { ApiError, fetchOption } from "./consts";
import type {
  TMDBMovie,
  TMDBMovieCreditsResponse,
  TMDBMovieResponse,
} from "./types";

/**
 *  These apis are inspired by the following document:
 * https://nextjs.org/docs/app/building-your-application/data-fetching/patterns

 * It is a little overkill to use cache here as we don't multiply
 * the calls too much
 * but it is a good practice to avoid waterfalls and get a better UX 
 */

async function fetchWithErrors(
  url: string,
  options: RequestInit
): Promise<Response> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw ApiError;
  }
  return response;
}

export const getUpcomingMovies = async () => {
  const nowPlayingMoviesResponse = await fetchWithErrors(
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
    fetchOption
  );
  return nowPlayingMoviesResponse.json() as Promise<TMDBMovieResponse>;
};

export const getNavBarMovies = async () => {
  const res1 = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    fetchOption
  );
  // const res2 = (await (
  //   await fetch(
  //     "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
  //     fetchOption
  //   )
  // ).json()) as TMDBMovieResponse;
  // const res3 = (await (
  //   await fetch(
  //     "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
  //     fetchOption
  //   )
  // ).json()) as TMDBMovieResponse;
  const res = await res1.json();
  console.log(res);
  return [res, res, res];
};

export const getMovieDetail = async (movieId: number) => {
  const res1 = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
    fetchOption
  );
  const res2 = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US&page=1`,
    fetchOption
  );
  // const res3 = (await (
  //   await fetch(
  //     `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`,
  //     fetchOption
  //   )
  // ).json()) as TMDBMovieResponse;
  const res = await res1.json();
  console.log(res);
  return [res, await res2.json(), res];
};
