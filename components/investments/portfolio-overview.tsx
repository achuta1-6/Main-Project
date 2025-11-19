"use client"

import { useState, useEffect } from "react"
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Portfolio } from "@/lib/types/database"

interface PortfolioOverviewProps {
  portfolios: Portfolio[]
}

export function PortfolioOverview({ portfolios }: PortfolioOverviewProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPortfolioName, setNewPortfolioName] = useState("")
  const [newPortfolioDescription, setNewPortfolioDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCreatePortfolio = async () => {
    if (!newPortfolioName.trim()) {
      toast({
        title: "Error",
        description: "Portfolio name is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create_portfolio",
          name: newPortfolioName.trim(),
          description: newPortfolioDescription.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create portfolio")
      }

      toast({
        title: "Success",
        description: "Portfolio created successfully",
      })

      setIsCreateDialogOpen(false)
      setNewPortfolioName("")
      setNewPortfolioDescription("")
      // Refresh the page to show new portfolio
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create portfolio",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalValue = portfolios.reduce((sum, portfolio) => sum + portfolio.total_value, 0)
  const totalGainLoss = portfolios.reduce((sum, portfolio) => sum + portfolio.total_gain_loss, 0)
  const totalGainLossPercentage = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${Math.abs(totalGainLoss).toLocaleString()}
            </div>
            <p className={`text-xs ${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalGainLossPercentage >= 0 ? "+" : ""}{totalGainLossPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolios</CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Portfolio</DialogTitle>
                  <DialogDescription>
                    Create a new investment portfolio to track your assets.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="portfolio-name">Portfolio Name</Label>
                    <Input
                      id="portfolio-name"
                      value={newPortfolioName}
                      onChange={(e) => setNewPortfolioName(e.target.value)}
                      placeholder="e.g., My Tech Stocks"
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio-description">Description (Optional)</Label>
                    <Textarea
                      id="portfolio-description"
                      value={newPortfolioDescription}
                      onChange={(e) => setNewPortfolioDescription(e.target.value)}
                      placeholder="Brief description of this portfolio"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePortfolio} disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Portfolio"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolios.length}</div>
            <p className="text-xs text-muted-foreground">Active portfolios</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Portfolios */}
      {portfolios.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                {portfolio.description && (
                  <CardDescription>{portfolio.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Value</span>
                    <span className="font-semibold">${portfolio.total_value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gain/Loss</span>
                    <div className="flex items-center space-x-1">
                      <span
                        className={`font-semibold ${
                          portfolio.total_gain_loss >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        ${Math.abs(portfolio.total_gain_loss).toLocaleString()}
                      </span>
                      <Badge
                        variant={portfolio.total_gain_loss >= 0 ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {portfolio.total_gain_loss >= 0 ? "+" : ""}
                        {portfolio.total_gain_loss_percentage.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No portfolios yet</h3>
                <p className="text-muted-foreground">Create your first portfolio to start tracking investments</p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Portfolio
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Portfolio</DialogTitle>
                    <DialogDescription>
                      Create a new investment portfolio to track your assets.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="portfolio-name">Portfolio Name</Label>
                      <Input
                        id="portfolio-name"
                        value={newPortfolioName}
                        onChange={(e) => setNewPortfolioName(e.target.value)}
                        placeholder="e.g., My Tech Stocks"
                      />
                    </div>
                    <div>
                      <Label htmlFor="portfolio-description">Description (Optional)</Label>
                      <Textarea
                        id="portfolio-description"
                        value={newPortfolioDescription}
                        onChange={(e) => setNewPortfolioDescription(e.target.value)}
                        placeholder="Brief description of this portfolio"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePortfolio} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Portfolio"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
