import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  getAuth, Auth, User,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged, signInAnonymously, Unsubscribe,
} from "firebase/auth";
import { collection, CollectionReference, deleteDoc, doc, DocumentData, Firestore, getFirestore, onSnapshot, QuerySnapshot, setDoc, updateDoc } from "firebase/firestore";

const USER = 'stache'
const LINKS = 'links'

const paths: Record<string, (...args:string[]) => string> = {
  user: (uid) => [USER, uid].join('/'),
  links: (uid) => [USER, uid, LINKS].join('/'),
  link: (uid, link) => [USER, uid, LINKS, link].join('/'),
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

// Docs: https://firebase.google.com/docs/firestore
/** Singleton Firebase Class */
export class Firebase {
  private static db: Firestore;
  private static auth: Auth
  public static user: User
  
  static init(config: FirebaseOptions) {
    const app = initializeApp(config);
    Firebase.auth = getAuth(app);
    Firebase.db = getFirestore(app);
  }

  static async authenticate() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(Firebase.auth, (user) => {
        if (user) {
          Firebase.user = user
          resolve(user)
        } else {
          reject(user)
        }
      })
    })
  }

  static async login(email: string, password: string) {
    return signInWithEmailAndPassword(Firebase.auth, email, password)
    .then(userCred => {
      const user = userCred.user;
      Firebase.user = user;
      return user;
    })
  }

  static async signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(Firebase.auth, email, password)
    .then(userCred => {
      const user = userCred.user;
      Firebase.user = user;
      return user;
    })
  }

  static async loginAnonymously() {
    return signInAnonymously(Firebase.auth)
    .then(userCred => {
      const user = userCred.user;
      Firebase.user = user;
      return user;
    })
  }

  static async logout() {
    return Firebase.auth.signOut()
  }

  static subscribeToLinks(callback: (links: Link[]) => void) {
    subscribe(collection(Firebase.db, paths.links(Firebase.user.uid)), (querySnapshot) => {
      const links = querySnapshot.docs.map(doc => doc.data() as Link)
      callback(links)
    })
  }

  static async upsertLink(link: string) {
    const encryptedLink = encodeURIComponent(link)
    const data: Link = {
      url: encryptedLink,
      createdAt: (new Date()).getTime(),
      id: encryptedLink,
      readCount: 0,
    }
    const linkDoc = doc(Firebase.db, paths.link(Firebase.user.uid, encryptedLink))
    await setDoc(linkDoc, data);
    return data
  }

  static async deleteLink(linkId: string) {
    const linkDoc = doc(Firebase.db, paths.link(Firebase.user.uid, linkId))
    await deleteDoc(linkDoc);
  }

  static async updateLink(linkId: string, data: Partial<Link>) {
    const linkDoc = doc(Firebase.db, paths.link(Firebase.user.uid, linkId))
    await updateDoc(linkDoc, data);
  }
}

type BaseLink = {
  id: string
  createdAt: number;
  title?: string;
  url: string
  readCount: number
}

type EncryptedLink = BaseLink & {
  encrypted: true
}

type PlainTextLink = BaseLink & {
  encrypted?: false
}

export type Link = EncryptedLink | PlainTextLink
