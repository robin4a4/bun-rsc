export const fetchOption = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.THEMOVIEDB_API_KEY}`,
  },
};

export const ApiError = new Error(
  "There was an error fetching the data (maybe your API key is wrong ?)"
);
