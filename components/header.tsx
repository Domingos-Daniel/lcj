"use client";
import { usePathname } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useAuth } from "@/context/auth-context";
import { SearchModal } from "@/components/search-modal";

const LOGO_DARK = "https://lcj-educa.com/wp-content/uploads/2024/05/2-e1715125937459.png";
const LOGO_LIGHT = "https://lcj-educa.com/wp-content/uploads/2024/05/1-e1715125891640.png";

export function Header() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { data: session, status: nextAuthStatus } = useSession();
  const { user, isAuthenticated, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isUserAuthenticated = isAuthenticated || nextAuthStatus === "authenticated";
  const userData = user || session?.user;
  const currentLogo = theme === "dark" ? LOGO_DARK : LOGO_LIGHT;

  const handleSignOut = () => {
    // Limpar storage e cookies
    localStorage.clear();
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/");
    });
    
    // Redirecionar para página de login
    window.location.href = "/auth";
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-950/95 dark:border-gray-800">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/">
              <img
                src={currentLogo}
                alt="LCJ Logo"
                className="w-auto h-8"
              />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center space-x-6">
              <MainNav currentPath={pathname} />
            </nav>
            <MobileNav currentPath={pathname} />
            
            <div className="hidden md:flex relative">
              <Input 
                type="search" 
                placeholder="Pesquisar aqui..." 
                className="w-[200px] lg:w-[300px]" 
                onClick={() => setIsSearchOpen(true)}
                readOnly 
              />
              <Search 
                className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" 
              />
            </div>

            {isUserAuthenticated ? (
              <div className="flex items-center gap-4">
                <a href="/profile">
                  {userData?.image || userData?.avatar ? (
                    <img
                      src={userData?.image || userData?.avatar}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                      {(userData?.name || userData?.email || "").charAt(0).toUpperCase()}
                    </div>
                  )}
                </a>
                <button
                  className="text-sm text-gray-700 hover:underline dark:text-gray-300"
                  onClick={handleSignOut}
                >
                  Sair
                </button>
              </div>
            ) : (
              <a href="/auth" className="inline-flex">
                <Button variant="default">Entrar</Button>
              </a>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      
      <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}