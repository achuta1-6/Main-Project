"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function RazorpayCheckout({ amount = 100 }: { amount?: number }) {
  const [loading, setLoading] = useState(false)

  const pay = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }), // amount in INR (server converts to paise)
      })
      const order = await res.json()
      if (!order?.id) {
        console.error("Order creation failed", order)
        alert("Order creation failed. Check server logs.")
        setLoading(false)
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Finovo",
        description: "Payment",
        order_id: order.id,
        handler: async function (response: any) {
          // Server-side verify signature
          const verify = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          })
          const result = await verify.json()
          if (result.ok) {
            alert("Payment verified")
          } else {
            alert("Payment verification failed")
            console.error("Verify result:", result)
          }
        },
        prefill: {},
      }

      const R = (window as any).Razorpay
      if (!R) {
        alert("Razorpay script not loaded. Add the script tag in app/layout.tsx.")
        setLoading(false)
        return
      }

      const rzp = new R(options)
      rzp.on && rzp.on("payment.failed", (err: any) => {
        console.error("payment.failed", err)
        alert("Payment failed")
      })
      rzp.open()
    } catch (err) {
      console.error(err)
      alert("Payment error. Check console.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={pay} disabled={loading}>
      {loading ? "Processing..." : `Pay ₹${amount}`}
    </Button>
  )
}