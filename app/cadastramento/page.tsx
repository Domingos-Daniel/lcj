"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Check, AlertCircle, Phone, Mail, CreditCard, MessageSquare,
  User, Lock, AtSign, Calendar, Smartphone, ShieldCheck, BadgeCheck
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Gratuito",
    price: "0 Kzs",
    description: "Para exploração inicial",
    features: [
      "Ver lista de categorias",
      "Ver lista de artigos de materias de Direito",
      "Ver todas listas de peças processuais",
      "Acesso básico ao conteúdo"
    ],
  },
  {
    name: "Mensal",
    price: "2.500 Kzs/mês",
    description: "Acesso completo a todo LCJ",
    features: [
      "Todos os recursos do plano Gratuito",
      "Acesso completo a todos artigos",
      "Acesso a todas peças processuais",
      "Recursos de leitura avançados",
      "Favoritar conteúdos",
      "Rastreamento de leitura",
    ],
    popular: true,
  }
]

export default function CadastramentoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular processo de cadastro
    setTimeout(() => {
      setLoading(false);
      // Redirecionar para a página de autenticação
      router.push('./auth');
    }, 1500);
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
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background pt-20 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Por favor, Faça o seu cadastramento agora!</h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Aproveite, e tenha acesso às mais variadas matérias e peças de direito!
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
              {plans.map((plan) => (
                <Card key={plan.name} className={`relative overflow-hidden ${plan.popular ? "border-primary shadow-xl" : "border-border"}`}>
                  {plan.popular && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white shadow-md">
                      <BadgeCheck className="inline-block h-3 w-3 mr-1" />
                      Recomendado
                    </div>
                  )}
                  <CardHeader className={plan.popular ? "bg-primary/5 border-b border-primary/10" : ""}>
                    <CardTitle className="flex items-center">
                      {plan.popular && <ShieldCheck className="h-5 w-5 text-primary mr-2" />}
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4 text-3xl font-bold">{plan.price}</div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <div className={`rounded-full p-1 ${plan.popular ? "bg-primary/10 text-primary" : "bg-muted"}`}>
                            <Check className="h-4 w-4" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="mt-8 w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.popular ? "Assinar Agora" : "Continuar Gratuitamente"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Alert className="mt-10 max-w-3xl mx-auto bg-amber-50 border-amber-300 text-amber-900">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Importante:</AlertTitle>
              <AlertDescription className="mt-2">
                Após fazer o cadastro, faça o pagamento e envie o comprovante e os dados do cadastro ao nosso WhatsApp para a validação!
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
                <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                  <div className="bg-primary/10 rounded-full p-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">IBAN Banco BAI:</div>
                    <div className="font-mono text-lg">AO06.0040.0000.9749.2262.1012.7</div>
                    <div className="text-sm text-muted-foreground">Titular: Arnaldo Leandro Gonga Miguel</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form - Modernizado */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <Card className="shadow-lg border-t-4 border-t-primary">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Cadastre-se Agora</CardTitle>
                  <CardDescription>
                    Crie sua conta para acessar todos os conteúdos jurídicos da plataforma LCJ.
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                              <Input 
                                id="password" 
                                type="password" 
                                placeholder="********" 
                                className="bg-background"
                                required 
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="confirm-password" className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-muted-foreground" />
                                Confirmar Senha
                              </Label>
                              <Input 
                                id="confirm-password" 
                                type="password" 
                                placeholder="********" 
                                className="bg-background"
                                required 
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox id="terms" required />
                            <Label htmlFor="terms" className="text-sm">
                              Concordo com os{" "}
                              <Link href="#" className="text-primary hover:underline">
                                Termos de Uso
                              </Link>{" "}
                              e{" "}
                              <Link href="#" className="text-primary hover:underline">
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
                        <Button variant="outline" className="w-full">
                          <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.523-4.477-10-10-10s-10 4.477-10 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.891h2.54v-2.203c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.891h-2.33v6.988c4.781-.75 8.437-4.887 8.437-9.878z" />
                          </svg>
                          Continuar com Facebook
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Já possui uma conta?
                  </p>
                  <Button variant="link" asChild>
                    <Link href="/auth">Faça login</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
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

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-12 text-center">Por Que Escolher a LCJ?</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-card border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <div className="bg-primary/10 rounded-full p-4 inline-block mb-4">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Conteúdo Jurídico de Qualidade</h3>
                <p className="text-muted-foreground">
                  Acesse uma biblioteca completa de materias de Direito e peças processuais atualizadas.
                </p>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <div className="bg-primary/10 rounded-full p-4 inline-block mb-4">
                  <HeadphonesIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Suporte ao Usuário</h3>
                <p className="text-muted-foreground">Nossa equipe está pronta para ajudar você em todas as etapas.</p>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <div className="bg-primary/10 rounded-full p-4 inline-block mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Experiência de Leitura</h3>
                <p className="text-muted-foreground">Interface intuitiva e recursos que facilitam o seu aprendizado.</p>
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

