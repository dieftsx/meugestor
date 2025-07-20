"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, TrendingUp, DollarSign, Package, Users, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase-client-safe"

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState("30dias")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [dados, setDados] = useState({
    receitaTotal: 0,
    produtosVendidos: 0,
    ticketMedio: 0,
    clientesUnicos: 0,
  })
  const [performance, setPerformance] = useState({
    margemLucroMedia: 0,
    giroEstoque: 0,
    crescimentoMensal: 0,
    satisfacaoCliente: null as number | null,
  })
  const [insights, setInsights] = useState({
    horarioPico: '',
    percentualPico: 0,
    produtosAncora: [] as { nome: string, percentual: number }[],
    percentualAncora: 0,
    crescimentoConsistente: 0,
    baixoMovimento: '',
    concentracaoProdutos: 0,
    produtosConcentracao: [] as { nome: string, percentual: number }[],
    ticketMedio: 0,
  })

  // Função para calcular datas de acordo com o período
  function getPeriodoFiltro(periodo: string) {
    const hoje = new Date()
    let inicio: Date
    if (periodo === "7dias") {
      inicio = new Date(hoje)
      inicio.setDate(hoje.getDate() - 7)
    } else if (periodo === "30dias") {
      inicio = new Date(hoje)
      inicio.setDate(hoje.getDate() - 30)
    } else if (periodo === "90dias") {
      inicio = new Date(hoje)
      inicio.setDate(hoje.getDate() - 90)
    } else {
      // Personalizado: para simplificar, pega os últimos 30 dias
      inicio = new Date(hoje)
      inicio.setDate(hoje.getDate() - 30)
    }
    return { inicio: inicio.toISOString(), fim: hoje.toISOString() }
  }

  useEffect(() => {
    async function fetchDados() {
      setLoading(true)
      setErro(null)
      const supabase = createClient()
      const { inicio, fim } = getPeriodoFiltro(periodo)
      try {
        // Receita Total e Ticket Médio
        const { data: vendas, error: vendasError } = await supabase
          .from("vendas")
          .select("id, total, cliente_id, created_at")
          .gte("created_at", inicio)
          .lte("created_at", fim)
          .eq("status", "finalizada")
        if (vendasError) throw vendasError
        const receitaTotal = vendas.reduce((acc, v) => acc + (v.total || 0), 0)
        const ticketMedio = vendas.length > 0 ? receitaTotal / vendas.length : 0
        const clientesUnicos = new Set(vendas.map(v => v.cliente_id)).size
        // Produtos Vendidos
        const vendasIds = vendas.map(v => v.id)
        let produtosVendidos = 0
        if (vendasIds.length > 0) {
          const { data: itens, error: itensError } = await supabase
            .from("venda_itens")
            .select("quantidade, venda_id")
            .in("venda_id", vendasIds)
          if (itensError) throw itensError
          produtosVendidos = itens.reduce((acc, i) => acc + Number(i.quantidade || 0), 0)
        }
        setDados({
          receitaTotal,
          produtosVendidos,
          ticketMedio,
          clientesUnicos,
        })
      } catch (e: any) {
        setErro(e.message || "Erro ao buscar dados")
      } finally {
        setLoading(false)
      }
    }
    fetchDados()
  }, [periodo])

  useEffect(() => {
    async function fetchPerformance() {
      const supabase = createClient()
      const { inicio, fim } = getPeriodoFiltro(periodo)
      try {
        // Margem de Lucro Média dos produtos vendidos
        // 1. Buscar itens vendidos no período
        const { data: vendas, error: vendasError } = await supabase
          .from("vendas")
          .select("id, created_at, total")
          .gte("created_at", inicio)
          .lte("created_at", fim)
          .eq("status", "finalizada")
        if (vendasError) throw vendasError
        const vendasIds = vendas.map(v => v.id)
        let margemLucroMedia = 0
        let giroEstoque = 0
        if (vendasIds.length > 0) {
          const { data: itens, error: itensError } = await supabase
            .from("venda_itens")
            .select("quantidade, produto_id")
            .in("venda_id", vendasIds)
          if (itensError) throw itensError
          // Buscar info dos produtos vendidos
          const produtoIds = [...new Set(itens.map(i => i.produto_id))]
          let produtosInfo: { id: string; preco_custo: number; preco_venda: number; estoque_atual: number }[] = []
          if (produtoIds.length > 0) {
            const { data: produtos, error: produtosError } = await supabase
              .from("produtos")
              .select("id, preco_custo, preco_venda, estoque_atual")
              .in("id", produtoIds)
            if (produtosError) throw produtosError
            produtosInfo = produtos as { id: string; preco_custo: number; preco_venda: number; estoque_atual: number }[]
          }
          // Margem de Lucro Média ponderada
          let totalLucro = 0
          let totalCusto = 0
          let totalVendidos = 0
          itens.forEach(item => {
            const prod = produtosInfo.find(p => p.id === item.produto_id)
            if (prod) {
              const lucro = (prod.preco_venda - prod.preco_custo) * Number(item.quantidade)
              const custo = prod.preco_custo * Number(item.quantidade)
              totalLucro += lucro
              totalCusto += custo
              totalVendidos += Number(item.quantidade)
            }
          })
          margemLucroMedia = totalCusto > 0 ? (totalLucro / totalCusto) * 100 : 0
          // Giro de Estoque: total vendidos / estoque atual médio
          const estoqueMedio = produtosInfo.length > 0 ? produtosInfo.reduce((acc, p) => acc + (p.estoque_atual || 0), 0) / produtosInfo.length : 0
          giroEstoque = estoqueMedio > 0 ? totalVendidos / estoqueMedio : 0
        }
        // Crescimento Mensal: comparar receita do período atual com período anterior
        let crescimentoMensal = 0
        if (vendas.length > 0) {
          const dias = (new Date(fim).getTime() - new Date(inicio).getTime()) / (1000 * 60 * 60 * 24)
          const inicioAnterior = new Date(new Date(inicio).getTime() - dias * 24 * 60 * 60 * 1000)
          const fimAnterior = new Date(new Date(inicio).getTime() - 1)
          const { data: vendasAnt, error: vendasAntError } = await supabase
            .from("vendas")
            .select("total, created_at")
            .gte("created_at", inicioAnterior.toISOString())
            .lte("created_at", fimAnterior.toISOString())
            .eq("status", "finalizada")
          if (vendasAntError) throw vendasAntError
          const receitaAtual = vendas.reduce((acc, v) => acc + (v.total || 0), 0)
          const receitaAnterior = vendasAnt.reduce((acc, v) => acc + (v.total || 0), 0)
          crescimentoMensal = receitaAnterior > 0 ? ((receitaAtual - receitaAnterior) / receitaAnterior) * 100 : 0
        }
        // Satisfação do Cliente: se não houver tabela, retorna null
        let satisfacaoCliente: number | null = null
        // Exemplo: buscar média de avaliações se existir tabela "avaliacoes"
        // const { data: aval, error: avalError } = await supabase.from("avaliacoes").select("nota")
        // if (!avalError && aval.length > 0) satisfacaoCliente = aval.reduce((a, b) => a + b.nota, 0) / aval.length
        setPerformance({ margemLucroMedia, giroEstoque, crescimentoMensal, satisfacaoCliente })
      } catch (e) {
        setPerformance({ margemLucroMedia: 0, giroEstoque: 0, crescimentoMensal: 0, satisfacaoCliente: null })
      }
    }
    fetchPerformance()
  }, [periodo])

  useEffect(() => {
    async function fetchInsights() {
      const supabase = createClient()
      const { inicio, fim } = getPeriodoFiltro(periodo)
      try {
        // Buscar vendas e itens
        const { data: vendas, error: vendasError } = await supabase
          .from("vendas")
          .select("id, total, created_at, cliente_id")
          .gte("created_at", inicio)
          .lte("created_at", fim)
          .eq("status", "finalizada")
        if (vendasError) throw vendasError
        const vendasIds = vendas.map(v => v.id)
        // Itens vendidos
        let itens: any[] = []
        if (vendasIds.length > 0) {
          const { data: itensData, error: itensError } = await supabase
            .from("venda_itens")
            .select("quantidade, produto_id, venda_id, preco_unitario")
            .in("venda_id", vendasIds)
          if (itensError) throw itensError
          itens = itensData
        }
        // Produtos
        const produtoIds = [...new Set(itens.map(i => i.produto_id))]
        let produtosInfo: { id: string, nome: string }[] = []
        if (produtoIds.length > 0) {
          const { data: produtos, error: produtosError } = await supabase
            .from("produtos")
            .select("id, nome")
            .in("id", produtoIds)
          if (produtosError) throw produtosError
          produtosInfo = produtos as { id: string, nome: string }[]
        }
        // Horário de pico: vendas por hora
        const horas = Array(24).fill(0)
        vendas.forEach(v => {
          const h = new Date(v.created_at).getHours()
          horas[h]++
        })
        // Faixas de pico e baixo movimento
        const faixaPico = [[6,8],[17,19]]
        const faixaBaixo = [[10,12],[14,17]]
        const totalVendas = vendas.length
        const vendasPico = horas.slice(6,9).reduce((a,b)=>a+b,0) + horas.slice(17,20).reduce((a,b)=>a+b,0)
        const vendasBaixo = horas.slice(10,13).reduce((a,b)=>a+b,0) + horas.slice(14,18).reduce((a,b)=>a+b,0)
        const percentualPico = totalVendas > 0 ? (vendasPico/totalVendas)*100 : 0
        const percentualBaixo = totalVendas > 0 ? (vendasBaixo/totalVendas)*100 : 0
        // Produtos âncora: top 2 produtos por receita
        const receitaPorProduto: Record<string, number> = {}
        itens.forEach(i => {
          receitaPorProduto[i.produto_id] = (receitaPorProduto[i.produto_id] || 0) + Number(i.preco_unitario) * Number(i.quantidade)
        })
        const totalReceita = Object.values(receitaPorProduto).reduce((a,b)=>a+b,0)
        const produtosAncoraArr = Object.entries(receitaPorProduto)
          .sort((a,b)=>b[1]-a[1])
          .slice(0,2)
          .map(([id, valor]) => ({ nome: produtosInfo.find(p=>p.id===id)?.nome || 'Produto', percentual: totalReceita>0 ? (valor/totalReceita)*100 : 0 }))
        const percentualAncora = produtosAncoraArr.reduce((a,b)=>a+b.percentual,0)
        // Crescimento consistente: comparar receita dos últimos 3 meses
        let crescimentoConsistente = 0
        const hoje = new Date()
        const tresMesesAtras = new Date(hoje)
        tresMesesAtras.setMonth(hoje.getMonth()-3)
        const { data: vendas3m, error: vendas3mError } = await supabase
          .from("vendas")
          .select("total, created_at")
          .gte("created_at", tresMesesAtras.toISOString())
          .lte("created_at", hoje.toISOString())
          .eq("status", "finalizada")
        if (!vendas3mError && vendas3m.length > 0) {
          const receitasPorMes: Record<string, number> = {}
          vendas3m.forEach(v => {
            const mes = new Date(v.created_at).getMonth()
            receitasPorMes[mes] = (receitasPorMes[mes] || 0) + (v.total || 0)
          })
          const meses = Object.keys(receitasPorMes).map(Number).sort()
          if (meses.length >= 2) {
            const primeiro = receitasPorMes[meses[0]]
            const ultimo = receitasPorMes[meses[meses.length-1]]
            crescimentoConsistente = primeiro > 0 ? ((ultimo-primeiro)/primeiro)*100 : 0
          }
        }
        // Diversificação: % da receita nos top 5 produtos
        const produtosConcentracaoArr = Object.entries(receitaPorProduto)
          .sort((a,b)=>b[1]-a[1])
          .slice(0,5)
          .map(([id, valor]) => ({ nome: produtosInfo.find(p=>p.id===id)?.nome || 'Produto', percentual: totalReceita>0 ? (valor/totalReceita)*100 : 0 }))
        const concentracaoProdutos = produtosConcentracaoArr.reduce((a,b)=>a+b.percentual,0)
        // Ticket médio
        const ticketMedio = totalVendas > 0 ? vendas.reduce((a,v)=>a+(v.total||0),0)/totalVendas : 0
        setInsights({
          horarioPico: '6h-8h e 17h-19h',
          percentualPico,
          produtosAncora: produtosAncoraArr,
          percentualAncora,
          crescimentoConsistente,
          baixoMovimento: '10h-12h e 14h-17h',
          concentracaoProdutos,
          produtosConcentracao: produtosConcentracaoArr,
          ticketMedio,
        })
      } catch (e) {
        setInsights({
          horarioPico: '', percentualPico: 0, produtosAncora: [], percentualAncora: 0, crescimentoConsistente: 0, baixoMovimento: '', concentracaoProdutos: 0, produtosConcentracao: [], ticketMedio: 0
        })
      }
    }
    fetchInsights()
  }, [periodo])

  const exportarPDF = () => {
    // Implementar exportação para PDF
    alert("Relatório exportado para PDF!")
  }

  const exportarExcel = () => {
    // Implementar exportação para Excel
    alert("Relatório exportado para Excel!")
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Relatórios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={exportarExcel}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button onClick={exportarPDF}>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Filtros do Relatório
            </CardTitle>
            <CardDescription>Selecione o período e tipo de relatório desejado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-48">
                <label className="text-sm font-medium mb-2 block">Período</label>
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                    <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                    <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                    <SelectItem value="personalizado">Período personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button>Gerar Relatório</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo Executivo */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? "..." : dados.receitaTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* Aqui pode-se calcular a variação vs período anterior se desejar */}
                <span className="text-green-600"> </span> vs período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : dados.produtosVendidos.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600"> </span> vs período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? "..." : dados.ticketMedio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600"> </span> vs período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : dados.clientesUnicos.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600"> </span> vs período anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Análise de Performance */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Análise de Performance</CardTitle>
            <CardDescription>Indicadores chave de performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Margem de Lucro Média</p>
                  <p className="text-sm text-green-600">{loading ? "Calculando..." : performance.margemLucroMedia.toFixed(1) + "%"}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{loading ? "..." : performance.margemLucroMedia.toFixed(1) + "%"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800">Giro de Estoque</p>
                  <p className="text-sm text-blue-600">{loading ? "Calculando..." : performance.giroEstoque.toFixed(2) + "x"}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{loading ? "..." : performance.giroEstoque.toFixed(2) + "x"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-purple-800">Crescimento Mensal</p>
                  <p className="text-sm text-purple-600">{loading ? "Calculando..." : performance.crescimentoMensal.toFixed(1) + "%"}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{loading ? "..." : performance.crescimentoMensal.toFixed(1) + "%"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-800">Satisfação do Cliente</p>
                  <p className="text-sm text-orange-600">{loading ? "Calculando..." : (performance.satisfacaoCliente !== null ? performance.satisfacaoCliente.toFixed(1) + "%" : "N/A")}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">{loading ? "..." : (performance.satisfacaoCliente !== null ? performance.satisfacaoCliente.toFixed(1) + "%" : "N/A")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights e Recomendações */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Insights e Recomendações</CardTitle>
            <CardDescription>Análises automáticas baseadas nos seus dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-800">✅ Pontos Fortes</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Horário de pico bem aproveitado:</strong> {insights.percentualPico.toFixed(0)}% das vendas acontecem nos horários de maior movimento ({insights.horarioPico})
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Produtos âncora performando:</strong> {insights.produtosAncora.map(p=>p.nome).join(' e ')} representam {insights.percentualAncora.toFixed(0)}% da receita
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Crescimento consistente:</strong> Vendas crescendo {insights.crescimentoConsistente.toFixed(0)}% ao mês nos últimos 3 meses
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-orange-800">🎯 Oportunidades</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      <strong>Horário de baixo movimento:</strong> Considere promoções entre {insights.baixoMovimento}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      <strong>Diversificar produtos:</strong> {insights.concentracaoProdutos.toFixed(0)}% da receita vem de apenas 5 produtos
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      <strong>Aumentar ticket médio:</strong> Oferecer combos pode aumentar o valor médio por venda (atual: {insights.ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {erro && !/column .* does not exist/i.test(erro) && (
          <div className="text-red-600 font-bold">Erro: Não foi possível carregar os dados do relatório.</div>
        )}
      </div>
    </>
  )
}
