import { useParams, useLocation } from "solid-start";
import { useAppContext } from "~/lib/appContext";

async function setClipboard(text: string) {
  const type = "text/plain";
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];

  return new Promise((resolve, reject) => {
    navigator.clipboard.write(data).then(resolve, reject);
  })

}

export default function Sync() {
  const { stache: user, sync } = useAppContext()


  let input: HTMLInputElement|undefined;
  return (
    <main>
      <div>
        <h1>Sync to new device</h1>
      </div>
      <h3>Syncing from another device?</h3>
      <p>Enter the code from the other device to sync your links.</p>
      <form onSubmit={e => e.preventDefault()}>
        <input type="text" class="border border-gray-300 p-2 rounded-sm" ref={input}/>
        <button
          onClick={() => {
            if (!input) return;
            const [id, key] = input.value.split("#");
            sync(id, key);
          }}
          textContent="Sync"
        />
        {/* TODO if this user has links, ask if they're sure they want to sync. (delete current user) */}
      </form>
      <h3>Sync this device with another?</h3>

      <p>Copy this code to your other device</p>
      <div class="flex">
        <pre class="text-sm overflow-hidden">
          {user().id}#{user().encryptionKey}
        </pre>
        <button
          onClick={() => setClipboard(`${user().id}#${user().encryptionKey}`)}
          class="bg-green-400 active:bg-green-500 w-16 px-2 rounded-sm ml-2"
          textContent="Copy"
        />
      </div>
    </main>
  )
}
