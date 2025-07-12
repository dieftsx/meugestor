import { ArrowRight, BarChart3, DollarSign, Package, Users, CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MeuGestor</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/demo">
              <Button variant="ghost">Ver Demo</Button>
            </Link>
            <Button>Começar Agora</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
          ✨ Especial para Rondônia - Primeiros 100 clientes com 50% OFF
        </Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Transforme seu Negócio em Rondônia com a<span className="text-blue-600"> Gestão Completa</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Sistema completo para padarias, açougues, lojas e restaurantes. Controle estoque, vendas e financeiro em um só
          lugar.
          <strong>Aumente seus lucros em 30 dias ou seu dinheiro de volta!</strong>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="text-lg px-8 py-4">
            Começar Teste Grátis de 15 Dias
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Link href="/demo">
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
              Ver Demonstração
            </Button>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>4.9/5 estrelas</span>
          </div>
          <span>•</span>
          <span>+200 negócios em RO</span>
          <span>•</span>
          <span>Suporte local</span>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Você está perdendo dinheiro todos os dias?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A maioria dos pequenos negócios em Rondônia perde até R$ 2.000/mês por falta de controle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">❌ Sem Controle de Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">Produtos vencendo, falta de mercadoria, compras desnecessárias</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">❌ Vendas no Papel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">Não sabe qual produto vende mais, horários de pico, margem real</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">❌ Financeiro Bagunçado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">Mistura dinheiro pessoal com da empresa, não sabe o lucro real</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">A Solução Completa para seu Negócio</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Tudo que você precisa para organizar e multiplicar os lucros do seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <Package className="h-12 w-12 text-blue-200 mb-4" />
                <CardTitle>Controle de Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">Nunca mais fique sem produto ou perca por vencimento</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-green-200 mb-4" />
                <CardTitle>Vendas Inteligentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">Saiba exatamente o que vende mais e quando vende mais</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-purple-200 mb-4" />
                <CardTitle>Relatórios Claros</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">Veja seu lucro real, produtos que mais vendem e horários de pico</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <Users className="h-12 w-12 text-yellow-200 mb-4" />
                <CardTitle>Suporte Local</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">Atendimento em português, conhecendo a realidade de RO</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Resultados Reais de Clientes em Rondônia</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">Padaria São José - Ji-Paraná</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 mb-2">+35% de lucro</p>
                <p className="text-gray-600">
                  "Descobri que estava perdendo R$ 800/mês com produtos vencidos. Agora sei exatamente quando comprar."
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">Açougue Central - Porto Velho</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 mb-2">+R$ 1.200/mês</p>
                <p className="text-gray-600">
                  "Identifiquei os horários de maior movimento e ajustei minha equipe. Vendas dispararam!"
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">Loja da Maria - Ariquemes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 mb-2">+28% vendas</p>
                <p className="text-gray-600">
                  "Agora sei quais produtos investir mais. Meu estoque gira 3x mais rápido."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Preço Especial para Rondônia</h2>
            <p className="text-lg text-gray-600">Investimento que se paga em menos de 1 semana</p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="border-2 border-blue-500 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500">
                50% OFF - Primeiros 100 clientes
              </Badge>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl">Plano Completo</CardTitle>
                <CardDescription>Tudo que você precisa para crescer</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-600">R$ 39</span>
                  <span className="text-gray-500 line-through ml-2">R$ 78</span>
                  <span className="text-sm text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Controle completo de estoque</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Sistema de vendas e PDV</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Relatórios financeiros</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Suporte via WhatsApp</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Treinamento gratuito</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Garantia de 30 dias</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" size="lg">
                  Começar Agora - 15 Dias Grátis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Não Perca Mais Dinheiro Por Falta de Controle</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 200 negócios em Rondônia que já aumentaram seus lucros com o GestãoRO
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
            Começar Teste Grátis Agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-gray-400 mt-4">
            ✅ 15 dias grátis • ✅ Sem cartão de crédito • ✅ Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BarChart3 className="h-6 w-6" />
              <span className="text-xl font-bold">Meu Gestor</span>
            </div>
            <div className="text-sm text-gray-400">
              <p>Suporte: (69) 9999-9999 • contato@gestaoro.com.br</p>
              <p>Feito especialmente para pequenos negócios de Rondônia</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
