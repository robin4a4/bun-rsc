"use client";

import { search } from "../../actions/search";
//@ts-ignore
import { useFormState } from "react-dom";
import { NavMovieList } from "./NavMovieList";
import { startTransition, useState } from "react";
import { Input } from "../Input";
import { Alert } from "../Alert";

export function SearchInput() {
  const [timeoutId, setTimeoutId] = useState<Timer>();
  const submitForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutId);
    const input = event.currentTarget;
    let id = setTimeout(() => {
      startTransition(() => {
        input.closest("form")?.requestSubmit();
        setTimeoutId(undefined);
      });
    }, 500);

    setTimeoutId(id);
  };
  return (
    <Input
      type="text"
      name="search"
      placeholder="Spongebob the return"
      onChange={submitForm}
    />
  );
}

export function SearchForm() {
  const [state, formAction] = useFormState(search, null);

  return (
    <form action={formAction} className="bg-zinc-900 rounded-lg">
      <SearchInput />
      {state?.error && <Alert>{state.error}</Alert>}
      {state?.movies && state?.movies.length > 0 && (
        <div className="p-2">
          <NavMovieList movies={state.movies} />
        </div>
      )}
    </form>
  );
}
