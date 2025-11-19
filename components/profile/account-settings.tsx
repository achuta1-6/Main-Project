"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Account {
  id: string
  account_number: string
  account_type: string
  balance: number
  status: string
}

interface AccountSettingsProps {
  accounts: Account[]
}

export function AccountSettings({ accounts }: AccountSettingsProps) {
  const [showBalances, setShowBalances] = useState(false)

  const getAccountTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "checking":
        return "bg-blue-100 text-blue-800"
      case "savings":
        return "bg-green-100 text-green-800"
      case "credit":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Account Information</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowBalances(!showBalances)}>
            {showBalances ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showBalances ? "Hide" : "Show"} Balances
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">**** **** **** {account.account_number.slice(-4)}</p>
                    <Badge className={getAccountTypeColor(account.account_type)}>{account.account_type}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">Account #{account.account_number}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {showBalances ? `$${account.balance.toLocaleString()}` : "****"}
                </p>
                <p className="text-sm text-green-600">{account.status}</p>
              </div>
            </div>
          ))}

          {accounts.length === 0 && <div className="text-center py-8 text-gray-500">No accounts found</div>}
        </div>
      </CardContent>
    </Card>
  )
}
