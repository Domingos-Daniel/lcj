"use client"

import Link from "next/link"
import { useTheme } from "@/hooks/useTheme"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background dark:bg-gray-950 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          <div>
            <Link href="/" className="text-2xl font-bold text-primary mb-4 block">
              LCJ.
            </Link>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              LCJ, é a sua escolha ideal para todas as necessidades jurídicas, com toda informação e assistência
              disponível com apenas um clique de distância.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-foreground dark:text-gray-200">LINKS RÁPIDOS</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/arquivos/22" className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                  Matérias de Direito
                </Link>
              </li>
              <li>
                <Link href="/arquivos/27" className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                  Peças Processuais
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-foreground dark:text-gray-200">CENTRO DE AJUDA</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                  Termos e Condições
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                  Políticas de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                  Contactos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-foreground dark:text-gray-200">ENTRE EM CONTACTO</h5>
            <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
              <li>Luanda, Malanga, Central Da Unitel</li>
              <li>
                <a href="mailto:lcjmalaboleandromiguel@Gmail.Com" className="hover:text-primary transition-colors">
                  lcjmalaboleandromiguel@Gmail.Com
                </a>
              </li>
              <li>
                <a href="https://wa.me/244940418442" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  +244 940418442 WhatsApp
                </a>
              </li>
              <li className="pt-4">
                <div className="flex space-x-4">
                  <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="py-8 border-t border-border dark:border-gray-800 text-center text-sm text-muted-foreground dark:text-gray-400">
          © Copyright {new Date().getFullYear()} LCJ - Laboratório de Ciências Jurídicas | Todos os direitos reservados
        </div>
      </div>
    </footer>
  )
}