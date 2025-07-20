"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, DollarSign, TrendingUp, AlertTriangle, Crown } from "lucide-react"

export default function AdminPage() {
  const usuarios = [
    {
      id: 1,
      nome: "José Silva",
      empresa: "Padaria São José",
      cidade: "Ji-Paraná",
      status: "ativo",
      plano: "completo",
      receita: 39,
    },
    {
      id: 2,
      nome: "Maria Santos",
      empresa: "Açougue Central",
      cidade: "Porto Velho",
      status: "ativo",
      plano: "completo",
      receita: 39,
    },
    {
      id: 3,
      nome: "João Costa",
      empresa: "Loja da Maria",
      cidade: "Ariquemes",
      status: "trial",
      plano: "trial",
      receita: 0,
    },
    {
      id: 4,
      nome: "Ana Oliveira",
      empresa: "Farmácia Popular",
      cidade: "Cacoal",
      status: "cancelado",
      plano: "cancelado",
      receita: 0,
    },
  ]

  const metricas = {
    usuariosAtivos: 127,
    receitaMensal: 4953,
    novosUsuarios: 23,
    taxaConversao: 68.5,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="w-full max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-yellow-600" />
              <span className="text-xl font-bold">Admin GestãoRO</span>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800">Painel Administrativo</Badge>
          </div>
        </div>
      </header>

      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        {/* Métricas Principais */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{metricas.usuariosAtivos}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{metricas.novosUsuarios}</span> este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {metricas.receitaMensal.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15.2%</span> vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metricas.taxaConversao}%</div>
              <p className="text-xs text-muted-foreground">Trial para pago</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">3.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-1.1%</span> vs mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Usuários Cadastrados
            </CardTitle>
            <CardDescription>Gerencie todos os usuários da plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Receita Mensal</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.nome}</TableCell>
                    <TableCell>{usuario.empresa}</TableCell>
                    <TableCell>{usuario.cidade}</TableCell>
                    <TableCell>
                      {usuario.status === "ativo" && <Badge className="bg-green-100 text-green-800">Ativo</Badge>}
                      {usuario.status === "trial" && <Badge className="bg-blue-100 text-blue-800">Trial</Badge>}
                      {usuario.status === "cancelado" && <Badge variant="destructive">Cancelado</Badge>}
                    </TableCell>
                    <TableCell>
                      {usuario.plano === "completo" && (
                        <Badge className="bg-purple-100 text-purple-800">Completo</Badge>
                      )}
                      {usuario.plano === "trial" && <Badge className="bg-yellow-100 text-yellow-800">Trial</Badge>}
                      {usuario.plano === "cancelado" && <Badge variant="outline">Cancelado</Badge>}
                    </TableCell>
                    <TableCell>R$ {usuario.receita}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Ver
                        </Button>
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
