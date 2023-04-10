import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  getAuth, Auth, User,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged, signInAnonymously,
} from "firebase/auth";
import { collection, deleteDoc, doc, Firestore, getFirestore, setDoc } from "firebase/firestore";
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
  private static _instance?: Firebase;
  static init(config: FirebaseOptions) {
    Firebase._instance = new Firebase(config)
  }
  static instance() {
    if (!Firebase._instance) {
      throw new Error('Firebase not initialized')
    }
    return Firebase._instance
  }
  private db: Firestore;
  private auth: Auth
  private constructor(config: FirebaseOptions) {
    const app = initializeApp(config);
    this.auth = getAuth(app);
    this.db = getFirestore(app);
  }

  public user!: User

  async authenticate() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.user = user
          resolve(user)
        } else {
          reject(user)
        }
      })
    })
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
    .then(userCred => {
      const user = userCred.user;
      this.user = user;
      return user;
    })
  }

  async signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then(userCred => {
      const user = userCred.user;
      this.user = user;
      return user;
    })
  }

  async loginAnonymously() {
    return signInAnonymously(this.auth)
    .then(userCred => {
      const user = userCred.user;
      this.user = user;
      return user;
    })
  }

  async logout() {
    return this.auth.signOut()
  }

  subscribeToLinks(callback: (links: Link[]) => void) {
    subscribe(collection(this.db, paths.links(this.user.uid)), (querySnapshot) => {
      const links = querySnapshot.docs.map(doc => doc.data() as Link)
      callback(links)
    })
  }

  async upsertLink(link: string) {
    const encryptedLink = encodeURIComponent(link)
    const data: Link = {
      url: encryptedLink,
      createdAt: (new Date()).getTime(),
      id: encryptedLink,
    }
    const linkDoc = doc(this.db, paths.link(this.user.uid, encryptedLink))
    await setDoc(linkDoc, data);
    return data
  }

  async deleteLink(linkId: string) {
    const linkDoc = doc(this.db, paths.link(this.user.uid, linkId))
    await deleteDoc(linkDoc);
  }

  async updateLink(linkId: string) {
    
  }
}
