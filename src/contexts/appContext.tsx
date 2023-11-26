import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../lib";
import { AuthError, Session, SupabaseClient, User } from "@supabase/supabase-js";

type TAppContext = {
  supabase: SupabaseClient<any, "public", any>
  signup: () => Promise<void>
  user: User | null
  error: AuthError | null
  session: Session | null
} 

const AppContext = createContext<TAppContext>({
  supabase,
  signup: async () => {},
  user: null,
  error: null,
  session: null
});

export const AppContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<AuthError | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  const signup = useCallback( async () => {
    const { data, error } = await supabase.auth.signUp({
      email: 'ben.isenstein@gmail.com',
      password: 'bens-password'
    })
  
    setUser(data.user)
    setError(error)
    setSession(data.session)
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