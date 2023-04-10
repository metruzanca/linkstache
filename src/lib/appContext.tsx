import { createSignal, createEffect, createContext, ParentComponent, useContext } from "solid-js";
import { v4 } from "uuid";
import { LOCAL_STORAGE } from "./constants";
import { Stache } from "./types";

const makeStache = (): Stache => ({
  encryptionKey: v4(),
})

const makeAppContext = () => {
  // Grab the user from localStorage. If it doesn't exist, create a new one.
  const raw = localStorage.getItem(LOCAL_STORAGE.STACHE);
  let data = makeStache()
  if (raw) {
    const parsed = JSON.parse(raw) as Stache;
    data = parsed
  }
  const [stache, setStache] = createSignal<Stache>(data);

  // Setup Reactive Persistance
  createEffect(() => {    
    const value = stache();
    if (value) {
      localStorage.setItem(LOCAL_STORAGE.STACHE, JSON.stringify(value));
    }
  });

  // Debugging
  if (import.meta.env.DEV) {
    createEffect(() => {
      console.log(stache())
    })
  }

  // Actions
  function sync(decryptionKey: string) {
  //   const currentUser = stache()
  //   if (id !== currentUser.id) {
  //     // TODO ask user which one they want to use.
  //     console.warn('Already logged in as another user. Making backup')
  //   }
  //   const newUser = makeStache({ id, encryptionKey: decryptionKey })
  //   localStorage.setItem(LOCAL_STORAGE.BACKUP, JSON.stringify(stache));
  //   setStache(stache)
  }

  
  const [menuOpen, setMenuOpen] = createSignal(false);


  return {
    // Signals
    user: stache,
    menuOpen, setMenuOpen,

    // Actions
    sync,
  } as const
}

type AppContext = ReturnType<typeof makeAppContext>


// For some damn reason, SolidStart w/ ssr: false doesn't work.
// Pages other than / get SSR'd.
//@ts-ignore 
const initialContext: AppContext = typeof window !== 'undefined' && makeAppContext();
const appContext = createContext<AppContext>(initialContext);

export const AppContextProvider: ParentComponent = (props) => (
  <appContext.Provider value={initialContext}>
    {props.children}
  </appContext.Provider>
)

export const useAppContext = () => useContext<AppContext>(appContext);
