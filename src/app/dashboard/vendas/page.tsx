"use client"

import { useState } from "react"
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
import { Plus, Search, ShoppingCart, Trash2, Calculator } from "lucide-react"

export default function VendasPage() {
  const [carrinho, setCarrinho] = useState([
    { id: 1, nome: "Pão Francês", preco: 2.0, quantidade: 5, total: 10.0 },
    { id: 2, nome: "Café com Leite", preco: 4.0, quantidade: 2, total: 8.0 },
  ])

  const totalCarrinho = carrinho.reduce((sum, item) => sum + item.total, 0)

  const produtos = [
    { id: 1, nome: "Pão Francês", preco: 2.0, estoque: 150 },
    { id: 2, nome: "Pão de Açúcar", preco: 2.5, estoque: 80 },
    { id: 3, nome: "Café com Leite", preco: 4.0, estoque: 200 },
    { id: 4, nome: "Sonho de Valsa", preco: 3.0, estoque: 45 },
    { id: 5, nome: "Refrigerante Lata", preco: 4.0, estoque: 120 },
    { id: 6, nome: "Água Mineral", preco: 2.5, estoque: 200 },
  ]

  const adicionarAoCarrinho = (produto: any) => {
    const itemExistente = carrinho.find((item) => item.id === produto.id)
    if (itemExistente) {
      setCarrinho(
        carrinho.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1, total: (item.quantidade + 1) * item.preco }
            : item,
        ),
      )
    } else {
      setCarrinho([
        ...carrinho,
        {
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
          total: produto.preco,
        },
      ])
    }
  }

  const removerDoCarrinho = (id: number) => {
    setCarrinho(carrinho.filter((item) => item.id !== id))
  }

  const finalizarVenda = () => {
    alert(`Venda finalizada! Total: R$ ${totalCarrinho.toFixed(2)}`)
    setCarrinho([])
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
              <BreadcrumbPage>Vendas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Badge className="bg-green-100 text-green-800">Vendas Hoje: R$ 1.247,80</Badge>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Lista de Produtos */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Produtos Disponíveis
              </CardTitle>
              <CardDescription>Clique nos produtos para adicionar ao carrinho</CardDescription>
              <div className="flex gap-2">
                <Input placeholder="Buscar produto..." className="max-w-sm" />
                <Button variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 max-h-96 overflow-y-auto">
                {produtos.map((produto) => (
                  <div
                    key={produto.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => adicionarAoCarrinho(produto)}
                  >
                    <div>
                      <p className="font-medium">{produto.nome}</p>
                      <p className="text-sm text-gray-500">Estoque: {produto.estoque} unidades</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">R$ {produto.preco.toFixed(2)}</p>
                      <Button size="sm" className="mt-1">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Carrinho de Compras */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Carrinho de Compras
              </CardTitle>
              <CardDescription>
                {carrinho.length} {carrinho.length === 1 ? "item" : "itens"} no carrinho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {carrinho.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Carrinho vazio</p>
                ) : (
                  carrinho.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.nome}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantidade}x R$ {item.preco.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-green-600">R$ {item.total.toFixed(2)}</p>
                        <Button size="sm" variant="outline" onClick={() => removerDoCarrinho(item.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {carrinho.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold">Total:</p>
                    <p className="text-2xl font-bold text-green-600">R$ {totalCarrinho.toFixed(2)}</p>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" size="lg" onClick={finalizarVenda}>
                      <Calculator className="h-4 w-4 mr-2" />
                      Finalizar Venda
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" onClick={() => setCarrinho([])}>
                      Limpar Carrinho
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Vendas de Hoje</CardTitle>
            <CardDescription>Histórico das vendas realizadas hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horário</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>14:32</TableCell>
                  <TableCell>Pão Francês, Café com Leite</TableCell>
                  <TableCell>7 itens</TableCell>
                  <TableCell className="font-semibold text-green-600">R$ 18,00</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Concluída</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>14:28</TableCell>
                  <TableCell>Sonho de Valsa, Refrigerante</TableCell>
                  <TableCell>3 itens</TableCell>
                  <TableCell className="font-semibold text-green-600">R$ 13,00</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Concluída</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>14:15</TableCell>
                  <TableCell>Pão de Açúcar, Água Mineral</TableCell>
                  <TableCell>4 itens</TableCell>
                  <TableCell className="font-semibold text-green-600">R$ 15,00</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Concluída</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>14:02</TableCell>
                  <TableCell>Pão Francês, Café com Leite, Sonho</TableCell>
                  <TableCell>8 itens</TableCell>
                  <TableCell className="font-semibold text-green-600">R$ 22,00</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Concluída</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
