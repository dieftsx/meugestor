"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { DollarSign, Package, TrendingUp, Users, AlertTriangle, ShoppingCart, Calendar, Clock } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [vendas, setVendas] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      setCarregando(true)
      const supabase = createClient()
      const [{ data: vendasData }, { data: produtosData }, { data: clientesData }] = await Promise.all([
        supabase.from("vendas").select("*").eq("user_id", user.id),
        supabase.from("produtos").select("*").eq("user_id", user.id),
        supabase.from("clientes").select("*").eq("user_id", user.id),
      ])
      setVendas(vendasData || [])
      setProdutos(produtosData || [])
      setClientes(clientesData || [])
      setCarregando(false)
    }
    if (user) fetchData()
  }, [user])

  // Cálculos
  const vendasHoje = vendas.filter(v => new Date(v.created_at).toDateString() === new Date().toDateString())
  const totalVendasHoje = vendasHoje.reduce((sum, v) => sum + Number(v.total), 0)
  const produtosVendidosHoje = vendasHoje.length // simplificado
  const ticketMedio = vendasHoje.length > 0 ? totalVendasHoje / vendasHoje.length : 0
  const clientesAtendidosHoje = new Set(vendasHoje.map(v => v.cliente_id)).size

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            ✅ Sistema Ativo
          </Badge>
          <Button size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Nova Venda
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Resumo do Dia */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {carregando ? "..." : `R$ ${totalVendasHoje.toFixed(2)}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* Aqui pode-se comparar com ontem se desejar */}
                {vendasHoje.length === 0 && !carregando && <span className="text-gray-500">Nenhuma venda registrada hoje.</span>}
              </p>
              <div className="mt-2">
                <Progress value={vendasHoje.length > 0 ? 100 : 0} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Meta: R$ 1.500</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {carregando ? "..." : produtosVendidosHoje}
              </div>
              <p className="text-xs text-muted-foreground">
                {produtosVendidosHoje === 0 && !carregando && <span className="text-gray-500">Nenhum produto vendido hoje.</span>}
              </p>
              <div className="mt-2">
                <Progress value={produtosVendidosHoje > 0 ? 100 : 0} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Meta: 500 itens</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {carregando ? "..." : `R$ ${ticketMedio.toFixed(2)}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {ticketMedio === 0 && !carregando && <span className="text-gray-500">Sem vendas para calcular ticket médio.</span>}
              </p>
              <div className="mt-2">
                <Progress value={ticketMedio > 0 ? 100 : 0} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Meta: R$ 17,00</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {carregando ? "..." : clientesAtendidosHoje}
              </div>
              <p className="text-xs text-muted-foreground">
                {clientesAtendidosHoje === 0 && !carregando && <span className="text-gray-500">Nenhum cliente atendido hoje.</span>}
              </p>
              <div className="mt-2">
                <Progress value={clientesAtendidosHoje > 0 ? 100 : 0} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Meta: 150 clientes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>🔥 Produtos Mais Vendidos Hoje</CardTitle>
              <CardDescription>Acompanhe o desempenho dos seus produtos em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              {carregando ? (
                <p>Carregando produtos...</p>
              ) : produtos.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Sem dados para exibir.</div>
              ) : (
                <div className="space-y-4">
                  {/* Aqui você pode implementar um ranking real se desejar */}
                  {produtos.slice(0, 4).map((produto) => (
                    <div key={produto.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{produto.nome}</p>
                          <p className="text-sm text-gray-500">Estoque: {produto.estoque_atual} unidades</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">R$ {Number(produto.preco_venda).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Margem: {produto.margem_lucro ? `${produto.margem_lucro.toFixed(1)}%` : "-"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alertas e Ações */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                Alertas Importantes
              </CardTitle>
              <CardDescription>Ações que precisam da sua atenção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Estoque Crítico */}
                {produtos.filter(p => p.estoque_atual <= p.estoque_minimo).length > 0 ? (
                  produtos.filter(p => p.estoque_atual <= p.estoque_minimo).map((produto) => (
                    <div key={produto.id} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-800">Estoque Crítico</p>
                        <p className="text-sm text-red-600">{produto.nome}: apenas {produto.estoque_atual} {produto.unidade_medida || ''}</p>
                        <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">Comprar Agora</Button>
                      </div>
                    </div>
                  ))
                ) : null}
                {/* Produtos Vencendo */}
                {produtos.filter(p => p.controla_validade && p.dias_vencimento && p.dias_vencimento < 7).length > 0 ? (
                  produtos.filter(p => p.controla_validade && p.dias_vencimento && p.dias_vencimento < 7).map((produto) => (
                    <div key={produto.id} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Clock className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-orange-800">Produtos Vencendo</p>
                        <p className="text-sm text-orange-600">{produto.estoque_atual} {produto.unidade_medida || ''} de {produto.nome} vencem em {produto.dias_vencimento} dias</p>
                        <Button size="sm" variant="outline" className="mt-2 border-orange-300 bg-transparent">Ver Detalhes</Button>
                      </div>
                    </div>
                  ))
                ) : null}
                {/* Se não houver alertas */}
                {produtos.filter(p => p.estoque_atual <= p.estoque_minimo).length === 0 && produtos.filter(p => p.controla_validade && p.dias_vencimento && p.dias_vencimento < 7).length === 0 && (
                  <div className="text-gray-500 text-center">Nenhum alerta importante no momento.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Horários de Movimento */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Movimento do Dia por Horário</CardTitle>
            <CardDescription>Otimize sua equipe baseado nos horários de maior movimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              Configure os horários de funcionamento da empresa na tela de configurações para visualizar o movimento do dia.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
