import { createSignal, createContext, ParentComponent, useContext } from "solid-js";

type LoggedIn = {
  state: 'logged-in'
  isAnonymous?: boolean
}

type LoggedOut = {
  state: 'logged-out'
}

type Loading = {
  state: 'loading'
}

type AuthState = LoggedIn | LoggedOut | Loading

const makeAppContext = () => {  
  const [menuOpen, setMenuOpen] = createSignal(false);
  const toggleMenu = (next = !menuOpen()) => setMenuOpen(next);

  // Used to determine if the user is logged in the nav components
  const [auth, _setAuth] = createSignal<AuthState>({ state: 'loading' });
  const setAuth = (state: AuthState['state']) => _setAuth({ state });


  return {
    // Signals
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
