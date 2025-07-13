"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { DollarSign, Package, TrendingUp, Users, AlertTriangle, ShoppingCart, Calendar, Clock } from "lucide-react"

export default function DashboardPage() {
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
              <div className="text-2xl font-bold text-green-600">R$ 1.247,80</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> vs ontem
              </p>
              <div className="mt-2">
                <Progress value={75} className="h-2" />
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
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> vs ontem
              </p>
              <div className="mt-2">
                <Progress value={68} className="h-2" />
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
              <div className="text-2xl font-bold text-blue-600">R$ 14,02</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+R$ 1,20</span> vs ontem
              </p>
              <div className="mt-2">
                <Progress value={82} className="h-2" />
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
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15</span> vs ontem
              </p>
              <div className="mt-2">
                <Progress value={59} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Meta: 150 clientes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Produtos Mais Vendidos */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>🔥 Produtos Mais Vendidos Hoje</CardTitle>
              <CardDescription>Acompanhe o desempenho dos seus produtos em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Pão Francês</p>
                      <p className="text-sm text-gray-500">67 unidades • R$ 2,00 cada</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">R$ 134,00</p>
                    <p className="text-xs text-gray-500">Margem: 65%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Café com Leite</p>
                      <p className="text-sm text-gray-500">43 unidades • R$ 4,00 cada</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">R$ 172,00</p>
                    <p className="text-xs text-gray-500">Margem: 78%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Sonho de Valsa</p>
                      <p className="text-sm text-gray-500">28 unidades • R$ 3,00 cada</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-600">R$ 84,00</p>
                    <p className="text-xs text-gray-500">Margem: 55%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Refrigerante Lata</p>
                      <p className="text-sm text-gray-500">31 unidades • R$ 4,00 cada</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">R$ 124,00</p>
                    <p className="text-xs text-gray-500">Margem: 45%</p>
                  </div>
                </div>
              </div>
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
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-800">Estoque Crítico</p>
                    <p className="text-sm text-red-600">Farinha de Trigo: apenas 2 sacos</p>
                    <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
                      Comprar Agora
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <Clock className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-orange-800">Produtos Vencendo</p>
                    <p className="text-sm text-orange-600">8 litros de leite vencem em 2 dias</p>
                    <Button size="sm" variant="outline" className="mt-2 border-orange-300 bg-transparent">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">Oportunidade</p>
                    <p className="text-sm text-blue-600">Sonhos vendem 40% mais às 15h</p>
                    <Button size="sm" variant="outline" className="mt-2 border-blue-300 bg-transparent">
                      Programar Produção
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Calendar className="h-4 w-4 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">Meta Atingida!</p>
                    <p className="text-sm text-green-600">Vendas de café superaram a meta</p>
                    <Badge className="mt-2 bg-green-600">Parabéns! 🎉</Badge>
                  </div>
                </div>
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
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-lg font-bold text-blue-600">6h-8h</p>
                <p className="text-sm text-blue-700 font-medium">Pico Manhã</p>
                <p className="text-xs text-gray-600">156 clientes</p>
                <p className="text-xs text-green-600 font-medium">R$ 624,00</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-600">8h-10h</p>
                <p className="text-sm text-gray-700">Movimento Normal</p>
                <p className="text-xs text-gray-600">45 clientes</p>
                <p className="text-xs text-gray-600">R$ 180,00</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-600">10h-12h</p>
                <p className="text-sm text-gray-700">Movimento Baixo</p>
                <p className="text-xs text-gray-600">23 clientes</p>
                <p className="text-xs text-gray-600">R$ 92,00</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-lg font-bold text-green-600">12h-14h</p>
                <p className="text-sm text-green-700 font-medium">Pico Almoço</p>
                <p className="text-xs text-gray-600">89 clientes</p>
                <p className="text-xs text-green-600 font-medium">R$ 356,00</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-600">14h-17h</p>
                <p className="text-sm text-gray-700">Movimento Baixo</p>
                <p className="text-xs text-gray-600">31 clientes</p>
                <p className="text-xs text-gray-600">R$ 124,00</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-lg font-bold text-orange-600">17h-19h</p>
                <p className="text-sm text-orange-700 font-medium">Pico Tarde</p>
                <p className="text-xs text-gray-600">67 clientes</p>
                <p className="text-xs text-orange-600 font-medium">R$ 268,00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
