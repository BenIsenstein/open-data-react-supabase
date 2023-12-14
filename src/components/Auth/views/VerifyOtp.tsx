import {
  EmailOtpType,
  MobileOtpType,
  VerifyOtpParams,
} from '@supabase/supabase-js'
import React, { useState } from 'react'
import { VIEWS, I18nVariables, OtpType, ViewType } from '@supabase/auth-ui-shared'
import { useAppContext } from 'contexts'

type VerifyOtpProps = {
  setAuthView?: (view: ViewType) => void
  otpType: OtpType
  i18n?: I18nVariables
  showLinks?: boolean
}

export function VerifyOtp({
  setAuthView = () => {},
  otpType = 'email',
  i18n,
  showLinks = false,
}: VerifyOtpProps) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const { supabase, withCaptureAuthError, error } = useAppContext()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    let verifyOpts: VerifyOtpParams = {
      email,
      token,
      type: otpType as EmailOtpType,
    }

    if (['sms', 'phone_change'].includes(otpType)) {
      verifyOpts = {
        phone,
        token,
        type: otpType as MobileOtpType,
      }
    }

    await withCaptureAuthError(() => supabase.auth.verifyOtp(verifyOpts))

    setLoading(false)
  }

  const labels = i18n?.verify_otp

  return (
    <form id="auth-magic-link" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 my-2">
        {['sms', 'phone_change'].includes(otpType) ? (
          <div>
            <label htmlFor="phone" className="text-sm mb-1 text-black block">
              {labels?.phone_input_label}
            </label>
            <input
            className="py-1 px-2 cursor-text border-[1px] border-solid border-black text-s w-full text-black box-border hover:[outline:none] focus:[outline:none]"
              id="phone"
              name="phone"
              type="text"
              autoFocus
              placeholder={labels?.phone_input_placeholder}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
            />
          </div>
        ) : (
          <div>
            <label htmlFor="email" className="text-sm mb-1 text-black block">
              {labels?.email_input_label}
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
        )}
        <div>
          <label htmlFor="token" className="text-sm mb-1 text-black block">
            {labels?.token_input_label}
          </label>
          <input
          className="py-1 px-2 cursor-text border-[1px] border-solid border-black text-s w-full text-black box-border hover:[outline:none] focus:[outline:none]"
            id="token"
            name="token"
            type="text"
            placeholder={labels?.token_input_placeholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setToken(e.target.value)
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
    </form>
  )
}
