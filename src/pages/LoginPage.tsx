import { useState } from "react"
import { SignUpForm } from "../components/SignUpForm"
import { Page } from "../components"

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
    <Page>
      <button
      className="w-24 p-3 bg-zinc-950 font-bold text-white rounded-md mb-3 hover:bg-zinc-700 active:bg-zinc-500"
      onClick={() => setView(SIGNIN)}>Sign In</button>
      <br />
      <button
      className="w-24 p-3 border-zinc-950 border-2 font-bold rounded-md hover:bg-zinc-300 active:bg-zinc-500 active:text-white"
      onClick={() => setView(SIGNUP)}>Sign Up</button>
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
    </Page>
  )
}