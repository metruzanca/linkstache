import { Component, createSignal } from "solid-js";
import { Firebase } from "~/lib/firebase";
import { AiOutlineEyeInvisible, AiOutlineEye } from 'solid-icons/ai'
import { z } from "zod";
import { useNavigate } from "solid-start";
import { useAppContext } from "~/lib/appContext";
import { FirebaseError } from "firebase/app";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const InputPassword: Component<{ ref?: HTMLInputElement, id?: string }> = (props) => {
  const [passwordVisible, setPasswordVisible] = createSignal(false);
  return (
    <span class="relative">
      <input
        class="w-full"
        type={passwordVisible() ? 'text' : 'password'}
        id={props.id}
        ref={props.ref}
      />
      <span
        onClick={() => setPasswordVisible(prev => !prev)}
        class="absolute right-0 top-1 h-full cursor-pointer"
        children={passwordVisible() ? (
          <AiOutlineEyeInvisible />
        ) : (
          <AiOutlineEye />
        )}
      />
    </span>
  )
}

const Auth: Component<{}> = () => {
  const { setAuth } = useAppContext()
  const navigate = useNavigate()        
  const [isLogin, setIsLogin] = createSignal(true);
  let passwordRef: HTMLInputElement|undefined;
  let emailRef: HTMLInputElement|undefined;

  const redirect = () => {
    setAuth('logged-in')
    navigate('/')
  }

  // Like upsert... but for login/signup... 🙃
  const logUp = (email: string, password: string ) => {
    const authPromise = isLogin()
    ? Firebase.login(email, password)
    : Firebase.signUp(email, password);
    authPromise
    .then(redirect)
    .catch((err: FirebaseError) => {
      if (err.code === 'auth/user-not-found' && isLogin()) {
        // Sign-up instead
        setIsLogin(false)
        logUp(email, password)
      }
    })
  }

  const handleSubmit = (e: Event ) => {
    e.preventDefault()
    const result = authSchema.safeParse({
      email: emailRef?.value,
      password: passwordRef?.value,
    })
    if (!result.success) {
      console.log(result.error);
      return
    }
    const { email, password } = result.data

    logUp(email, password)
  }

  const handleAnon = async () => {
    Firebase.loginAnonymously()
    .then(redirect)
    .catch(console.error)
  }

  return (
    <div>
      <h1>{isLogin() ? 'Login' : 'Sign Up'}</h1>
      <form class="flex flex-col" onSubmit={handleSubmit}>
        
        <label for="email">Email</label>
        <input type="email" id="email" ref={emailRef} />
        
        <label for="password">Password</label>
        <InputPassword ref={passwordRef} id="password"/>

        <button type="submit">
          {isLogin() ? 'Login' : 'Sign Up'}
        </button>
        {isLogin() ? (
          <p>
            Need an account?
            <button
              onClick={() => setIsLogin(false)}
              class="inline text-blue-500"
              textContent=" Register"
            />
          </p>
        ): (
          <p>
            Already have an account?
            <button
              onClick={() => setIsLogin(true)}
              class="inline text-blue-500"
              textContent=" Login"
            />
          </p>
        )}
        
        <p>
          Don't want to make an account?
          <button
            type="button"
            onClick={handleAnon}
            class="inline text-blue-500"
            textContent=" Login Anonymously"
          />
        </p>

      </form>
    </div>
  )
};

export default Auth;