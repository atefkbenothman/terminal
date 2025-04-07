import type { NextRequest } from "next/server"
import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const result = await streamText({
    model: groq("deepseek-r1-distill-llama-70b"),
    system: "You are a friendly assistant",
    messages: messages
  })

  return result.toDataStreamResponse()
}
