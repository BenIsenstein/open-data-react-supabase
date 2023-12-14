import React, { useState } from 'react'
import { VIEWS, I18nVariables, RedirectTo, ViewType } from '@supabase/auth-ui-shared'
import { useAppContext } from 'contexts'

type ForgottenPasswordProps = {
  setAuthView?: (view: ViewType) => void
  redirectTo?: RedirectTo
  i18n?: I18nVariables
  showLinks?: boolean
}

export function ForgottenPassword({
  setAuthView = () => {},
  redirectTo,
  i18n,
  showLinks = false,
}: ForgottenPasswordProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { supabase, withCaptureAuthError, error } = useAppContext()

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    const { error } = await withCaptureAuthError(() => supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    }))
    if (!error) setMessage(i18n?.forgotten_password?.confirmation_text as string)
    setLoading(false)
  }

  const labels = i18n?.forgotten_password

  return (
    <form id="auth-forgot-password" onSubmit={handlePasswordReset}>
      <div className="flex flex-col gap-2 my-2">
        <div className="flex flex-col gap-2 my-2">
          <div>
            <label htmlFor="email" className="text-sm mb-1 text-black block">
              {labels?.email_label}
            </label>
            <input
              className="py-1 px-2 cursor-text border-[1px] border-solid border-black text-s w-full text-black box-border hover:[outline:none] focus:[outline:none]"
              id="email"
              name="email"
              type="email"
              autoFocus
              placeholder={labels?.email_input_placeholder}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <button
            className="flex justify-center items-center gap-2 rounded-md text-sm p-1 cursor-pointer border-[1px] border-zinc-950 w-full disabled:opacity-70 disabled:cursor-[unset] bg-amber-200 text-amber-950 hover:bg-amber-300"
            type="submit"
            disabled={loading}
          >
            {loading ? labels?.loading_button_label : labels?.button_label}
          </button>
          {showLinks && (
            <a
              className="block text-xs text-center mb-1 underline hover:text-blue-700"
              href="#auth-sign-in"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault()
                setAuthView(VIEWS.SIGN_IN)
              }}
            >
              {i18n?.sign_in?.link_text}
            </a>
          )}
          {message && <span className="block text-center text-xs mb-1 rounded-md py-6 px-4 border-[1px] border-black">{message}</span>}
          {error && <span className="block text-center text-xs mb-1 rounded-md py-6 px-4 border-[1px] text-red-900 bg-red-100 border-red-950">{error.message}</span>}
        </div>
      </div>
    </form>
  )
}