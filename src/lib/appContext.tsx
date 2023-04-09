import { createSignal, createEffect, createContext, ParentComponent, useContext } from "solid-js";
import { v4 } from "uuid";
import { LOCAL_STORAGE } from "./constants";
import { User } from "./types";



const makeUser = (user: Partial<User> = {}): User => ({
  id: v4(),
  decryptionKey: v4(),
  ...user,
})

const makeAppContext = () => {
  // Grab the user from localStorage. If it doesn't exist, create a new one.
  const raw = localStorage.getItem(LOCAL_STORAGE.USER);
  let data = makeUser()
  if (raw) {
    const parsed = JSON.parse(raw) as User;
    data = parsed
  }
  const [user, setUser] = createSignal<User>(data);

  // Setup Reactive Persistance
  createEffect(() => {    
    const value = user();
    if (value) {
      localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(value));
    }
  });

  // Debugging
  if (import.meta.env.DEV) {
    createEffect(() => {
      console.log(user())
    })
  }

  // Actions
  function save(user: User) {
    localStorage.setItem(LOCAL_STORAGE.BACKUP, JSON.stringify(user));
    setUser(user)
  }

  function sync(id: string, decryptionKey: string) {
    const currentUser = user()
    if (id !== currentUser.id) {
      // TODO ask user which one they want to use.
      console.warn('Already logged in as another user. Making backup')
    }
    const newUser = makeUser({ id, decryptionKey })
    save(newUser)
  }

  
  const [menuOpen, setMenuOpen] = createSignal(false);


  return {
    // Signals
    user,
    menuOpen, setMenuOpen,

    // Actions
    sync,
  } as const
}

type AppContext = ReturnType<typeof makeAppContext>


const initialContext = window && makeAppContext();
const appContext = createContext<AppContext>(initialContext);

export const AppContextProvider: ParentComponent = (props) => (
  <appContext.Provider value={initialContext}>
    {props.children}
  </appContext.Provider>
)

export const useAppContext = () => useContext<AppContext>(appContext);
