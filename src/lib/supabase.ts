import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lwpiiplkqeylomngpegm.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

