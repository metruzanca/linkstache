import { Component, Show } from "solid-js";
import { useAppContext } from "~/lib/appContext";
import { makeBookmarklet } from "~/lib/util";

const Debug: Component<{ data: any }> = (props) => (
  <Show when={props.data} keyed>
    <pre>
      {JSON.stringify(props.data, null, 2)}
    </pre>
  </Show>
)

export default function App() {
  const {user, sync} = useAppContext()

  return (
    <main class="mx-auto text-gray-700 p-4" style={{}}>

      <a href={makeBookmarklet()}>Bookmarklet</a>

      <Debug data={user()} />
    </main>
  );
}
