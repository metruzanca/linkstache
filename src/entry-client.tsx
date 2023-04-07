import { mount, StartClient } from "solid-start/entry-client";

import '~/lib/firebase'
import { FirebaseProvider } from "~/lib/firebase";


mount(() => (
  <FirebaseProvider>
    <StartClient />
  </FirebaseProvider>
), document);
