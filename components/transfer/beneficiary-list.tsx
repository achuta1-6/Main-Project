"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MoreVertical, Edit, Trash2, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Beneficiary } from "@/lib/types/database"

interface BeneficiaryListProps {
  beneficiaries: Beneficiary[]
}

export function BeneficiaryList({ beneficiaries }: BeneficiaryListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const toggleFavorite = async (beneficiaryId: string, currentStatus: boolean) => {
    setIsLoading(beneficiaryId)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("beneficiaries")
        .update({ is_favorite: !currentStatus })
        .eq("id", beneficiaryId)

      if (error) throw error
      // In a real app, this would refresh the data
      window.location.reload()
    } catch (error) {
      console.error("Error updating favorite status:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const deleteBeneficiary = async (beneficiaryId: string) => {
    setIsLoading(beneficiaryId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("beneficiaries").delete().eq("id", beneficiaryId)

      if (error) throw error
      // In a real app, this would refresh the data
      window.location.reload()
    } catch (error) {
      console.error("Error deleting beneficiary:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (beneficiaries.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No saved recipients yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add recipients to send money quickly</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Recipients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {beneficiaries.map((beneficiary) => (
          <div key={beneficiary.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(beneficiary.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{beneficiary.name}</p>
                  {beneficiary.is_favorite && (
                    <Badge variant="secondary" className="text-red-600 bg-red-50">
                      <Heart className="h-3 w-3 mr-1 fill-current" />
                      Favorite
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">****{beneficiary.account_number.slice(-4)}</p>
                {beneficiary.bank_name && <p className="text-xs text-muted-foreground">{beneficiary.bank_name}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={() => {
                  // In a real app, this would pre-fill the transfer form
                  console.log("Transfer to:", beneficiary)
                }}
                disabled={isLoading === beneficiary.id}
                className="h-8"
              >
                <Send className="h-4 w-4 mr-1" />
                Send
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => toggleFavorite(beneficiary.id, beneficiary.is_favorite)}
                    disabled={isLoading === beneficiary.id}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    {beneficiary.is_favorite ? "Remove from Favorites" : "Add to Favorites"}
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteBeneficiary(beneficiary.id)}
                    disabled={isLoading === beneficiary.id}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
