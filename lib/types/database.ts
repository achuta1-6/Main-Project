// Database types for Finovo Banking App

export type UserRole = "customer" | "admin" | "manager"
export type AccountType = "checking" | "savings" | "credit" | "investment"
export type TransactionType = "deposit" | "withdrawal" | "transfer" | "payment" | "fee"
export type TransactionStatus = "pending" | "completed" | "failed" | "cancelled"
export type PaymentStatus = "pending" | "completed" | "failed" | "cancelled"

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  date_of_birth?: string
  address?: any
  role: UserRole
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  user_id: string
  account_number: string
  account_type: AccountType
  balance: number
  available_balance: number
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  from_account_id?: string
  to_account_id?: string
  transaction_type: TransactionType
  amount: number
  currency: string
  description?: string
  reference_number?: string
  status: TransactionStatus
  metadata?: any
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  from_account_id: string
  payee_name: string
  payee_account?: string
  amount: number
  currency: string
  payment_date?: string
  description?: string
  category?: string
  status: PaymentStatus
  recurring: boolean
  recurring_frequency?: string
  metadata?: any
  created_at: string
  updated_at: string
}

export interface Beneficiary {
  id: string
  user_id: string
  name: string
  account_number: string
  bank_name?: string
  routing_number?: string
  email?: string
  phone?: string
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface Card {
  id: string
  account_id: string
  card_number: string
  card_type: string
  expiry_date: string
  cvv: string
  is_active: boolean
  daily_limit: number
  monthly_limit: number
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  metadata?: any
  created_at: string
}

export interface AIChatSession {
  id: string
  user_id: string
  session_name?: string
  messages: any[]
  created_at: string
  updated_at: string
}

// Investment-related types
export interface Portfolio {
  id: string
  user_id: string
  name: string
  description?: string
  total_value: number
  total_gain_loss: number
  total_gain_loss_percentage: number
  created_at: string
  updated_at: string
}

export interface Investment {
  id: string
  portfolio_id: string
  symbol: string
  name: string
  type: 'stock' | 'crypto'
  quantity: number
  average_cost: number
  current_price: number
  market_value: number
  gain_loss: number
  gain_loss_percentage: number
  created_at: string
  updated_at: string
}

export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  change_percent: number
  volume: number
  market_cap?: number
  pe_ratio?: number
  last_updated: string
}

export interface Crypto {
  symbol: string
  name: string
  price: number
  change_24h: number
  change_percent_24h: number
  volume_24h: number
  market_cap: number
  last_updated: string
}
