import { useState } from "react"
import { SignUpForm } from "../components/SignUpForm"

const SIGNIN = "signin"
const SIGNUP = "signup"

type LoginView = null | typeof SIGNIN | typeof SIGNUP

export const LoginPage = () => {
  const [view, setView] = useState<LoginView>(null)

  const viewFactory = (view: LoginView) => {
    if (view == SIGNIN) {
      return <></>
    } else if (view == SIGNUP) {
      return <SignUpForm />
    } else {
      return <></>
    }
  }

  return (
    <>
      <button onClick={() => setView(SIGNIN)}>Sign In</button>
      <br />
      <button onClick={() => setView(SIGNUP)}>Sign Up</button>
      {view && (
        <div
          onClick={() => setView(null)}
          className="fixed left-0 top-0 w-screen h-screen flex justify-center items-center bg-slate-950 opacity-50"
        >
          <div onClick={e => e.stopPropagation()}>
            {[viewFactory(view)]}
          </div>
        </div>
      )}
    </>
  )
}