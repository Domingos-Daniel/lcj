import { Carousel } from "@/components/carousel"
import { ProcessCards } from "@/components/process-cards"
import Link from "next/link"

export default function Home() {
  return (
    <main>
      <Carousel />

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          
          <ProcessCards />
        </div>
      </section>
    </main>
  )
}

