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
import { useAuth } from "@/components/auth-provider"
import { useEffect } from "react"
import { createClient } from "@/lib/supabase"

export default function VendasPage() {
  const { user, loading } = useAuth()
  const [carrinho, setCarrinho] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [vendas, setVendas] = useState<any[]>([])
  const [carregandoProdutos, setCarregandoProdutos] = useState(true)
  const [carregandoVendas, setCarregandoVendas] = useState(true)

  useEffect(() => {
    const fetchProdutos = async () => {
      if (!user) return
      setCarregandoProdutos(true)
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
      setCarregandoProdutos(false)
    }
    if (user) fetchProdutos()
  }, [user])

  useEffect(() => {
    const fetchVendas = async () => {
      if (!user) return
      setCarregandoVendas(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("vendas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      if (!error && data) {
        setVendas(data)
      } else {
        setVendas([])
      }
      setCarregandoVendas(false)
    }
    if (user) fetchVendas()
  }, [user])

  const totalCarrinho = carrinho.reduce((sum, item) => sum + item.total, 0)

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
          preco: produto.preco_venda,
          quantidade: 1,
          total: produto.preco_venda,
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

  const vendasHoje = vendas.filter(v => new Date(v.created_at).toDateString() === new Date().toDateString())
  const totalVendasHoje = vendasHoje.reduce((sum, v) => sum + Number(v.total), 0)

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
          <Badge className="bg-green-100 text-green-800">
            Vendas Hoje: R$ {carregandoVendas ? "..." : totalVendasHoje.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Badge>
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
              {carregandoProdutos ? (
                <p>Carregando produtos...</p>
              ) : produtos.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Nenhum produto cadastrado ainda. Cadastre seu primeiro produto para começar a vender.
                </div>
              ) : (
                <div className="grid gap-2 max-h-96 overflow-y-auto">
                  {produtos.map((produto) => (
                    <div
                      key={produto.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => adicionarAoCarrinho(produto)}
                    >
                      <div>
                        <p className="font-medium">{produto.nome}</p>
                        <p className="text-sm text-gray-500">Estoque: {produto.estoque_atual} unidades</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">R$ {Number(produto.preco_venda).toFixed(2)}</p>
                        <Button size="sm" className="mt-1">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
            {carregandoVendas ? (
              <p>Carregando vendas...</p>
            ) : vendas.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Nenhuma venda realizada ainda. Cadastre sua primeira venda!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendas.map((venda) => (
                    <TableRow key={venda.id}>
                      <TableCell>{new Date(venda.created_at).toLocaleString("pt-BR")}</TableCell>
                      <TableCell className="font-semibold text-green-600">R$ {Number(venda.total).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{venda.status_pagamento || "Concluída"}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
