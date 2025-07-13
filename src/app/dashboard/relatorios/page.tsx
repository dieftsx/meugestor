"use client"

import { useState } from "react"
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

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState("30dias")

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
              <div className="text-2xl font-bold text-green-600">R$ 42.350</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15.2%</span> vs período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.247</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.1%</span> vs período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">R$ 33,95</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+R$ 2,15</span> vs período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">892</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.3%</span> vs período anterior
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
                  <p className="text-sm text-green-600">Muito boa performance</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">34.2%</p>
                  <Badge className="bg-green-100 text-green-800">+2.1%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800">Giro de Estoque</p>
                  <p className="text-sm text-blue-600">Estoque girando bem</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">2.8x</p>
                  <Badge className="bg-blue-100 text-blue-800">+0.3x</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-purple-800">Crescimento Mensal</p>
                  <p className="text-sm text-purple-600">Crescimento consistente</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">+15.2%</p>
                  <Badge className="bg-purple-100 text-purple-800">Excelente</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-800">Satisfação do Cliente</p>
                  <p className="text-sm text-orange-600">Baseado em retorno</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">94%</p>
                  <Badge className="bg-orange-100 text-orange-800">Ótimo</Badge>
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
                      <strong>Horário de pico bem aproveitado:</strong> 67% das vendas acontecem nos horários de maior
                      movimento (6h-8h e 17h-19h)
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Produtos âncora performando:</strong> Pão francês e café com leite representam 45% da
                      receita
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Crescimento consistente:</strong> Vendas crescendo 15% ao mês nos últimos 3 meses
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-orange-800">🎯 Oportunidades</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      <strong>Horário de baixo movimento:</strong> Considere promoções entre 10h-12h e 14h-17h
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      <strong>Diversificar produtos:</strong> 80% da receita vem de apenas 5 produtos
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      <strong>Aumentar ticket médio:</strong> Oferecer combos pode aumentar o valor médio por venda
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
