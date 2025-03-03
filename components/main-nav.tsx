"use client"

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

interface MainNavProps {
  currentPath?: string
}

export function MainNav({ currentPath }: MainNavProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/arquivos/22" className={cn(
            navigationMenuTriggerStyle(),
            currentPath === "/arquivos/22" && "bg-accent text-accent-foreground",
          )}>
            Matérias de Direito
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Peças Processuais</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
              <ListItem 
                href="/arquivos/32" 
                title="Peças Processuais de Direito Público" 
                active={currentPath === "/arquivos/32"}
              >
                Petições, recursos e documentos relacionados ao Direito Público, incluindo Administrativo e Constitucional.
              </ListItem>
              <ListItem 
                href="/arquivos/28" 
                title="Peças Processuais de Direito Privado" 
                active={currentPath === "/arquivos/28"}
              >
                Modelos de petições e documentos para casos de Direito Civil, Empresarial e outras áreas privadas.
              </ListItem>
              <ListItem 
                href="/arquivos/31" 
                title="Peças Processuais de Direito Genéricas" 
                active={currentPath === "/arquivos/31"}
              >
                Modelos gerais e formulários que podem ser adaptados para diferentes áreas do Direito.
              </ListItem>
              <ListItem 
                href="/arquivos/27" 
                title="Todas as Peças Processuais" 
                active={currentPath === "/arquivos/27"}
              >
                Acesse a coleção completa de peças processuais disponíveis em nosso acervo.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link href="/cadastramento" className={cn(
            navigationMenuTriggerStyle(),
            currentPath === "/cadastramento" && "bg-accent text-accent-foreground",
          )}>
            Cadastramento
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link href="/sobre" className={cn(
            navigationMenuTriggerStyle(),
            currentPath === "/sobre" && "bg-accent text-accent-foreground",
          )}>
            Quem Somos
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

// ListItem com Link do Next.js para navegação do lado do cliente
const ListItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"a"> & { 
  active?: boolean; 
  href: string; 
  title: string 
}>(({ className, title, children, active, href, ...props }, ref) => {
  return (
    <li ref={ref}>
      <Link href={href} className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        active && "bg-accent text-accent-foreground",
        className,
      )}>
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
      </Link>
    </li>
  )
})
ListItem.displayName = "ListItem"

