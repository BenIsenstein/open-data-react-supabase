import { useState } from "react";
import { useAppContext } from "../contexts/appContext";

export const SignUpForm = () => {
  const [email, setEmail] = useState<string >("")
  const [password, setPassword] = useState<string>("")
  
  const {signup} = useAppContext()
  const submit = async (e: Event) => {
    e.preventDefault()
    signup(email, password)
  }

  return <form className="flex flex-col p-4" onSubmit={submit}>
    <input value={email} onChange={e=> setEmail(e.target.value)} placeholder="Email" autoComplete="email" />
    <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" autoComplete="password" />
    <button className="bg-gray-600">Sign Up</button>
  </form>
}