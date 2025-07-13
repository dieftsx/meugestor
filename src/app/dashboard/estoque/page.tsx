"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Package, AlertTriangle, Plus, Search, Edit, TrendingDown, Calendar } from "lucide-react"

export default function EstoquePage() {
  const produtos = [
    {
      id: 1,
      nome: "Farinha de Trigo",
      categoria: "Ingredientes",
      estoque: 2,
      minimo: 10,
      preco: 4.5,
      status: "critico",
      ultimaCompra: "2024-01-10",
      fornecedor: "Distribuidora ABC",
    },
    {
      id: 2,
      nome: "Ovos",
      categoria: "Ingredientes",
      estoque: 3,
      minimo: 5,
      preco: 8.0,
      status: "baixo",
      ultimaCompra: "2024-01-12",
      fornecedor: "Granja São João",
    },
    {
      id: 3,
      nome: "Leite Integral",
      categoria: "Laticínios",
      estoque: 8,
      minimo: 15,
      preco: 4.2,
      status: "vencimento",
      ultimaCompra: "2024-01-11",
      fornecedor: "Laticínios RO",
    },
    {
      id: 4,
      nome: "Açúcar Cristal",
      categoria: "Ingredientes",
      estoque: 15,
      minimo: 8,
      preco: 3.8,
      status: "ok",
      ultimaCompra: "2024-01-08",
      fornecedor: "Distribuidora ABC",
    },
    {
      id: 5,
      nome: "Pão Francês",
      categoria: "Produtos Finais",
      estoque: 150,
      minimo: 50,
      preco: 2.0,
      status: "ok",
      ultimaCompra: "Produção própria",
      fornecedor: "Produção própria",
    },
    {
      id: 6,
      nome: "Refrigerante Lata",
      categoria: "Bebidas",
      estoque: 120,
      minimo: 30,
      preco: 4.0,
      status: "ok",
      ultimaCompra: "2024-01-09",
      fornecedor: "Coca-Cola RO",
    },
  ]

  const getStatusBadge = (status: string, estoque: number, minimo: number) => {
    switch (status) {
      case "critico":
        return <Badge variant="destructive">Crítico</Badge>
      case "baixo":
        return <Badge className="bg-orange-500">Baixo</Badge>
      case "vencimento":
        return <Badge className="bg-yellow-500">Vencimento</Badge>
      case "ok":
        return <Badge className="bg-green-500">OK</Badge>
      default:
        return <Badge variant="outline">-</Badge>
    }
  }

  const produtosCriticos = produtos.filter((p) => p.status === "critico").length
  const produtosBaixos = produtos.filter((p) => p.status === "baixo").length
  const produtosVencimento = produtos.filter((p) => p.status === "vencimento").length

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
              <BreadcrumbPage>Estoque</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Produto</DialogTitle>
                <DialogDescription>Cadastre um novo produto no seu estoque</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome" className="text-right">
                    Nome
                  </Label>
                  <Input id="nome" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoria" className="text-right">
                    Categoria
                  </Label>
                  <Input id="categoria" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="estoque" className="text-right">
                    Estoque
                  </Label>
                  <Input id="estoque" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minimo" className="text-right">
                    Mínimo
                  </Label>
                  <Input id="minimo" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="preco" className="text-right">
                    Preço
                  </Label>
                  <Input id="preco" type="number" step="0.01" className="col-span-3" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar Produto</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Resumo do Estoque */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{produtos.length}</div>
              <p className="text-xs text-muted-foreground">Produtos cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Crítico</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{produtosCriticos}</div>
              <p className="text-xs text-muted-foreground">Precisam de reposição urgente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{produtosBaixos}</div>
              <p className="text-xs text-muted-foreground">Abaixo do estoque mínimo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Vencimento</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{produtosVencimento}</div>
              <p className="text-xs text-muted-foreground">Vencem nos próximos dias</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Produtos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Controle de Estoque
            </CardTitle>
            <CardDescription>Gerencie todos os produtos do seu estoque</CardDescription>
            <div className="flex gap-2">
              <Input placeholder="Buscar produto..." className="max-w-sm" />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estoque Atual</TableHead>
                  <TableHead>Estoque Mínimo</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Compra</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>{produto.categoria}</TableCell>
                    <TableCell>
                      <span className={produto.estoque <= produto.minimo ? "text-red-600 font-semibold" : ""}>
                        {produto.estoque}
                      </span>
                    </TableCell>
                    <TableCell>{produto.minimo}</TableCell>
                    <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(produto.status, produto.estoque, produto.minimo)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{produto.ultimaCompra}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Alertas Importantes */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Ação Urgente Necessária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-red-700 font-medium">Farinha de Trigo</p>
                <p className="text-sm text-red-600">Apenas 2 sacos restantes</p>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Comprar Agora
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <TrendingDown className="h-5 w-5 mr-2" />
                Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-orange-700 font-medium">Ovos</p>
                <p className="text-sm text-orange-600">3 dúzias (mín: 5)</p>
                <Button size="sm" variant="outline" className="border-orange-300 bg-transparent">
                  Programar Compra
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Vencimento Próximo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-yellow-700 font-medium">Leite Integral</p>
                <p className="text-sm text-yellow-600">Vence em 2 dias</p>
                <Button size="sm" variant="outline" className="border-yellow-300 bg-transparent">
                  Fazer Promoção
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
