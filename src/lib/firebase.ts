import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  getAuth, Auth, User,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged, signInAnonymously,
} from "firebase/auth";
import { collection, deleteDoc, doc, Firestore, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { Link } from "./types";
import { subscribe } from "./util";

const USER = 'stache'
const LINKS = 'links'

const paths: Record<string, (...args:string[]) => string> = {
  user: (uid) => [USER, uid].join('/'),
  links: (uid) => [USER, uid, LINKS].join('/'),
  link: (uid, link) => [USER, uid, LINKS, link].join('/'),
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
