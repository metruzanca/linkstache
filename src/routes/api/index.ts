import { doc, getDoc, setDoc } from "firebase/firestore"
import { APIEvent, json } from "solid-start"
import db, { schemas } from "~/lib/firebase"

type Body = {
  url: string
  user: { id: string, decryptionKey: string }
}

export async function POST(props: APIEvent) {
  const body = await props.request.json() as Body
  const { id } = body.user

  const docSnap = await getDoc(doc(db, schemas.stache.name, id));
  if (!docSnap.exists()) {
    await setDoc(doc(db, schemas.stache.name, id), {
      // id: id,
    });
  }


  // await setDoc(doc(db, schemas.stache.name, id), {
  //   id,
  // });

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
