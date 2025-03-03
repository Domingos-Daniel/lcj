"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Preloader } from "@/components/preloader"
import { Footer } from "@/components/footer"
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloaderVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isPreloaderVisible && <Preloader isVisible={true} />}
      {!isPreloaderVisible && (
        <>
          <Header />
          {children}
          <Footer />
        </>
      )}
    </>
  )
}