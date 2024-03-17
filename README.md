# bun-rsc

Ultra minimalist React server component implementation using bun. Absolutely experimental and messy.

Heavily inspired by:
- https://github.com/bholmesdev/simple-rsc
- https://github.com/hex2f/marz

## Getting started

### Installation

`bun i bun-rsc`

### You first route

Bun-rsc is based on the file system router that Bun provides which is itself based on the Nextjs Page router.

First create a `pages` folder which will contain all the routes, then create a `home.tsx` file. It will create the `/home` url.

In each view you have to export a default react component, for example:

```javascript
export default function Page() {
  return <p>My first route !</p>;
}
```

The framework comes with almost no custom api's. Everything RSC related is documented on the react docs.

## Usage

### Routing

The framework uses Bun's [FileSystemRouter](https://bun.sh/docs/api/file-system-router), which is the Nextjs pages router.

### Meta data

If you want to change the title description and favicon you can export a `meta` const from your page file:

```typescript
import type {Meta} from "bun-rsc"

export const meta: Meta = {
    title: "My blog"
    description: "The description of my blog"
    icon: "favicon.png"
}
```

The favicon will be searched in the public folder.

### Middlewares

If you want to execute something at each request you can create a `middleware.ts` file in your src folder. This file should export a default function of type `MiddlewareType`:

```typescript
// src/middleware.ts
import { type RequestType } from "bun-rsc";

export default ({request, params, searchParams}: RequestType) => {
    if (Math.random() > 0.5) {
        return Response("Redirected to example.com", 302, {
            Location: "https://example.com"
        })
    }
}
```

### Bootstrap scripts

If you want to execute something before the server starts you can create a `bootstrap.ts` file in your src folder. This file should export a default function of type `BootstrapType`:

```typescript
// src/bootstrap.ts
import createDb from "fake-db"

export default () => {
    createDb()
}
```
## Current limitations

### Server actions limitations
the "use server" directive is only supported at the top level of the module:

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

### Dev mode

The dev mode only provides a basic file watcher which sends a web socket message and make the browser reload. It's not as advanced as the vite's dev mode.