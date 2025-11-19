import crypto from "crypto"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const bodyText = await req.text()
  const signature = req.headers.get("x-razorpay-signature") ?? ""

  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "").update(bodyText).digest("hex")
  if (expected !== signature) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const payload = JSON.parse(bodyText)
  // handle webhook events here (payment.captured, payment.failed, order.paid, etc.)
  // persist to DB as needed

  return NextResponse.json({ ok: true })
}
