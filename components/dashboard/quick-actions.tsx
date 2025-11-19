"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, CreditCard, Plus, Smartphone, Banknote } from "lucide-react"
import Link from "next/link"

const quickActions = [
  {
    icon: ArrowUpRight,
    label: "Send Money",
    href: "/transfer",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: ArrowDownLeft,
    label: "Request",
    href: "/transfer?type=request",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: CreditCard,
    label: "Pay Bills",
    href: "/payments",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Plus,
    label: "Deposit",
    href: "/deposit",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: Smartphone,
    label: "Mobile Pay",
    href: "/mobile-pay",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    icon: Banknote,
    label: "ATM Finder",
    href: "/atm-finder",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.label} href={action.href}>
                <Button variant="ghost" className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-muted/50">
                  <div className={`p-3 rounded-full ${action.bgColor}`}>
                    <Icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <span className="text-xs font-medium text-center">{action.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
