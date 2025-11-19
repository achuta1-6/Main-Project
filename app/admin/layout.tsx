// import type React from "react"
// import { createServerClient } from "@/lib/supabase/server"
// import { redirect } from "next/navigation"
// import { AdminSidebar } from "@/components/admin/admin-sidebar"
// import { AdminHeader } from "@/components/admin/admin-header"

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const supabase = await createServerClient()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (!user) {
//     redirect("/auth/login")
//   }

//   // Check if user is admin (you can modify this logic based on your needs)
//   const { data: profile } = await supabase.from("user_profiles").select("role").eq("user_id", user.id).single()

//   if (profile?.role !== "admin") {
//     redirect("/dashboard")
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       <AdminSidebar />
//       <div className="lg:pl-72">
//         <AdminHeader />
//         <main className="py-8">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
//         </main>
//       </div>
//     </div>
//   )
// }


import type React from "react"
import Script from "next/script" // ✅ add this
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin (you can modify this logic based on your needs)
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* ✅ Correct way to add Razorpay script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />

      <AdminSidebar />
      <div className="lg:pl-72">
        <AdminHeader />
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

