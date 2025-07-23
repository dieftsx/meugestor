
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, CheckCircle, Users, DollarSign, Package } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando para o dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex justify-center w-full">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b">
          <div className="w-full max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">GestãoRO</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/register">
                  <Button>Começar Grátis</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="w-full max-w-4xl mx-auto text-center px-4">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Gerencie seu negócio com
              <span className="text-blue-600"> facilidade</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sistema completo para padarias, açougues, lojas e restaurantes em Rondônia. 
              Controle vendas, estoque e clientes em uma única plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 py-3">
                  Começar Teste Grátis
                </Button>
              </Link>
            </div>
            {/* Card de Assinatura */}
            <div className="flex justify-center">
              <Card className="max-w-md w-full mx-auto shadow-lg border-blue-200 border-2">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <DollarSign className="h-6 w-6 text-blue-600" /> Assinatura GestãoRO
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    <span className="font-bold text-blue-700 text-3xl">R$ 50,00</span> <span className="text-gray-600">/mês</span>
                    <br />
                    <span className="text-gray-500 text-base">ou <span className="font-semibold">R$ 600,00</span> /ano</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-left text-gray-700 mb-6 space-y-1 text-base">
                    <li>✔️ Acesso completo à plataforma</li>
                    <li>✔️ Suporte prioritário</li>
                    <li>✔️ Relatórios e backups ilimitados</li>
                  </ul>
                  <Button
                    size="lg"
                    className="w-full text-lg"
                    onClick={async () => {
                      if (!user) {
                        router.push("/register")
                        return
                      }
                      try {
                        const response = await fetch("/api/create-checkout-session", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ priceId: "price_1234567890" }),
                        })
                        const { sessionId } = await response.json()
                        // @ts-ignore
                        const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
                        await stripe.redirectToCheckout({ sessionId })
                      } catch (err) {
                        alert("Erro ao iniciar assinatura. Tente novamente.")
                      }
                    }}
                  >
                    Assinar agora
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Pagamento seguro via Stripe</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-white">
          <div className="w-full max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Por que escolher o GestãoRO?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle>Controle de Vendas</CardTitle>
                  <CardDescription>
                    Gerencie vendas, receitas e relatórios financeiros com facilidade
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle>Gestão de Estoque</CardTitle>
                  <CardDescription>
                    Controle produtos, alertas de estoque baixo e validade
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle>Gestão de Clientes</CardTitle>
                  <CardDescription>
                    Cadastre clientes, histórico de compras e fidelização
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="w-full max-w-4xl mx-auto text-center px-4">
            <Card className="bg-blue-600 text-white border-0">
              <CardContent className="pt-12 pb-12">
                <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
                <p className="text-xl mb-8 opacity-90">
                  Teste grátis por 15 dias. Sem cartão de crédito, sem compromisso.
                </p>
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                    Criar Conta Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 px-4">
          <div className="w-full max-w-6xl mx-auto text-center px-4">
            <p>&copy; 2025 GestãoRO. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
