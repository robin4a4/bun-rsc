"use client";
import {
  ChevronBottomIcon
} from "../../chunk-CHYDV354.js";
import {
  require_client_browser
} from "../../chunk-55YHR64E.js";
import {
  __toESM
} from "../../chunk-VBXJIVYU.js";

// node_modules/bun-rsc/dist/serve/client-condition-export.js
var import_client = __toESM(require_client_browser(), 1);
var import_client2 = __toESM(require_client_browser(), 1);
import { startTransition } from "react";
function combineUrl(path1, path2) {
  let firstPath = path1;
  let secondPath = path2;
  if (path1.endsWith("/")) {
    firstPath = path1.substring(0, path1.length - 1);
  }
  if (path2.startsWith("/")) {
    secondPath = path2.substring(1);
  }
  return `${firstPath}/${secondPath}`;
}
function getCacheKey(url) {
  const urlObj = new URL(url.replace(`/${BUN_RSC_SPECIFIC_KEYWORD}`, ""));
  return urlObj.search ? urlObj.pathname + urlObj.search : urlObj.pathname;
}
var BUN_RSC_SPECIFIC_KEYWORD = "__BUN_RSC";
var RSC_CONTENT_TYPE = "text/x-component";
var BASE_RSC_SERVER_URL = true ? "http://localhost:3001" : "http://localhost:3001";
var callServer = async (id, args) => {
  const baseUrl = combineUrl(BASE_RSC_SERVER_URL, combineUrl(BUN_RSC_SPECIFIC_KEYWORD, window.location.pathname));
  const url = `${baseUrl}?actionId=${encodeURIComponent(id)}`;
  let requestOpts;
  if (!Array.isArray(args) || args.some((a) => a instanceof FormData)) {
    requestOpts = {
      headers: { accept: RSC_CONTENT_TYPE },
      body: await (0, import_client2.encodeReply)(args)
    };
  } else {
    requestOpts = {
      headers: {
        accept: RSC_CONTENT_TYPE,
        "content-type": "application/json"
      },
      body: JSON.stringify(args)
    };
  }
  const actionResult = (0, import_client2.createFromFetch)(fetch(url, {
    method: "POST",
    ...requestOpts
  }), { callServer });
  const cacheKey = getCacheKey(baseUrl);
  startTransition(() => {
    if (window.__UPDATE_RSC_PAYLOAD__) {
      window.__BUN_RSC_CACHE__.set(cacheKey, actionResult);
      window.__UPDATE_RSC_PAYLOAD__(actionResult);
    }
  });
  return actionResult;
};
var createServerReferenceClient = (id) => {
  return (0, import_client.createServerReference)(id, callServer);
};

// src/actions/search.tsx
var search = createServerReferenceClient("/__bun_rsc/server-actions/actions/search.tsx#search");

// src/components/Nav/SearchForm.tsx
import { useFormState } from "react-dom";

// src/components/Nav/NavMovieList.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function NavMobieItem({ movie }) {
  return /* @__PURE__ */ jsxs("li", { className: "py-2 flex gap-4 items-center relative", children: [
    /* @__PURE__ */ jsx(
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
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0" })
        ]
      }
    )
  ] });
}
function NavMovieList({ movies }) {
  return /* @__PURE__ */ jsxs("ul", { className: "flex flex-col overflow-y-scroll", children: [
    movies.slice(0, 3).map((movie) => /* @__PURE__ */ jsx(NavMobieItem, { movie }, movie.id)),
    /* @__PURE__ */ jsxs("details", { className: "group", children: [
      /* @__PURE__ */ jsxs("summary", { className: "py-2 flex gap-4 items-center relative w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-zinc-500 font-semibold flex justify-between w-full", children: [
          "More",
          /* @__PURE__ */ jsx(ChevronBottomIcon, { className: "group-open:rotate-180 transition" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0" })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-2", children: movies.slice(3).map((movie) => /* @__PURE__ */ jsx(NavMobieItem, { movie }, movie.id)) })
    ] })
  ] });
}

// src/components/Nav/SearchForm.tsx
import { startTransition as startTransition2, useState } from "react";

// src/components/Input.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function Input(props) {
  return /* @__PURE__ */ jsx2(
    "input",
    {
      className: "h-11 bg-zinc-900 rounded-lg p-2 w-full text-zinc-400 placeholder:text-zinc-600 focus:outline outline-2 outline-blue-500 outline-offset-2",
      ...props
    }
  );
}

// src/components/Alert.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
function Alert({ children }) {
  return /* @__PURE__ */ jsx3("div", { className: "border border-red-500 bg-red-950 text-red-200 p-4 rounded-lg m-4", children: /* @__PURE__ */ jsx3("p", { children }) });
}

// src/components/Nav/SearchForm.tsx
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
function SearchInput() {
  const [timeoutId, setTimeoutId] = useState();
  const submitForm = (event) => {
    clearTimeout(timeoutId);
    const input = event.currentTarget;
    let id = setTimeout(() => {
      startTransition2(() => {
        input.closest("form")?.requestSubmit();
        setTimeoutId(void 0);
      });
    }, 500);
    setTimeoutId(id);
  };
  return /* @__PURE__ */ jsx4(
    Input,
    {
      type: "text",
      name: "search",
      placeholder: "Spongebob the return",
      onChange: submitForm
    }
  );
}
function SearchForm() {
  const [state, formAction] = useFormState(search, null);
  return /* @__PURE__ */ jsxs2("form", { action: formAction, className: "bg-zinc-900 rounded-lg", children: [
    /* @__PURE__ */ jsx4(SearchInput, {}),
    state?.error && /* @__PURE__ */ jsx4(Alert, { children: state.error }),
    state?.movies && state?.movies.length > 0 && /* @__PURE__ */ jsx4("div", { className: "p-2", children: /* @__PURE__ */ jsx4(NavMovieList, { movies: state.movies }) })
  ] });
}
export {
  SearchForm,
  SearchInput
};
