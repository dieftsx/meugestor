
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database"

// Verificação de variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL não está configurado. Verifique seu arquivo .env")
}

if (!supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY não está configurado. Verifique seu arquivo .env")
}

// Validação básica do formato da URL
try {
  new URL(supabaseUrl)
} catch {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL tem formato inválido")
}

// Cliente singleton para evitar múltiplas instâncias
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

// Cliente com tratamento de erro
export const createClient = () => {
  if (!supabaseClient) {
    try {
      supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
    } catch (error) {
      console.error("Erro ao criar cliente Supabase:", error)
      throw new Error("Falha na configuração do Supabase. Verifique as variáveis de ambiente.")
    }
  }
  return supabaseClient
}

// Função para testar a conexão
export const testConnection = async () => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").select("count").limit(1)

    if (error) {
      console.error("Erro na conexão:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Erro no teste de conexão:", error)
    return { success: false, error: "Falha na conexão com o banco de dados" }
  }
}
