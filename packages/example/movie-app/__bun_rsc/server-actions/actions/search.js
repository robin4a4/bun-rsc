"use server";

// src/consts.ts
var fetchOption = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.THEMOVIEDB_API_KEY}`
  }
};
var ApiError = new Error(
  "There was an error fetching the data (maybe your API key is wrong ?)"
);

// src/actions/search.tsx
async function search(_, formData) {
  try {
    const search2 = String(formData.get("search"));
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${search2}`,
      fetchOption
    ).then((response2) => response2.json());
    return {
      status: response.status,
      error: response.error,
      movies: response.results
    };
  } catch (error) {
    return {
      status: 500,
      error: "An error occurred while fetching the movies. Please try again later.",
      movies: []
    };
  }
}
export {
  search
};
