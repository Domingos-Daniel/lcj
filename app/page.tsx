import { Carousel } from "@/components/carousel"
import { ProcessCards } from "@/components/process-cards"
import Link from "next/link"
import { BackToTop } from "@/components/back-to-top"
import { HomeTutorialOverlay } from "@/components/tutorials/home-tutorial-overlay"

export default function Home() {
  return (
    <main>
      {/* Add the home page tutorial */}
      <HomeTutorialOverlay pageKey="home" />
      
      {/* Add id to carousel for tutorial targeting */}
      <div id="carousel-container">
        <Carousel />
      </div>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <ProcessCards />
        </div>
      </section>

      <BackToTop />
    </main>
  )
}

