import "./globals.css";
import { Inter } from "next/font/google";
import ClientProvider from "./ClientProvider";
import { metadata } from "./metadata";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
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
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}