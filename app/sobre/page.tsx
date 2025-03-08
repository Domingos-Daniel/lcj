import { MainNav } from "@/components/main-nav"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Scale, BookOpen, Award, Search, User } from "lucide-react"
import Link from "next/link"

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main>
        {/* Hero Section melhorada */}
        <section className="relative h-[350px] overflow-hidden">
          <Image 
            src="https://lcj-educa.com/wp-content/uploads/2023/09/2.jpg" 
            alt="Fundo" 
            layout="fill"
            objectFit="cover"
            quality={90}
            className="transition-all duration-300"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl drop-shadow-lg">Quem Somos</h1>
              <p className="mx-auto mb-6 max-w-2xl text-lg drop-shadow-md">
                LCJ-Educa é uma plataforma inovadora dedicada a fornecer recursos jurídicos de alta qualidade para profissionais e estudantes de direito.
              </p>
              <Button variant="default" className="mx-auto">
                Saiba Mais
              </Button>
            </div>
          </div>
        </section>

        {/* Seção "SOBRE NÓS" aprimorada */}
        <section className="py-16 px-10">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-center text-3xl font-bold">SOBRE NÓS</h2>
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h3 className="mb-4 text-2xl font-bold">POR QUE O LCJ-EDUCA.COM?</h3>
                <p className="mb-4 text-base text-muted-foreground">
                  Com o lcj-educa.com é possível aprender o Direito sem sequer frequentar uma Faculdade de Direito. O LCJ auxilia estudantes de direito, advogados, juízes, procuradores e todos os operadores do Direito – e não só – a se familiarizarem com conteúdo jurídico de forma fácil, simples e nacional, proporcionando o conforto de sua residência.
                </p>
                <p className="mb-4 text-base text-muted-foreground">
                  A apresentação de matérias, legislações e peças processuais com características totalmente angolanas facilita o trabalho dos operadores do Direito e dos estudantes.
                </p>
                <p className="text-base text-muted-foreground">
                  Ajuda os cidadãos a estarem em dia com os seus direitos de uma forma fácil e simples.
                </p>
              </div>
              <div className="relative h-[600px] w-[400px] mx-auto">
                <Image 
                  src="https://lcj-educa.com/wp-content/uploads/2024/09/Arnaldo-.jpg" 
                  alt="Arnaldo" 
                  layout="fill"
                  objectFit="cover"
                  quality={90}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Nova Seção "SOBRE NÓS" adicional */}
        <section className="py-16 px-10">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-center text-3xl font-bold">SOBRE NÓS</h2>
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="relative h-[400px] w-full md:w-[500px] mx-auto">
                <Image 
                  src="./image4.jpeg" 
                  alt="LCJ-educa" 
                  layout="fill"
                  objectFit="cover"
                  quality={90}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div>
                <h3 className="mb-4 text-2xl font-bold">O QUE É LCJ-educa.com?</h3>
                <p className="mb-4 text-base text-muted-foreground">
                  O lcj-educa.com, nomeadamente "laboratório de ciências Jurídicos", é um site que foi criado e desenvolvido pelo jurista "Arnaldo Leandro Gonga Miguel". É uma plataforma única e exclusiva que contém matérias de Direito e conteúdo Jurídico totalmente nacional!
                </p>
                <h3 className="mb-4 text-2xl font-bold">QUANDO FOI CRIADO O LCJ-educa.com?</h3>
                <p className="text-base text-muted-foreground">
                  O lcj-educa.com foi criado e elaborado em 2017 pelo jurista ARNALDO MIGUEL, com o objectivo de albergar conteúdos de cunho jurídico, tendo o seu desenvolvimento substancial expandido em 2019.
                </p>
              </div>
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

