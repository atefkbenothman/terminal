"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sun, Moon } from "lucide-react"
import { useSoundEffect } from "@/hooks/use-sound-effect"

export function DarkModeToggle() {
  const { setTheme, theme } = useTheme()
  const { play, AudioComponent } = useSoundEffect("./hover.mp3", {
    volume: 0.5,
  })

  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeClick = (theme: string) => {
    setTheme(theme)
    play()
  }

  return (
    <div className="p-2">
      {AudioComponent}
      {mounted && (
        <Tabs defaultValue={theme ? theme : ""}>
          <TabsList>
            <TabsTrigger
              value="light"
              onClick={() => handleThemeClick("light")}
            >
              <Sun />
            </TabsTrigger>
            <TabsTrigger value="dark" onClick={() => handleThemeClick("dark")}>
              <Moon />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </div>
  )
}
