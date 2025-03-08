"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();

  useEffect(() => {
    // Verificar se temos um token do WordPress no localStorage
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
    } else if (session) {
      // Se não temos token do WordPress mas temos uma sessão NextAuth
      setUser({
        id: session.user?.email,
        name: session.user?.name,
        email: session.user?.email,
        avatar: session.user?.image,
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [session]);

  const login = (token: string, userData: any) => {
    localStorage.setItem("wp_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("wp_token");
    setUser(null);
    // Se usando NextAuth, você também precisa chamar signOut()
    // signOut();
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