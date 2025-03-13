import { createClient } from '@supabase/supabase-js'

// Debug: Log environment variables (without exposing sensitive data)
console.log('Environment check:', {
  hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10) + '...'
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase environment variables. 
    URL: ${supabaseUrl ? 'present' : 'missing'}, 
    Key: ${supabaseAnonKey ? 'present' : 'missing'}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 