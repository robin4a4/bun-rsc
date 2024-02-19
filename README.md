# bun-rsc

Ultra minimalist React server component implementation using bun. Absolutely experimental and messy.

Heavily inspired by:
- https://github.com/bholmesdev/simple-rsc
- https://github.com/hex2f/marz

# Usage

The framework comes with almost no custom api's. Everything RSC related is documented on the react docs.

## Routing

The framework uses the `bun` router, which is the nextjs pages router.

## Middleware and bootstrapping

There are two special files that are used for middleware and bootstrapping.
- The optional `src/middleware.ts` file is used to define middleware that is run before the request is handled.
- The optional `src/bootstrap.ts` file is used to define code that is run before the server starts.

## Server actions limitations
the "use server" directive is only supported at the top level of the module and the module is only importable in a client component:

```typescript
// addTodo.ts
"use server";
import {db} from "./db";

export async function addTodo(formData: FormData) {
  return db.todos.add(formData.get("text"));
}
```

```typescript
// TodoList.tsx
"use client";
import {addTodo} from "./addTodo";

export function TodoList() {
  return (
    <div>
      <form action={addTodo}>
        <input type="text" name="text" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
```

Actions in server components are not yet supported.


## SSR limitations

The framework support ssr but the hydration is done by refetching the rsc form the client, which is far from optimal. Ideally we should send the jsx to the client and hydrate it there. This is not yet supported.
