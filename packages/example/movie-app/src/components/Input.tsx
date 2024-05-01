import { ComponentProps } from "react";

export function Input(props: Omit<ComponentProps<"input">, "className">) {
  return (
    <input
      className="h-11 bg-zinc-900 rounded-lg p-2 w-full text-zinc-400 placeholder:text-zinc-600 focus:outline outline-2 outline-blue-500 outline-offset-2"
      {...props}
    />
  );
}
