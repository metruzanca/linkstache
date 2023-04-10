import { AES, enc } from "crypto-js"
import { CollectionReference, DocumentData, onSnapshot, QuerySnapshot, Unsubscribe } from "firebase/firestore"
import { flags } from "~/flags"
import { Link } from "./types"

type Groups = Record<string, { createdAt: number }[]>
export const groupByDate = (links: { createdAt: number }[]): Groups => {
  const groups: Groups = {}
  links.forEach(link => {
    const date = (new Date(link.createdAt)).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(link)
  })
  return groups
}

export function youtubeQueue(links: string[]) {
  const videoIds: string[] = []
  for (const link of links) {
    if (link.includes('youtube')) {
      const url = new URL(link)
      const params = new URLSearchParams(url.search)
      const id = params.get('v')
      if (id) {
        videoIds.push(id)
      }
    } else if (link.includes('youtu.be')) {
      const id = link.split('/')[3]
      if (id) {
        videoIds.push(id)
      }
    }
  }
  return `https://youtube.com/watch_videos?video_ids=${videoIds.join(',')}`
}

const subscriptions: Record<string, Unsubscribe> = {}
/**
 * Like onSnapshot but handles unsubscribing for you.
 * 
 * Call this function multiple times safely.
 */
export function subscribe(
  query: CollectionReference<DocumentData>,
  onNext: (snapshot: QuerySnapshot<DocumentData>) => void,
) {
  const path = query.path
  subscriptions[path]?.()
  subscriptions[path] = onSnapshot(query, onNext)
  return subscriptions[path]
}

export function encrypt(text: string, key: string): string {
  if (flags.disableUrlEncryption) {
    return encodeURIComponent(text)
  }
  return encodeURIComponent(AES.encrypt(text, key).toString());
}

export function decrypt(ciphertext: string, key: string): string {
  if (flags.disableUrlEncryption) {
    return decodeURIComponent(ciphertext)
  }
  return AES.decrypt(decodeURIComponent(ciphertext), key).toString(enc.Utf8)
}

export function decryptLinks(links: Link[], key: string) {
  return links.map(link => ({
    ...link,
    url: link.encrypted ? decrypt(link.url, key) : link.url,
  }))
}

export function encryptLinks(links: Link[], key: string) {
  return links.map(link => ({
    ...link,
    url: link.encrypted ? link.url : encrypt(link.url, key),
  }))
}

type FormSubmit = Event & {
  submitter: HTMLElement;
} & {
  currentTarget: HTMLFormElement;
  target: Element;
}
export const submit = (onSubmit: (e: FormSubmit) => Promise<void>) => {
  return async (e: FormSubmit) => {
    e.preventDefault()
    await onSubmit(e)
  }
}