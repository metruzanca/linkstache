import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { CollectionReference, DocumentData, QuerySnapshot, Unsubscribe, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { AES, enc } from 'crypto-js'
import { flags } from "~/flags";
import { Link, User } from "~/lib/types";
import FIREBASE_CONFIG from "~/../firebase.json";

// Docs: https://firebase.google.com/docs/firestore
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = getAuth(app);

export async function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
  .then(userCred => {
    const user = userCred.user;
    return user;
  })
}

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
  .then(userCred => {
    const user = userCred.user;
    return user;
  })
}

export const signInEffect = () => new Promise ((res, rej) => {
  onAuthStateChanged(auth, (user) => user ? res(user) : rej(user))
});


export const schemas = {
  stache: {
    name: 'stache',
    links: {
      name: 'links',
    }
  }
}

const STACHE = 'stache'
const LINKS = 'links'

const paths = {
  stache: (uid: string) => [STACHE, uid].join('/'),
  links: (uid: string) => [STACHE, uid, LINKS].join('/'),
  link: (uid: string, link: string) => [STACHE, uid, LINKS, link].join('/'),
}

const subscriptions: Record<string, Unsubscribe> = {}
/**
 * Like onSnapshot but handles unsubscribing for you.
 * 
 * Call this function multipletimes safely.
 */
function subscribe(
  query: CollectionReference<DocumentData>,
  onNext: (snapshot: QuerySnapshot<DocumentData>) => void,
) {
  const path = query.path
  subscriptions[path]?.()
  subscriptions[path] = onSnapshot(query, onNext)
  return subscriptions[path]
}

function encrypt(text: string, key: string): string {
  if (flags.disableUrlEncryption) {
    return encodeURIComponent(text)
  }
  return encodeURIComponent(AES.encrypt(text, key).toString());
}

function decrypt(ciphertext: string, key: string): string {
  if (flags.disableUrlEncryption) {
    return decodeURIComponent(ciphertext)
  }
  return AES.decrypt(decodeURIComponent(ciphertext), key).toString(enc.Utf8)
}

export async function saveLink(user: User, link: string) {
  if (!link.startsWith('http')) {
    link = `https://${link}`
  }
  
  const encryptedLink = encrypt(link, user.decryptionKey)
  
  const data: Link = {
    url: encryptedLink,
    createdAt: (new Date()).getTime(),
    id: encryptedLink,
  }

  const linkDoc = doc(db, paths.link(user.id, encryptedLink))
  await setDoc(linkDoc, data);

  return data
}

export async function getlinks(user: User) {
  const links = await getDocs(collection(db, paths.links(user.id)))
  return links.docs.map(doc => {
    const data = doc.data()
    return {
      ...data,
      url: decrypt(data.url, user.decryptionKey),
    } as Link
  })
}

export async function getLiveLinks(user: User, callback: (links: Link[]) => void) {  
  return subscribe(collection(db, paths.links(user.id)), (querySnapshot) => {
    const links = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        url: decrypt(data.url, user.decryptionKey),
      } as Link
    })
    callback(links)
  })
}

export async function deleteLink(user: User, linkId: string) {
  const linkDoc = doc(db, paths.link(user.id, linkId))
  await deleteDoc(linkDoc);
}

export async function addDebugLinks(user: User) {
  const day = 1000 * 60 * 60 * 24
  const links = [
    {
      url: 'https://www.google.com',
      createdAt: (new Date()).getTime(),
    },
    {
      url: 'https://github.com',
      createdAt: (new Date()).getTime() - day,
    }
  ]
  
  for (const link of links) {
    const encryptedLink = encrypt(link.url, user.decryptionKey)
    const data: Link = {
      ...link,
      url: encryptedLink,
      id: encryptedLink,
      //@ts-ignore
      debug: link.url,
    }
    const linkDoc = doc(db, paths.link(user.id, encryptedLink))
    await setDoc(linkDoc, data);

  }
}
