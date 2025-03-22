"use client"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getNavigationLinks } from "@/lib/navigation"
import { useState } from "react"
import { SearchModal } from "./search-modal"

interface MobileNavProps {
  currentPath?: string
}

export function MobileNav({ currentPath }: MobileNavProps) {
  const navLinks = getNavigationLinks()
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  return (
    <>
      <div className="md:hidden flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              id="mobile-menu-button"
              variant="ghost" 
              size="icon" 
              className="md:hidden focus:outline-none"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-[300px] sm:w-[400px] overflow-y-auto"
          >
            <nav id="mobile-navigation" className="mt-6 flex flex-col gap-4">
              {navLinks.map((section) => (
                <div key={section.title} className="flex flex-col gap-2">
                  {section.href && !section.items ? (
                    <a
                      href={section.href}
                      id={`dropdown-menu-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className={cn(
                        "font-medium hover:text-primary text-left",
                        currentPath === section.href && "text-primary"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {section.title}
                    </a>
                  ) : (
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
                        <a
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "text-muted-foreground hover:text-primary text-left",
                            currentPath === item.href && "text-primary font-medium"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      
      <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}

