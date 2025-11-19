"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Repeat, Calendar } from "lucide-react"
import Link from "next/link"
import type { Payment } from "@/lib/types/database"

interface RecentPaymentsProps {
  payments: Payment[]
}

export function RecentPayments({ payments }: RecentPaymentsProps) {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Recent Payments</CardTitle>
        <Link href="/payments/history">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent payments</p>
            <p className="text-sm">Your payment history will appear here</p>
          </div>
        ) : (
          payments.slice(0, 5).map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials(payment.payee_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{payment.payee_name}</p>
                    {payment.recurring && <Repeat className="h-3 w-3 text-muted-foreground" />}
                    {payment.payment_date && new Date(payment.payment_date) > new Date() && (
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{formatDate(payment.created_at)}</span>
                    <span>•</span>
                    {getStatusBadge(payment.status)}
                    {payment.category && (
                      <>
                        <span>•</span>
                        <span>{payment.category}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="font-semibold text-red-600">-{formatCurrency(payment.amount)}</p>
                  {payment.payment_date && new Date(payment.payment_date) > new Date() && (
                    <p className="text-xs text-muted-foreground">Scheduled</p>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Pay Again</DropdownMenuItem>
                    {payment.status === "pending" && <DropdownMenuItem>Cancel Payment</DropdownMenuItem>}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
