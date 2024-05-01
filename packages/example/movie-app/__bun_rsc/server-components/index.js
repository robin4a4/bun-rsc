import {
  Carousel,
  CarouselMoviesList,
  ChevronBottomIcon,
  FireIcon,
  Header,
  HomeIcon,
  SearchIcon,
  TrendingIcon,
  UpcomingIcon,
  getNavBarMovies,
  getUpcomingMovies
} from "./chunk-TAE77GGD.js";

// src/components/Alert.tsx
import { jsx } from "react/jsx-runtime";
function Alert({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "border border-red-500 bg-red-950 text-red-200 p-4 rounded-lg m-4", children: /* @__PURE__ */ jsx("p", { children }) });
}

// src/components/layout.tsx
import { Suspense } from "react";

// src/components/Nav/NavSection.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function NavSection({ children }) {
  return /* @__PURE__ */ jsx2("div", { className: "flex flex-col gap-4", children });
}

// src/components/Nav/NavTitle.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
function NavTitle({ children }) {
  return /* @__PURE__ */ jsx3("h2", { className: "text-zinc-500 font-semibold flex items-center gap-2 mb-2", children });
}

// src/components/Nav/SearchForm.tsx
import { createClientReference } from "bun-rsc/server-condition-export";
var SearchForm = createClientReference("/__bun_rsc/client-components/components/Nav/SearchForm.tsx#SearchForm", "SearchForm");
var SearchInput = createClientReference("/__bun_rsc/client-components/components/Nav/SearchForm.tsx#SearchInput", "SearchInput");

// src/components/Nav/NavMovieList.tsx
import { jsx as jsx4, jsxs } from "react/jsx-runtime";
function NavMobieItem({ movie }) {
  return /* @__PURE__ */ jsxs("li", { className: "py-2 flex gap-4 items-center relative", children: [
    /* @__PURE__ */ jsx4(
      "img",
      {
        src: `https://image.tmdb.org/t/p/w92${movie.poster_path}`,
        alt: movie.title,
        className: "w-10 h-14 rounded-lg",
        width: 48,
        height: 64
      }
    ),
    /* @__PURE__ */ jsxs(
      "a",
      {
        href: `/movie/${movie.id}`,
        className: "text-zinc-400 hover:text-zinc-200 transition",
        children: [
          movie.title,
          /* @__PURE__ */ jsx4("div", { className: "absolute inset-0" })
        ]
      }
    )
  ] });
}
function NavMovieList({ movies }) {
  return /* @__PURE__ */ jsxs("ul", { className: "flex flex-col overflow-y-scroll", children: [
    movies.slice(0, 3).map((movie) => /* @__PURE__ */ jsx4(NavMobieItem, { movie }, movie.id)),
    /* @__PURE__ */ jsxs("details", { className: "group", children: [
      /* @__PURE__ */ jsxs("summary", { className: "py-2 flex gap-4 items-center relative w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-zinc-500 font-semibold flex justify-between w-full", children: [
          "More",
          /* @__PURE__ */ jsx4(ChevronBottomIcon, { className: "group-open:rotate-180 transition" })
        ] }),
        /* @__PURE__ */ jsx4("div", { className: "absolute inset-0" })
      ] }),
      /* @__PURE__ */ jsx4("ul", { className: "flex flex-col gap-2", children: movies.slice(3).map((movie) => /* @__PURE__ */ jsx4(NavMobieItem, { movie }, movie.id)) })
    ] })
  ] });
}

