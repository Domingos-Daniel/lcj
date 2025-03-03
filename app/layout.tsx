import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ClientLayout from "./ClientLayout"
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { BackToTop } from "@/components/back-to-top"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LoadingProvider } from "@/components/loading-provider"
import { Preloader } from "@/components/preloader"

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "LCJ Educa",
    template: "%s | LCJ Educa"
  },
  description: "Plataforma de educação do Laboratório de Comunicação e Jornalismo",
  generator: 'Deploy-IT'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Script para detectar e aplicar o tema antes do React iniciar */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  const theme = storedTheme || (prefersDark ? 'dark' : 'light');
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                  
                  // Criar estilo inline para o preloader
                  const style = document.createElement('style');
                  style.textContent = 
                    '.preloader-init {' +
                    '  position: fixed;' +
                    '  top: 0;' +
                    '  left: 0;' +
                    '  width: 100%;' +
                    '  height: 100%;' +
                    '  z-index: 9999;' +
                    '  display: flex;' +
                    '  align-items: center;' +
                    '  justify-content: center;' +
                    '  background-color: ' + (theme === 'dark' ? '#121212' : '#ffffff') + ';' +
                    '  transition: opacity 0.5s;' +
                    '}' +
                    '.preloader-spinner {' +
                    '  width: 50px;' +
                    '  height: 50px;' +
                    '  border: 3px solid transparent;' +
                    '  border-top-color: ' + (theme === 'dark' ? '#ffffff' : '#0f172a') + ';' +
                    '  border-radius: 50%;' +
                    '  animation: spin 1s linear infinite;' +
                    '}' +
                    '@keyframes spin {' +
                    '  0% { transform: rotate(0deg); }' +
                    '  100% { transform: rotate(360deg); }' +
                    '}';
                  document.head.appendChild(style);
                  
                  // Criar e inserir preloader
                  const preloader = document.createElement('div');
                  preloader.className = 'preloader-init';
                  preloader.innerHTML = '<div class="preloader-spinner"></div>';
                  document.body.appendChild(preloader);
                  
                  // Remover preloader quando o React estiver pronto
                  window.addEventListener('load', function() {
                    setTimeout(function() {
                      preloader.style.opacity = '0';
                      setTimeout(function() {
                        preloader.remove();
                      }, 500);
                    }, 200);
                  });
                } catch (e) {
                  console.error('Erro ao configurar tema:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LoadingProvider>
            <ClientLayout>
              <Preloader />
              {children}
              <BackToTop />
            </ClientLayout>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}