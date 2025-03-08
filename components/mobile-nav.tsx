"use client"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getNavigationLinks } from "@/lib/navigation"
import { useRouter } from "next/navigation"
import { useState, useCallback } from "react"

interface MobileNavProps {
  currentPath?: string
}

export function MobileNav({ currentPath }: MobileNavProps) {
  const navLinks = getNavigationLinks()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  
  // Função otimizada para navegação
  const handleNavigation = useCallback((href: string) => {
    setIsOpen(false) // Feche o menu imediatamente
    setTimeout(() => {
      router.push(href)
    }, 0)
  }, [router])
  
  return (
    <div className="flex items-center gap-4">
      {/* Botão de Pesquisa no Navbar */}
      <Button
        onClick={() => handleNavigation('/search')}
        variant="ghost"
        size="icon"
        className={cn(
          "md:hidden focus:outline-none active:scale-95 transition-transform",
          currentPath === '/search' && "text-primary"
        )}
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Pesquisar</span>
      </Button>
      
      {/* Botão do Menu e Sidebar (Sheet) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            id="mobile-menu-button"
            variant="ghost" 
            size="icon" 
            className="md:hidden focus:outline-none active:scale-95 transition-transform"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="w-[300px] sm:w-[400px] overflow-y-auto"
          style={{"--sheet-animation-duration": "150ms"} as React.CSSProperties}
        >
          <nav id="mobile-navigation" className="mt-6 flex flex-col gap-4">
            {navLinks.map((section) => (
              <div key={section.title} className="flex flex-col gap-2">
                {section.href && !section.items ? (
                  // Link direto com handler otimizado
                  <button
                    onClick={() => handleNavigation(section.href!)}
                    id={`dropdown-menu-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className={cn(
                      "font-medium hover:text-primary text-left focus:outline-none active:scale-95 transition-transform",
                      currentPath === section.href && "text-primary"
                    )}
                  >
                    {section.title}
                  </button>
                ) : (
                  // Título da seção para dropdowns
                  <div id={`mobile-${section.title.toLowerCase().replace(/\s+/g, '-')}`} className="font-medium">
                    {section.title}
                  </div>
                )}
                
                {section.items && section.items.length > 0 && (
                  <div
                    id={`mobile-${section.title.toLowerCase().replace(/\s+/g, '-')}-items`}
                    className="flex flex-col gap-1 pl-4"
                  >
                    {section.items.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          "text-muted-foreground hover:text-primary text-left focus:outline-none active:scale-95 transition-transform",
                          currentPath === item.href && "text-primary font-medium"
                        )}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

