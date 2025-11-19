// import { createServerClient } from "@/lib/supabase/server"
// import { AdminStats } from "@/components/admin/admin-stats"
// import { AdminCharts } from "@/components/admin/admin-charts"
// import { RecentActivity } from "@/components/admin/recent-activity"
// import { SystemHealth } from "@/components/admin/system-health"

// export default async function AdminDashboard() {
//   const supabase = await createServerClient()

//   // Fetch dashboard data
//   const [{ count: totalUsers }, { count: totalTransactions }, { data: recentTransactions }] = await Promise.all([
//     supabase.from("user_profiles").select("*", { count: "exact", head: true }),
//     supabase.from("transactions").select("*", { count: "exact", head: true }),
//     supabase
//       .from("transactions")
//       .select(`
//         *,
//         user_profiles!transactions_user_id_fkey(full_name)
//       `)
//       .order("created_at", { ascending: false })
//       .limit(10),
//   ])

//   return (
//     <div className="space-y-8">
//       {/* Welcome Section */}
//       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-12">
//         <div className="relative z-10">
//           <h1 className="text-3xl font-bold text-white mb-2">Welcome to Finovo Admin</h1>
//           <p className="text-blue-100 text-lg">
//             Monitor and manage your banking platform with powerful insights and controls.
//           </p>
//         </div>
//         <div className="absolute inset-0 bg-black/10"></div>
//         <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10"></div>
//         <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5"></div>
//       </div>

//       {/* Stats */}
//       <AdminStats totalUsers={totalUsers || 0} totalTransactions={totalTransactions || 0} />

//       {/* Charts and Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <AdminCharts />
//         <RecentActivity transactions={recentTransactions || []} />
//       </div>

//       {/* System Health */}
//       <SystemHealth />
//     </div>
//   )
// }


import { createServerClient } from "@/lib/supabase/server"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminCharts } from "@/components/admin/admin-charts"
import { RecentActivity } from "@/components/admin/recent-activity"
import { SystemHealth } from "@/components/admin/system-health"
import Script from "next/script" // ✅ Add this import

export default async function AdminDashboard() {
  const supabase = await createServerClient()

  // Fetch dashboard data
  const [
    { count: totalUsers },
    { count: totalTransactions },
    { data: recentTransactions },
  ] = await Promise.all([
    supabase.from("user_profiles").select("*", { count: "exact", head: true }),
    supabase.from("transactions").select("*", { count: "exact", head: true }),
    supabase
      .from("transactions")
      .select(`
        *,
        user_profiles!transactions_user_id_fkey(full_name)
      `)
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  return (
    <div className="space-y-8">
      {/* ✅ Razorpay Script (this is your <head><script>...</script></head> equivalent) */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />

      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-12">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Finovo Admin</h1>
          <p className="text-blue-100 text-lg">
            Monitor and manage your banking platform with powerful insights and controls.
          </p>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5"></div>
      </div>

      {/* Stats */}
      <AdminStats totalUsers={totalUsers || 0} totalTransactions={totalTransactions || 0} />

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdminCharts />
        <RecentActivity transactions={recentTransactions || []} />
      </div>

      {/* System Health */}
      <SystemHealth />
    </div>
  )
}
