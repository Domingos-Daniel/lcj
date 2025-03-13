"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import Image from "next/image";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useEffect, useState } from "react";
import { useLoading } from "./loading-provider";
import { useSession, signOut } from "next-auth/react";
import { useAuth } from "@/context/auth-context";

const LOGO_DARK = "https://lcj-educa.com/wp-content/uploads/2024/05/2-e1715125937459.png";
const LOGO_LIGHT = "https://lcj-educa.com/wp-content/uploads/2024/05/1-e1715125891640.png";

export function Header() {
  const pathname = usePathname();
  const { theme, mounted } = useTheme();
  const { setIsLoading } = useLoading();
  const [currentLogo, setCurrentLogo] = useState(LOGO_LIGHT);
  const { data: session, status: nextAuthStatus } = useSession();
  const { user, isAuthenticated, logout } = useAuth();

  // Determinar se o usuário está autenticado por qualquer um dos métodos
  const isUserAuthenticated = isAuthenticated || nextAuthStatus === "authenticated";
  
  // Dados do usuário, priorizando o token personalizado sobre o NextAuth
  const userData = user || session?.user;

  useEffect(() => {
    if (mounted) {
      setCurrentLogo(theme === "dark" ? LOGO_DARK : LOGO_LIGHT);
    }
  }, [theme, mounted]);

  const handleNavigation = () => {
    setIsLoading(true);
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true); // Ativar indicador de carregamento
      
      // Limpar tokens do localStorage
      localStorage.removeItem("wp_token");
      localStorage.removeItem("jwt_token");
      
      // Limpar cookies de autenticação
      document.cookie = "wp_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      document.cookie = "jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      document.cookie = "next-auth.callback-url=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      
      // Deslogar via sistema de autenticação personalizado (se aplicável)
      if (isAuthenticated) {
        await logout();
      }
      
      // Deslogar via NextAuth (se aplicável)
      if (nextAuthStatus === "authenticated") {
        await signOut({ redirect: false });
      }
      
      // Redirecionar para a página de login após logout completo
      window.location.href = "/auth";
    } catch (error) {
      console.error("Erro durante logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full h-14 border-b bg-background/95">
        <div className="container flex h-full items-center">
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-950/95 dark:border-gray-800">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" onClick={handleNavigation}>
            <Image
              src={currentLogo}
              alt="LCJ Logo"
              width={100}
              height={40}
              priority
              className="w-auto h-8 transition-all duration-300"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center space-x-6">
            <MainNav currentPath={pathname} />
          </nav>
          <MobileNav currentPath={pathname} />
          <div className="hidden md:flex relative">
            <Input type="search" placeholder="Pesquisar aqui..." className="w-[200px] lg:w-[300px]" />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          {isUserAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href={`/profile`}>
                {userData?.image || userData?.avatar ? (
                  <img
                    src={userData?.image || userData?.avatar}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full cursor-pointer"
                  />
                ) : (
                  <div className="h-8 w-8 cursor-pointer rounded-full bg-primary flex items-center justify-center text-white">
                    {(userData?.name || userData?.email || "").charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
              <button
                className="text-sm text-gray-700 hover:underline dark:text-gray-300"
                onClick={handleSignOut}
              >
                Sair
              </button>
            </div>
          ) : (
            <Link href="/auth" onClick={handleNavigation}>
              <Button id="user-account">Entrar</Button>
            </Link>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}