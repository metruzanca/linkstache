import { initializeApp } from "firebase/app";
import { Unsubscribe, collection, deleteDoc, doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { FIREBASE_CONFIG } from "./constants";
import { Link, User } from "./types";
import { AES, enc } from 'crypto-js'
import { flags } from "~/flags";

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

// Docs: https://firebase.google.com/docs/firestore
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

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

let getLinksLiveSubscription: Unsubscribe|null = null;
export async function getLinks(user: User, callback: (links: Link[]) => void) {
  getLinksLiveSubscription?.();
  const linksDoc = collection(db, paths.links(user.id))
  getLinksLiveSubscription = onSnapshot(linksDoc, (querySnapshot) => {
    const links = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        url: decrypt(data.url, user.decryptionKey),
      } as Link
    })
    callback(links)
  });
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
