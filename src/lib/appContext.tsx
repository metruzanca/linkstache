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
  
  const [menuOpen, setMenuOpen] = createSignal(false);
  const toggleMenu = (next = !menuOpen()) => setMenuOpen(next);

  // Used to determine if the user is logged in the nav components
  const [auth, setAuth] = createSignal(false);

  return {
    // Signals
    stache,
    menuOpen, toggleMenu,
    auth, setAuth,

    // Actions
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
