type BaseLink = {
  id: string
  createdAt: number;
  title?: string;
  url: string
}

type EncryptedLink = BaseLink & {
  encrypted: true
}

type PlainTextLink = BaseLink & {
  encrypted?: false
}

export type Link = EncryptedLink | PlainTextLink