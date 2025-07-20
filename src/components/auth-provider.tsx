
"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("Supabase configuration missing")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const getUser = async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession()

          console.log("Initial session check:", session?.user?.email || "No user")
          setUser(session?.user ?? null)
          setLoading(false)
        } catch (err) {
          console.error("Error getting session:", err)
          setError("Failed to get user session")
          setLoading(false)
        }
      }

      getUser()

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email || "No user")
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Redirecionar após signOut
        if (event === "SIGNED_OUT") {
          console.log("User signed out, redirecting to login")
          try {
            router.push("/login")
          } catch (routerError) {
            console.log("Router failed in SIGNED_OUT, using window.location")
            window.location.href = "/login"
          }
        }
      })

      return () => subscription.unsubscribe()
    } catch (err) {
      console.error("Error initializing Supabase:", err)
      setError("Failed to initialize authentication")
      setLoading(false)
    }
  }, [router])

  const signOut = async () => {
    try {
      console.log("Starting signOut process...")
      const supabase = createClient()
      
      // Limpar estado imediatamente
      setUser(null)
      setLoading(false)
      
      // Fazer signOut no Supabase
      await supabase.auth.signOut()
      
      console.log("SignOut completed, redirecting to login...")
      
      // Tentar redirecionar com router primeiro
      try {
        router.push("/login")
      } catch (routerError) {
        console.log("Router failed, using window.location")
        window.location.href = "/login"
      }
      
    } catch (err) {
      console.error("Error signing out:", err)
      // Mesmo com erro, tentar redirecionar
      try {
        router.push("/login")
      } catch (routerError) {
        window.location.href = "/login"
      }
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Configuration Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-gray-600">
            Please check your environment variables:
            <br />- NEXT_PUBLIC_SUPABASE_URL
            <br />- NEXT_PUBLIC_SUPABASE_ANON_KEY
          </p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>
}
