import React, { useEffect, useRef, useState } from 'react'
import {
  I18nVariables,
  RedirectTo,
  ViewSignUp,
  ViewSignIn,
  VIEWS,
  ViewType,
} from '@supabase/auth-ui-shared'
import { useAppContext } from 'contexts'

export interface EmailAuthProps {
  authView?: ViewSignIn | ViewSignUp
  defaultEmail?: string
  defaultPassword?: string
  setAuthView?: (view: ViewType) => void
  setDefaultEmail?: (email: string) => void
  setDefaultPassword?: (password: string) => void
  showLinks?: boolean
  redirectTo?: RedirectTo
  additionalData?: { [key: string]: unknown }
  magicLink?: boolean
  i18n?: I18nVariables
  children?: React.ReactNode
}

export function EmailAuth({
  authView = 'sign_in',
  defaultEmail = '',
  defaultPassword = '',
  setAuthView = () => {},
  setDefaultEmail = () => {},
  setDefaultPassword = () => {},
  showLinks = false,
  redirectTo,
  additionalData,
  magicLink,
  i18n,
  children,
}: EmailAuthProps) {
  const isMounted = useRef<boolean>(true)
  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState(defaultPassword)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { supabase, withCaptureAuthError, error } = useAppContext()

  useEffect(() => {
    isMounted.current = true
    return () => {isMounted.current = false}
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    switch (authView) {
      case 'sign_in': {
        await withCaptureAuthError(() => supabase.auth.signInWithPassword({
          email,
          password,
        }))
        break
      }
      case 'sign_up': {
        const options = {
          emailRedirectTo: redirectTo,
          data: additionalData
        }

        const { data: { user, session }} = await withCaptureAuthError(() => supabase.auth.signUp({
          email,
          password,
          options
        }))
        
        // Check if session is null -> email confirmation setting is turned on
        if (user && !session) setMessage(i18n?.sign_up?.confirmation_text as string)
        break
      }
    }

    if (isMounted.current) setLoading(false)
  }

  const handleViewChange = (newView: ViewType) => {
    setDefaultEmail(email)
    setDefaultPassword(password)
    setAuthView(newView)
  }

  const labels = i18n?.[authView]

  return (
    <form
      id={authView === 'sign_in' ? `auth-sign-in` : `auth-sign-up`}
      onSubmit={handleSubmit}
      autoComplete={'on'}
      style={{ width: '100%' }}
    >
      <div className="flex flex-col gap-2 my-2">
        <div className="flex flex-col gap-2 my-2">
          <div>
            <label htmlFor="email" className="text-sm mb-1 text-black block">
              {labels?.email_label}
            </label>
            <input
              className="py-1 px-2 cursor-text border-[1px] border-solid border-black text-s w-full text-black box-border hover:[outline:none] focus:[outline:none]"
              id="email"
              type="email"
              name="email"
              placeholder={labels?.email_input_placeholder}
              defaultValue={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm mb-1 text-black block">
              {labels?.password_label}
            </label>
            <input
              className="py-1 px-2 cursor-text border-[1px] border-solid border-black text-s w-full text-black box-border hover:[outline:none] focus:[outline:none]"
              id="password"
              type="password"
              name="password"
              placeholder={labels?.password_input_placeholder}
              defaultValue={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              autoComplete={
                authView === 'sign_in' ? 'current-password' : 'new-password'
              }
            />
          </div>
          {children}
        </div>

        <button
          className="flex justify-center items-center gap-2 rounded-md text-sm p-1 cursor-pointer border-[1px] border-zinc-950 w-full disabled:opacity-70 disabled:cursor-[unset] bg-amber-200 text-amber-950 hover:bg-amber-300"
          type="submit"
          disabled={loading}
        >
          {loading ? labels?.loading_button_label : labels?.button_label}
        </button>

        {showLinks && (
          <div className="flex flex-col gap-2 my-2">
            {authView === VIEWS.SIGN_IN && magicLink && (
              <a
                className="block text-xs text-center mb-1 underline hover:text-blue-700"
                href="#auth-magic-link"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault()
                  setAuthView(VIEWS.MAGIC_LINK)
                }}
              >
                {i18n?.magic_link?.link_text}
              </a>
            )}
            {authView === VIEWS.SIGN_IN && (
              <a
                className="block text-xs text-center mb-1 underline hover:text-blue-700"
                href="#auth-forgot-password"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault()
                  setAuthView(VIEWS.FORGOTTEN_PASSWORD)
                }}
              >
                {i18n?.forgotten_password?.link_text}
              </a>
            )}
            {authView === VIEWS.SIGN_IN ? (
              <a
                className="block text-xs text-center mb-1 underline hover:text-blue-700"
                href="#auth-sign-up"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault()
                  handleViewChange(VIEWS.SIGN_UP)
                }}
              >
                {i18n?.sign_up?.link_text}
              </a>
            ) : (
              <a
                className="block text-xs text-center mb-1 underline hover:text-blue-700"
                href="#auth-sign-in"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault()
                  handleViewChange(VIEWS.SIGN_IN)
                }}
              >
                {i18n?.sign_in?.link_text}
              </a>
            )}
          </div>
        )}
      </div>
      {message && <span className="block text-center text-xs mb-1 rounded-md py-6 px-4 border-[1px] border-black">{message}</span>}
      {error && <span className="block text-center text-xs mb-1 rounded-md py-6 px-4 border-[1px] text-red-900 bg-red-100 border-red-950">{error.message}</span>}
    </form>
  )
}
