import { useParams, useLocation, Navigate } from "solid-start";
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
  const { stache } = useAppContext()


  let input: HTMLInputElement|undefined;

  return (
    <Navigate href='/'/>
  )

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
            if (!input?.value) return;
            console.log(input.value);
          }}
          class="btn secondary"
          textContent="Sync"
        />
        {/* TODO if this user has links, ask if they want to merge or delete user (delete key) */}
      </form>
      <h3>Sync this device with another?</h3>

      <p>Copy this code to your other device</p>
      <div class="flex">
        <div>
          <pre class="text-sm overflow-hidden">
            {stache().encryptionKey}
          </pre>
        </div>
        <button
          onClick={() => setClipboard(stache().encryptionKey)}
          class="btn secondary"
          textContent="Copy"
        />
      </div>
    </main>
  )
}
