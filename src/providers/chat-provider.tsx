"use client"

import { createContext, useContext, useState } from "react"
import { useChat } from "@ai-sdk/react"
import type { Message } from "ai"
import { useSoundEffect } from "@/hooks/use-sound-effect"

type Status = "submitted" | "streaming" | "ready" | "error"

type AIChatContextType = {
  messages: Message[]
  input: string
  status: Status
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void
  error: Error | undefined
  context: string
  setContext: (context: string) => void
  handleSend: () => void
  handleNewChat: () => void
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined)

type AIChatProviderProps = {
  children: React.ReactNode
}

export function AIChatProvider({ children }: AIChatProviderProps) {
  const { play } = useSoundEffect("./hover.mp3", {
    volume: 0.5,
  })

  const [context, setContext] = useState<string>("")

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    append,
    status,
    error,
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      { id: "1", role: "assistant", content: "How can I help you today?" },
    ],
  })

  const handleSend = () => {
    if (status === "ready" && input.trim()) {
      const fullInput = context ? `${context}\n\n${input}` : input
      const message: Message = {
        id: Math.random().toString(),
        role: "user" as const,
        content: fullInput,
      }
      append(message)
      play()
      handleInputChange({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const handleNewChat = () => {
    setMessages([
      { id: "1", role: "assistant", content: "How can I help you today?" },
    ])
    handleInputChange({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  const value = {
    messages,
    input,
    handleInputChange,
    status,
    error,
    context,
    setContext,
    handleSend,
    handleNewChat,
  }

  return (
    <AIChatContext.Provider value={value}>{children}</AIChatContext.Provider>
  )
}

export function useChatProvider() {
  const context = useContext(AIChatContext)
  if (!context) {
    throw new Error("useChat must be used within an AIChatProvider")
  }
  return context
}
