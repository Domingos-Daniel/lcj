import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const materias = {
  civil: {
    title: "Direito Civil",
    description: "Contratos, responsabilidade civil, direitos reais e obrigações",
    content: [
      { title: "Parte Geral", description: "Pessoas, bens, fatos jurídicos" },
      { title: "Obrigações", description: "Modalidades, transmissão, adimplemento" },
      { title: "Contratos", description: "Teoria geral, espécies de contratos" },
    ],
  },
  penal: {
    title: "Direito Penal",
    description: "Crimes, penas, processo penal",
    content: [
      { title: "Parte Geral", description: "Princípios, aplicação da lei penal" },
      { title: "Crimes", description: "Tipos penais, classificação" },
      { title: "Penas", description: "Espécies, aplicação, execução" },
    ],
  },
  // Adicione mais matérias conforme necessário
}

export default function MateriaPage({ params }: { params: { slug: string } }) {
  const materia = materias[params.slug as keyof typeof materias]

  if (!materia) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">{materia.title}</h1>
        <p className="mb-12 text-lg text-muted-foreground">{materia.description}</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {materia.content.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Acessar Conteúdo</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

