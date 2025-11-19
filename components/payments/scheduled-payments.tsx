"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Repeat, Edit, Trash2 } from "lucide-react"
import type { Payment } from "@/lib/types/database"

interface ScheduledPaymentsProps {
  payments: Payment[]
  onEditPayment: (payment: Payment) => void
  onCancelPayment: (paymentId: string) => void
}

export function ScheduledPayments({ payments, onEditPayment, onCancelPayment }: ScheduledPaymentsProps) {
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
      year: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const scheduledPayments = payments.filter(
    (payment) => payment.payment_date && new Date(payment.payment_date) > new Date(),
  )

  const recurringPayments = payments.filter((payment) => payment.recurring)

  return (
    <div className="space-y-6">
      {/* Scheduled Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Scheduled Payments</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scheduledPayments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No scheduled payments</p>
              <p className="text-sm">Schedule payments to pay bills automatically</p>
            </div>
          ) : (
            scheduledPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                      {getInitials(payment.payee_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{payment.payee_name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Due: {formatDate(payment.payment_date!)}</span>
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
                    <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                    <Badge variant="secondary" className="text-blue-700 bg-blue-50">
                      Scheduled
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => onEditPayment(payment)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCancelPayment(payment.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recurring Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Repeat className="h-5 w-5" />
            <span>Recurring Payments</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recurringPayments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No recurring payments</p>
              <p className="text-sm">Set up recurring payments for regular bills</p>
            </div>
          ) : (
            recurringPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                      {getInitials(payment.payee_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{payment.payee_name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Every {payment.recurring_frequency}</span>
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
                    <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                    <Badge variant="secondary" className="text-green-700 bg-green-50">
                      <Repeat className="h-3 w-3 mr-1" />
                      Recurring
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => onEditPayment(payment)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCancelPayment(payment.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
