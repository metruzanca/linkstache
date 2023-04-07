import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import { LOCAL_STORAGE } from "./constants";
import { createContext, createEffect, createSignal, ParentComponent, useContext } from "solid-js";
import { v4 } from "uuid";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "linkstache-fed2f.firebaseapp.com",
  projectId: "linkstache-fed2f",
  storageBucket: "linkstache-fed2f.appspot.com",
  messagingSenderId: "1072668570019",
  appId: "1:1072668570019:web:bd097665750b9c8821aa16",
  measurementId: "G-LXR46Q68DQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export type User = {
  id: string;
  decryptionKey: string;
}

const makeUser = (): User => ({
  id: v4(),
  decryptionKey: v4(),
})

const makeAppContext = () => {
  const raw = localStorage.getItem(LOCAL_STORAGE.USER);
  let data = makeUser()
  if (raw) {
    const parsed = JSON.parse(raw) as User;
    data = parsed
  }

  const [user, setUser] = createSignal<User>(data);

  // Persistance
  createEffect(() => {    
    const value = user();
    if (value) {
      localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(value));
    }
  });

  if (import.meta.env.DEV) {
    createEffect(() => {
      console.log(user())
    })
  }


  return {
    user,
    sync(id: string, decryptionKey: string) {
      const currentUser = user()

      if (id !== currentUser.id) {
        // TODO ask user which one they want to use.
        console.warn('Already logged in as another user.')
      }
    },
  } as const
}

type AppContext = ReturnType<typeof makeAppContext>

const initialContext = makeAppContext();
const appContext = createContext<AppContext>(initialContext);

export const FirebaseProvider: ParentComponent = (props) => (
  <appContext.Provider value={initialContext}>
    {props.children}
  </appContext.Provider>
)

export const useAppContext = () => useContext<AppContext>(appContext);
