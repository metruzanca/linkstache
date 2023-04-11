import { A } from "solid-start";
import { routes } from "~/lib/util";

export default function NotFound() {
  return (
    <div class="flex flex-col items-center justify-center h-[100%]">
      <h1 class="text-4xl font-bold">404</h1>
      <p class="text-xl">Page not found</p>
      <A href={routes.app()} class="text-xl text-blue-500">Go home</A>
    </div>
  );
}
