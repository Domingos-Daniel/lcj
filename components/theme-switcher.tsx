"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/useTheme"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const { theme, toggleTheme, mounted } = useTheme()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!mounted || !isClient) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full transition-colors duration-200 opacity-0"
      >
        <span className="sr-only">Loading theme switcher</span>
      </Button>
    )
  }

  return (
    <Button
      id="theme-toggle"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-full transition-colors duration-200"
      aria-label="Toggle theme"
    >
      <span className="sr-only">
        {theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      </span>
      {theme === "light" ? (
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-200" />
      ) : (
        <Moon className="h-4 w-4 rotate-90 scale-100 transition-all duration-200" />
      )}
    </Button>
  )
}