"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, CreditCard, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import type { Transaction } from "@/lib/types/database"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case "transfer":
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-purple-600" />
      default:
        return <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="text-green-700 bg-green-50">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="text-yellow-700 bg-yellow-50">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="secondary" className="text-red-700 bg-red-50">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        <Link href="/transactions">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent transactions</p>
            <p className="text-sm">Your transaction history will appear here</p>
          </div>
        ) : (
          transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-muted rounded-full">{getTransactionIcon(transaction.transaction_type)}</div>
                <div>
                  <p className="font-medium">
                    {transaction.description ||
                      `${transaction.transaction_type.charAt(0).toUpperCase()}${transaction.transaction_type.slice(1)}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.created_at)} • {getStatusBadge(transaction.status)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    transaction.transaction_type === "deposit" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.transaction_type === "deposit" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-muted-foreground">{transaction.reference_number?.slice(-6)}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
