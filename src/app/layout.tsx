import type { Metadata } from "next"
import "./globals.css"

import { Inter } from "next/font/google"

import { DarkModeProvider } from "@/providers/dark-mode-provider"
import { AIChatProvider } from "@/providers/chat-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Terminal",
  description: "terminal",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AIChatProvider>
        <body className={`antialiased ${inter.className}`}>
          <DarkModeProvider
            attribute="class"
            defaultTheme="systeml"
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main>
            <Toaster
              toastOptions={{ style: { borderRadius: "var(--radius-md)" } }}
            />
          </DarkModeProvider>
        </body>
      </AIChatProvider>
    </html>
  )
}
