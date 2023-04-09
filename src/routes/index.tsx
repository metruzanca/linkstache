import { Accessor, Component, For, JSXElement, createEffect, createSignal } from "solid-js";
import { useAppContext } from "~/lib/appContext";
import { deleteLink, getLinks, saveLink } from "~/lib/firebase";
import { Link } from "~/lib/types";
import clsx from 'clsx';
import { groupByDate } from "~/lib/util";
import { Navigation } from "~/lib/components";


type DatedListProps = {
  each: any[]
  children: (item: any, index: Accessor<number>) => JSXElement
  header: (date: Date, index: Accessor<number>) => JSXElement
}

/** Adds headings every change of date */
const DatedList: Component<DatedListProps> = (props) => {
  return (
    <>
      {Object.entries(groupByDate(props.each)).map(([date, links], idx) => (
        <>
          {props.header(new Date(date), () => idx)}
          <For each={links} children={props.children}/>
        </>
      ))}
    </>
  )
}

export default function App() {
  const {user} = useAppContext()
  const [links, setLinks] = createSignal<Link[]>([]);

  createEffect(() => {
    const currentUser = user();
    getLinks(currentUser, setLinks)
    
  });

  let input: HTMLInputElement|undefined;

  async function handleAddLink() {
    if (input?.value && input.value.length > 0) {
      await saveLink(user(), input.value);
      input.value = '';
    }
  }


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
            children={(link) => (
              <div class="flex items-center justify-between p-4">
                <a
                  target="_blank"
                  href={link.url}
                  class="text-blue-600"
                  textContent={link.title || link.url}
                />
                <button
                  class="bg-red-400 active:bg-red-500 w-16 px-2 rounded-sm"
                  textContent="Delete"
                  onClick={async () => {
                    await deleteLink(user(), link.id);
                  }}
                />
              </div>
            )}
          />

        </div>
        

      </main>

      <div>
        <form
          class={`
            flex items-center justify-between p-4
            border-t border-gray-200 bg-white
            fixed bottom-0 w-full 
          `}
          onsubmit={e => e.preventDefault()}
        >
          <input
            class="border border-gray-300 p-2 rounded-sm"
            placeholder="https://zanca.dev"
            ref={input}
          />
          <button
            type="submit"
            class="bg-green-400 active:bg-green-500 w-16 px-2 rounded-sm"
            onClick={handleAddLink}
            textContent="Add"
          />
        </form>
      </div>
    </div>
  );
}