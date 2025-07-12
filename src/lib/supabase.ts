
// Corrigido: importação e verificação das variáveis de ambiente do Supabase

import { createClient } from "@supabase/supabase-js"

// Verificação das variáveis de ambiente do Supabase
const supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Cliente para componentes do lado do cliente
export const createSupabaseClient = () =>
  createClient(supabaseUrl, supabaseAnonKey)

// Cliente singleton para uso geral no cliente
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}
