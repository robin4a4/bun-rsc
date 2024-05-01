"use client";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  StarMicroIcon
} from "../chunk-CHYDV354.js";
import "../chunk-VBXJIVYU.js";

// src/formatDate.ts
function formatDate(date) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(date));
  } catch (e) {
    return date;
  }
}

// src/components/Carousel.tsx
import { useRef } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var CAROUSEL_GAP = 2;
var REM_TO_PX = 16;
function CarouselMoviesList({ movies }) {
  return /* @__PURE__ */ jsx(Fragment, { children: movies.slice(0, 10).map((movie) => /* @__PURE__ */ jsxs(
    "li",
    {
      className: "snap-center relative shrink-0 min-w-72 max-w-72 h-96 rounded-lg overflow-hidden first:ml-4 last:mr-4 md:first:ml-8 md:last:mr-8",
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: `https://image.tmdb.org/t/p/w780${movie.poster_path}`,
            alt: movie.title,
            width: 312,
            height: 468,
            className: "rounded-xl object-cover w-full h-full"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-dark/90 to-dark" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col justify-end gap-2 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-thin text-2xl text-white", children: /* @__PURE__ */ jsxs("a", { href: `/movie/${movie.id}`, children: [
            movie.title,
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0" })
          ] }) }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-400", children: [
            formatDate(movie.release_date),
            " \u2022",
            " ",
            /* @__PURE__ */ jsxs("span", { className: "font-bold inline-flex gap-2 items-center", children: [
              movie.vote_average,
              " ",
              /* @__PURE__ */ jsx(StarMicroIcon, {})
            ] })
          ] })
        ] })
      ]
    },
    movie.id
  )) });
}
function CarouselCreditsList({
  credits
}) {
  return /* @__PURE__ */ jsx(Fragment, { children: credits.slice(0, 10).map((credit) => /* @__PURE__ */ jsxs(
    "li",
    {
      className: "snap-center relative shrink-0 min-w-72 max-w-72 h-96 rounded-lg overflow-hidden first:ml-4 last:mr-4 md:first:ml-8 md:last:mr-8",
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: `https://image.tmdb.org/t/p/w780${credit.profile_path}`,
            alt: credit.name,
            width: 312,
            height: 468,
            className: "rounded-xl object-cover w-full h-full"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-dark/90 to-dark" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col justify-end gap-2 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-thin text-2xl text-white", children: credit.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: credit.character })
        ] })
      ]
    },
    credit.id
  )) });
}
function Carousel({ children }) {
  const carouselRef = useRef(null);
  const swipe = (direction) => {
    if (!carouselRef.current || !carouselRef.current.children[0])
      return;
    carouselRef.current.scrollBy({
      left: (carouselRef.current.children[0].clientWidth + CAROUSEL_GAP * REM_TO_PX) * (direction === "left" ? -1 : 1),
      behavior: "smooth"
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden opacity-0 motion-safe:animate-fadeIn -ml-4 md:-ml-8 w-[calc(100%+2rem)] md:w-[calc(100%+4rem)]", children: [
    /* @__PURE__ */ jsx(
      "ul",
      {
        className: "flex w-full overflow-x-auto snap-proximity snap-x pb-6",
        style: {
          gap: `${CAROUSEL_GAP}rem`
        },
        ref: carouselRef,
        children
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 justify-end mr-4 md:mr-8", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "w-9 h-9 rounded-lg bg-darker grid place-content-center text-zinc-200",
          onClick: () => swipe("left"),
          children: /* @__PURE__ */ jsx(ArrowLeftIcon, {})
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "w-9 h-9 rounded-lg bg-darker grid place-content-center text-zinc-200",
          onClick: () => swipe("right"),
          children: /* @__PURE__ */ jsx(ArrowRightIcon, {})
        }
      )
    ] })
  ] });
}
function CarouselSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full overflow-hidden", children: [
    /* @__PURE__ */ jsx(
      "ul",
      {
        className: "flex w-full overflow-x-auto snap-mandatory snap-x pb-6",
        style: {
          gap: `${CAROUSEL_GAP}rem`
        },
        children: [...Array(5)].map((_, index) => /* @__PURE__ */ jsx(
          "li",
          {
            className: "min-w-72 max-w-72 h-96 rounded-lg overflow-hidden animate-pulse",
            children: /* @__PURE__ */ jsx("div", { className: "bg-zinc-800 w-full h-full rounded-xl" })
          },
          index
        ))
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 justify-end", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "w-9 h-9 rounded-lg bg-darker grid place-content-center text-zinc-200",
          children: /* @__PURE__ */ jsx(ArrowLeftIcon, {})
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "w-9 h-9 rounded-lg bg-darker grid place-content-center text-zinc-200",
          children: /* @__PURE__ */ jsx(ArrowRightIcon, {})
        }
      )
    ] })
  ] });
}
export {
  Carousel,
  CarouselCreditsList,
  CarouselMoviesList,
  CarouselSkeleton
};
