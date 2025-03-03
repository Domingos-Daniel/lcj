"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/hooks/useTheme"
import { cn } from "@/lib/utils"

export function Preloader() {
  const [visible, setVisible] = useState(true)
  const { theme } = useTheme()
  
  useEffect(() => {
    // Esconder o preloader após carregamento completo
    const hidePreloader = () => {
      setVisible(false)
    }
    
    // Esconder depois de um timeout ou quando a página carregar completamente
    const timeoutId = setTimeout(hidePreloader, 800)
    window.addEventListener('load', hidePreloader)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('load', hidePreloader)
    }
  }, [])
  
  if (!visible) return null
  
  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
        theme === "dark" ? "bg-gray-900" : "bg-white"
      )}
    >
      <div className="relative">
        <div className="h-16 w-16 relative">
          <div className={cn(
            "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2",
            theme === "dark" ? "border-primary-foreground" : "border-primary"
          )}></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <span className={cn(
              "text-sm font-medium",
              theme === "dark" ? "text-primary-foreground" : "text-primary"
            )}>LCJ.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

