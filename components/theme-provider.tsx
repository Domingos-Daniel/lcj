"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null

    if (storedTheme) {
      setTheme(storedTheme)
      document.documentElement.classList.toggle("dark", storedTheme === "dark")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const initialTheme = prefersDark ? "dark" : "light"
      setTheme(initialTheme)
      document.documentElement.classList.toggle("dark", initialTheme === "dark")
      localStorage.setItem("theme", initialTheme)
    }
  }, [])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem("theme", theme)
      setTheme(theme)
      document.documentElement.classList.toggle("dark", theme === "dark")
    },
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useThemeContext = () => useContext(ThemeProviderContext)
