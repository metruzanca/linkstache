
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
