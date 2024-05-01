// src/components/Carousel.tsx
import { createClientReference } from "bun-rsc/server-condition-export";
var Carousel = createClientReference("/__bun_rsc/client-components/components/Carousel.tsx#Carousel", "Carousel");
var CarouselCreditsList = createClientReference("/__bun_rsc/client-components/components/Carousel.tsx#CarouselCreditsList", "CarouselCreditsList");
var CarouselMoviesList = createClientReference("/__bun_rsc/client-components/components/Carousel.tsx#CarouselMoviesList", "CarouselMoviesList");
var CarouselSkeleton = createClientReference("/__bun_rsc/client-components/components/Carousel.tsx#CarouselSkeleton", "CarouselSkeleton");

// src/icons.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function FireIcon() {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: "w-5 h-5",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M13.5 4.938a7 7 0 1 1-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 0 1 .572-2.759 6.026 6.026 0 0 1 2.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0 0 13.5 4.938ZM14 12a4 4 0 0 1-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 0 0 1.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 0 1 1.315-4.192.447.447 0 0 1 .431-.16A4.001 4.001 0 0 1 14 12Z",
          clipRule: "evenodd"
        }
      )
    }
  );
}
function SearchIcon() {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: "w-5 h-5",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z",
          clipRule: "evenodd"
        }
      )
    }
  );
}
function StarMicroIcon() {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      fill: "currentColor",
      className: "w-4 h-4",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z",
          clipRule: "evenodd"
        }
      )
    }
  );
}
function ArrowRightIcon() {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      fill: "currentColor",
      className: "w-4 h-4",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z",
          clipRule: "evenodd"
        }
      )
    }
  );
}
function ChevronBottomIcon({ className }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: `w-5 h-5 ` + className,
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z",
          clipRule: "evenodd"
        }
      )
    }
  );
}
function TrendingIcon() {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: "w-5 h-5",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M12.577 4.878a.75.75 0 0 1 .919-.53l4.78 1.281a.75.75 0 0 1 .531.919l-1.281 4.78a.75.75 0 0 1-1.449-.387l.81-3.022a19.407 19.407 0 0 0-5.594 5.203.75.75 0 0 1-1.139.093L7 10.06l-4.72 4.72a.75.75 0 0 1-1.06-1.061l5.25-5.25a.75.75 0 0 1 1.06 0l3.074 3.073a20.923 20.923 0 0 1 5.545-4.931l-3.042-.815a.75.75 0 0 1-.53-.919Z",
          clipRule: "evenodd"
        }
      )
    }
  );
}
function UpcomingIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: "w-5 h-5",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M4.214 3.227a.75.75 0 0 0-1.156-.955 8.97 8.97 0 0 0-1.856 3.825.75.75 0 0 0 1.466.316 7.47 7.47 0 0 1 1.546-3.186ZM16.942 2.272a.75.75 0 0 0-1.157.955 7.47 7.47 0 0 1 1.547 3.186.75.75 0 0 0 1.466-.316 8.971 8.971 0 0 0-1.856-3.825Z" }),
        /* @__PURE__ */ jsx(
          "path",
          {
            fillRule: "evenodd",
            d: "M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6Zm0 14.5a2 2 0 0 1-1.95-1.557 33.54 33.54 0 0 0 3.9 0A2 2 0 0 1 10 16.5Z",
            clipRule: "evenodd"
          }
        )
      ]
    }
  );
}
function HomeIcon() {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: "w-5 h-5",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z",
          clipRule: "evenodd"
        }
      )
    }
  );
}

// src/components/Button.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function LinkButton(props) {
  return /* @__PURE__ */ jsx2(
    "a",
    {
      className: "bg-blue-500 hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-lg mr-auto py-3 px-6 flex items-center gap-2 focus:outline outline-2 outline-blue-500 outline-offset-2",
      ...props,
      children: props.children
    }
  );
}

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

// src/components/Header.tsx
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function Header({
  movie,
  type
}) {
  return /* @__PURE__ */ jsxs2("header", { className: "md:h-1/2 relative opacity-0 motion-safe:animate-fadeIn", children: [
    /* @__PURE__ */ jsx3(
      "img",
      {
        src: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
        alt: movie.title,
        width: 1920,
        height: 1080,
        className: "object-cover w-full h-full"
      }
    ),
    /* @__PURE__ */ jsx3("div", { className: "hidden md:block md:absolute inset-0 bg-gradient-to-b from-transparent to-dark" }),
    /* @__PURE__ */ jsxs2("div", { className: "md:absolute inset-0 flex justify-end p-4 md:p-8 flex-col gap-4 ", children: [
      /* @__PURE__ */ jsx3("h1", { className: "text-4xl md:text-8xl tracking-wider font-thin text-white/80", children: movie.title }),
      /* @__PURE__ */ jsxs2("p", { className: "text-white/70 md:w-1/2", children: [
        formatDate(movie.release_date),
        " \u2022",
        " ",
        /* @__PURE__ */ jsxs2("span", { className: "font-bold inline-flex gap-2 items-center", children: [
          movie.vote_average,
          " ",
          /* @__PURE__ */ jsx3(StarMicroIcon, {})
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("p", { className: "text-white/70 md:w-1/2", children: [
        type === "homepage" && /* @__PURE__ */ jsxs2(Fragment, { children: [
          movie.overview.split(".")[0],
          "."
        ] }),
        type === "detail" && movie.overview
      ] }),
      type === "homepage" && /* @__PURE__ */ jsxs2(LinkButton, { href: `/movie/${movie.id}`, children: [
        "See more",
        /* @__PURE__ */ jsx3(ArrowRightIcon, {})
      ] })
    ] })
  ] });
}

// src/getData.ts
import { cache } from "react";

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

// src/getData.ts
async function fetchWithErrors(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw ApiError;
  }
  return response;
}
var getUpcomingMovies = cache(async () => {
  const nowPlayingMoviesResponse = await fetchWithErrors(
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
    fetchOption
  );
  return await nowPlayingMoviesResponse.json();
});
var getNavBarMovies = cache(async () => {
  const responses = await Promise.all([
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
    )
  ]);
  return Promise.all(
    responses.map((response) => response.json())
  );
});
var getMovieDetail = cache(async (movieId) => {
  return await Promise.all([
    fetchWithErrors(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      fetchOption
    ).then((response) => response.json()),
    fetchWithErrors(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US&page=1`,
      fetchOption
    ).then((response) => response.json()),
    fetchWithErrors(
      `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`,
      fetchOption
    ).then((response) => response.json())
  ]);
});

export {
  Carousel,
  CarouselCreditsList,
  CarouselMoviesList,
  FireIcon,
  SearchIcon,
  ChevronBottomIcon,
  TrendingIcon,
  UpcomingIcon,
  HomeIcon,
  Header,
  getUpcomingMovies,
  getNavBarMovies,
  getMovieDetail
};
