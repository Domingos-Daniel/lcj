"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Check, AlertCircle, Phone, Mail, CreditCard, MessageSquare,
  User, Lock, AtSign, Calendar, Smartphone, ShieldCheck, BadgeCheck,
  Copy, CheckCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { PasswordInput } from "@/components/password-input";

// Modify plans to only show the paid plan
const plans = [{
  name: "Acesso Mensal",
  price: "2.500 Kzs/mês",
  description: "Acesso completo a todo conteúdo do LCJ",
  features: [
    "Acesso completo a todos artigos jurídicos",
    "Acesso a todas peças processuais",
    "Recursos de leitura avançados",
    "Favoritar conteúdos",
    "Rastreamento de leitura",
    "Suporte prioritário"
  ],
}]

export default function CadastramentoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false
  });
  const [error, setError] = useState("");
  const [ibanCopied, setIbanCopied] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const copyIban = () => {
    navigator.clipboard.writeText("AO06.0040.0000.9749.2262.1012.7");
    setIbanCopied(true);
    toast({
      title: "IBAN copiado!",
      description: "O número IBAN foi copiado para a área de transferência",
      duration: 3000,
    });
    
    setTimeout(() => setIbanCopied(false), 2000);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Validação básica
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não correspondem");
      setLoading(false);
      return;
    }
    
    if (!formData.terms) {
      setError("Você precisa aceitar os termos e condições");
      setLoading(false);
      return;
    }
    
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
        AUTH_KEY: process.env.NEXT_PUBLIC_AUTH_CODE || ""
      });
      
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
          title: "Cadastro realizado com sucesso!",
          description: "Redirecionando para a página de login...",
          duration: 3000,
        });
        
        // Redirecionar para a página de autenticação após um breve delay
        setTimeout(() => {
          router.push('/auth');
        }, 1500);
      } else {
        // Extrair mensagem de erro específica da API
        const errorMessage = data.message || data.error || "Erro ao criar conta. Tente novamente.";
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
      setLoading(false);
    }
  };
  
  // Função para cadastro com Google
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
      
      setGoogleLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section - Mais objetivo */}
        <section className="bg-gradient-to-b from-primary/10 to-background pt-20 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl">
              Cadastre-se para Acesso Premium
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Complete seu cadastro e faça o pagamento para acessar todo o conteúdo jurídico da plataforma
            </p>
          </div>
        </section>

        {/* Steps Section - Nova seção */}
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
              <div className="flex-1 flex flex-col items-center text-center p-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Faça o Cadastro</h3>
                <p className="text-muted-foreground text-sm">
                  Preencha o formulário com seus dados
                </p>
              </div>
              <div className="flex-1 flex flex-col items-center text-center p-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Realize o Pagamento</h3>
                <p className="text-muted-foreground text-sm">
                  Efetue o pagamento via Multicaixa ou transferência
                </p>
              </div>
              <div className="flex-1 flex flex-col items-center text-center p-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Envie o Comprovante</h3>
                <p className="text-muted-foreground text-sm">
                  Envie o comprovante via WhatsApp para ativação
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Simplificado */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <Card className="border-primary shadow-lg">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <CardTitle className="flex items-center justify-center text-2xl">
                    <ShieldCheck className="h-6 w-6 text-primary mr-2" />
                    Assinatura Premium
                  </CardTitle>
                  <div className="mt-4 text-center">
                    <div className="text-4xl font-bold">2.500 Kzs</div>
                    <div className="text-sm text-muted-foreground">por mês</div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {plans[0].features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <div className="rounded-full p-1 bg-primary/10 text-primary">
                          <Check className="h-4 w-4" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Payment Options - Mantido e melhorado */}
            <Alert className="mt-10 max-w-xl mx-auto bg-amber-50 border-amber-300 text-amber-900">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Importante:</AlertTitle>
              <AlertDescription className="mt-2">
                Após realizar o cadastro, efetue o pagamento e envie o comprovante junto com seus dados cadastrais para validação imediata.
              </AlertDescription>
            </Alert>

            <div className="mt-6 max-w-3xl mx-auto bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                Opções de Pagamento:
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Multicaixa Express:</div>
                    <div className="text-lg font-mono">+244 940 418 435</div>
                  </div>
                </div>
                
                {/* IBAN responsivo com botão de copiar */}
                <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                  <div className="bg-primary/10 rounded-full p-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 break-words">
                    <div className="font-medium">IBAN Banco BAI:</div>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-sm sm:text-base break-all bg-muted/70 rounded px-2 py-1 font-mono">
                        AO06.0040.0000.9749.2262.1012.7
                      </code>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="shrink-0 h-9 w-9" 
                        onClick={copyIban}
                      >
                        {ibanCopied ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">Titular: Arnaldo Leandro Gonga Miguel</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form Section - Mantido como está */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              {status === "authenticated" ? (
                <Card className="shadow-lg border-t-4 border-t-green-500">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Bem-vindo de volta, {session.user.name}!</CardTitle>
                    <CardDescription>
                      Você já está autenticado na plataforma LCJ.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-6">
                    <div className="flex justify-center">
                      <div className="bg-green-100 rounded-full p-6">
                        <Check className="h-10 w-10 text-green-600" />
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      Você já possui uma conta ativa. Para acessar todos os recursos da plataforma, 
                      navegue até sua área pessoal ou continue explorando os conteúdos disponíveis.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button asChild>
                        <Link href="/profile">
                          Meu Perfil
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/">
                          Explorar Conteúdo
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg border-t-4 border-t-primary">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Cadastre-se Agora</CardTitle>
                    <CardDescription>
                      Crie sua conta para acessar todos os conteúdos jurídicos da plataforma LCJ.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <div className="mb-4 p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                        {error}
                      </div>
                    )}
                    
                    <Tabs defaultValue="form" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="form">Formulário</TabsTrigger>
                        <TabsTrigger value="social">Cadastro Social</TabsTrigger>
                      </TabsList>
                      <TabsContent value="form">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                          <div className="space-y-4">
                            <div className="grid gap-2">
                              <Label htmlFor="name" className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Nome Completo
                              </Label>
                              <Input 
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Digite seu nome completo" 
                                className="bg-background"
                                required 
                              />
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                  <AtSign className="h-4 w-4 text-muted-foreground" />
                                  Email
                                </Label>
                                <Input 
                                  id="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  type="email" 
                                  placeholder="seu@email.com" 
                                  className="bg-background"
                                  required 
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                                  Telefone
                                </Label>
                                <Input 
                                  id="phone"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  type="tel" 
                                  placeholder="+244 XXX XXX XXX" 
                                  className="bg-background"
                                  required 
                                />
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="password" className="flex items-center gap-2">
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                  Senha
                                </Label>
                                <PasswordInput 
                                  id="password"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  placeholder="********" 
                                  className="bg-background"
                                  required 
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                  Confirmar Senha
                                </Label>
                                <PasswordInput 
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleChange}
                                  placeholder="********" 
                                  className="bg-background"
                                  required 
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="terms" 
                                name="terms"
                                checked={formData.terms}
                                onCheckedChange={(checked) => 
                                  setFormData(prev => ({ ...prev, terms: checked === true }))
                                }
                                required 
                              />
                              <Label htmlFor="terms" className="text-sm">
                                Concordo com os{" "}
                                <Link href="/terms" className="text-primary hover:underline">
                                  Termos de Uso
                                </Link>{" "}
                                e{" "}
                                <Link href="/privacy-policy" className="text-primary hover:underline">
                                  Política de Privacidade
                                </Link>
                              </Label>
                            </div>
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full" 
                            size="lg"
                            disabled={loading}
                          >
                            {loading ? "Processando..." : "Cadastrar e Continuar"}
                          </Button>
                        </form>
                      </TabsContent>
                      <TabsContent value="social">
                        <div className="flex flex-col space-y-4">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={handleGoogleSignup}
                            disabled={googleLoading}
                          >
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
                            {googleLoading ? "Redirecionando..." : "Continuar com Google"}
                          </Button>
                          {/* Botão do Facebook removido conforme solicitado */}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      Já possui uma conta?
                    </p>
                    <Button variant="link" asChild>
                      <Link href="/auth">Faça login</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Contact Section - Mantido como está */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">Precisa de Ajuda?</h2>
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <p className="text-lg mb-6">
                  Não hesite em nos contactar para qualquer informação. Nossa equipe está pronta para ajudar!
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
                  <div className="flex flex-col items-center p-4 rounded-lg border bg-background">
                    <div className="bg-primary/10 rounded-full p-4 mb-3">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <a href="https://wa.me/244940418442" className="text-lg font-mono hover:text-primary transition-colors">
                      +244 940 418 442
                    </a>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 rounded-lg border bg-background">
                    <div className="bg-primary/10 rounded-full p-4 mb-3">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">Telefone</h3>
                    <a href="tel:+244958730565" className="text-lg font-mono hover:text-primary transition-colors">
                      +244 958 730 565
                    </a>
                  </div>
                </div>
                
                <div className="mt-6 text-muted-foreground">
                  <p>Horário de atendimento: Segunda a Sexta, 08:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

// Ícones que não foram importados no cabeçalho
function Book(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  )
}

function BookOpen(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function HeadphonesIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

