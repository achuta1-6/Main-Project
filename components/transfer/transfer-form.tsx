"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Account, Beneficiary } from "@/lib/types/database"

interface TransferFormProps {
  accounts: Account[]
  beneficiaries: Beneficiary[]
}

export function TransferForm({ accounts, beneficiaries }: TransferFormProps) {
  const [fromAccount, setFromAccount] = useState("")
  const [transferType, setTransferType] = useState<"internal" | "external" | "beneficiary">("internal")
  const [toAccount, setToAccount] = useState("")
  const [beneficiaryId, setBeneficiaryId] = useState("")
  const [externalAccount, setExternalAccount] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const selectedFromAccount = accounts.find((acc) => acc.id === fromAccount)
  const selectedBeneficiary = beneficiaries.find((ben) => ben.id === beneficiaryId)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fromAccount || !amount) {
      setError("Please fill in all required fields")
      return
    }

    const transferAmount = Number.parseFloat(amount)
    if (transferAmount <= 0) {
      setError("Transfer amount must be greater than 0")
      return
    }

    if (selectedFromAccount && transferAmount > selectedFromAccount.available_balance) {
      setError("Insufficient funds")
      return
    }

    setShowConfirmation(true)
  }

  const confirmTransfer = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const transferAmount = Number.parseFloat(amount)
      let toAccountId = null
      let recipientInfo = ""

      // Determine recipient based on transfer type
      if (transferType === "internal") {
        toAccountId = toAccount
        const recipient = accounts.find((acc) => acc.id === toAccount)
        recipientInfo = `Internal transfer to ${recipient?.account_type} account`
      } else if (transferType === "beneficiary") {
        recipientInfo = `Transfer to ${selectedBeneficiary?.name}`
      } else {
        recipientInfo = `External transfer to ${recipientName}`
      }

      // Create transaction record
      const { error: transactionError } = await supabase.from("transactions").insert({
        from_account_id: fromAccount,
        to_account_id: toAccountId,
        transaction_type: "transfer",
        amount: transferAmount,
        description: description || recipientInfo,
        status: "pending",
        reference_number: `TXN-${Date.now()}`,
        metadata: {
          transfer_type: transferType,
          recipient_name: recipientName || selectedBeneficiary?.name,
          external_account: externalAccount,
          routing_number: routingNumber,
        },
      })

      if (transactionError) throw transactionError

      // Update account balance (in a real app, this would be handled by a secure backend process)
      if (transferType === "internal" && toAccountId) {
        // Deduct from source account
        const { error: deductError } = await supabase
          .from("accounts")
          .update({
            available_balance: selectedFromAccount!.available_balance - transferAmount,
            balance: selectedFromAccount!.balance - transferAmount,
          })
          .eq("id", fromAccount)

        if (deductError) throw deductError

        // Add to destination account
        const destinationAccount = accounts.find((acc) => acc.id === toAccountId)
        const { error: addError } = await supabase
          .from("accounts")
          .update({
            available_balance: destinationAccount!.available_balance + transferAmount,
            balance: destinationAccount!.balance + transferAmount,
          })
          .eq("id", toAccountId)

        if (addError) throw addError
      } else {
        // For external transfers, just deduct from source account
        const { error: deductError } = await supabase
          .from("accounts")
          .update({
            available_balance: selectedFromAccount!.available_balance - transferAmount,
          })
          .eq("id", fromAccount)

        if (deductError) throw deductError
      }

      // In a real app, this would refresh the data
      window.location.reload()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Transfer failed")
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
            <span>Confirm Transfer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">From</p>
                <p className="text-sm text-muted-foreground">
                  {selectedFromAccount?.account_type} ****{selectedFromAccount?.account_number.slice(-4)}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="text-right">
                <p className="font-medium">To</p>
                <p className="text-sm text-muted-foreground">
                  {transferType === "internal"
                    ? `${accounts.find((acc) => acc.id === toAccount)?.account_type} ****${accounts
                        .find((acc) => acc.id === toAccount)
                        ?.account_number.slice(-4)}`
                    : transferType === "beneficiary"
                      ? selectedBeneficiary?.name
                      : recipientName}
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{formatCurrency(Number.parseFloat(amount))}</p>
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {transferType === "internal" ? "Instant transfer" : "1-3 business days for external transfers"}
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
            <Button onClick={confirmTransfer} className="flex-1" disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm Transfer"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* From Account */}
          <div className="space-y-2">
            <Label htmlFor="fromAccount">From Account</Label>
            <Select value={fromAccount} onValueChange={setFromAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select account to send from" />
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
            {selectedFromAccount && (
              <p className="text-sm text-muted-foreground">
                Available: {formatCurrency(selectedFromAccount.available_balance)}
              </p>
            )}
          </div>

          {/* Transfer Type */}
          <div className="space-y-2">
            <Label>Transfer To</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={transferType === "internal" ? "default" : "outline"}
                onClick={() => setTransferType("internal")}
                className="h-auto p-3 flex flex-col items-center space-y-1"
              >
                <span className="text-xs">My Accounts</span>
              </Button>
              <Button
                type="button"
                variant={transferType === "beneficiary" ? "default" : "outline"}
                onClick={() => setTransferType("beneficiary")}
                className="h-auto p-3 flex flex-col items-center space-y-1"
              >
                <span className="text-xs">Saved Recipients</span>
              </Button>
              <Button
                type="button"
                variant={transferType === "external" ? "default" : "outline"}
                onClick={() => setTransferType("external")}
                className="h-auto p-3 flex flex-col items-center space-y-1"
              >
                <span className="text-xs">New Recipient</span>
              </Button>
            </div>
          </div>

          {/* Recipient Selection */}
          {transferType === "internal" && (
            <div className="space-y-2">
              <Label htmlFor="toAccount">To Account</Label>
              <Select value={toAccount} onValueChange={setToAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    .filter((account) => account.id !== fromAccount)
                    .map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} ****
                        {account.account_number.slice(-4)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {transferType === "beneficiary" && (
            <div className="space-y-2">
              <Label htmlFor="beneficiary">Select Recipient</Label>
              <Select value={beneficiaryId} onValueChange={setBeneficiaryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose from saved recipients" />
                </SelectTrigger>
                <SelectContent>
                  {beneficiaries.map((beneficiary) => (
                    <SelectItem key={beneficiary.id} value={beneficiary.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{beneficiary.name}</span>
                        {beneficiary.is_favorite && <Badge variant="secondary">Favorite</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {transferType === "external" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter recipient's full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="externalAccount">Account Number</Label>
                <Input
                  id="externalAccount"
                  value={externalAccount}
                  onChange={(e) => setExternalAccount(e.target.value)}
                  placeholder="Enter account number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  placeholder="Enter 9-digit routing number"
                  required
                />
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this transfer for?"
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Review Transfer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
