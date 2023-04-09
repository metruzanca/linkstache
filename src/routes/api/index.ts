import { APIEvent, json } from "solid-start"
import { saveLink } from "~/lib/firebase"

type Body = {
  url: string
  user: { id: string, decryptionKey: string }
}

export async function POST(props: APIEvent) {
  const body = await props.request.json() as Body

  saveLink(body.user, body.url)

  if (!body?.url) {
    return json({
      message: 'No body'
    }, 400)
  }
  return json({
    message: 'Added to LinkStache!',
    url: body.url,
  })
}
