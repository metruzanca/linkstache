// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "linkstache-fed2f.firebaseapp.com",
  projectId: "linkstache-fed2f",
  storageBucket: "linkstache-fed2f.appspot.com",
  messagingSenderId: "1072668570019",
  appId: "1:1072668570019:web:bd097665750b9c8821aa16",
  measurementId: "G-LXR46Q68DQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// const analytics = getAnalytics(app);
