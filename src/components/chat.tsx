"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChatProvider } from "@/providers/chat-provider"
import { Slot } from "@radix-ui/react-slot"
import type { Message } from "ai"
import { cn } from "@/lib/utils"
import { useSoundEffect } from "@/hooks/use-sound-effect"

/**
 * Chat Container
 */
const Chat = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-full w-full flex-col", className)}
    {...props}
  />
))
Chat.displayName = "Chat"

/**
 * ChatHeader
 */
const ChatHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 border-b p-2", className)}
    {...props}
  />
))
ChatHeader.displayName = "ChatHeader"

/**
 * ChatFooter
 */
const ChatFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 border-t p-2", className)}
    {...props}
  />
))
ChatFooter.displayName = "ChatFooter"

/**
 * ChatError
 */
const ChatError = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { error } = useChatProvider()

  if (!error) return null

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {error.message}
    </div>
  )
})
ChatError.displayName = "ChatError"

/**
 * ChatLoadingIndicator
 */
const ChatLoadingIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { status } = useChatProvider()

  if (status !== "streaming") return null

  return <div ref={ref} className={cn(className)} {...props} />
})
ChatLoadingIndicator.displayName = "ChatLoadingIndicator"

/**
 * ChatInput
 */
const ChatInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof Input> & {
    asChild?: boolean
  }
>(({ placeholder, className, asChild, ...props }, ref) => {
  const { input, handleInputChange, status, handleSend } = useChatProvider()
  const { play, AudioComponent } = useSoundEffect("./hover.mp3", {
    volume: 0.5,
  })

  const Comp = asChild ? Slot : Input

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && status === "ready") {
      handleSend()
      play()
    }
  }

  return (
    <>
      {AudioComponent}
      <Comp
        ref={ref}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Type here..."}
        disabled={status === "streaming" || status === "error"}
        className={cn("", className)}
        {...props}
      />
    </>
  )
})
ChatInput.displayName = "ChatInput"

/**
 * ChatSendButton
 */
const ChatSendButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & {
    onClick: () => void
    asChild?: boolean
  }
>(({ onClick, className, children, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : Button

  return (
    <Comp ref={ref} onClick={onClick} className={cn("", className)} {...props}>
      {children || "Send"}
    </Comp>
  )
})
ChatSendButton.displayName = "ChatSendButton"

/**
 * ChatNewButton
 */
const ChatNewButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & {
    asChild?: boolean
  }
>(({ className, children, asChild, ...props }, ref) => {
  const { handleNewChat } = useChatProvider()

  const Comp = asChild ? Slot : Button

  return (
    <Comp
      ref={ref}
      onClick={handleNewChat}
      className={cn("", className)}
      {...props}
    >
      {children || "New Chat"}
    </Comp>
  )
})
ChatNewButton.displayName = "ChatNewButton"

/**
 * ChatMessage
 */
type ChatMessageProps = {
  message: Message
  role?: "user" | "assistant" | "system"
  renderContent?: (message: Message) => React.ReactNode
}

const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message, renderContent }, ref) => {
    const defaultContent = (
      <div>
        <p>{message.role === "user" ? "User" : "AI"}</p>
        <span
          className={cn(
            "inline-block p-2",
            message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200",
          )}
        >
          {message.content}
        </span>
      </div>
    )
    return (
      <div
        ref={ref}
        className={cn(message.role === "user" ? "text-right" : "text-left")}
      >
        {renderContent ? renderContent(message) : defaultContent}
      </div>
    )
  },
)
ChatMessage.displayName = "ChatMessage"

/**
 * UserMessage
 */
type UserMessageProps = {
  message?: Message
  className?: string
  label?: React.ReactNode
  align?: string
  children?: React.ReactNode
}

const UserMessage = React.forwardRef<HTMLDivElement, UserMessageProps>(
  ({ message, className, label, align, children }, ref) => {
    const content = children ?? message?.content

    return (
      <div ref={ref} className={cn(`text-${align ?? "right"}`)}>
        {/* {label ? label : <div>User</div>} */}
        <span className={cn("inline-block p-2", className)}>{content}</span>
      </div>
    )
  },
)
UserMessage.displayName = "UserMessage"

/**
 * AssistantMessage
 */
type AssistantMessageProps = {
  message?: Message
  className?: string
  label?: React.ReactNode
  align?: string
  children?: React.ReactNode
}

const AssistantMessage = React.forwardRef<
  HTMLDivElement,
  AssistantMessageProps
>(({ message, className, label, align, children }, ref) => {
  const content = children ?? message?.content

  return (
    <div ref={ref} className={cn(`text-${align ?? "left"}`)}>
      {/* {label ? label : <div>AI</div>} */}
      <span className={cn("inline-block p-2", className)}>{content}</span>
    </div>
  )
})
AssistantMessage.displayName = "AssistantMessage"

/**
 * ChatMessageList
 */
const ChatMessageList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2 p-2", className)} {...props} />
))
ChatMessageList.displayName = "ChatMessageList"

export {
  Chat,
  ChatError,
  ChatFooter,
  ChatHeader,
  ChatInput,
  ChatMessageList,
  ChatMessage,
  ChatNewButton,
  ChatSendButton,
  ChatLoadingIndicator,
  UserMessage,
  AssistantMessage,
}
