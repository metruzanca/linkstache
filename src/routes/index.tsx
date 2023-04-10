import { Component, createEffect, createSignal } from "solid-js";
import clsx from 'clsx';

import { Link } from "~/lib/types";
import { DatedList, LinkComponent, LinkForm } from "~/lib/components";
import { Firebase } from "~/lib/firebase";

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