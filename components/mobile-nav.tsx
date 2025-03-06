"use client"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { getNavigationLinks } from "@/lib/navigation"

interface MobileNavProps {
  currentPath?: string
}

export function MobileNav({ currentPath }: MobileNavProps) {
  const navLinks = getNavigationLinks();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          id="mobile-menu-button" 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav id="mobile-navigation" className="mt-6 flex flex-col gap-4">
          {navLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              {section.href && !section.items ? (
                // Direct link if href is provided and no items
                <Link
                  href={section.href}
                  className={cn(
                    "font-medium hover:text-primary",
                    currentPath === section.href && "text-primary"
                  )}
                >
                  {section.title}
                </Link>
              ) : (
                // Section title for dropdowns
                <div id={`mobile-${section.title.toLowerCase().replace(/\s+/g, '-')}`} className="font-medium">
                  {section.title}
                </div>
              )}
              
              {section.items && section.items.length > 0 && (
                <div id={`mobile-${section.title.toLowerCase().replace(/\s+/g, '-')}-items`} className="flex flex-col gap-1 pl-4">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "text-muted-foreground hover:text-primary",
                        currentPath === item.href && "text-primary font-medium",
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

