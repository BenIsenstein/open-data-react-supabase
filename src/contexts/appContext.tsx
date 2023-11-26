import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";
import { signIn, signOut, signUp, supabase } from "../lib";
import { AuthError, Session, SupabaseClient, User } from "@supabase/supabase-js";

type TAppContext = {
  supabase: SupabaseClient<any, "public", any>
  signin: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  signout: () => Promise<void>
  user: User | null
  error: AuthError | null
  session: Session | null
}

const AppContext = createContext<TAppContext>({
  supabase,
  signin: async (email: string, password: string) => { },
  signup: async (email: string, password: string) => { },
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
    supabase.auth.getUser().then((res) => {
      const { data, error } = res
      setUser(data.user)
      setError(error)
    })
  }, [])

  return (
    <AppContext.Provider
      value={{ supabase, signup, signin, signout, user, error, session }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);