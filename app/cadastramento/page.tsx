import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, User, Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Básico",
    price: "Grátis",
    description: "Para estudantes e iniciantes",
    features: [
      "Acesso a documentos básicos",
      "Modelos de petições simples",
      "Suporte por email",
      "Atualizações mensais",
    ],
  },
  {
    name: "Profissional",
    price: "R$ 49,90/mês",
    description: "Para advogados e escritórios",
    features: [
      "Todos os recursos do plano Básico",
      "Modelos premium",
      "Suporte prioritário",
      "Atualizações semanais",
      "Download ilimitado",
    ],
    popular: true,
  },
  {
    name: "Empresarial",
    price: "R$ 99,90/mês",
    description: "Para grandes escritórios",
    features: [
      "Todos os recursos do plano Profissional",
      "API de integração",
      "Suporte 24/7",
      "Personalização de documentos",
      "Treinamento exclusivo",
    ],
  },
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
              Tenha acesso a milhares de documentos jurídicos e recursos exclusivos para impulsionar sua carreira.
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {plans.map((plan) => (
                <Card key={plan.name} className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
                      Popular
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
                          <Check className="h-5 w-5 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="mt-8 w-full" variant={plan.popular ? "default" : "outline"}>
                      Começar Agora
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
                  <CardDescription>Crie sua conta para acessar todos os recursos da plataforma.</CardDescription>
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
                      <Input id="phone" type="tel" placeholder="Digite seu telefone" />
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
                <h3 className="mb-2 text-xl font-bold">Documentos Atualizados</h3>
                <p className="text-muted-foreground">
                  Acesse uma biblioteca completa de documentos jurídicos sempre atualizados.
                </p>
              </div>
              <div className="text-center">
                <img src="/placeholder.svg?height=200&width=300" alt="Feature 2" className="mx-auto mb-4 rounded-lg" />
                <h3 className="mb-2 text-xl font-bold">Suporte Especializado</h3>
                <p className="text-muted-foreground">Nossa equipe está pronta para ajudar você em todas as etapas.</p>
              </div>
              <div className="text-center">
                <img src="/placeholder.svg?height=200&width=300" alt="Feature 3" className="mx-auto mb-4 rounded-lg" />
                <h3 className="mb-2 text-xl font-bold">Recursos Exclusivos</h3>
                <p className="text-muted-foreground">Ferramentas e funcionalidades para otimizar seu trabalho.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

