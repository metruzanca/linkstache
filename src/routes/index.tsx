import { Component, createEffect, createSignal } from "solid-js";
import clsx from 'clsx';

import { useAppContext } from "~/lib/appContext";
import { Link } from "~/lib/types";
import { DatedList, LinkForm } from "~/lib/components";
import { decodeLinks } from "~/lib/util";
import { Firebase } from "~/lib/firebase";

const LinkComponent: Component<Link> = (props) => {
  const handleDelete = async () => {
    await Firebase.instance().deleteLink(props.id)
  }

  return (
    <div class="flex items-center justify-between p-4">
      <a
        target="_blank"
        href={props.url}
        class="text-blue-600"
        textContent={props.title || props.url}
      />
      <button
        class="bg-red-400 active:bg-red-500 w-16 px-2 rounded-sm"
        textContent="Delete"
        onClick={handleDelete}
      />
    </div>
  )
}

export default function App() {
  const [links, setLinks] = createSignal<Link[]>([]);

  createEffect(() => {
    Firebase.instance().subscribeToLinks(links => {
      setLinks(links.map(link => {
        link.url = decodeURIComponent(link.url)
        return link
      }));
    })
  })

  return (
    <div>
      <main class="mx-auto text-gray-700 p-4">
        <div>
          <DatedList
            each={links()}
            header={(d, i) => (
              <h3
                class={clsx("text-lg p-4", i() !== 0 && "border-t border-gray-200")}
                textContent={d.toDateString()}
              />
            )}
            children={LinkComponent}
          />
        </div>

      </main>
      <LinkForm/>
    </div>
  );
}