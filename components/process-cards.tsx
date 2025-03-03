"use client"

import { motion } from "framer-motion"
import {
  Briefcase, Scale, Building2, FileText, Banknote,
  FileCodeIcon as FileContract, Users, ShoppingCart,
  Landmark, Globe, Copyright, Home, Trophy
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/useTheme"
import { Card } from "@/components/ui/card"

const categories = [
  {
    name: "TRABALHO",
    icon: Briefcase,
    description: "Ações trabalhistas e direitos do trabalhador",
    color: "bg-blue-500",
  },
  {
    name: "PENAL",
    icon: Scale,
    description: "Defesa criminal e processo penal",
    color: "bg-red-500",
  },
  {
    name: "EMPRESARIAL",
    icon: Building2,
    description: "Direito societário e empresarial",
    color: "bg-green-500",
  },
  {
    name: "CIVIL",
    icon: FileText,
    description: "Contratos e responsabilidade civil",
    color: "bg-purple-500",
  },
  {
    name: "TRIBUTÁRIO",
    icon: Banknote,
    description: "Impostos e planejamento tributário",
    color: "bg-yellow-500",
  },
  {
    name: "FAMÍLIA",
    icon: Users,
    description: "Divórcio, guarda e sucessões",
    color: "bg-orange-500",
  },
  {
    name: "CONSUMIDOR",
    icon: ShoppingCart,
    description: "Direitos do consumidor",
    color: "bg-teal-500",
  },
  {
    name: "BANCÁRIO",
    icon: Landmark,
    description: "Direitos e relações bancárias",
    color: "bg-indigo-500",
  },
  {
    name: "DIGITAL",
    icon: Globe,
    description: "Direito digital e tecnologia",
    color: "bg-cyan-500",
  },
  {
    name: "AUTORAIS",
    icon: Copyright,
    description: "Direitos autorais e conexos",
    color: "bg-pink-500",
  },
  {
    name: "IMOBILIÁRIO",
    icon: Home,
    description: "Negócios e direitos imobiliários",
    color: "bg-emerald-500",
  },
  {
    name: "DESPORTOS",
    icon: Trophy,
    description: "Direito dos desportos",
    color: "bg-violet-500",
  }
]

export function ProcessCards() {
  const { theme } = useTheme()

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-background to-muted/50 dark:from-gray-950 dark:to-gray-900/50 rounded-lg">
      <div className="container px-4 md:px-6">
      <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-2">NAVEGUE POR CATEGORIAS</h2>
            <h3 className="text-2xl font-bold text-primary">PEÇAS PROCESSUAIS DE DIREITO</h3>
          </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, index) => (
            <Card 
              key={category.name} 
              className="group overflow-hidden border-none bg-background/50 dark:bg-gray-900/50 hover:bg-background/80 dark:hover:bg-gray-800/80 transition-all duration-300 shadow-lg"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative p-6"
              >
                <div
                  className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${category.color} opacity-10 transition-transform duration-300 group-hover:scale-150 dark:opacity-20`}
                />
                <category.icon 
                  className={`relative h-10 w-10 ${category.color} mb-4 text-white rounded-xl p-2 shadow-lg transition-transform duration-300 group-hover:scale-110`} 
                />
                <h4 className="mb-2 text-lg font-bold tracking-tight dark:text-gray-100">
                  {category.name}
                </h4>
                <p className="mb-4 text-sm text-muted-foreground dark:text-gray-400">
                  {category.description}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-white transition-colors duration-300"
                >
                  Ver Documentos
                </Button>
              </motion.div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

