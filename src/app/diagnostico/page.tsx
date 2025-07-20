
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { testConnection } from "@/lib/supabase-client-safe"
import { createClient } from "@/lib/supabase"

interface DiagnosticResult {
  name: string
  status: "success" | "warning" | "error"
  message: string
}

export default function DiagnosticoPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [testing, setTesting] = useState(false)

  const runDiagnostics = async () => {
    setTesting(true)
    const diagnostics: DiagnosticResult[] = []

    // 1. Verificar variáveis de ambiente
    diagnostics.push({
      name: "Supabase URL",
      status: process.env.NEXT_PUBLIC_SUPABASE_URL ? "success" : "error",
      message: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? "Configurado corretamente"
        : "NEXT_PUBLIC_SUPABASE_URL não configurado",
    })

    diagnostics.push({
      name: "Supabase Anon Key",
      status: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "success" : "error",
      message: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? "Configurado corretamente"
        : "NEXT_PUBLIC_SUPABASE_ANON_KEY não configurado",
    })

    // 2. Testar conexão com o banco
    try {
      const connectionTest = await testConnection()
      diagnostics.push({
        name: "Conexão com Banco",
        status: connectionTest.success ? "success" : "error",
        message: connectionTest.success
          ? "Conexão estabelecida com sucesso"
          : `Erro na conexão: ${connectionTest.error}`,
      })
    } catch (error) {
      diagnostics.push({
        name: "Conexão com Banco",
        status: "error",
        message: `Erro na conexão: ${error}`,
      })
    }

    // 3. Testar autenticação
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()

      diagnostics.push({
        name: "Sistema de Autenticação",
        status: error ? "error" : "success",
        message: error
          ? `Erro na autenticação: ${error.message}`
          : data.session
            ? `Usuário logado: ${data.session.user.email}`
            : "Sistema funcionando (usuário não logado)",
      })
    } catch (error) {
      diagnostics.push({
        name: "Sistema de Autenticação",
        status: "error",
        message: `Erro no sistema de auth: ${error}`,
      })
    }

    // 4. Verificar se está em desenvolvimento
    diagnostics.push({
      name: "Ambiente",
      status: process.env.NODE_ENV === "development" ? "warning" : "success",
      message: `Executando em modo ${process.env.NODE_ENV || "unknown"}`,
    })

    setResults(diagnostics)
    setTesting(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">OK</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Atenção</Badge>
      case "error":
        return <Badge variant="destructive">Erro</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">🔧 Diagnóstico do Sistema</CardTitle>
            <p className="text-gray-600">Verificação da configuração e conectividade do sistema</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Resultados da Verificação</h3>
                <Button onClick={runDiagnostics} disabled={testing}>
                  {testing ? "Testando..." : "Executar Novamente"}
                </Button>
              </div>

              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📋 Checklist de Configuração</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✅ Criar projeto no Supabase</li>
                  <li>✅ Copiar URL e Anon Key para .env.local</li>
                  <li>✅ Executar scripts SQL na ordem correta</li>
                  <li>✅ Verificar se RLS está habilitado</li>
                  <li>✅ Testar a criação de usuário</li>
                  <li>✅ Verificar se o middleware está funcionando</li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">🐛 Debug de Login</h4>
                <p className="text-sm text-yellow-700">
                  Se o login não estiver redirecionando:
                  <br />
                  1. Abra o Console do navegador (F12)
                  <br />
                  2. Tente fazer login
                  <br />
                  3. Verifique os logs no console
                  <br />
                  4. Verifique se há erros de CORS ou rede
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
