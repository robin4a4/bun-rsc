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

export const getUpcomingMovies = cache(async () => {
  const nowPlayingMoviesResponse = await fetchWithErrors(
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
    fetchOption
  );
  return (await nowPlayingMoviesResponse.json()) as TMDBMovieResponse;
});

export const getNavBarMovies = cache(async () => {
  const responses = await Promise.all<Response>([
    fetchWithErrors(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      fetchOption
    ),
    fetchWithErrors(
      "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
      fetchOption
    ),
    fetchWithErrors(
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
      fetchOption
    ),
  ]);
  return Promise.all<TMDBMovieResponse>(
    responses.map((response) => response.json())
  );
});

export const getMovieDetail = cache(async (movieId: number) => {
  return await Promise.all([
    fetchWithErrors(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      fetchOption
    ).then((response) => response.json()) as Promise<TMDBMovie>,
    fetchWithErrors(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US&page=1`,
      fetchOption
    ).then((response) => response.json()) as Promise<TMDBMovieCreditsResponse>,
    fetchWithErrors(
      `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`,
      fetchOption
    ).then((response) => response.json()) as Promise<TMDBMovieResponse>,
  ]);
});
