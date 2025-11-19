import Razorpay from "razorpay"
import { NextResponse } from "next/server"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const amount = Number(body?.amount)
    const currency = body?.currency ?? "INR"
    const receipt = body?.receipt ?? `rcpt_${Date.now()}`

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Razorpay expects smallest currency unit (paise for INR)
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt,
      payment_capture: 1,
    }

    const order = await razorpay.orders.create(options)
    return NextResponse.json(order)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
// import Razorpay from "razorpay"
// import { NextResponse } from "next/server"

// const razorpay = new Razorpay({
//   key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// })

// export async function POST(req: Request) {
//   const { amount, currency = "INR", receipt } = await req.json()
//   if (!amount) return NextResponse.json({ error: "Missing amount" }, { status: 400 })

//   // amount should be in paise for INR
//   const options = {
//     amount: Math.round(Number(amount) * 100),
//     currency,
//     receipt: receipt ?? `rcpt_${Date.now()}`,
//     payment_capture: 1,
//   }

//   try {
//     const order = await razorpay.orders.create(options)
//     return NextResponse.json(order)
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
//   }
// }


import Razorpay from "razorpay"
import { NextResponse } from "next/server"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const amount = Number(body?.amount)
    const currency = body?.currency ?? "INR"
    const receipt = body?.receipt ?? `rcpt_${Date.now()}`

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Razorpay expects smallest currency unit (paise for INR)
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt,
      payment_capture: 1,
    }

    const order = await razorpay.orders.create(options)
    return NextResponse.json(order)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}