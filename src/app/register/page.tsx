"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { createClient, testConnection } from "@/lib/supabase-client-safe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Eye, EyeOff, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nomeCompleto: "",
    nomeEmpresa: "",
    tipoNegocio: "",
    telefone: "",
    cidade: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkConnection = async () => {
      const result = await testConnection()
      if (!result.success) {
        setError(`Erro de configuração: ${result.error}`)
      }
    }

    checkConnection()
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Debug logs
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configurado" : "NÃO CONFIGURADO")
    console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configurado" : "NÃO CONFIGURADO")

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Log adicional para debug
      console.log("Tentando criar usuário com email:", formData.email)

      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome_completo: formData.nomeCompleto,
            nome_empresa: formData.nomeEmpresa,
            tipo_negocio: formData.tipoNegocio,
            telefone: formData.telefone,
            cidade: formData.cidade,
          },
        },
      })

      console.log("Resposta do Supabase:", { data, error: authError })

      if (authError) {
        console.error("Erro detalhado:", authError)
        setError("Erro ao criar conta: " + authError.message)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard/configuracoes")
      }, 2000)
    } catch (err) {
      console.error("Erro no catch:", err)
      setError("Erro ao criar conta. Verifique sua conexão e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="flex justify-center w-full">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 w-full">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">Conta Criada!</h2>
              <p className="text-green-600 mb-4">Bem-vindo ao GestãoRO! Redirecionando para seu painel...</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="flex justify-center w-full">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 w-full">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">GestãoRO</span>
            </div>
            <CardTitle>Criar sua conta</CardTitle>
            <CardDescription>Comece seu teste grátis de 15 dias agora mesmo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo</Label>
                  <Input
                    id="nomeCompleto"
                    placeholder="Seu nome"
                    value={formData.nomeCompleto}
                    onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(69) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                <Input
                  id="nomeEmpresa"
                  placeholder="Padaria São José"
                  value={formData.nomeEmpresa}
                  onChange={(e) => setFormData({ ...formData, nomeEmpresa: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoNegocio">Tipo de Negócio</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, tipoNegocio: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="padaria">Padaria</SelectItem>
                      <SelectItem value="acougue">Açougue</SelectItem>
                      <SelectItem value="mercearia">Mercearia</SelectItem>
                      <SelectItem value="farmacia">Farmácia</SelectItem>
                      <SelectItem value="restaurante">Restaurante</SelectItem>
                      <SelectItem value="loja-roupas">Loja de Roupas</SelectItem>
                      <SelectItem value="oficina">Oficina</SelectItem>
                      <SelectItem value="salao">Salão de Beleza</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, cidade: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="porto-velho">Porto Velho</SelectItem>
                      <SelectItem value="ji-parana">Ji-Paraná</SelectItem>
                      <SelectItem value="ariquemes">Ariquemes</SelectItem>
                      <SelectItem value="vilhena">Vilhena</SelectItem>
                      <SelectItem value="cacoal">Cacoal</SelectItem>
                      <SelectItem value="rolim-moura">Rolim de Moura</SelectItem>
                      <SelectItem value="jaru">Jaru</SelectItem>
                      <SelectItem value="ouro-preto">Ouro Preto do Oeste</SelectItem>
                      <SelectItem value="outra">Outra cidade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repita a senha"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando conta..." : "Criar Conta Grátis"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Faça login
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 text-center">
                ✅ 15 dias grátis • ✅ Sem cartão de crédito • ✅ Cancele quando quiser
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
