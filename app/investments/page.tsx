import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { PortfolioOverview } from "@/components/investments/portfolio-overview"
import { StockList } from "@/components/investments/stock-list"
import { CryptoList } from "@/components/investments/crypto-list"
import type { User, Portfolio } from "@/lib/types/database"

export default async function InvestmentsPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !authUser) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: user } = await supabase.from("users").select("*").eq("id", authUser.id).single()

  // Fetch user's portfolios
  const { data: portfolios } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", authUser.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader user={user as User} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Investments</h1>
          <p className="text-muted-foreground">Track your portfolio and market performance</p>
        </div>

        {/* Portfolio Overview */}
        <PortfolioOverview portfolios={(portfolios || []) as Portfolio[]} />

        {/* Market Data */}
        <div className="grid gap-6 md:grid-cols-2">
          <StockList />
          <CryptoList />
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
