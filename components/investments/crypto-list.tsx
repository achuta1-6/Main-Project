"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Coins } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Crypto } from "@/lib/types/database"

export function CryptoList() {
  const [crypto, setCrypto] = useState<Crypto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const response = await fetch("/api/investments?type=crypto")
        if (response.ok) {
          const data = await response.json()
          setCrypto(data.crypto)
        }
      } catch (error) {
        console.error("Failed to fetch crypto:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCrypto()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coins className="h-5 w-5 mr-2" />
            Cryptocurrency
          </CardTitle>
          <CardDescription>Track crypto market trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-20" />
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
          <Coins className="h-5 w-5 mr-2" />
          Cryptocurrency
        </CardTitle>
        <CardDescription>Track crypto market trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {crypto.map((coin) => (
            <div key={coin.symbol} className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{coin.symbol}</div>
                <div className="text-sm text-muted-foreground">{coin.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${coin.price.toLocaleString()}</div>
                <div className="flex items-center space-x-1">
                  {coin.change_24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <Badge
                    variant={coin.change_24h >= 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {coin.change_24h >= 0 ? "+" : ""}${Math.abs(coin.change_24h).toFixed(2)} ({coin.change_percent_24h >= 0 ? "+" : ""}{coin.change_percent_24h.toFixed(2)}%)
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            View All Crypto
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
