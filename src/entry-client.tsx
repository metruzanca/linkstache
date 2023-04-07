import { mount, StartClient } from "solid-start/entry-client";
import { FirebaseProvider } from "./lib/appContext";

mount(() => (
  <FirebaseProvider>
    <StartClient />
  </FirebaseProvider>
), document);
