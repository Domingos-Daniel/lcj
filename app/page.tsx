import { Carousel } from "@/components/carousel"
import { ProcessCards } from "@/components/process-cards"
import Link from "next/link"
import { BackToTop } from "@/components/back-to-top"
import { HomeTutorialOverlay } from "@/components/tutorials/home-tutorial-overlay"
import type { Metadata } from "next"

// Metadata para SEO - Next.js App Router
export const metadata: Metadata = {
  title: "LCJ - Plataforma Jurídica | Pesquisa e Consulta de Conteúdo Jurídico",
  description: "Acesse conteúdo jurídico de alta qualidade. Artigos, peças processuais e materiais para profissionais de Direito em Angola.",
  keywords: "direito, jurídico, artigos jurídicos, peças processuais, Angola, LCJ",
  authors: [{ name: "LCJ" }],
  openGraph: {
    title: "LCJ - Plataforma Jurídica",
    description: "Acesse conteúdo jurídico de alta qualidade em Angola",
    url: "https://lcj-educa.com/",
    siteName: "LCJ",
    images: [
      {
        url: "https://lcj-educa.com/wp-content/uploads/2024/05/1-e1715125891640.png",
        width: 1200,
        height: 630,
        alt: "LCJ - Plataforma Jurídica"
      }
    ],
    locale: "pt_AO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LCJ - Plataforma Jurídica",
    description: "Acesse conteúdo jurídico de alta qualidade em Angola",
    images: ["https://lcj-educa.com/wp-content/uploads/2024/05/1-e1715125891640.png"],
  },
  alternates: {
    canonical: "https://lcj-educa.com/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Adicionar schema.org JSON-LD
export default function Home() {
  return (
    <>
      {/* Schema.org JSON-LD para rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "LCJ - Plataforma Jurídica",
            "url": "https://lcj-educa.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://lcj-educa.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "description": "Acesse conteúdo jurídico de alta qualidade. Artigos, peças processuais e materiais para profissionais de Direito em Angola."
          })
        }}
      />

      <main>
        {/* Add the home page tutorial */}
        <HomeTutorialOverlay pageKey="home" />
        
        {/* Hero Section - Adicionada com marcação semântica e cabeçalho H1 */}
        <section aria-labelledby="main-heading" id="carousel-container">
          <h1 id="main-heading" className="sr-only">LCJ - Plataforma Jurídica para Profissionais de Direito</h1>
          <Carousel />
        </section>

        {/* Process Section - Melhorada semântica */}
        <section 
          aria-labelledby="process-heading" 
          className="py-20 bg-gray-50 dark:bg-gray-900"
        >
          <div className="container mx-auto px-4">
            <h2 id="process-heading" className="text-3xl font-bold text-center mb-12">
              Como Funciona a Plataforma LCJ
            </h2>
            <ProcessCards />
          </div>
        </section>

        {/* Seção de Conteúdo em Destaque - Nova seção para melhorar SEO com conteúdo */}
        <section 
          aria-labelledby="featured-content-heading" 
          className="py-20"
        >
          <div className="container mx-auto px-4">
            <h2 id="featured-content-heading" className="text-3xl font-bold text-center mb-12">
              Conteúdo Jurídico em Destaque
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Direito Penal em Angola</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Análise sobre o sistema penal angolano e suas recentes atualizações.
                  </p>
                  <Link href="/categoria/direito-penal" className="text-primary hover:underline">
                    Saiba mais
                  </Link>
                </div>
              </article>
              <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Direito Processual Civil</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Principais peças processuais e modelos para advocacia cível.
                  </p>
                  <Link href="/categoria/direito-civil" className="text-primary hover:underline">
                    Saiba mais
                  </Link>
                </div>
              </article>
              <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Doutrina Jurídica</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Acesso a artigos doutrinários e análises de especialistas.
                  </p>
                  <Link href="/categoria/doutrina" className="text-primary hover:underline">
                    Saiba mais
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Seção de Chamada para Ação - Importante para conversão */}
        <section 
          aria-labelledby="cta-heading" 
          className="py-16 bg-primary text-white"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 id="cta-heading" className="text-3xl font-bold mb-4">
              Comece Hoje Mesmo
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg">
              Acesse o melhor conteúdo jurídico disponível para profissionais do direito em Angola. 
              Cadastre-se agora e eleve sua prática jurídica.
            </p>
            <Link 
              href="/cadastramento" 
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Criar Conta
            </Link>
          </div>
        </section>

        <BackToTop />
      </main>
    </>
  )
}

