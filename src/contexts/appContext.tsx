import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";
import { signUp, supabase } from "../lib";
import { AuthError, Session, SupabaseClient, User } from "@supabase/supabase-js";

type TAppContext = {
  supabase: SupabaseClient<any, "public", any>
  signup: (email: string, password: string) => Promise<void>
  user: User | null
  error: AuthError | null
  session: Session | null
} 

const AppContext = createContext<TAppContext>({
  supabase,
  signup: async (email: string, password: string) => {},
  user: null,
  error: null,
  session: null
});

export const AppContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<AuthError | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  const signup = useCallback( async (email: string, password: string) => {
    signUp(email, password).then(({error, data}) => {
      setUser(data.user)
      setError(error)
      setSession(data.session)
    })
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
      value={{ supabase, signup, user, error, session }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);