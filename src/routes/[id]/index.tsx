import { useAppContext } from "~/lib/firebase";
import { getCredentials } from "~/lib/util";

export default function Sync() {
  const {user, sync} = useAppContext()
  const data = getCredentials()

  const hasConflict = user().id !== data.id

  if (!hasConflict) {
    sync(data.id, data.decryptionKey)
    // TODO redirect to home
  }

  return (
    <div>
      <div>
        <p>Preparing to sync user id: {data.id}</p>
      </div>
      {hasConflict && (
        <div>
          <p>Already logged in as another user.</p>
          <p>Are you sure you want to Sync to the new User?</p>
          <button class="bg-blue-400" onClick={() => sync(data.id, data.decryptionKey)}>Yes</button>
          <button class="bg-slate-400">No</button>
        </div>
      )}
    </div>
  )
}
