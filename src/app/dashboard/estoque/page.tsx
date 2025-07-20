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
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

export default function EstoquePage() {
  const { user, loading } = useAuth()
  const [produtos, setProdutos] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const fetchProdutos = async () => {
      if (!user) return
      setCarregando(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      if (!error && data) {
        setProdutos(data)
      } else {
        setProdutos([])
      }
      setCarregando(false)
    }
    if (user) fetchProdutos()
  }, [user])

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

  const produtosCriticos = produtos.filter((p) => p.estoque_atual <= p.estoque_minimo).length
  const produtosBaixos = produtos.filter((p) => p.estoque_atual > p.estoque_minimo && p.estoque_atual <= p.estoque_minimo * 1.5).length
  const produtosVencimento = produtos.filter((p) => p.controla_validade && p.dias_vencimento && p.dias_vencimento < 7).length

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

        {/* Tabela de Produtos */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Produtos em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            {carregando ? (
              <p>Carregando produtos...</p>
            ) : produtos.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Nenhum produto cadastrado ainda. Clique em "Novo Produto" para começar.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Mínimo</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>{produto.categoria_id || "-"}</TableCell>
                      <TableCell>{produto.estoque_atual}</TableCell>
                      <TableCell>{produto.estoque_minimo}</TableCell>
                      <TableCell>R$ {Number(produto.preco_venda).toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(produto.estoque_atual <= produto.estoque_minimo ? "critico" : "ok", produto.estoque_atual, produto.estoque_minimo)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Alertas Importantes */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Estoque Crítico */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Ação Urgente Necessária
              </CardTitle>
            </CardHeader>
            <CardContent>
              {produtos.filter(p => p.estoque_atual <= p.estoque_minimo).length === 0 ? (
                <div className="text-red-700">Nenhum produto em estoque crítico.</div>
              ) : (
                produtos.filter(p => p.estoque_atual <= p.estoque_minimo).map((produto) => (
                  <div key={produto.id} className="space-y-2 mb-4">
                    <p className="text-red-700 font-medium">{produto.nome}</p>
                    <p className="text-sm text-red-600">Apenas {produto.estoque_atual} {produto.unidade_medida || ''} restantes</p>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Comprar Agora
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Estoque Baixo */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <TrendingDown className="h-5 w-5 mr-2" />
                Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {produtos.filter(p => p.estoque_atual > p.estoque_minimo && p.estoque_atual <= p.estoque_minimo * 1.5).length === 0 ? (
                <div className="text-orange-700">Nenhum produto com estoque baixo.</div>
              ) : (
                produtos.filter(p => p.estoque_atual > p.estoque_minimo && p.estoque_atual <= p.estoque_minimo * 1.5).map((produto) => (
                  <div key={produto.id} className="space-y-2 mb-4">
                    <p className="text-orange-700 font-medium">{produto.nome}</p>
                    <p className="text-sm text-orange-600">{produto.estoque_atual} (mín: {produto.estoque_minimo})</p>
                    <Button size="sm" variant="outline" className="border-orange-300 bg-transparent">
                      Programar Compra
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Vencimento Próximo */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Vencimento Próximo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {produtos.filter(p => p.controla_validade && p.dias_vencimento && p.dias_vencimento < 7).length === 0 ? (
                <div className="text-yellow-700">Nenhum produto com vencimento próximo.</div>
              ) : (
                produtos.filter(p => p.controla_validade && p.dias_vencimento && p.dias_vencimento < 7).map((produto) => (
                  <div key={produto.id} className="space-y-2 mb-4">
                    <p className="text-yellow-700 font-medium">{produto.nome}</p>
                    <p className="text-sm text-yellow-600">Vence em {produto.dias_vencimento} dias</p>
                    <Button size="sm" variant="outline" className="border-yellow-300 bg-transparent">
                      Fazer Promoção
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
