import React, { useState } from 'react'
import { I18nVariables } from '@supabase/auth-ui-shared'
import { useAppContext } from 'contexts'

type UpdatePasswordProps = {
  i18n?: I18nVariables
}

export function UpdatePassword({ i18n }: UpdatePasswordProps) {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const { supabase, withCaptureAuthError, error } = useAppContext()

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const { error } = await withCaptureAuthError(() => supabase.auth.updateUser({ password }))

    if (!error) setMessage(i18n?.update_password?.confirmation_text as string)

    setLoading(false)
  }

  const labels = i18n?.update_password

  return (
    <form id="auth-update-password" onSubmit={handlePasswordReset}>
      <div className="flex flex-col gap-2 my-2">
        <div>
          <label htmlFor="password" className="text-sm mb-1 text-black block">
            {labels?.password_label}
          </label>
          <input
            className="py-1 px-2 cursor-text border-[1px] border-solid border-black text-s w-full text-black box-border hover:[outline:none] focus:[outline:none]"
            id="password"
            name="password"
            placeholder={labels?.password_label}
            type="password"
            autoFocus
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </div>
        <button
          type="submit"
          className="flex justify-center items-center gap-2 rounded-md text-sm p-1 cursor-pointer border-[1px] border-zinc-950 w-full disabled:opacity-70 disabled:cursor-[unset] bg-amber-200 text-amber-950 hover:bg-amber-300"
          disabled={loading}
        >
          {loading ? labels?.loading_button_label : labels?.button_label}
        </button>
        {message && <span className="block text-center text-xs mb-1 rounded-md py-6 px-4 border-[1px] border-black">{message}</span>}
        {error && <span className="block text-center text-xs mb-1 rounded-md py-6 px-4 border-[1px] text-red-900 bg-red-100 border-red-950">{error.message}</span>}
      </div>
    </form>
  )
}
