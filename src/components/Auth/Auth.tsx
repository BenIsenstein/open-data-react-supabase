import { createStitches, createTheme } from '@stitches/core'
import { I18nVariables, merge, VIEWS, en } from '@supabase/auth-ui-shared'
import React, { useEffect, useState } from 'react'
import { Auth as AuthProps } from './types'
import {
  EmailAuth,
  EmailAuthProps,
  ForgottenPassword,
  MagicLink,
  SocialAuth,
  UpdatePassword,
  VerifyOtp,
} from './views'

export const Auth = ({
  supabaseClient,
  socialLayout = 'vertical',
  providers,
  providerScopes,
  queryParams,
  view = 'sign_in',
  redirectTo,
  onlyThirdPartyProviders = false,
  magicLink = false,
  showLinks = true,
  appearance,
  theme = 'default',
  localization = { variables: {} },
  otpType = 'email',
  additionalData,
  children,
}: AuthProps): JSX.Element | null => {
  /**
   * Localization support
   */

  const i18n: I18nVariables = merge(en, localization.variables ?? {})

  const [authView, setAuthView] = useState(view)
  const [defaultEmail, setDefaultEmail] = useState('')
  const [defaultPassword, setDefaultPassword] = useState('')

  /**
   * Simple boolean to detect if authView 'sign_in' or 'sign_up' or 'magic_link' is used
   *
   * @returns boolean
   */
  const SignView =
    authView === 'sign_in' ||
    authView === 'sign_up' ||
    authView === 'magic_link'

  useEffect(() => {
    createStitches({
      theme: merge(
        appearance?.theme?.default ?? {},
        appearance?.variables?.default ?? {}
      ),
    })
  }, [appearance])

  /**
   * Wraps around all auth components
   * renders the social auth providers if SignView is true
   *
   * also handles the theme override
   *
   * @param children
   * @returns React.ReactNode
   */
  const Container = ({ children }: { children: React.ReactNode }) => (
    <div
      className={
        theme !== 'default'
          ? createTheme(
              merge(
                appearance?.theme?.[theme],
                appearance?.variables?.[theme] ?? {}
              )
            )
          : ''
      }
    >
      {SignView && (
        <SocialAuth
          appearance={appearance}
          supabaseClient={supabaseClient}
          providers={providers}
          providerScopes={providerScopes}
          queryParams={queryParams}
          socialLayout={socialLayout}
          redirectTo={redirectTo}
          onlyThirdPartyProviders={onlyThirdPartyProviders}
          i18n={i18n}
          view={authView}
        />
      )}
      {!onlyThirdPartyProviders && children}
    </div>
  )

  useEffect(() => {
    /**
     * Overrides the authview if it is changed externally
     */
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setAuthView('update_password')
        } else if (event === 'USER_UPDATED') {
          setAuthView('sign_in')
        }
      }
    )
    setAuthView(view)

    return () => authListener.subscription.unsubscribe()
  }, [view, supabaseClient.auth])

  const emailProp: Omit<EmailAuthProps, 'authView' | 'id'> = {
    supabaseClient,
    setAuthView,
    defaultEmail,
    defaultPassword,
    setDefaultEmail,
    setDefaultPassword,
    redirectTo,
    magicLink,
    showLinks,
    i18n,
    appearance,
  }

  /**
   * View handler, displays the correct Auth view
   * all views are wrapped in <Container/>
   */
  switch (authView) {
    case VIEWS.SIGN_IN:
      return (
        <Container>
          <EmailAuth {...emailProp} authView={'sign_in'} />
        </Container>
      )
    case VIEWS.SIGN_UP:
      return (
        <Container>
          <EmailAuth
            {...emailProp}
            authView={'sign_up'}
            additionalData={additionalData}
            children={children}
          />
        </Container>
      )
    case VIEWS.FORGOTTEN_PASSWORD:
      return (
        <Container>
          <ForgottenPassword
            appearance={appearance}
            supabaseClient={supabaseClient}
            setAuthView={setAuthView}
            redirectTo={redirectTo}
            showLinks={showLinks}
            i18n={i18n}
          />
        </Container>
      )
    case VIEWS.MAGIC_LINK:
      return (
        <Container>
          <MagicLink
            appearance={appearance}
            supabaseClient={supabaseClient}
            setAuthView={setAuthView}
            redirectTo={redirectTo}
            showLinks={showLinks}
            i18n={i18n}
          />
        </Container>
      )
    case VIEWS.UPDATE_PASSWORD:
      return (
        <UpdatePassword
          appearance={appearance}
          supabaseClient={supabaseClient}
          i18n={i18n}
        />
      )
    case VIEWS.VERIFY_OTP:
      return (
        <VerifyOtp
          appearance={appearance}
          supabaseClient={supabaseClient}
          otpType={otpType}
          i18n={i18n}
        />
      )
    default:
      return null
  }
}
