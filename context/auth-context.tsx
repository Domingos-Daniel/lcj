"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
  loading: boolean;
  updateProfile: (userData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const hasShownWelcomeToast = useRef(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("wp_token");
      
      if (token) {
        // Verificar a validade do token com o WordPress
        fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/lcj/v1/validate-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("Token inválido");
          })
          .then((data) => {
            if (data.valid) {
              setUser(data.user);
              
              // Mostrar toast apenas uma vez
              if (!hasShownWelcomeToast.current) {
                toast({
                  title: "Bem-vindo de volta!",
                  description: `Olá, ${data.user.name || "usuário"}!`,
                  variant: "success",
                  duration: 3000,
                });
                hasShownWelcomeToast.current = true;
              }
            } else {
              localStorage.removeItem("wp_token");
            }
          })
          .catch(() => {
            localStorage.removeItem("wp_token");
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (session && status === "authenticated") {
        // Se não temos token do WordPress mas temos uma sessão NextAuth
        setUser({
          id: session.user?.email,
          name: session.user?.name,
          email: session.user?.email,
          avatar: session.user?.image,
        });
        
        // Mostrar toast apenas uma vez
        if (!hasShownWelcomeToast.current) {
          toast({
            title: "Login bem-sucedido!",
            description: `Bem-vindo, ${session.user?.name || "usuário"}!`,
            variant: "success",
            duration: 3000,
          });
          hasShownWelcomeToast.current = true;
        }
        
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro no contexto de autenticação:", error);
      setLoading(false);
    }
  }, [session?.user?.email]);

  const login = (token: string, userData: any) => {
    localStorage.setItem("wp_token", token);
    setUser(userData);
    
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
    hasShownWelcomeToast.current = false;
    
    // Se usando NextAuth, você também precisa chamar signOut()
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
  
  // Função para atualizar perfil
  const updateProfile = async (userData: any): Promise<boolean> => {
    try {
      const token = localStorage.getItem("wp_token");
      
      // Se temos um token WordPress
      if (token) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/lcj/v1/update-profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setUser(prev => ({ ...prev, ...userData }));
          toast({
            title: "Perfil atualizado",
            description: "Suas informações foram salvas com sucesso!",
            variant: "success",
            duration: 3000,
          });
          return true;
        } else {
          toast({
            title: "Erro",
            description: data.message || "Não foi possível atualizar o perfil",
            variant: "destructive",
            duration: 3000,
          });
          return false;
        }
      } else if (session) {
        // Para usuários Google, podemos apenas atualizar o estado local
        // já que não podemos alterar informações do Google
        setUser(prev => ({ ...prev, ...userData }));
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram salvas localmente",
          variant: "success",
          duration: 3000,
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil",
        variant: "destructive",
        duration: 3000,
      });
      return false;
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
        updateProfile
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