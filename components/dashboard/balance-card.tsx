"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, TrendingUp, TrendingDown } from "lucide-react"
import { useState } from "react"
import type { Account } from "@/lib/types/database"

interface BalanceCardProps {
  account: Account
}

export function BalanceCard({ account }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: account.currency,
    }).format(amount)
  }

  const balanceChange = account.balance - account.available_balance
  const isPositiveChange = balanceChange >= 0

  return (
    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium opacity-90">
            {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} Account
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalance(!showBalance)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm opacity-75">****{account.account_number.slice(-4)}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm opacity-75 mb-1">Available Balance</p>
            <p className="text-3xl font-bold">{showBalance ? formatCurrency(account.available_balance) : "••••••"}</p>
          </div>

          {balanceChange !== 0 && (
            <div className="flex items-center space-x-2">
              {isPositiveChange ? (
                <TrendingUp className="h-4 w-4 text-green-300" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-300" />
              )}
              <span className="text-sm">
                {isPositiveChange ? "+" : ""}
                {formatCurrency(balanceChange)} pending
              </span>
            </div>
          )}

          <div className="text-sm opacity-75">
            <p>Total Balance: {showBalance ? formatCurrency(account.balance) : "••••••"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
