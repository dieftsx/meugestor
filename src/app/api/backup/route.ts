
import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all user data
    const [produtos, vendas, clientes] = await Promise.all([
      supabase.from("produtos").select("*").eq("user_id", session.user.id),
      supabase.from("vendas").select("*").eq("user_id", session.user.id),
      supabase.from("clientes").select("*").eq("user_id", session.user.id),
    ])

    const backupData = {
      timestamp: new Date().toISOString(),
      user_id: session.user.id,
      data: {
        produtos: produtos.data || [],
        vendas: vendas.data || [],
        clientes: clientes.data || [],
      },
    }

    // Store backup
    const { error } = await supabase.from("backups").insert({
      user_id: session.user.id,
      backup_data: backupData,
      created_at: new Date().toISOString(),
    })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Backup criado com sucesso",
      timestamp: backupData.timestamp,
    })
  } catch (error) {
    console.error("Backup error:", error)
    return NextResponse.json({ error: "Erro ao criar backup" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: backups } = await supabase
      .from("backups")
      .select("id, created_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    return NextResponse.json({ backups: backups || [] })
  } catch (error) {
    console.error("Get backups error:", error)
    return NextResponse.json({ error: "Erro ao buscar backups" }, { status: 500 })
  }
}
