"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react"; // removido Facebook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

// Componente para o logo do Google
const GoogleLogo = () => (
  <svg 
    className="mr-2 h-4 w-4" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 48 48" 
    width="18px" 
    height="18px"
  >
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();
  const { status } = useSession();

  // Redirecionar usuário autenticado
  useEffect(() => {
    if (status === "authenticated") {
      router.push(searchParams?.get("callbackUrl") || "/profile");
    }
  }, [status, router, searchParams]);

  // Função para login com Google (evita loading global)
  const handleGoogleLogin = async () => {
    setIsSocialLoading(true);
    try {
      await signIn("google", { callbackUrl: "/profile" });
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Falha ao entrar com Google. Tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSocialLoading(false);
    }
  };

  // Remova ou comente a função handleFacebookLogin
  // const handleFacebookLogin = async () => {
  //   setIsSocialLoading(true);
  //   try {
  //     await signIn("facebook", { callbackUrl: "/profile" });
  //   } catch (error) {
  //     toast({
  //       title: "Erro no login",
  //       description: "Falha ao entrar com Facebook. Tente novamente.",
  //       variant: "destructive",
  //       duration: 5000,
  //     });
  //   } finally {
  //     setIsSocialLoading(false);
  //   }
  // };

  // Função para login com credenciais do WordPress via JWT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      // Verifica se é um e-mail ou nome de usuário
      if (email.includes("@")) {
        formData.append("email", email);
      } else {
        formData.append("username", email);
      }
      formData.append("password", password);
      formData.append("AUTH_KEY", process.env.NEXT_PUBLIC_AUTH_CODE || "");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/simple-jwt-login/v1/auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const data = await response.json();
      //console.log("Resposta do login:", data);

      if (!response.ok || !data.success || !data.data?.jwt) {
        let errorMessage = "Erro ao fazer login.";

        if (data.data?.message) {
          switch (data.data.message) {
            case "Wrong user credentials.":
              errorMessage = "Usuário ou senha incorretos.";
              break;
            case "User not found.":
              errorMessage = "Usuário não encontrado.";
              break;
            case "Missing parameters.":
              errorMessage = "Preencha todos os campos.";
              break;
            default:
              errorMessage = data.data.message;
          }
        }

        setError(errorMessage);
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      const token = data.data.jwt;
      localStorage.setItem("jwt_token", token);

      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando...",
        duration: 1000,
      });

      //console.log("Redirecionando para o /profile com token:", token);
      login(token, data.data.user, "/profile");
    } catch (error) {
      setError("Erro ao conectar com o servidor.");
      toast({
        title: "Erro no servidor",
        description: "Erro ao conectar com o servidor. Tente novamente mais tarde.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Entrar na plataforma</CardTitle>
          <CardDescription>Entre com suas credenciais abaixo ou use uma rede social</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>
          )}

          <div className="grid gap-4">
            {/* Botão de login social: Google */}
            <Button 
              className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500" 
              onClick={handleGoogleLogin} 
              disabled={isSocialLoading}
            >
              {isSocialLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <GoogleLogo />
                  Entrar com Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Ou continue com email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email ou Nome de Usuário</Label>
                <Input id="email" type="text" placeholder="seuemail@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="password">Palavra Passe</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm font-medium">Lembrar de mim</label>
              </div>

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar"}
              </Button>
            </form>

            <Button variant="link" className="text-xs" asChild>
              <Link href="/auth/signup">Não tem uma conta? Cadastre-se</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
