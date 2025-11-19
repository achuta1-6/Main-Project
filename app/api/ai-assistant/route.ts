import { GoogleGenerativeAI } from "@google/generative-ai"

export const maxDuration = 30

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

export async function POST(req: Request) {
  const body = await req.json()
  const { messages } = body

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  // Get the last user message
  const lastMessage = messages[messages.length - 1]
  const userMessage = lastMessage?.parts?.[0]?.text || lastMessage?.content || "Hello"

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `You are Finovo AI, a helpful banking assistant for the Finovo banking app. You help users with account information, transaction history, spending analysis, and financial advice.

User query: ${userMessage}

Please provide a helpful response. Keep it concise and professional.` }],
        },
      ],
    })

    const response = result.response
    const text = response.text()

    return new Response(JSON.stringify({
      messages: [{
        id: Date.now().toString(),
        role: "assistant",
        parts: [{ type: "text", text }]
      }]
    }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Gemini API error:", error)
    return new Response(JSON.stringify({
      messages: [{
        id: Date.now().toString(),
        role: "assistant",
        parts: [{ type: "text", text: "I'm sorry, I encountered an error. Please try again." }]
      }]
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
