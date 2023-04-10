import { CollectionReference, DocumentData, onSnapshot, QuerySnapshot, Unsubscribe } from "firebase/firestore"

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