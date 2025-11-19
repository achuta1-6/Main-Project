"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Shield, Clock } from "lucide-react"
import { format } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import type { Account } from "@/lib/types/database"

interface BillPaymentFormProps {
  accounts: Account[]
  onPaymentComplete: () => void
}

const paymentCategories = [
  "Utilities",
  "Credit Cards",
  "Loans",
  "Insurance",
  "Rent/Mortgage",
  "Phone/Internet",
  "Subscriptions",
  "Other",
]

const recurringFrequencies = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
]

export function BillPaymentForm({ accounts, onPaymentComplete }: BillPaymentFormProps) {
  const [fromAccount, setFromAccount] = useState("")
  const [payeeName, setPayeeName] = useState("")
  const [payeeAccount, setPayeeAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [paymentDate, setPaymentDate] = useState<Date>()
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const selectedAccount = accounts.find((acc) => acc.id === fromAccount)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fromAccount || !payeeName || !amount) {
      setError("Please fill in all required fields")
      return
    }

    const paymentAmount = Number.parseFloat(amount)
    if (paymentAmount <= 0) {
      setError("Payment amount must be greater than 0")
      return
    }

    if (selectedAccount && paymentAmount > selectedAccount.available_balance) {
      setError("Insufficient funds")
      return
    }

    if (isRecurring && !recurringFrequency) {
      setError("Please select a recurring frequency")
      return
    }

    setShowConfirmation(true)
  }

  const confirmPayment = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const paymentAmount = Number.parseFloat(amount)

      // Create payment record
      const { error: paymentError } = await supabase.from("payments").insert({
        from_account_id: fromAccount,
        payee_name: payeeName,
        payee_account: payeeAccount || null,
        amount: paymentAmount,
        payment_date: paymentDate ? format(paymentDate, "yyyy-MM-dd") : null,
        description: description || null,
        category: category || null,
        status: "pending",
        recurring: isRecurring,
        recurring_frequency: isRecurring ? recurringFrequency : null,
        metadata: {
          payment_type: "bill_payment",
          scheduled: !!paymentDate,
        },
      })

      if (paymentError) throw paymentError

      // Create corresponding transaction
      const { error: transactionError } = await supabase.from("transactions").insert({
        from_account_id: fromAccount,
        transaction_type: "payment",
        amount: paymentAmount,
        description: `Bill payment to ${payeeName}`,
        status: "pending",
        reference_number: `PAY-${Date.now()}`,
        metadata: {
          payee_name: payeeName,
          category: category,
          payment_date: paymentDate ? format(paymentDate, "yyyy-MM-dd") : null,
        },
      })

      if (transactionError) throw transactionError

      // Update account balance (in a real app, this would be handled by a secure backend process)
      if (!paymentDate || paymentDate <= new Date()) {
        const { error: balanceError } = await supabase
          .from("accounts")
          .update({
            available_balance: selectedAccount!.available_balance - paymentAmount,
          })
          .eq("id", fromAccount)

        if (balanceError) throw balanceError
      }

      onPaymentComplete()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Payment failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (showConfirmation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Confirm Payment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">From</span>
                <span className="font-medium">
                  {selectedAccount?.account_type} ****{selectedAccount?.account_number.slice(-4)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">To</span>
                <span className="font-medium">{payeeName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(Number.parseFloat(amount))}</span>
              </div>
              {category && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="font-medium">{category}</span>
                </div>
              )}
              {paymentDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Date</span>
                  <span className="font-medium">{format(paymentDate, "MMM dd, yyyy")}</span>
                </div>
              )}
              {isRecurring && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Recurring</span>
                  <span className="font-medium">
                    {recurringFrequencies.find((f) => f.value === recurringFrequency)?.label}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {paymentDate && paymentDate > new Date()
                  ? "Scheduled payment"
                  : "Payment will be processed immediately"}
              </span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={confirmPayment} className="flex-1" disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm Payment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay Bills</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* From Account */}
          <div className="space-y-2">
            <Label htmlFor="fromAccount">Pay From</Label>
            <Select value={fromAccount} onValueChange={setFromAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select account to pay from" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>
                        {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} ****
                        {account.account_number.slice(-4)}
                      </span>
                      <span className="ml-2 text-muted-foreground">{formatCurrency(account.available_balance)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedAccount && (
              <p className="text-sm text-muted-foreground">
                Available: {formatCurrency(selectedAccount.available_balance)}
              </p>
            )}
          </div>

          {/* Payee Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payeeName">Payee Name *</Label>
              <Input
                id="payeeName"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                placeholder="Enter company or person name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payeeAccount">Account Number (Optional)</Label>
              <Input
                id="payeeAccount"
                value={payeeAccount}
                onChange={(e) => setPayeeAccount(e.target.value)}
                placeholder="Enter account or reference number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment category" />
                </SelectTrigger>
                <SelectContent>
                  {paymentCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-8"
                required
              />
            </div>
          </div>

          {/* Payment Date */}
          <div className="space-y-2">
            <Label>Payment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !paymentDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {paymentDate ? format(paymentDate, "PPP") : "Pay now (or select date)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={paymentDate}
                  onSelect={setPaymentDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Recurring Payment */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
              />
              <Label htmlFor="recurring" className="text-sm">
                Make this a recurring payment
              </Label>
            </div>

            {isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {recurringFrequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Notes (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any notes about this payment"
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Review Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
