"use client"

import * as React from "react"
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
              <a 
                href={item.href} 
                className={cn(
                  navigationMenuTriggerStyle(),
                  currentPath === item.href && "bg-accent text-accent-foreground",
                )}
              >
                {item.title}
              </a>
            ) : (
              // Dropdown menu
              <>
                <NavigationMenuTrigger id="dropdown-menu">{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                    {item.items?.map((subItem) => (
                      <SimpleListItem 
                        key={subItem.href}
                        href={subItem.href} 
                        title={subItem.title} 
                        active={currentPath === subItem.href}
                      >
                        {subItem.description || subItem.title}
                      </SimpleListItem>
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

// Simplified ListItem component with standard <a> tag
const SimpleListItem = ({ 
  className, 
  title, 
  children, 
  active, 
  href, 
  ...props 
}: { 
  className?: string;
  title: string;
  children: React.ReactNode;
  active?: boolean;
  href: string;
}) => {
  return (
    <li>
      <a
        href={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          active && "bg-accent text-accent-foreground",
          className,
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
      </a>
    </li>
  )
}

