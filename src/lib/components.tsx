import { Accessor, Component, createEffect, createSignal, For, JSXElement, ParentComponent, Show } from "solid-js";
import clsx from "clsx";

import { useAppContext } from "./appContext";
import { A, useLocation } from "solid-start";
import { groupByDate } from "./util";
import { useRouteParams } from "solid-start/islands/server-router";
import { Firebase } from "./firebase";

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
      {props.children}
    </aside>
  </div>
)

const AA: Component<{ href: string; text: string }> = (props) => {
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
  const { menuOpen, toggleMenu, auth } = useAppContext();
  const location = useLocation();
  const page = () => location.pathname.slice(1);

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
                href="/"
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
            <h3 class="text-xl">Navigation</h3>
            <div class="flex justify-center flex-col">
              <AA href="/" text="My Links" />
              <AA href="/sync" text="Sync" />
              <AA href="/settings" text="Settings" />  
            </div>
          </div>

          {auth() && (
            <div class="p-4 text-center border-t">
              <button
                class="btn-warn"
                onClick={() => alert('WIP')}
                textContent="Logout"
              />
            </div>
          )}
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