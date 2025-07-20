"use client"

import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import { Loader2 } from "lucide-react"

export default function PerfilPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [carregando, setCarregando] = useState(true)
  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      setCarregando(true)
      const supabase = createClient()
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      if (!error && data) {
        setProfile(data)
      }
      setCarregando(false)
    }
    if (user) fetchProfile()
  }, [user])

  // Função para upload de imagem no Supabase Storage
  const uploadImage = async (file: File, pathPrefix: string) => {
    if (!user) throw new Error("Usuário não autenticado.")
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const filePath = `${pathPrefix}-${user.id}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true })
    if (error) throw new Error("Erro ao fazer upload da imagem: " + error.message)
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath)
    if (!urlData?.publicUrl) throw new Error("Não foi possível obter o link público da imagem.")
    return urlData.publicUrl
  }

  // Handler para selecionar avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setAvatarFile(file)
    if (file) {
      setAvatarPreview(URL.createObjectURL(file))
    } else {
      setAvatarPreview(null)
    }
  }
  // Handler para selecionar logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setLogoFile(file)
    if (file) {
      setLogoPreview(URL.createObjectURL(file))
    } else {
      setLogoPreview(null)
    }
  }

  // Handler para salvar alterações
  const salvarAlteracoes = async () => {
    if (!user) return
    setSalvando(true)
    setUploading(true)
    let avatar_url = profile.avatar_url
    let logo_url = profile.logo_url
    try {
      if (avatarFile) {
        avatar_url = await uploadImage(avatarFile, "avatar")
      }
      if (logoFile) {
        logo_url = await uploadImage(logoFile, "logo")
      }
      setUploading(false)
      const supabase = createClient()
      await supabase.from("profiles").update({
        nome_completo: profile.nome_completo,
        telefone: profile.telefone,
        nome_empresa: profile.nome_empresa,
        cnpj: profile.cnpj,
        cidade: profile.cidade,
        endereco: profile.endereco,
        horarios_funcionamento: profile.horarios_funcionamento,
        avatar_url,
        logo_url,
      }).eq("id", user.id)
      setEditando(false)
      setAvatarFile(null)
      setLogoFile(null)
      setAvatarPreview(null)
      setLogoPreview(null)
      // Atualiza perfil após salvar
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(data)
      alert("Alterações salvas com sucesso!")
    } catch (err: any) {
      setUploading(false)
      alert(err.message || "Erro ao salvar alterações")
    }
    setSalvando(false)
  }

  // Handler para campos editáveis
  const handleChange = (e: any) => {
    setProfile({ ...profile, [e.target.id]: e.target.value })
  }

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
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Perfil da Empresa</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatarPreview || profile?.avatar_url || "/placeholder.svg?height=64&width=64"} alt={profile?.nome_completo || "Usuário"} />
                  <AvatarFallback>
                    {profile?.nome_completo ? profile.nome_completo.split(" ").map((n: string) => n[0]).join("") : "U"}
                  </AvatarFallback>
                </Avatar>
                {editando && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute left-0 top-0 w-16 h-16 opacity-0 cursor-pointer"
                      title="Trocar avatar"
                      onChange={handleAvatarChange}
                    />
                    <div className="absolute left-0 top-0 w-16 h-16 flex items-center justify-center pointer-events-none">
                      {uploading ? (
                        <Loader2 className="h-6 w-6 text-white bg-black/60 rounded-full p-1 animate-spin" />
                      ) : (
                        <Camera className="h-6 w-6 text-white bg-black/60 rounded-full p-1" />
                      )}
                    </div>
                  </>
                )}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {editando ? (
                    <Input id="nome_empresa" value={profile?.nome_empresa || ""} onChange={handleChange} />
                  ) : (
                    profile?.nome_empresa || "Empresa"
                  )}
                </CardTitle>
                <CardDescription className="text-lg">
                  Responsável: {editando ? (
                    <Input id="nome_completo" value={profile?.nome_completo || ""} onChange={handleChange} />
                  ) : (
                    profile?.nome_completo || "-"
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Logo da empresa */}
            <div className="space-y-2">
              <Label>Logo da Empresa</Label>
              <div className="relative">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Preview" className="h-20 w-auto rounded shadow border" />
                ) : profile?.logo_url ? (
                  <img src={profile.logo_url} alt="Logo da Empresa" className="h-20 w-auto rounded shadow border" />
                ) : (
                  <span className="text-gray-400">Nenhuma logo cadastrada</span>
                )}
                {editando && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute left-0 top-0 h-20 w-20 opacity-0 cursor-pointer"
                      title="Trocar logo"
                      onChange={handleLogoChange}
                    />
                    <div className="absolute left-0 top-0 h-20 w-20 flex items-center justify-center pointer-events-none">
                      {uploading ? (
                        <Loader2 className="h-7 w-7 text-white bg-black/60 rounded-full p-1 animate-spin" />
                      ) : (
                        <Camera className="h-7 w-7 text-white bg-black/60 rounded-full p-1" />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            {carregando ? (
              <p>Carregando dados...</p>
            ) : profile ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    {editando ? (
                      <Input id="telefone" value={profile.telefone || ""} onChange={handleChange} />
                    ) : (
                      <Input value={profile.telefone || ""} disabled />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user?.email || ""} disabled />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    {editando ? (
                      <Input id="cnpj" value={profile.cnpj || ""} onChange={handleChange} />
                    ) : (
                      <Input value={profile.cnpj || ""} disabled />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    {editando ? (
                      <Input id="cidade" value={profile.cidade || ""} onChange={handleChange} />
                    ) : (
                      <Input value={profile.cidade || ""} disabled />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  {editando ? (
                    <Input id="endereco" value={profile.endereco || ""} onChange={handleChange} />
                  ) : (
                    <Input value={profile.endereco || ""} disabled />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Horários de Funcionamento</Label>
                  {editando ? (
                    <Input id="horarios_funcionamento" value={profile.horarios_funcionamento || ""} onChange={handleChange} />
                  ) : (
                    <Input value={profile.horarios_funcionamento || ""} disabled />
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  {editando ? (
                    <>
                      <Button onClick={salvarAlteracoes} disabled={salvando || uploading}>{salvando || uploading ? "Salvando..." : "Salvar"}</Button>
                      <Button variant="outline" onClick={() => setEditando(false)} disabled={salvando}>Cancelar</Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditando(true)}>Editar Perfil</Button>
                  )}
                </div>
              </>
            ) : (
              <p>Não foi possível carregar os dados do perfil.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
} 