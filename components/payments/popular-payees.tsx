"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Zap, Wifi, CreditCard, Home, Shield } from "lucide-react"

interface PopularPayeesProps {
  onSelectPayee: (payee: { name: string; category: string }) => void
}

const popularPayees = [
  {
    name: "Electric Company",
    category: "Utilities",
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    name: "Water Department",
    category: "Utilities",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "Internet Provider",
    category: "Phone/Internet",
    icon: Wifi,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    name: "Credit Card Company",
    category: "Credit Cards",
    icon: CreditCard,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    name: "Mortgage Lender",
    category: "Rent/Mortgage",
    icon: Home,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    name: "Insurance Company",
    category: "Insurance",
    icon: Shield,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
]

export function PopularPayees({ onSelectPayee }: PopularPayeesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Popular Payees</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {popularPayees.map((payee) => {
            const Icon = payee.icon
            return (
              <Button
                key={payee.name}
                variant="ghost"
                onClick={() => onSelectPayee(payee)}
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-muted/50"
              >
                <div className={`p-3 rounded-full ${payee.bgColor}`}>
                  <Icon className={`h-6 w-6 ${payee.color}`} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{payee.name}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {payee.category}
                  </Badge>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
