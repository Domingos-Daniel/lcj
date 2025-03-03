"use client"

import { createContext, useContext, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Preloader } from "./preloader"

type LoadingContextType = {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => null,
})

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <Preloader isVisible={true} />}
      <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-200"}>
        {children}
      </div>
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)