import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import { AuthError, Session, SupabaseClient, User } from "@supabase/supabase-js"
import { supabase } from 'shared'

type SupabaseAuthResponseLike = { error: AuthError | null, [key: string]: unknown }

type AuthCallback<T extends SupabaseAuthResponseLike> = () => Promise<T>

type WithCaptureAuthError = <T extends SupabaseAuthResponseLike>(cb: AuthCallback<T>) => Promise<T>

type TAppContext = {
  supabase: SupabaseClient<unknown, "public", unknown>
  session: Session | null
  user: User | null
  error: AuthError | null
  withCaptureAuthError: WithCaptureAuthError
}

const AppContext = createContext<TAppContext>({
  supabase,
  session: null,
  user: null,
  error: null,
  withCaptureAuthError: (async () => ({ error: null })) as WithCaptureAuthError
})

export const AppContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<AuthError | null>(null)

  const withCaptureAuthError: WithCaptureAuthError = async (cb) => {
    setError(null)
    const result = await cb()
    if (result.error) setError(result.error)
    return result
  }

  useEffect(() => {
    const listener = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session)
    })

    return () => listener.data.subscription.unsubscribe()
  }, [])

  const value = {
    supabase,
    session,
    user: session?.user ?? null,
    error,
    withCaptureAuthError
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
