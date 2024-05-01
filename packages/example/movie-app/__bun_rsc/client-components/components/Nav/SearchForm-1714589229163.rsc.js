"use client";
import {
  ChevronBottomIcon,
  require_jsx_runtime
} from "../../chunk-TS3CQHHF.js";
import {
  require_client_browser,
  require_react_dom
} from "../../chunk-TNLWNAOM.js";
import {
  __toESM,
  require_react
} from "../../chunk-H6GTI6SL.js";

// node_modules/bun-rsc/dist/serve/client-condition-export.js
var import_client = __toESM(require_client_browser(), 1);
var import_react = __toESM(require_react(), 1);
var import_client2 = __toESM(require_client_browser(), 1);
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
  (0, import_react.startTransition)(() => {
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
var import_react_dom = __toESM(require_react_dom(), 1);

// src/components/Nav/NavMovieList.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function NavMobieItem({ movie }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "py-2 flex gap-4 items-center relative", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "img",
      {
        src: `https://image.tmdb.org/t/p/w92${movie.poster_path}`,
        alt: movie.title,
        className: "w-10 h-14 rounded-lg",
        width: 48,
        height: 64
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "a",
      {
        href: `/movie/${movie.id}`,
        className: "text-zinc-400 hover:text-zinc-200 transition",
        children: [
          movie.title,
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0" })
        ]
      }
    )
  ] });
}
function NavMovieList({ movies }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "flex flex-col overflow-y-scroll", children: [
    movies.slice(0, 3).map((movie) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavMobieItem, { movie }, movie.id)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { className: "group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { className: "py-2 flex gap-4 items-center relative w-full", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-zinc-500 font-semibold flex justify-between w-full", children: [
          "More",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronBottomIcon, { className: "group-open:rotate-180 transition" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "flex flex-col gap-2", children: movies.slice(3).map((movie) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavMobieItem, { movie }, movie.id)) })
    ] })
  ] });
}

// src/components/Nav/SearchForm.tsx
var import_react2 = __toESM(require_react(), 1);

// src/components/Input.tsx
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
function Input(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "input",
    {
      className: "h-11 bg-zinc-900 rounded-lg p-2 w-full text-zinc-400 placeholder:text-zinc-600 focus:outline outline-2 outline-blue-500 outline-offset-2",
      ...props
    }
  );
}

// src/components/Alert.tsx
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
function Alert({ children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "border border-red-500 bg-red-950 text-red-200 p-4 rounded-lg m-4", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children }) });
}

// src/components/Nav/SearchForm.tsx
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
function SearchInput() {
  const [timeoutId, setTimeoutId] = (0, import_react2.useState)();
  const submitForm = (event) => {
    clearTimeout(timeoutId);
    const input = event.currentTarget;
    let id = setTimeout(() => {
      (0, import_react2.startTransition)(() => {
        input.closest("form")?.requestSubmit();
        setTimeoutId(void 0);
      });
    }, 500);
    setTimeoutId(id);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
  const [state, formAction] = (0, import_react_dom.useFormState)(search, null);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { action: formAction, className: "bg-zinc-900 rounded-lg", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SearchInput, {}),
    state?.error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Alert, { children: state.error }),
    state?.movies && state?.movies.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "p-2", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(NavMovieList, { movies: state.movies }) })
  ] });
}
export {
  SearchForm,
  SearchInput
};
