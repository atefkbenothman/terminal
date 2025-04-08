"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Chat,
  ChatInput,
  ChatMessageList,
  UserMessage,
  AssistantMessage,
  ChatSendButton,
  ChatFooter,
  ChatLoadingIndicator,
} from "@/components/chat"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ImperativePanelHandle } from "react-resizable-panels"
import { ArrowUp, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { useChatProvider } from "@/providers/chat-provider"
import { toast } from "sonner"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { useSoundEffect } from "@/hooks/use-sound-effect"

export default function Home() {
  const { status, handleSend, messages, error, input } = useChatProvider()
  const { play, AudioComponent } = useSoundEffect("./hover.mp3", {
    volume: 0.5,
  })

  const chatPanelRef = useRef<ImperativePanelHandle>(null)

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)

  const resizeChatPanel = (newSize: number) => {
    if (chatPanelRef.current) {
      chatPanelRef.current.resize(newSize)
    } else {
      console.warn("chat panel ref not yet available.")
    }
  }

  useEffect(() => {
    if (error) {
      toast(error.name, { position: "bottom-center" })
    }
  }, [error])

  const handleSidebarClick = (mode: boolean) => {
    mode === true ? resizeChatPanel(8) : resizeChatPanel(20)
    setSidebarCollapsed(mode)
    play()
  }

  const handleMessageSend = () => {
    if (input.trim()) {
      handleSend()
      play()
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {AudioComponent}
      <ResizablePanelGroup direction="horizontal">
        {/* Content Panel */}
        <ResizablePanel defaultSize={80}>
          <div className="flex h-full flex-col">
            {/* Content Header */}
            <div className="bg-card flex h-12 flex-shrink-0 items-center border-b pr-2 pl-4">
              <p className="text-md flex-1 font-medium">Content</p>
              <div className="flex flex-row items-center gap-2">
                <DarkModeToggle />
                <Button
                  onClick={() => handleSidebarClick(!sidebarCollapsed)}
                  size="icon"
                  variant="outline"
                >
                  {sidebarCollapsed ? (
                    <ChevronLeft className="h-4.5 w-4.5" />
                  ) : (
                    <ChevronRight className="h-4.5 w-4.5" />
                  )}
                </Button>
              </div>
            </div>
            {/* Content Body */}
            <div className="flex-1 overflow-auto p-4">
              <p>main application content area...</p>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          id="chat-panel"
          ref={chatPanelRef}
          className="bg-card h-full w-full"
          minSize={20}
          maxSize={60}
          defaultSize={20}
          collapsible
          collapsedSize={3}
          onCollapse={() => handleSidebarClick(true)}
          onExpand={() => handleSidebarClick(false)}
        >
          <div className={cn("flex h-full w-full flex-col")}>
            {/* Chat Header */}
            <div className="flex h-12 flex-shrink-0 items-center border-b px-2">
              {sidebarCollapsed ? (
                <div className="flex w-full items-center justify-center">
                  <MessageCircle className="h-4.5 w-4.5" />
                </div>
              ) : (
                <p className="text-medium flex-1 font-medium">Chat</p>
              )}
            </div>
            {sidebarCollapsed ? (
              <div className="flex flex-1 items-center justify-center" />
            ) : (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <ChatMessageList className="gap-2">
                    {messages.map((msg) =>
                      msg.role === "user" ? (
                        <UserMessage
                          label={false}
                          key={msg.id}
                          message={msg}
                          align="left"
                          className="bg-secondary text-secondary-foreground px-2 py-1 text-xs wrap-break-word"
                        >
                          {msg.content}
                        </UserMessage>
                      ) : (
                        <AssistantMessage
                          key={msg.id}
                          message={msg}
                          label={false}
                          className="bg-accent text-accent-foreground px-2 py-1 text-xs wrap-break-word"
                        >
                          {msg.content}
                        </AssistantMessage>
                      ),
                    )}
                  </ChatMessageList>
                </div>
                <ChatFooter className="flex-shrink-0">
                  <ChatInput placeholder="Send a message..." />
                  <ChatSendButton
                    onClick={handleMessageSend}
                    disabled={
                      status === "streaming" ||
                      status === "error" ||
                      !input.trim()
                    }
                    variant="secondary"
                    className="h-full"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </ChatSendButton>
                </ChatFooter>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
