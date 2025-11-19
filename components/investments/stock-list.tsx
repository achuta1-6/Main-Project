"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Stock } from "@/lib/types/database"

export function StockList() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("/api/investments?type=stocks")
        if (response.ok) {
          const data = await response.json()
          setStocks(data.stocks)
        }
      } catch (error) {
        console.error("Failed to fetch stocks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStocks()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Popular Stocks
          </CardTitle>
          <CardDescription>Track major stock performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Popular Stocks
        </CardTitle>
        <CardDescription>Track major stock performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{stock.symbol}</div>
                <div className="text-sm text-muted-foreground">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${stock.price.toFixed(2)}</div>
                <div className="flex items-center space-x-1">
                  {stock.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <Badge
                    variant={stock.change >= 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {stock.change >= 0 ? "+" : ""}${Math.abs(stock.change).toFixed(2)} ({stock.change_percent >= 0 ? "+" : ""}{stock.change_percent.toFixed(2)}%)
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            View All Stocks
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
