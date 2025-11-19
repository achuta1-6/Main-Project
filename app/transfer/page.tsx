import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { TransferForm } from "@/components/transfer/transfer-form"
import { BeneficiaryList } from "@/components/transfer/beneficiary-list"
import type { User, Account, Beneficiary } from "@/lib/types/database"

export default async function TransferPage() {
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

  // Fetch user's accounts
  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", authUser.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  // Fetch beneficiaries
  const { data: beneficiaries } = await supabase
    .from("beneficiaries")
    .select("*")
    .eq("user_id", authUser.id)
    .order("is_favorite", { ascending: false })
    .order("name", { ascending: true })

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader user={user as User} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Transfer Money</h1>
          <p className="text-muted-foreground">Send money to your accounts or other recipients</p>
        </div>

        <TransferForm
          accounts={(accounts || []) as Account[]}
          beneficiaries={(beneficiaries || []) as Beneficiary[]}
        />

        <BeneficiaryList
          beneficiaries={(beneficiaries || []) as Beneficiary[]}
        />
      </main>

      <MobileNav />
    </div>
  )
}
