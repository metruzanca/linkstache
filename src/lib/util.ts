
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
