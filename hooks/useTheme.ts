"use client"

import { useState, useEffect } from "react"
import { useThemeContext } from "@/components/theme-provider"

export function useTheme() {
  const { theme, setTheme } = useThemeContext()
  const [mounted, setMounted] = useState(false)

  // Verificar se estamos no navegador
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  return { theme, toggleTheme, mounted }
}