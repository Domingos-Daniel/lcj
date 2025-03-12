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
  login: (token: string, userData: any, redirectUrl?: string) => void;
  logout: () => void;
  loading: boolean;
  refreshUserData: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>;
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
      //console.log("Buscando detalhes do usuário com token:", token.substring(0, 10) + "...");
      
      // Usar token na URL em vez de no header
      const url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/lcj/v1/user/details&token=${encodeURIComponent(token)}`;
      //console.log("URL completa:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "omit" // Não enviar cookies para evitar conflitos
      });
      
      //console.log("Status da resposta:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao buscar detalhes do usuário:", response.status, response.statusText);
        console.error("Texto do erro:", errorText);
        
        if (response.status === 401) {
          console.error("Token inválido ou expirado");
          
          // Testar o endpoint de debug para verificar o problema
          try {
            const debugResponse = await fetch(
              `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/lcj/v1/debug-token&token=${encodeURIComponent(token)}`
            );
            const debugData = await debugResponse.json();
            //console.log("Dados de debug do token:", debugData);
          } catch (debugError) {
            console.error("Erro ao verificar debug do token:", debugError);
          }
        }
        return null;
      }
      
      const userData = await response.json();
      //console.log("Detalhes do usuário recebidos:", userData);
      
      // Verificar se o usuário fez login via OAuth
      const isOAuthUser = userData.oauth_user === true;
      
      return {
        ...userData,
        oauth: isOAuthUser, // Adicionar a propriedade oauth
      };
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
            createdAt: userData.registered || new Date().toISOString(),
            oauth: userData.oauth|| false, // Adicionar a propriedade oauth
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
              createdAt: userData.registered || new Date().toISOString(),
              oauth: true, // Marca o usuário como OAuth
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
              createdAt: userData.registered || new Date().toISOString(),
              oauth: userData.oauth || false, // Adicionar a propriedade oauth
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
            //console.log("Tentando sincronizar usuário Google com WordPress");
            
            // Verificar se temos uma URL do WordPress válida
            if (!process.env.NEXT_PUBLIC_WORDPRESS_URL) {
              console.error("URL do WordPress não configurada");
              throw new Error("URL do WordPress não configurada");
            }
            
            const wpURL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
            //console.log("Chamando endpoint WordPress:", `${wpURL}/?rest_route=/lcj/v1/oauth/google`);
            
            // Detectar provedor de autenticação
            const authProvider = session?.provider || 
                                (session?.user?.image?.includes('google') ? 'google' : 
                                 session?.user?.image?.includes('facebook') ? 'facebook' : 'unknown');

            // Construir URL para endpoint correto
            const oauthEndpoint = authProvider === 'facebook' ? 
                                 `${wpURL}/?rest_route=/lcj/v1/oauth/facebook` :
                                 `${wpURL}/?rest_route=/lcj/v1/oauth/google`;

            const response = await fetch(oauthEndpoint, {
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
              // Adicionar timeout para não ficar esperando indefinidamente
              signal: AbortSignal.timeout(10000) // 10 segundos de timeout
            });
            
            // Log do código de status
            //console.log(`Status da resposta: ${response.status} ${response.statusText}`);
            
            // Verificar se tem resposta válida
            let responseText;
            let data;
            
            try {
              responseText = await response.text();
              //console.log("Resposta do WordPress (texto):", responseText);
              data = JSON.parse(responseText);
              //console.log("Resposta do WordPress (JSON):", data);
            } catch (parseError) {
              console.error("Erro ao analisar resposta JSON:", parseError);
              
              // Tentar determinar o erro com base no texto da resposta
              if (responseText && responseText.includes("<!DOCTYPE html>")) {
                throw new Error("O WordPress retornou HTML em vez de JSON. Verifique se a API REST está ativada e o endpoint está registrado corretamente.");
              } else {
                throw new Error("Erro ao processar resposta");
              }
            }
            
            // Verificar se teve sucesso
            if (response.ok && data?.success && data?.token) {
              //console.log("Token recebido do WordPress");
              localStorage.setItem("wp_token", data.token);
              
              // Buscar dados atualizados do usuário
              const userData = await fetchWpUserDetails(data.token);
              
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
                  createdAt: userData.registered || new Date().toISOString(),
                  oauth: userData.oauth || false, // Adicionar a propriedade oauth
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
            } else {
              console.error("Falha na sincronização com WordPress:", data?.message || "Erro desconhecido");
              
              // Se o erro for 404, informar especificamente sobre o endpoint
              if (response.status === 404) {
                throw new Error(`Endpoint não encontrado (404). O endpoint /lcj/v1/oauth/google não está registrado no WordPress.`);
              } else {
                throw new Error(data?.message || "Erro desconhecido na sincronização");
              }
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
            
            // Mostrar toast com mensagem mais específica
            toast({
              title: "Atenção",
              description: `Login realizado, mas não foi possível sincronizar com o WordPress. ${error instanceof Error ? error.message : ""}`,
              variant: "destructive",
              duration: 7000,
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

  const login = (token: string, userData: User, redirectUrl?: string) => {
    localStorage.setItem("wp_token", token);
    
    // Definir cookie com atributos apropriados para localhost
    document.cookie = `wp_token=${token}; path=/; max-age=${30 * 24 * 3600}; SameSite=Lax;`;
    
    // Limpar o cookie de callback do NextAuth
    document.cookie = "next-auth.callback-url=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    
    setUser(userData);
    
    if (redirectUrl) {
      // Usar window.location para fazer um redirecionamento mais "forte"
      window.location.href = redirectUrl;
      // Alternativamente, você pode manter o router.push, mas talvez precise de
      // return; para garantir que o redirecionamento aconteça antes de qualquer outro código
    }
  };

  const logout = () => {
    localStorage.removeItem("wp_token");
    setUser(null);
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/wp/v2/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          email,
          password,
          name,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        login(data.token, {
          id: data.user_id,
          email: data.user_email,
          name: data.user_display_name,
          avatar: data.user_avatar,
        });
        return { success: true };
      } else {
        return { success: false, message: data.message || "Erro ao criar conta" };
      }
    } catch (error) {
      return { success: false, message: "Erro ao conectar com o servidor. Tente novamente mais tarde." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        loading,
        refreshUserData,
        signup
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