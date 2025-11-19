import { createServerClient } from "@/lib/supabase/server"
import { UserManagement } from "@/components/admin/user-management"

export default async function AdminUsersPage() {
  const supabase = await createServerClient()

  const { data: users } = await supabase
    .from("user_profiles")
    .select(`
      *,
      accounts(*)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage user accounts, permissions, and account details.</p>
      </div>

      <UserManagement users={users || []} />
    </div>
  )
}
