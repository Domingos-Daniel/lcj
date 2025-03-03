"use client"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  {
    title: "Matérias de Direito",
    items: [
      { title: "Direito Civil", href: "/materias/civil" },
      { title: "Direito Penal", href: "/materias/penal" },
      { title: "Direito Trabalhista", href: "/materias/trabalho" },
      { title: "Direito Empresarial", href: "/materias/empresarial" },
    ],
  },
  {
    title: "Peças Processuais",
    items: [
      { title: "Petições", href: "/pecas/peticoes" },
      { title: "Recursos", href: "/pecas/recursos" },
      { title: "Documentos", href: "/pecas/documentos" },
    ],
  },
]

interface MobileNavProps {
  currentPath?: string
}

export function MobileNav({ currentPath }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="mt-6 flex flex-col gap-4">
          {links.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <div className="font-medium">{section.title}</div>
              <div className="flex flex-col gap-1 pl-4">
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
            </div>
          ))}
          <Link
            href="/cadastramento"
            className={cn("font-medium hover:text-primary", currentPath === "/cadastramento" && "text-primary")}
          >
            Cadastramento
          </Link>
          <Link
            href="/sobre"
            className={cn("font-medium hover:text-primary", currentPath === "/sobre" && "text-primary")}
          >
            Quem Somos
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

