import { ComponentProps, PropsWithChildren } from "react";

export function LinkButton(
  props: PropsWithChildren<Omit<ComponentProps<"a">, "className">>
) {
  return (
    <a
      className="bg-blue-500 hover:bg-blue-600 transition font-semibold text-white py-2 px-4 rounded-lg mr-auto py-3 px-6 flex items-center gap-2 focus:outline outline-2 outline-blue-500 outline-offset-2"
      {...props}
    >
      {props.children}
    </a>
  );
}
