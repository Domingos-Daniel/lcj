"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se temos um token do WordPress no localStorage
    try {
      const token = localStorage.getItem("wp_token");
      
      if (token) {
        // Verificar a validade do token com o WordPress
        fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/lcj/v1/validate-token`, {
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
              toast({
                title: "Bem-vindo de volta!",
                description: `Olá, ${data.user.name || "usuário"}!`,
                variant: "success",
                duration: 3000,
              });
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
        
        toast({
          title: "Login bem-sucedido!",
          description: `Bem-vindo, ${session.user?.name || "usuário"}!`,
          variant: "success",
          duration: 3000,
        });
        
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro no contexto de autenticação:", error);
      setLoading(false);
    }
  }, [session, status, toast]);

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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        loading,
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