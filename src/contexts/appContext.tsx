import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthError, Session, SupabaseClient, User } from "@supabase/supabase-js";
import { signIn, signOut, signUp, supabase } from "lib";

type TAppContext = {
  supabase: SupabaseClient<unknown, "public", unknown>
  signin: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  signout: () => Promise<void>
  user: User | null
  error: AuthError | null
  session: Session | null
}

const AppContext = createContext<TAppContext>({
  supabase,
  signin: async () => { },
  signup: async () => { },
  signout: async () => { },
  user: null,
  error: null,
  session: null
});

export const AppContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<AuthError | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  const signup = useCallback(async (email: string, password: string) => {
    signUp(email, password).then(({ error, data }) => {
      setUser(data.user)
      setError(error)
      setSession(data.session)
    })
  }, [])

  const signin = useCallback(async (email: string, password: string) => {
    signIn(email, password).then(({ error, data }) => {
      setUser(data.user)
      setError(error)
      setSession(data.session)
    })
  }, [])

  const signout = useCallback(async () => {
    const { error } = await signOut()
    if (error) {
      console.log(error);
      setError(error)
    }
    setUser(null)
    setSession(null)
  }, [])

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession()
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setError(error)
    })()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )
    return () => authListener?.subscription.unsubscribe()
  }, [])

  return (
    <AppContext.Provider value={{ supabase, signup, signin, signout, user, error, session }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);