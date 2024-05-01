import {
  Carousel,
  CarouselCreditsList,
  CarouselMoviesList,
  Header,
  getMovieDetail
} from "../chunk-TAE77GGD.js";

// src/pages/movie/[movieId].tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
async function Page({ params }) {
  const [currentMovie, credits, similarMovies] = await getMovieDetail(
    Number.parseInt(params.movieId)
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Header, { movie: currentMovie, type: "detail" }),
    /* @__PURE__ */ jsxs("section", { className: "p-4 md:p-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl my-8 text-zinc-200", children: "Credits" }),
      /* @__PURE__ */ jsx("div", { className: "w-full max-w-full", children: /* @__PURE__ */ jsx(Carousel, { children: /* @__PURE__ */ jsx(
        CarouselCreditsList,
        {
          credits: credits.cast.filter(
            (member) => member.known_for_department === "Acting"
          )
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "p-4 md:p-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl my-8 text-zinc-200", children: "Similar movies" }),
      /* @__PURE__ */ jsx("div", { className: "w-full max-w-full", children: /* @__PURE__ */ jsx(Carousel, { children: /* @__PURE__ */ jsx(CarouselMoviesList, { movies: similarMovies.results }) }) })
    ] })
  ] });
}
export {
  Page
};
