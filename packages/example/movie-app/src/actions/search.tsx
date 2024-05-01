"use server";

import { fetchOption } from "../consts";

export async function search(_: unknown, formData: FormData) {
  try {
    const search = String(formData.get("search"));
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${search}`,
      fetchOption
    ).then((response) => response.json());
    return {
      status: response.status,
      error: response.error,
      movies: response.results,
    };
  } catch (error) {
    return {
      status: 500,
      error:
        "An error occurred while fetching the movies. Please try again later.",
      movies: [],
    };
  }
}
