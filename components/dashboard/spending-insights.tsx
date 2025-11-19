"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface SpendingInsightsProps {
  monthlySpending: number
  monthlyBudget: number
  categories: Array<{
    name: string
    amount: number
    percentage: number
    color: string
  }>
}

export function SpendingInsights({ monthlySpending, monthlyBudget, categories }: SpendingInsightsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const spendingPercentage = (monthlySpending / monthlyBudget) * 100
  const remainingBudget = monthlyBudget - monthlySpending
  const isOverBudget = monthlySpending > monthlyBudget

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Spending Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Budget Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Monthly Budget</span>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(monthlySpending)} of {formatCurrency(monthlyBudget)}
            </span>
          </div>
          <Progress value={Math.min(spendingPercentage, 100)} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <div className={`flex items-center space-x-1 ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
              {isOverBudget ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>
                {isOverBudget ? "Over budget by " : "Remaining: "}
                {formatCurrency(Math.abs(remainingBudget))}
              </span>
            </div>
            <span className="text-muted-foreground">{spendingPercentage.toFixed(1)}%</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Top Categories</h4>
          {categories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{category.name}</span>
                <span className="font-medium">{formatCurrency(category.amount)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={category.percentage} className="flex-1 h-1" />
                <span className="text-xs text-muted-foreground w-10 text-right">{category.percentage.toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
