import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from "./constants";

export const schemas = {
  stache: {
    name: 'stache'
  }
}

// Docs: https://firebase.google.com/docs/firestore
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export default db;
