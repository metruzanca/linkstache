import { Accessor, Component, ParentComponent, Show, createSignal } from "solid-js";
import { useAppContext } from "./appContext";
import { addDebugLinks } from "./firebase";
import clsx from "clsx";
import { A, useLocation } from "solid-start";

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

type SidebarProps = { open: Accessor<boolean>; close: () => void }
const Sidebar: ParentComponent<SidebarProps> = (props) => (
  <div>
    <div
      class={clsx(
        "fixed top-16 bg-black w-full h-full",
        props.open() ? "opacity-30" : "opacity-0 pointer-events-none",
        "ease-in-out duration-300"
      )}
      onclick={props.close}
    />
    <aside class={clsx(
      `fixed top-16 right-0 w-64 h-full bg-white border-l border-gray-200`,
      props.open() ? "translate-x-0 " : "translate-x-full",
      "ease-in-out duration-300"
    )}>
      {props.children}
    </aside>
  </div>
)

const AA: Component<{ href: string; text: string }> = (props) => {
  const { setMenuOpen } = useAppContext();

  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-slate-400"
      : "border-transparent hover:border-slate-400";

  return (
    <A
      href={props.href}
      onClick={() => setMenuOpen(false)}
      class={`border-b-2 ${active(props.href)} mx-1.5 sm:mx-6`}
      textContent={props.text}
    />
  )
}

export const Navigation: Component<{}> = (props) => {
  const { user, menuOpen, setMenuOpen } = useAppContext();

  return (
    <nav>
      <div class="h-16">
        <div class={`
            flex justify-between fixed top-0 w-full  p-4
            border-b border-gray-200 bg-white
          `}>
          <h1 class="text-2xl font-bold">
            <A
              href="/"
              onClick={() => setMenuOpen(false)}
              textContent={"LinkStache"}
            />
          </h1>
          <Hamburger
            onClick={setMenuOpen}
            toggled={menuOpen}
          />
        </div>
      </div>

      <Sidebar open={menuOpen} close={() => setMenuOpen(false)}>
        <h3 class="text-xl">Navigation</h3>
        <div class="flex justify-center flex-col">
          <AA href="/" text="My Links" />
          <AA href="/sync" text="Sync" />
          <AA href="/settings" text="Settings" />  
        </div>

        <hr />
        
        <h3 class="text-xl">Debug Utils</h3>
        <button onclick={() => addDebugLinks(user())}>Add links</button>
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
