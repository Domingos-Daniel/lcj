import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Scale, BookOpen, Award, Search, User } from "lucide-react"
import Link from "next/link"

export default function SobrePage() {
  return (
    <div className="min-h-screen">

      <main className="">
        {/* Hero Section */}
        <section className="relative h-[400px] overflow-hidden">
          <img src="/placeholder.svg?height=400&width=1920" alt="Office" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">Quem Somos</h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg">
                LCJ é uma plataforma inovadora dedicada a fornecer recursos jurídicos de alta qualidade para
                profissionais e estudantes de direito.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-3xl font-bold">+5000</h3>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
              </Card>
              <Card className="p-6 text-center">
                <Scale className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-3xl font-bold">+1000</h3>
                <p className="text-sm text-muted-foreground">Modelos Jurídicos</p>
              </Card>
              <Card className="p-6 text-center">
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-3xl font-bold">+100</h3>
                <p className="text-sm text-muted-foreground">Artigos Publicados</p>
              </Card>
              <Card className="p-6 text-center">
                <Award className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-3xl font-bold">98%</h3>
                <p className="text-sm text-muted-foreground">Satisfação</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-8 text-3xl font-bold">Nossa Missão</h2>
              <p className="mb-12 text-lg text-muted-foreground">
                Facilitar o acesso à informação jurídica de qualidade, fornecendo ferramentas e recursos que auxiliem no
                trabalho diário de profissionais e estudantes da área do direito.
              </p>
              <div className="grid gap-8 md:grid-cols-2">
                <img src="/placeholder.svg?height=300&width=500" alt="Mission" className="rounded-lg" />
                <div className="flex flex-col justify-center text-left">
                  <h3 className="mb-4 text-xl font-bold">Nossos Valores</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <span>Excelência em conteúdo jurídico</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Foco no usuário</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-primary" />
                      <span>Compromisso com a justiça</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Nossa Equipe</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Team Member 1"
                  className="mx-auto mb-4 h-48 w-48 rounded-full object-cover"
                />
                <h3 className="mb-2 text-xl font-bold">Dr. João Silva</h3>
                <p className="text-muted-foreground">Diretor Jurídico</p>
              </div>
              <div className="text-center">
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Team Member 2"
                  className="mx-auto mb-4 h-48 w-48 rounded-full object-cover"
                />
                <h3 className="mb-2 text-xl font-bold">Dra. Maria Santos</h3>
                <p className="text-muted-foreground">Coordenadora de Conteúdo</p>
              </div>
              <div className="text-center">
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Team Member 3"
                  className="mx-auto mb-4 h-48 w-48 rounded-full object-cover"
                />
                <h3 className="mb-2 text-xl font-bold">Dr. Pedro Costa</h3>
                <p className="text-muted-foreground">Especialista em Tecnologia</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

