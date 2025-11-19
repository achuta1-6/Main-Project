import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Portfolio, Investment, Stock, Crypto } from "@/lib/types/database"

// Mock data for stocks and crypto (in production, integrate with real APIs)
const mockStocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 175.43,
    change: 2.15,
    change_percent: 1.24,
    volume: 52847392,
    market_cap: 2750000000000,
    pe_ratio: 28.5,
    last_updated: new Date().toISOString(),
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.56,
    change: -1.23,
    change_percent: -0.85,
    volume: 23456789,
    market_cap: 1780000000000,
    pe_ratio: 25.8,
    last_updated: new Date().toISOString(),
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 378.85,
    change: 5.67,
    change_percent: 1.52,
    volume: 34567890,
    market_cap: 2820000000000,
    pe_ratio: 32.1,
    last_updated: new Date().toISOString(),
  },
]

const mockCrypto: Crypto[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 43250.75,
    change_24h: 1250.30,
    change_percent_24h: 2.98,
    volume_24h: 28500000000,
    market_cap: 845000000000,
    last_updated: new Date().toISOString(),
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 2650.45,
    change_24h: -45.20,
    change_percent_24h: -1.68,
    volume_24h: 15200000000,
    market_cap: 318000000000,
    last_updated: new Date().toISOString(),
  },
  {
    symbol: "ADA",
    name: "Cardano",
    price: 0.485,
    change_24h: 0.015,
    change_percent_24h: 3.19,
    volume_24h: 850000000,
    market_cap: 17000000000,
    last_updated: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 'portfolio', 'stocks', 'crypto'

    switch (type) {
      case "portfolio": {
        // Fetch user's portfolios
        const { data: portfolios, error: portfolioError } = await supabase
          .from("portfolios")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false })

        if (portfolioError) {
          console.error("Portfolio fetch error:", portfolioError)
          return NextResponse.json({ error: "Failed to fetch portfolios" }, { status: 500 })
        }

        // Fetch investments for each portfolio
        const portfoliosWithInvestments = await Promise.all(
          (portfolios || []).map(async (portfolio) => {
            const { data: investments, error: investmentError } = await supabase
              .from("investments")
              .select("*")
              .eq("portfolio_id", portfolio.id)

            if (investmentError) {
              console.error("Investment fetch error:", investmentError)
              return { ...portfolio, investments: [] }
            }

            return { ...portfolio, investments: investments || [] }
          })
        )

        return NextResponse.json({ portfolios: portfoliosWithInvestments })
      }

      case "stocks":
        return NextResponse.json({ stocks: mockStocks })

      case "crypto":
        return NextResponse.json({ crypto: mockCrypto })

      default:
        return NextResponse.json({
          error: "Invalid type parameter. Use 'portfolio', 'stocks', or 'crypto'"
        }, { status: 400 })
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, portfolioId, symbol, name, type, quantity, price } = body

    if (action === "create_portfolio") {
      const { data, error } = await supabase
        .from("portfolios")
        .insert({
          user_id: authUser.id,
          name: body.name,
          description: body.description,
        })
        .select()
        .single()

      if (error) {
        console.error("Portfolio creation error:", error)
        return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 })
      }

      return NextResponse.json({ portfolio: data })
    }

    if (action === "add_investment") {
      if (!portfolioId || !symbol || !name || !type || !quantity || !price) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }

      const marketValue = quantity * price

      const { data, error } = await supabase
        .from("investments")
        .insert({
          portfolio_id: portfolioId,
          symbol,
          name,
          type,
          quantity,
          average_cost: price,
          current_price: price,
          market_value: marketValue,
          gain_loss: 0,
          gain_loss_percentage: 0,
        })
        .select()
        .single()

      if (error) {
        console.error("Investment creation error:", error)
        return NextResponse.json({ error: "Failed to add investment" }, { status: 500 })
      }

      // Update portfolio totals
      await updatePortfolioTotals(supabase, portfolioId)

      return NextResponse.json({ investment: data })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function updatePortfolioTotals(supabase: any, portfolioId: string) {
  // Calculate totals from investments
  const { data: investments, error } = await supabase
    .from("investments")
    .select("market_value, gain_loss")
    .eq("portfolio_id", portfolioId)

  if (error || !investments) return

  const totalValue = investments.reduce((sum: number, inv: any) => sum + inv.market_value, 0)
  const totalGainLoss = investments.reduce((sum: number, inv: any) => sum + inv.gain_loss, 0)
  const totalGainLossPercentage = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0

  await supabase
    .from("portfolios")
    .update({
      total_value: totalValue,
      total_gain_loss: totalGainLoss,
      total_gain_loss_percentage: totalGainLossPercentage,
    })
    .eq("id", portfolioId)
}
