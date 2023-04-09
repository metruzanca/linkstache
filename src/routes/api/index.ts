import { APIEvent, json } from "solid-start"
import { getlinks, saveLink } from "~/lib/firebase"

type ListLinks = {
  action: 'list'
}

type CreateLink = {
  action: 'create'
  url: string
}

type Body = { user: { id: string, decryptionKey: string } } & (
  ListLinks | CreateLink
)

export async function POST(props: APIEvent) {
  const body = await props.request.json() as Body
  if (!body?.user) {
    return json({
      message: 'Missing user object',
    }, 400)
  }

  if (!body?.action) {
    return json({
      message: 'Missing action',
    }, 400)
  }
  
  if (body.action === 'create') {
    saveLink(body.user, body.url)
    return json({
      message: 'Added to LinkStache!',
      url: body.url,
    })
  }


  if (body.action === 'list') {   
    const links = await getlinks(body.user)
    return json(links)
  }
}