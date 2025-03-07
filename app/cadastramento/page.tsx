import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Search, User, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

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
  return (
    <div className="min-h-screen">

      <main className="">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-transparent py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Escolha o Plano Ideal</h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Tenha acesso a conteúdos jurídicos de qualidade e recursos exclusivos para impulsionar sua carreira.
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
              {plans.map((plan) => (
                <Card key={plan.name} className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
                      Recomendado
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4 text-3xl font-bold">{plan.price}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="mt-8 w-full" variant={plan.popular ? "default" : "outline"}>
                      {plan.popular ? "Assinar Agora" : "Continuar Gratuitamente"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Alert className="mt-8 max-w-3xl mx-auto bg-red-600 border-red/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium text-white">
                Após fazer o cadastro, faça o pagamento e envie o comprovante e os dados do cadastro ao nosso WhatsApp para a validação!
              </AlertDescription>
            </Alert>
            
            <div className="mt-6 max-w-3xl mx-auto bg-muted p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Opções de Pagamento:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="font-medium min-w-[160px]">Multicaixa Express:</div>
                  <div>+244 940 418 435</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="font-medium min-w-[160px]">IBAN Banco BAI:</div>
                  <div>
                    <div className="font-mono">AO06.0040.0000.9749.2262.1012.7</div>
                    <div className="text-sm text-muted-foreground">Titular: Arnaldo Leandro Gonga Miguel</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Cadastre-se Agora</CardTitle>
                  <CardDescription>Crie sua conta para acessar a plataforma LCJ.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" placeholder="Digite seu nome completo" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Digite seu email" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" type="tel" placeholder="Digite seu telefone com DDD" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" type="password" placeholder="Digite sua senha" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirmar Senha</Label>
                      <Input id="confirm-password" type="password" placeholder="Confirme sua senha" />
                    </div>
                    <Button className="w-full" size="lg">
                      Cadastrar
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground w-full text-center">
                    Já possui uma conta? <Link href="/login" className="text-primary hover:underline">Faça login</Link>
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <img src="/placeholder.svg?height=200&width=300" alt="Feature 1" className="mx-auto mb-4 rounded-lg" />
                <h3 className="mb-2 text-xl font-bold">Conteúdo Jurídico de Qualidade</h3>
                <p className="text-muted-foreground">
                  Acesse uma biblioteca completa de materias de Direito e peças processuais atualizadas.
                </p>
              </div>
              <div className="text-center">
                <img src="/placeholder.svg?height=200&width=300" alt="Feature 2" className="mx-auto mb-4 rounded-lg" />
                <h3 className="mb-2 text-xl font-bold">Suporte ao Usuário</h3>
                <p className="text-muted-foreground">Nossa equipe está pronta para ajudar você em todas as etapas.</p>
              </div>
              <div className="text-center">
                <img src="/placeholder.svg?height=200&width=300" alt="Feature 3" className="mx-auto mb-4 rounded-lg" />
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

