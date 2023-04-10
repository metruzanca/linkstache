import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  getAuth, Auth, User,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged, signInAnonymously,
} from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

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

  public isAuth = false
  public user?: User

  async authenticate() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.auth, (user) => {
        this.isAuth = !!user
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

  subscribeToLinks() {

  }

  upsertLink() {

  }

  deleteLink() {

  }
}

// export async function saveLink(user: User, link: string) {
//   if (!link.startsWith('http')) {
//     link = `https://${link}`
//   }
  
//   const encryptedLink = encrypt(link, user.decryptionKey)
  
//   const data: Link = {
//     url: encryptedLink,
//     createdAt: (new Date()).getTime(),
//     id: encryptedLink,
//   }

//   const linkDoc = doc(db, paths.link(user.id, encryptedLink))
//   await setDoc(linkDoc, data);

//   return data
// }

// export async function getLiveLinks(user: User, callback: (links: Link[]) => void) {  
//   return subscribe(collection(db, paths.links(user.id)), (querySnapshot) => {
//     const links = querySnapshot.docs.map(doc => {
//       const data = doc.data()
//       return {
//         ...data,
//         url: decrypt(data.url, user.decryptionKey),
//       } as Link
//     })
//     callback(links)
//   })
// }

// export async function deleteLink(user: User, linkId: string) {
//   const linkDoc = doc(db, paths.link(user.id, linkId))
//   await deleteDoc(linkDoc);
// }

// export async function addDebugLinks(user: User) {
//   const day = 1000 * 60 * 60 * 24
//   const links = [
//     {
//       url: 'https://www.google.com',
//       createdAt: (new Date()).getTime(),
//     },
//     {
//       url: 'https://github.com',
//       createdAt: (new Date()).getTime() - day,
//     }
//   ]
  
//   for (const link of links) {
//     const encryptedLink = encrypt(link.url, user.decryptionKey)
//     const data: Link = {
//       ...link,
//       url: encryptedLink,
//       id: encryptedLink,
//       //@ts-ignore
//       debug: link.url,
//     }
//     const linkDoc = doc(db, paths.link(user.id, encryptedLink))
//     await setDoc(linkDoc, data);

//   }
// }
