import { Component, Show } from "solid-js";
import { useAppContext } from "~/lib/firebase";

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
    <main class="mx-auto text-gray-700 p-4">
      <Debug data={user()} />
    </main>
  );
}
