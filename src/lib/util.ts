import { useParams, useLocation } from "solid-start"
import { User } from "./firebase"

export const getCredentials = (): User => {
  const params = useParams<{id:string}>()
  const location = useLocation()

  return {
    id: params.id,
    decryptionKey: location.hash.slice(1)
  }
}
