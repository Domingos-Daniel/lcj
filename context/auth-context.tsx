"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  gender?: string;
  createdAt?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  // Referências para evitar carregar múltiplas vezes e toasts duplicados
  const hasShownWelcomeToast = useRef(false);
  const initialLoadComplete = useRef(false);

  // Função para buscar detalhes do usuário do WordPress
  const fetchWpUserDetails = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/lcj/v1/user/details`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Erro ao carregar detalhes do usuário:", error);
      return null;
    }
  };

  // Atualizar dados do usuário
  const refreshUserData = async () => {
    try {
      // Verificar se temos token do WordPress (direto ou da sessão NextAuth)
      const wpToken = localStorage.getItem("wp_token") || session?.user?.wpToken;
      
      if (wpToken) {
        const userData = await fetchWpUserDetails(wpToken);
        
        if (userData) {
          setUser({
            id: userData.id,
            name: userData.display_name || `${userData.first_name} ${userData.last_name}`.trim(),
            email: userData.email,
            avatar: userData.avatar,
            firstName: userData.first_name,
            lastName: userData.last_name,
            bio: userData.description,
            phone: userData.phone,
            gender: userData.gender,
            createdAt: userData.registered || new Date().toISOString()
          });
        }
      } else if (session?.user) {
        // Se não temos dados do WP mas temos sessão, usar dados da sessão
        setUser({
          id: session.user.id || session.user.email!,
          name: session.user.name || '',
          email: session.user.email!,
          avatar: session.user.image || undefined
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
    }
  };

  // Efeito para carregar dados do usuário no início
  useEffect(() => {
    const loadUserData = async () => {
      if (initialLoadComplete.current) return;
      if (status === "loading") return;
      
      try {
        setLoading(true);
        
        // Verificar token WordPress no localStorage
        const wpToken = localStorage.getItem("wp_token");
        
        // Se temos token WordPress
        if (wpToken) {
          const userData = await fetchWpUserDetails(wpToken);
          
          if (userData) {
            setUser({
              id: userData.id,
              name: userData.display_name || `${userData.first_name} ${userData.last_name}`.trim(),
              email: userData.email,
              avatar: userData.avatar,
              firstName: userData.first_name,
              lastName: userData.last_name,
              bio: userData.description,
              phone: userData.phone,
              gender: userData.gender,
              createdAt: userData.registered || new Date().toISOString()
            });
            
            if (!hasShownWelcomeToast.current) {
              toast({
                title: "Bem-vindo de volta!",
                description: `Olá, ${userData.display_name || userData.first_name || "usuário"}!`,
                variant: "success",
                duration: 3000,
              });
              hasShownWelcomeToast.current = true;
            }
          } else {
            // Token inválido
            localStorage.removeItem("wp_token");
          }
        }
        // Se temos sessão NextAuth com token WordPress
        else if (session?.user?.wpToken) {
          // Salvar token no localStorage para uso futuro
          localStorage.setItem("wp_token", session.user.wpToken);
          
          const userData = await fetchWpUserDetails(session.user.wpToken);
          
          if (userData) {
            setUser({
              id: userData.id,
              name: userData.display_name || `${userData.first_name} ${userData.last_name}`.trim(),
              email: userData.email,
              avatar: userData.avatar,
              firstName: userData.first_name,
              lastName: userData.last_name,
              bio: userData.description,
              phone: userData.phone,
              gender: userData.gender,
              createdAt: userData.registered || new Date().toISOString()
            });
            
            if (!hasShownWelcomeToast.current) {
              toast({
                title: "Login bem-sucedido!",
                description: `Bem-vindo, ${userData.display_name || userData.first_name || "usuário"}!`,
                variant: "success",
                duration: 3000,
              });
              hasShownWelcomeToast.current = true;
            }
          }
        }
        // Se só temos sessão NextAuth sem token WordPress
        else if (session && status === "authenticated") {
          // Tentar sincronizar com WordPress
          try {
            console.log("Tentando sincronizar usuário Google com WordPress");
            
            // Verificar se temos uma URL do WordPress válida
            if (!process.env.NEXT_PUBLIC_WORDPRESS_URL || 
                process.env.NEXT_PUBLIC_WORDPRESS_URL === window.location.origin) {
              throw new Error("URL do WordPress não configurada ou inválida");
            }
            
            const wpURL = new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL);
            const apiURL = `${wpURL.origin}/?rest_route=/lcj/v1/oauth/google`;
            
            console.log("Chamando endpoint WordPress:", apiURL);
            
            const response = await fetch(apiURL, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: JSON.stringify({
                email: session.user?.email,
                name: session.user?.name,
                picture: session.user?.image,
              }),
            });
            
            // Verificar se a resposta parece HTML em vez de JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("text/html")) {
              console.error("Recebido HTML em vez de JSON. A URL do WordPress está incorreta ou o endpoint não existe.");
              throw new Error("Endpoint WordPress inválido - recebeu HTML");
            }
            
            const responseText = await response.text();
            console.log("Resposta do WordPress (texto):", responseText);
            
            let data;
            try {
              data = JSON.parse(responseText);
              console.log("Resposta do WordPress (JSON):", data);
            } catch (e) {
              console.error("Erro ao analisar resposta JSON:", e);
              data = { success: false, message: "Erro ao processar resposta" };
            }
            
            if (response.ok && data.token) {
              console.log("Token recebido do WordPress:", data.token.substring(0, 10) + "...");
              localStorage.setItem("wp_token", data.token);
              
              // Buscar dados atualizados do usuário
              const userData = await fetchWpUserDetails(data.token);
              
              if (userData) {
                console.log("Dados do usuário recuperados do WordPress:", userData);
                setUser({
                  id: userData.id,
                  name: userData.display_name || `${userData.first_name} ${userData.last_name}`.trim(),
                  email: userData.email,
                  avatar: userData.avatar,
                  firstName: userData.first_name,
                  lastName: userData.last_name,
                  bio: userData.description,
                  phone: userData.phone,
                  gender: userData.gender,
                  createdAt: userData.registered || new Date().toISOString()
                });
                
                if (!hasShownWelcomeToast.current) {
                  toast({
                    title: "Login bem-sucedido!",
                    description: `Bem-vindo, ${userData.display_name || userData.first_name || "usuário"}!`,
                    variant: "success",
                    duration: 3000,
                  });
                  hasShownWelcomeToast.current = true;
                }
              } else {
                console.error("Não foi possível recuperar dados do usuário após autenticação");
              }
            } else {
              console.error("Falha na sincronização com WordPress:", data?.message || "Erro desconhecido");
              // Falha na sincronização com WP, usar dados da sessão apenas
              setUser({
                id: session.user?.id || session.user?.email!,
                name: session.user?.name || '',
                email: session.user?.email!,
                avatar: session.user?.image || undefined
              });
              
              toast({
                title: "Atenção",
                description: "Login realizado, mas não foi possível sincronizar com o WordPress.",
                variant: "destructive",
                duration: 5000,
              });
            }
          } catch (error) {
            console.error("Erro ao sincronizar com WordPress:", error);
            // Usar dados da sessão apenas
            setUser({
              id: session.user?.id || session.user?.email!,
              name: session.user?.name || '',
              email: session.user?.email!,
              avatar: session.user?.image || undefined
            });
          }
        }
        
        initialLoadComplete.current = true;
      } catch (error) {
        console.error("Erro no contexto de autenticação:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [session, status, toast]);

  const login = (token: string, userData: any) => {
    localStorage.setItem("wp_token", token);
    setUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      firstName: userData.firstName,
      lastName: userData.lastName,
      bio: userData.bio,
      phone: userData.phone,
      gender: userData.gender,
      createdAt: userData.registered || new Date().toISOString()
    });
    
    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo, ${userData.name || "usuário"}!`,
      variant: "success",
      duration: 3000,
    });
    
    // Redirecionar para o perfil após login bem-sucedido
    router.push("/profile");
  };

  const logout = () => {
    localStorage.removeItem("wp_token");
    setUser(null);
    hasShownWelcomeToast.current = false; // Redefinir para permitir toast no próximo login
    initialLoadComplete.current = false; // Redefinir para recarregar dados no próximo login
    
    // Se usando NextAuth, também encerrar sessão
    signOut({ redirect: false }).then(() => {
      toast({
        title: "Sessão encerrada",
        description: "Você foi desconectado com sucesso.",
        duration: 3000,
      });
      
      // Redirecionar para a home após logout
      router.push("/");
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        loading,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};