// src/components/Nav/NavContent.tsx
import { jsx as jsx5, jsxs as jsxs2 } from "react/jsx-runtime";
function NavContentSkeleton() {
  return /* @__PURE__ */ jsxs2("div", { className: "animate-pulse flex flex-col gap-4", children: [
    /* @__PURE__ */ jsx5("div", { className: "h-11 bg-zinc-900 rounded-lg" }),
    /* @__PURE__ */ jsxs2("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx5("div", { className: "h-24 bg-zinc-900 rounded-lg" }),
      /* @__PURE__ */ jsx5("div", { className: "h-24 bg-zinc-900 rounded-lg" }),
      /* @__PURE__ */ jsx5("div", { className: "h-24 bg-zinc-900 rounded-lg" }),
      /* @__PURE__ */ jsx5("div", { className: "h-24 bg-zinc-900 rounded-lg" }),
      /* @__PURE__ */ jsx5("div", { className: "h-24 bg-zinc-900 rounded-lg" }),
      /* @__PURE__ */ jsx5("div", { className: "h-24 bg-zinc-900 rounded-lg" }),
      /* @__PURE__ */ jsx5("div", { className: "h-24 bg-zinc-900 rounded-lg" })
    ] })
  ] });
}
async function NavContent() {
  if (!process.env.THEMOVIEDB_API_KEY) {
    return /* @__PURE__ */ jsxs2(Alert, { children: [
      "You need to set the ",
      /* @__PURE__ */ jsx5("code", { children: "THEMOVIEDB_API_KEY" }),
      " environment variable in a `.env` file."
    ] });
  }
  const [popularMovies, topRatedMovies, upcomingMovies] = await getNavBarMovies();
  if (!popularMovies || !topRatedMovies || !upcomingMovies) {
    return /* @__PURE__ */ jsx5(Alert, { children: "No movies found" });
  }
  return /* @__PURE__ */ jsxs2("nav", { className: "flex flex-col gap-10 mt-8 p-4", children: [
    /* @__PURE__ */ jsx5(NavSection, { children: /* @__PURE__ */ jsx5("a", { href: "/", children: /* @__PURE__ */ jsxs2(NavTitle, { children: [
      /* @__PURE__ */ jsx5(HomeIcon, {}),
      "Home"
    ] }) }) }),
    /* @__PURE__ */ jsxs2(NavSection, { children: [
      /* @__PURE__ */ jsxs2(NavTitle, { children: [
        /* @__PURE__ */ jsx5(SearchIcon, {}),
        "Search"
      ] }),
      /* @__PURE__ */ jsx5(SearchForm, {})
    ] }),
    /* @__PURE__ */ jsxs2(NavSection, { children: [
      /* @__PURE__ */ jsxs2(NavTitle, { children: [
        /* @__PURE__ */ jsx5(FireIcon, {}),
        "Popular Movies"
      ] }),
      /* @__PURE__ */ jsx5(NavMovieList, { movies: popularMovies.results })
    ] }),
    /* @__PURE__ */ jsxs2(NavSection, { children: [
      /* @__PURE__ */ jsxs2(NavTitle, { children: [
        /* @__PURE__ */ jsx5(TrendingIcon, {}),
        "Top rated Movies"
      ] }),
      /* @__PURE__ */ jsx5(NavMovieList, { movies: topRatedMovies.results })
    ] }),
    /* @__PURE__ */ jsxs2(NavSection, { children: [
      /* @__PURE__ */ jsxs2(NavTitle, { children: [
        /* @__PURE__ */ jsx5(UpcomingIcon, {}),
        "Upcoming Movies"
      ] }),
      /* @__PURE__ */ jsx5(NavMovieList, { movies: upcomingMovies.results })
    ] })
  ] });
}

// src/components/layout.tsx
import { jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
var Logo = () => /* @__PURE__ */ jsx6("a", { href: "/", className: "flex items-center gap-2 text-white", children: "Logo" });
async function RootLayout({
  children
}) {
  return /* @__PURE__ */ jsxs3("section", { className: "bg-darker md:py-4 md:flex h-screen w-screen relative", children: [
    /* @__PURE__ */ jsxs3("details", { className: "md:hidden p-4 group sticky top-0 bg-darker z-20", children: [
      /* @__PURE__ */ jsxs3("summary", { className: "flex w-full justify-between items-center text-white", children: [
        /* @__PURE__ */ jsx6(Logo, {}),
        /* @__PURE__ */ jsx6(ChevronBottomIcon, { className: "group-open:rotate-180 transition" })
      ] }),
      /* @__PURE__ */ jsx6("div", { className: "px-2 pt-6 pb-2", children: /* @__PURE__ */ jsx6(Suspense, { fallback: /* @__PURE__ */ jsx6(NavContentSkeleton, {}), children: /* @__PURE__ */ jsx6(NavContent, {}) }) })
    ] }),
    /* @__PURE__ */ jsxs3("aside", { className: "hidden md:block w-96 h-full overflow-y-auto relative", children: [
      /* @__PURE__ */ jsx6("div", { className: "sticky top-0 bg-darker z-10 p-4", children: /* @__PURE__ */ jsx6(Logo, {}) }),
      /* @__PURE__ */ jsx6(Suspense, { fallback: /* @__PURE__ */ jsx6(NavContentSkeleton, {}), children: /* @__PURE__ */ jsx6(NavContent, {}) })
    ] }),
    /* @__PURE__ */ jsx6("main", { className: "flex-1 md:rounded-l-2xl bg-dark overflow-y-auto", children })
  ] });
}

// src/pages/index.tsx
import { jsx as jsx7, jsxs as jsxs4 } from "react/jsx-runtime";
var meta = {
  title: "Robin x Fleet | Technical test",
  description: "Movie app for Robin x Fleet technical test"
};
async function Page() {
  const nowPlayingMovies = await getUpcomingMovies();
  const [firstNowPlayingMovie, ...restNowPlayingMovies] = nowPlayingMovies.results;
  if (!firstNowPlayingMovie) {
    return /* @__PURE__ */ jsx7(Alert, { children: "No movies found" });
  }
  return /* @__PURE__ */ jsxs4(RootLayout, { children: [
    /* @__PURE__ */ jsx7(Header, { movie: firstNowPlayingMovie, type: "homepage" }),
    /* @__PURE__ */ jsxs4("section", { className: "p-4 md:p-8", children: [
      /* @__PURE__ */ jsx7("h2", { className: "text-4xl my-8 text-zinc-200", children: "Now playing" }),
      /* @__PURE__ */ jsx7("div", { className: "w-full max-w-full", children: /* @__PURE__ */ jsx7(Carousel, { children: /* @__PURE__ */ jsx7(CarouselMoviesList, { movies: restNowPlayingMovies }) }) })
    ] })
  ] });
}
export {
  Page,
  meta
};
