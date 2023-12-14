import { Provider } from '@supabase/supabase-js'
import { useState } from 'react'
import {
  I18nVariables,
  ProviderScopes,
  template,
} from '@supabase/auth-ui-shared'
import { Icons } from '../Icons'
import { useAppContext } from 'contexts'

interface SocialAuthProps {
  providers?: Provider[]
  providerScopes?: Partial<ProviderScopes>
  queryParams?: { [key: string]: string }
  redirectTo?: RedirectTo
  onlyThirdPartyProviders?: boolean
  view?: 'sign_in' | 'sign_up' | 'magic_link'
  i18n?: I18nVariables
}

type RedirectTo = undefined | string

function capitalize(word: string) {
  const lower = word.toLowerCase()
  return word.charAt(0).toUpperCase() + lower.slice(1)
}

export function SocialAuth({
  providers = ['github', 'google', 'facebook'],
  providerScopes,
  queryParams,
  redirectTo,
  onlyThirdPartyProviders = true,
  view = 'sign_in',
  i18n,
}: SocialAuthProps) {
  const { supabase, withCaptureAuthError } = useAppContext()
  const [loading, setLoading] = useState(false)
  
  const currentView = view === 'magic_link' ? 'sign_in' : view

  const handleProviderSignIn = async (provider: Provider) => {
    setLoading(true)

    await withCaptureAuthError(() => supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        scopes: providerScopes?.[provider],
        queryParams,
      },
    }))

    setLoading(false)
  }

  return (
    <>
      {providers && providers.length > 0 && (
        <>
          <div className="flex flex-col gap-2 my-2">
            <div className="flex flex-col gap-2 my-2">
              {providers.map((provider: Provider) => {
                return (
                  <button
                    key={provider}
                    className="flex justify-center items-center gap-2 rounded-md text-sm p-1 cursor-pointer border-[1px] border-zinc-950 w-full disabled:opacity-70 disabled:cursor-[unset] bg-transparent text-black hover:bg-stone-100"
                    disabled={loading}
                    onClick={() => handleProviderSignIn(provider)}
                  >
                    <Icons provider={provider} />
                    {template(
                      i18n?.[currentView]?.social_provider_text as string,
                      {
                        provider: capitalize(provider),
                      }
                    )}
                  </button>
                )
              })}
            </div>
          </div>
          {!onlyThirdPartyProviders && <div className="block my-4 h-[1px] w-full" />}
        </>
      )}
    </>
  )
}