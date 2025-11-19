import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure you set this in .env.local
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Stream the response from GPT model
    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4o" if you have access
      messages: [
        { role: "system", content: "You are a helpful AI campus assistant who helps students with university, academics, and campus life questions." },
        ...messages,
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(encoder.encode(content));
          }
        } catch (err) {
          console.error("Streaming error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error in /api/ask-question:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
