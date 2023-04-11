import { Accessor, Component, For, JSXElement, onMount, ParentComponent, Show } from "solid-js";
import clsx from "clsx";

import { useAppContext } from "./appContext";
import { A, useLocation, useNavigate } from "solid-start";
import { groupByDate, routes } from "./util";
import { Firebase, Link } from "./firebase";
import { z } from "zod";

type HamburgerProps = {
  onClick: (state: boolean) => void
  toggled: Accessor<boolean>;
}
const Hamburger: Component<HamburgerProps> = (props) => {
  return (
    <div class="text-4xl mt-[-10px]">
      {props.toggled() ? (
        <button
          onclick={() => {
            props.onClick(false)
          }}
          textContent="×"
        />
      ) : (
        <button
          onclick={() => {
            props.onClick(true)
          }}
          textContent="≡"
        />
      )}
    </div>
  )
}

type SidebarProps = {
  open: Accessor<boolean>;
  close: () => void;
}
const Sidebar: ParentComponent<SidebarProps> = (props) => {
  const { auth, toggleMenu } = useAppContext()

  return (
    <div>
      <div
        class={clsx(
          "fixed z-50 top-16 bg-black w-full h-full",
          props.open() ? "opacity-30" : "opacity-0 pointer-events-none",
          "ease-in-out duration-300"
        )}
        onclick={props.close}
      />
      <aside class={clsx(
        `fixed z-50 top-16 right-0 w-64 h-[calc(100dvh-4rem)] bg-white border-l border-gray-200`,
        props.open() ? "translate-x-0 " : "translate-x-full",
        "ease-in-out duration-300"
      )}>
        <Show
          when={auth().state === 'logged-in'}
          children={props.children}
          fallback={(
            <div class="text-center">
              <h2>You're not logged in.</h2>
              <A href={routes.auth()} onClick={() => toggleMenu(false)}>Login</A>
            </div>
          )}
        />          
      </aside>
    </div>
  )
}

const SidebarLink: Component<{ href: string; text: string }> = (props) => {
  const { toggleMenu } = useAppContext();

  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-slate-400"
      : "border-transparent hover:border-slate-400";

  return (
    <A
      href={props.href}
      onClick={() => toggleMenu(false)}
      class={`border-b-2 ${active(props.href)} mx-1.5 sm:mx-6`}
      textContent={props.text}
    />
  )
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const Navigation: Component<{}> = (props) => {
  const { menuOpen, toggleMenu, auth, setAuth } = useAppContext();
  const location = useLocation();
  const page = () => location.pathname.slice(1);
  const navigate = useNavigate()

  const handleLogOut = async () => {
    await Firebase.logout();
    setAuth('logged-out')
    toggleMenu(false)
    navigate(routes.auth())
  }

  return (
    <nav>
      <div class="h-16">
        <div class={`
            flex justify-between fixed top-0 w-full  p-4
            border-b border-gray-200 bg-white
          `}>
          <span>
            <h1 class="text-2xl font-bold inline">
              <A
                href={auth().state == 'logged-in' ? routes.app() : routes.home()}
                onClick={() => toggleMenu(false)}
                textContent="LinkStache"
              />
            </h1>
            {page().length > 0 && <span> - {capitalize(page())}</span>}
          </span>
          <Hamburger
            onClick={toggleMenu}
            toggled={menuOpen}
          />
        </div>
      </div>

      <Sidebar open={menuOpen} close={() => toggleMenu(false)}>
        <div class="flex flex-col justify-between h-full">
          <div>
            <h3 class="text-xl text-center">Navigation</h3>
            <div class="flex justify-center flex-col">
              <SidebarLink href={routes.app()} text="My Links" />
              <SidebarLink href={routes.settings()} text="Settings" />  
            </div>
          </div>

          <div class="p-4 text-center border-t">
            <button
              class="btn warn"
              onClick={handleLogOut}
              textContent="Logout"
            />
          </div>
        </div>
      </Sidebar>
    </nav>
  )
};

export const Debug: Component<{ data: any }> = (props) => (
  <Show when={props.data} keyed>
    <pre>
      {JSON.stringify(props.data, null, 2)}
    </pre>
  </Show>
)

type DatedListProps = {
  each: any[]
  children: (item: any, index: Accessor<number>) => JSXElement
  header: (date: Date, index: Accessor<number>) => JSXElement
}

/** Adds headings every change of date */
export const DatedList: Component<DatedListProps> = (props) => {
  return (
    <>
      {Object.entries(groupByDate(props.each)).map(([date, links], idx) => (
        <>
          {props.header(new Date(date), () => idx)}
          <For each={links} children={props.children} />
        </>
      ))}
    </>
  )
}

export const Loading: Component = () => (
  <div class="flex justify-center items-center h-full">
    <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>
)

export const SplashScreen: ParentComponent = (props) => {
  const { auth, setAuth } = useAppContext();
  const navigate = useNavigate();

  onMount(async () => {
    const fire = Firebase;
    fire.authenticate()
    .then(() => {
      setAuth('logged-in')
      if (location.pathname == routes.auth()) {
        navigate(routes.app())
      }
    })
    .catch(() => {
      setAuth('logged-out')
      // If user is on the app, redirect to login. Else landing page
      if (location.pathname.startsWith(routes.app())) {
        navigate(routes.auth())
      } else {
        navigate(routes.home())
      }
    })
  });

  return (
    <Show when={auth().state !== 'loading'} keyed fallback={<Loading/>}>
      {props.children}
    </Show>
  )
}

export const linkSchema = z.string().regex(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)

export const LinkForm: Component<{}> = (props) => {
  let input: HTMLInputElement|undefined;
  async function handleAddLink() {
    const result = linkSchema.safeParse(input?.value);
    if (!result.success) {
      console.log(result.error);
      return
    }
    await Firebase.upsertLink(result.data);
    input!.value = '';
  }

  return (
    <div class="fixed bottom-0 w-full border-t border-gray-200 bg-white">
        <form
          class="flex items-center justify-between p-4"
          onsubmit={e => e.preventDefault()}
        >
          <input
            class="border border-gray-300 p-2 rounded-sm"
            placeholder="https://zanca.dev"
            ref={input}
          />
          <button
            type="submit"
            class="bg-green-400 active:bg-green-500 w-16 px-2 rounded-sm"
            onClick={handleAddLink}
            textContent="Add"
          />
        </form>
      </div>
  )
};

const TOO_MANY_READS = 5;

export const LinkComponent: Component<Link> = (props) => {
  const handleDelete = async () => {
    await Firebase.deleteLink(props.id)
  }

  const formatUrl = (url: string) => url.startsWith('http') ? url : `https://${url}`

  return (
    <div class="flex items-center justify-between p-4">
      <a
        target="_blank"
        href={formatUrl(props.url)}
        onClick={() => {
          if (props.readCount >= TOO_MANY_READS - 1) {
            Firebase.deleteLink(props.id)
          } else {
            Firebase.updateLink(props.id, {
              readCount: (props.readCount || 0) + 1,
            })
          }
        }}
        class="text-blue-600"
        textContent={props.title || props.url}
      />
      {props.readCount > 0 && (
        <span
          class={clsx(
            "text-gray-500 text-sm",
          )}
          textContent={`reads left: ${TOO_MANY_READS - props.readCount}`}
        />
        )}
      <button
        class="bg-red-400 active:bg-red-500 w-16 px-2 rounded-sm"
        textContent="Delete"
        onClick={handleDelete}
      />
    </div>
  )
}
