"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Shield, Database, Bell, User, Building, Download, CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase"

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(false)
  const [backupLoading, setBackupLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    estoqueBaixo: true,
    vendasDiarias: true,
    backup: true,
    promocoes: false,
  })
  const { user, signOut } = useAuth()

  // Estados para dados reais
  const [profile, setProfile] = useState<any>(null)
  const [empresa, setEmpresa] = useState<any>({})
  const [horarios, setHorarios] = useState<string>("")
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      const supabase = createClient()
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      if (!error && data) {
        setProfile(data)
        setEmpresa({
          nome_empresa: data.nome_empresa || "",
          cnpj: data.cnpj || "",
          cidade: data.cidade || "",
          endereco: data.endereco || "",
        })
        setHorarios(data.horarios_funcionamento || "")
      }
    }
    if (user) fetchProfile()
  }, [user])

  // Handlers de alteração
  const handleProfileChange = (e: any) => {
    setProfile({ ...profile, [e.target.id]: e.target.value })
  }
  const handleEmpresaChange = (e: any) => {
    setEmpresa({ ...empresa, [e.target.id]: e.target.value })
  }
  const handleHorariosChange = (e: any) => {
    setHorarios(e.target.value)
  }

  // Salvar alterações
  const salvarAlteracoes = async () => {
    if (!user) return;
    setSalvando(true)
    const supabase = createClient()
    // Atualiza profile
    await supabase.from("profiles").update({
      nome_completo: profile.nome_completo,
      telefone: profile.telefone,
      nome_empresa: empresa.nome_empresa,
      cnpj: empresa.cnpj,
      cidade: empresa.cidade,
      endereco: empresa.endereco,
      horarios_funcionamento: horarios,
    }).eq("id", user.id)
    setSalvando(false)
    alert("Alterações salvas com sucesso!")
  }

  const criarBackup = async () => {
    setBackupLoading(true)
    try {
      const response = await fetch("/api/backup", {
        method: "POST",
      })

      if (response.ok) {
        alert("Backup criado com sucesso!")
      } else {
        alert("Erro ao criar backup")
      }
    } catch (error) {
      alert("Erro ao criar backup")
    } finally {
      setBackupLoading(false)
    }
  }

  const criarCheckoutSession = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_1234567890", // ID do preço no Stripe
        }),
      })

      const { sessionId } = await response.json()

      // Redirecionar para o Stripe Checkout
      const stripe = (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      await stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      alert("Erro ao processar pagamento")
    } finally {
      setLoading(false)
    }
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
              <BreadcrumbPage>Configurações</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Status da Conta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Status da Conta
            </CardTitle>
            <CardDescription>Informações sobre sua assinatura e uso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-green-800">Plano Ativo</p>
                  <p className="text-sm text-green-600">Plano Completo</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-blue-800">Próxima Cobrança</p>
                  <p className="text-sm text-blue-600">15 de Fevereiro</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">R$ 39,00</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div>
                  <p className="font-medium text-purple-800">Produtos Cadastrados</p>
                  <p className="text-sm text-purple-600">47 de 1000</p>
                </div>
                <Badge className="bg-purple-100 text-purple-800">4.7%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>Atualize seus dados pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_completo">Nome Completo</Label>
                  <Input id="nome_completo" value={profile?.nome_completo || ""} onChange={handleProfileChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" value={profile?.telefone || ""} onChange={handleProfileChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email || ""} disabled />
              </div>

              <Button className="w-full" onClick={salvarAlteracoes} disabled={salvando}>{salvando ? "Salvando..." : "Salvar Alterações"}</Button>
            </CardContent>
          </Card>

          {/* Informações da Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Informações da Empresa
              </CardTitle>
              <CardDescription>Dados do seu negócio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome_empresa">Nome da Empresa</Label>
                <Input id="nome_empresa" value={empresa.nome_empresa || ""} onChange={handleEmpresaChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" value={empresa.cnpj || ""} onChange={handleEmpresaChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" value={empresa.cidade || ""} onChange={handleEmpresaChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" value={empresa.endereco || ""} onChange={handleEmpresaChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horarios_funcionamento">Horários de Funcionamento</Label>
                <Input id="horarios_funcionamento" value={horarios} onChange={handleHorariosChange} placeholder="Ex: 08:00-12:00, 14:00-18:00" />
              </div>

              <Button className="w-full" onClick={salvarAlteracoes} disabled={salvando}>{salvando ? "Salvando..." : "Salvar Alterações"}</Button>
            </CardContent>
          </Card>
        </div>

        {/* Pagamento e Assinatura */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Pagamento e Assinatura
            </CardTitle>
            <CardDescription>Gerencie sua assinatura e forma de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Sua assinatura está ativa e será renovada automaticamente em 15 de Fevereiro por R$ 39,00.
                </AlertDescription>
              </Alert>

              <div className="flex flex-wrap gap-4">
                <Button onClick={criarCheckoutSession} disabled={loading}>
                  {loading ? "Processando..." : "Atualizar Cartão"}
                </Button>
                <Button variant="outline">Alterar Plano</Button>
                <Button variant="outline">Histórico de Pagamentos</Button>
                <Button variant="destructive">Cancelar Assinatura</Button>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">💳 Forma de Pagamento</h4>
                <p className="text-sm text-yellow-700">Cartão terminado em ****4242 • Vence em 12/2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notificações
            </CardTitle>
            <CardDescription>Configure quando e como receber notificações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertas de Estoque Baixo</p>
                  <p className="text-sm text-gray-500">Receba avisos quando produtos estiverem acabando</p>
                </div>
                <Switch
                  checked={notifications.estoqueBaixo}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, estoqueBaixo: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Resumo Diário de Vendas</p>
                  <p className="text-sm text-gray-500">Relatório diário enviado por email às 20h</p>
                </div>
                <Switch
                  checked={notifications.vendasDiarias}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, vendasDiarias: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Backup Automático</p>
                  <p className="text-sm text-gray-500">Confirmação quando backup for realizado</p>
                </div>
                <Switch
                  checked={notifications.backup}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, backup: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Promoções e Novidades</p>
                  <p className="text-sm text-gray-500">Receba dicas e novidades do GestãoRO</p>
                </div>
                <Switch
                  checked={notifications.promocoes}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, promocoes: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup e Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Backup e Segurança
            </CardTitle>
            <CardDescription>Proteja seus dados com backups automáticos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Seus dados são automaticamente salvos a cada 24 horas. Último backup: hoje às 03:00.
                </AlertDescription>
              </Alert>

              <div className="flex flex-wrap gap-4">
                <Button onClick={criarBackup} disabled={backupLoading}>
                  {backupLoading ? "Criando..." : "Criar Backup Agora"}
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Backup
                </Button>
                <Button variant="outline">Histórico de Backups</Button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-medium text-green-800">✅ Backup Automático</p>
                  <p className="text-sm text-green-600">Ativo - Diário às 03:00</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-800">🔒 Criptografia</p>
                  <p className="text-sm text-blue-600">AES-256 - Máxima segurança</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suporte */}
        <Card>
          <CardHeader>
            <CardTitle>🆘 Precisa de Ajuda?</CardTitle>
            <CardDescription>Nossa equipe está aqui para te ajudar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">💬 WhatsApp</h4>
                <p className="text-sm text-blue-600 mb-3">(69) 99999-9999</p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Chamar no WhatsApp
                </Button>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-2">📧 Email</h4>
                <p className="text-sm text-purple-600 mb-3">suporte@gestaoro.com.br</p>
                <Button size="sm" variant="outline">
                  Enviar Email
                </Button>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-800 mb-2">📚 Central de Ajuda</h4>
                <p className="text-sm text-orange-600 mb-3">Tutoriais e guias</p>
                <Button size="sm" variant="outline">
                  Acessar Tutoriais
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <Button variant="destructive" onClick={signOut} className="w-full">
                Sair da Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
