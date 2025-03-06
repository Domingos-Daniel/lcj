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
import { getNavigationLinks } from "@/lib/navigation"

interface MainNavProps {
  currentPath?: string
}

export function MainNav({ currentPath }: MainNavProps) {
  const navLinks = getNavigationLinks();
  
  return (
    <NavigationMenu id="main-menu">
      <NavigationMenuList>
        {navLinks.map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.href && !item.items ? (
              // Simple link without dropdown
              <Link href={item.href} className={cn(
                navigationMenuTriggerStyle(),
                currentPath === item.href && "bg-accent text-accent-foreground",
              )}>
                {item.title}
              </Link>
            ) : (
              // Dropdown menu
              <>
                <NavigationMenuTrigger id="dropdown-menu">{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                    {item.items?.map((subItem) => (
                      <ListItem 
                        key={subItem.href}
                        href={subItem.href} 
                        title={subItem.title} 
                        active={currentPath === subItem.href}
                      >
                        {subItem.description || subItem.title}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

// ListItem component remains the same
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

