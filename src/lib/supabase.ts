
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database"

// Environment variables check
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Cliente singleton para evitar múltiplas instâncias
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export const createClient = () => {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Alias para compatibilidade
export const getSupabaseClient = createClient
