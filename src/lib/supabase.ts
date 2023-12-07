import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_API_URL!
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export const signUp = (email: string, password: string) => {
  return supabase.auth.signUp({ email, password })
}

export const signIn = (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password })
}

export const signOut = () => {
  return supabase.auth.signOut()
}