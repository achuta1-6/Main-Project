import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { SpendingInsights } from "@/components/dashboard/spending-insights"
import type { User, Account, Transaction } from "@/lib/types/database"

export default async function DashboardPage() {
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

  // Fetch user's primary account
  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", authUser.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  const primaryAccount = accounts?.[0]

  // Fetch recent transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .or(`from_account_id.eq.${primaryAccount?.id},to_account_id.eq.${primaryAccount?.id}`)
    .order("created_at", { ascending: false })
    .limit(10)

  // Mock data for spending insights (in a real app, this would be calculated from transactions)
  const spendingData = {
    monthlySpending: 2450.75,
    monthlyBudget: 3000.0,
    categories: [
      { name: "Food & Dining", amount: 680.25, percentage: 27.8, color: "#FF6B6B" },
      { name: "Shopping", amount: 520.5, percentage: 21.2, color: "#4ECDC4" },
      { name: "Transportation", amount: 340.75, percentage: 13.9, color: "#45B7D1" },
      { name: "Entertainment", amount: 280.3, percentage: 11.4, color: "#96CEB4" },
      { name: "Bills & Utilities", amount: 628.95, percentage: 25.7, color: "#FFEAA7" },
    ],
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader user={user as User} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Welcome back, {user?.first_name || "User"}!</h1>
          <p className="text-muted-foreground">Here's your financial overview</p>
        </div>

        {/* Balance Card */}
        {primaryAccount && <BalanceCard account={primaryAccount as Account} />}

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Transactions */}
        <RecentTransactions transactions={(transactions || []) as Transaction[]} />

        {/* Spending Insights */}
        <SpendingInsights {...spendingData} />
      </main>

      <MobileNav />
    </div>
  )
}
