import { createEffect, createSignal } from "solid-js";
import clsx from 'clsx';

import { useAppContext } from "~/lib/appContext";
import { Link } from "~/lib/types";
import { DatedList } from "~/lib/components";
import { useNavigate } from "solid-start";
import { Firebase } from "~/lib/firebase";


export default function App() {
  const {user} = useAppContext()
  const [links, setLinks] = createSignal<Link[]>([]);

  createEffect(() => {
    const currentUser = user();
    // getLiveLinks(currentUser, setLinks)    
    const navigate = useNavigate();
    const fire = Firebase.instance();
    if (!fire.isAuth) {
      navigate('/auth')
    }
  });

  let input: HTMLInputElement|undefined;

  async function handleAddLink() {
    // if (input?.value && input.value.length > 0) {
    //   await saveLink(user(), input.value);
    //   input.value = '';
    // }
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
                    // await deleteLink(user(), link.id);
                  }}
                />
              </div>
            )}
          />

        </div>
        

      </main>

      <div class="fixed bottom-0 w-full border-t border-gray-200 bg-white">
        <form
          class="flex items-center justify-between p-4"
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