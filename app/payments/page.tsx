"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function PaymentsPage() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSuccessMessage("");

    // Simulate payment delay
    await new Promise((res) => setTimeout(res, 2000));

    setIsSending(false);
    setSuccessMessage(`✅ Payment of $${amount} sent to ${recipient}!`);
    setAmount("");
    setRecipient("");
    setNote("");
  };

  return (
    <motion.div
      className="flex flex-col items-center p-6 space-y-6 max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold text-center">Send a Payment</h1>

      <Card className="w-full shadow-md rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Recipient</label>
              <Input
                type="text"
                placeholder="Enter recipient name or ID"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Note (optional)</label>
              <Input
                type="text"
                placeholder="Add a note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSending || !amount || !recipient}
            >
              {isSending ? "Processing..." : "Send Payment"}
            </Button>
          </form>

          {successMessage && (
            <motion.p
              className="text-green-600 text-center mt-4 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {successMessage}
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
