import { addDoc, collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { createEffect, createSignal, onMount } from "solid-js";
import { A } from "solid-start";
import Counter from "~/components/Counter";

// const docRef = await addDoc(collection(db, "users"), {
//   first: "Ada",
//   last: "Lovelace",
//   born: 1815
// });

export default function About() {
  const [users, setUsers] = createSignal<any>([]);

  onMount(async () => {
    const currentUsers = await getDocs(collection(db, "users"));
    // currentUsers.forEach((doc) => {
    //   console.log(`${doc.id} => ${doc.data()}`);
    // });
    setUsers(currentUsers.docs)
  })

  createEffect(() => {
    const value = users();
    console.log(value);
    
  });

  return (
    <main >
      {JSON.stringify(users(), null, 2)}
    </main>
  );
}
