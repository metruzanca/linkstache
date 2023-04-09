export type User = {
  id: string;
  decryptionKey: string;
}
export type Link = {
  id: string
  url: string;
  createdAt: number;
  title?: string;
}