import { useState } from "react";

type Props = { callback: (email: string, password: string) => Promise<void> }

export const EmailLoginForm = ({ callback }: Props) => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const submit = async (e: Event) => {
    e.preventDefault()
    await callback(email, password)
  }

  return <form className="flex flex-col p-4" onSubmit={submit}>
    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" autoComplete="email" />
    <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" autoComplete="password" />
    <button className="bg-gray-600">Submit</button>
  </form>
}