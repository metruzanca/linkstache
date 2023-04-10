import { Component } from "solid-js";
import { useAppContext } from "~/lib/appContext";
import { Firebase } from "~/lib/firebase";
import { submit } from "~/lib/util";

const Auth: Component<{}> = (props) => {
  const handleSubmit = submit(e => {
    
  })

  const handleAnon = async () => {
    const {  } = useAppContext()
    const user = await Firebase.instance().loginAnonymously()

  }

  return (
    <div>
      <h1>Login</h1>
      <form class="flex flex-col" onSubmit={handleSubmit}>
        <label for="email">Email</label>
        <input type="email" name="email" id="email" />
        <label for="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Login</button>
        <p>
          Already have an account? 
          <button class="inline text-blue-500"> Login</button>
        </p>
        
        <p>
          Don't want to make an account?
          <button class="inline text-blue-500">Use Anonymously</button>
        </p>

      </form>
    </div>
  )
};

export default Auth;