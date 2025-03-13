"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PasswordInput } from "@/components/password-input";
import zxcvbn from "zxcvbn";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    acceptTerms: false
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "password") {
      const result = zxcvbn(value);
      setPasswordStrength(result.score); // 0-4 (0 = weak, 4 = strong)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Função para signup com Google
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      toast({
        title: "Redirecionando...",
        description: "Você será redirecionado para o Google para criar sua conta",
        duration: 3000,
      });
      
      await signIn("google", { 
        callbackUrl: "/profile" 
      });
    } catch (error) {
      console.error("Erro no cadastro com Google:", error);
      toast({
        title: "Erro no cadastro",
        description: "Falha ao cadastrar com Google. Por favor, tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  // Modificando a função handleSubmit para incluir o AUTH_KEY
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      setError("Você precisa aceitar os termos e condições.");
      return;
    }
    
    if (passwordStrength < 2) {
      setError("Por favor, use uma senha mais forte.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Formatação conforme documentação do Simple JWT Login
      const baseUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/simple-jwt-login/v1/users`;
      
      // Construir URL com parâmetros (conforme documentação)
      const params = new URLSearchParams({
        email: formData.email,
        password: formData.password,
        display_name: formData.name,
        first_name: formData.name.split(' ')[0],
        last_name: formData.name.split(' ').slice(1).join(' '),
        // Adicionar AUTH_KEY necessário para registro
        AUTH_KEY: process.env.NEXT_PUBLIC_AUTH_CODE || ""      });
      
      if (formData.phone) {
        params.append("meta_input[phone]", formData.phone);
      }
      
      const url = `${baseUrl}&${params.toString()}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Redirecionando para a página de login...",
          variant: "success",
          duration: 3000,
        });
        
        // Redirecionar para login após cadastro bem-sucedido
        setTimeout(() => {
          router.push("/auth");
        }, 1500);
      } else {
        // Extrair mensagem de erro específica da API
        const errorMessage = data.message || data.error || "Erro ao criar conta. Tente novamente.";
        console.error("Resposta de erro:", data);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setError(error instanceof Error ? error.message : "Erro ao criar conta. Tente novamente.");
      
      toast({
        title: "Erro no cadastro",
        description: error instanceof Error ? error.message : "Erro ao criar conta. Tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 0: return "Muito fraca";
      case 1: return "Fraca";
      case 2: return "Razoável";
      case 3: return "Boa";
      case 4: return "Forte";
      default: return "";
    }
  };
  
  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return "bg-red-500";
      case 1: return "bg-orange-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-green-400";
      case 4: return "bg-green-600";
      default: return "bg-gray-200";
    }
  };
  
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <Link href="/" className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          LCJ - Laboratório de Ciências Jurídicas
        </Link>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Juntar-se à LCJ Educa foi a melhor decisão que tomei para minha carreira jurídica.
              Os recursos e o conhecimento disponíveis são incomparáveis."
            </p>
            <footer className="text-sm">Dr. Marcos Silva, Advogado</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
              <CardDescription>Preencha os dados abaixo para se cadastrar na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="grid gap-6">
                {/* Botões de login social */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleGoogleSignup}
                    disabled={googleLoading || isLoading}
                    className="w-full"
                  >
                    {googleLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                    )}
                    Google
                  </Button>
                  <Button variant="outline" disabled={isLoading} className="w-full">
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou continue com email</span>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Digite seu nome completo"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+244 9XX XXX XXX"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="password">Palavra-passe</Label>
                      <PasswordInput
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      
                      {formData.password && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Força da senha</span>
                            <span className={
                              passwordStrength < 2 ? "text-red-500" :
                              passwordStrength < 3 ? "text-orange-500" :
                              passwordStrength < 4 ? "text-yellow-500" :
                              "text-green-500"
                            }>
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className={`h-1 ${getPasswordStrengthColor()}`} style={{ width: `${(passwordStrength + 1) * 20}%` }} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="acceptTerms" 
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                        }
                        required
                      />
                      <label
                        htmlFor="acceptTerms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Concordo com os{" "}
                        <Link href="#" className="text-primary hover:underline">
                          Termos de Uso
                        </Link>{" "}
                        e{" "}
                        <Link href="#" className="text-primary hover:underline">
                          Política de Privacidade
                        </Link>
                      </label>
                    </div>
                    
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Cadastrar
                    </Button>
                    
                    <p className="text-center text-sm text-muted-foreground">
                      Já possui uma conta?{" "}
                      <Link href="/auth" className="text-primary hover:underline">
                        Faça login
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

