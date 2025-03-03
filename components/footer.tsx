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
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                  Matérias de Direito
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                  Peças Processuais
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-foreground dark:text-gray-200">CENTRO DE AJUDA</h5>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                  Termos e Condições
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                  Políticas de Privacidade
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-foreground dark:text-gray-200">ENTRE EM CONTACTO</h5>
            <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
              <li>Luanda, Malanga, Central Da Unitel</li>
              <li>lcjmalaboleandromiguel@Gmail.Com</li>
              <li>+244 940418442 WhatsApp</li>
            </ul>
          </div>
        </div>
        <div className="py-8 border-t border-border dark:border-gray-800 text-center text-sm text-muted-foreground dark:text-gray-400">
          © Copyright 2024 powered by Deploy IT
        </div>
      </div>
    </footer>
  )
}