import { mount, StartClient } from "solid-start/entry-client";
import { FirebaseProvider } from 'solid-firebase'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "linkstache-fed2f.firebaseapp.com",
  projectId: "linkstache-fed2f",
  storageBucket: "linkstache-fed2f.appspot.com",
  messagingSenderId: "1072668570019",
  appId: "1:1072668570019:web:bd097665750b9c8821aa16",
  measurementId: "G-LXR46Q68DQ"
};

import './lib/firebase'


mount(() => (
  // <FirebaseProvider config={firebaseConfig}>
    <StartClient />
  // </FirebaseProvider>
), document);
