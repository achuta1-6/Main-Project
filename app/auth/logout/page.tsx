"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleLogout = async () => {
      await supabase.auth.signOut()
      router.push("/")
    }

    handleLogout()
  }, [router, supabase.auth])

  const handleManualLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Signing Out</CardTitle>
          <CardDescription>
            Please wait while we sign you out securely...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">
            If you're not redirected automatically, click the button below.
          </p>
          <Button onClick={handleManualLogout} variant="outline">
            Sign Out Manually
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
