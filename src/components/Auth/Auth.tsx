import { useEffect, useState, PropsWithChildren, FC } from 'react'
import {
  I18nVariables,
  merge,
  VIEWS,
  en,
  ProviderScopes,
  ViewType,
  RedirectTo,
  OtpType
} from '@supabase/auth-ui-shared'
import {
  EmailAuth,
  EmailAuthProps,
  ForgottenPassword,
  MagicLink,
  SocialAuth,
  UpdatePassword,
  VerifyOtp,
} from './views'
import { useAppContext } from 'contexts'
import { Provider } from '@supabase/supabase-js';

type AuthProps = {
  providers?: Provider[]
  providerScopes?: Partial<ProviderScopes>
  queryParams?: {
    [key: string]: string;
  }
  view: ViewType
  setView: React.Dispatch<React.SetStateAction<ViewType>>
  redirectTo?: RedirectTo
  onlyThirdPartyProviders?: boolean
  magicLink?: boolean
  showLinks?: boolean
  otpType?: OtpType
  additionalData?: {
    [key: string]: unknown
  }
  // Override the labels and button text
  localization?: {
    variables?: I18nVariables;
  }
}

export const Auth: FC<PropsWithChildren<AuthProps>> = ({
  providers,
  providerScopes,
  queryParams,
  view = 'sign_in',
  setView,
  redirectTo,
  onlyThirdPartyProviders = false,
  magicLink = false,
  showLinks = true,
  localization = { variables: {} },
  otpType = 'email',
  additionalData,
  children,
}) => {
  // Localization support
  const i18n: I18nVariables = merge(en, localization.variables ?? {})

  const [defaultEmail, setDefaultEmail] = useState('')
  const [defaultPassword, setDefaultPassword] = useState('')

  const { supabase } = useAppContext()

  const isSignView = (
    view === 'sign_in' ||
    view === 'sign_up' ||
    view === 'magic_link'
  )

  useEffect(() => {
    // Overrides the authview if it is changed externally
    const listener = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setView('update_password')
      } else if (event === 'USER_UPDATED' || event === 'SIGNED_OUT') {
        setView('sign_in')
      }
    })
    
    return () => listener.data.subscription.unsubscribe()
  }, [supabase.auth, setView])

  const emailProps: Omit<EmailAuthProps, 'authView' | 'id'> = {
    setAuthView: setView,
    defaultEmail,
    defaultPassword,
    setDefaultEmail,
    setDefaultPassword,
    redirectTo,
    magicLink,
    showLinks,
    i18n
  }

  let ViewUI: JSX.Element

  switch (view) {
    case VIEWS.SIGN_IN:
      ViewUI = (
        <EmailAuth
          {...emailProps}
          authView={'sign_in'}
        />
      )
      break
    case VIEWS.SIGN_UP:
      ViewUI = (
        <EmailAuth
          {...emailProps}
          authView={'sign_up'}
          additionalData={additionalData}
        >
          {children}
        </EmailAuth>
      )
      break
    case VIEWS.FORGOTTEN_PASSWORD:
      ViewUI = (
        <ForgottenPassword
          setAuthView={setView}
          redirectTo={redirectTo}
          showLinks={showLinks}
          i18n={i18n}
        />
      )
      break
    case VIEWS.MAGIC_LINK:
      ViewUI = (
        <MagicLink
          setAuthView={setView}
          redirectTo={redirectTo}
          showLinks={showLinks}
          i18n={i18n}
        />
      )
      break
    case VIEWS.UPDATE_PASSWORD:
      return (
        <UpdatePassword
          i18n={i18n}
        />
      )
    case VIEWS.VERIFY_OTP:
      return (
        <VerifyOtp
          otpType={otpType}
          i18n={i18n}
        />
      )
    default:
      return null
  }

  return (
    <div>
      {isSignView && (
        <SocialAuth
          providers={providers}
          providerScopes={providerScopes}
          queryParams={queryParams}
          redirectTo={redirectTo}
          onlyThirdPartyProviders={onlyThirdPartyProviders}
          i18n={i18n}
          view={view}
        />
      )}
      {!onlyThirdPartyProviders && ViewUI}
    </div>
  )
}
