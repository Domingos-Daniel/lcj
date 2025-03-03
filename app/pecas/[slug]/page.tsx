import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const pecas = {
  peticoes: {
    title: "Petições",
    description: "Modelos de petições iniciais e intermediárias",
    content: [
      {
        title: "Petição Inicial",
        description: "Modelos para diferentes tipos de ações",
      },
      {
        title: "Contestação",
        description: "Modelos de defesa em diferentes áreas",
      },
      {
        title: "Recursos",
        description: "Modelos de recursos diversos",
      },
    ],
  },
  documentos: {
    title: "Documentos",
    description: "Procurações, declarações e outros documentos",
    content: [
      {
        title: "Procurações",
        description: "Modelos para diferentes finalidades",
      },
      {
        title: "Declarações",
        description: "Diversos tipos de declarações",
      },
      {
        title: "Contratos",
        description: "Modelos de contratos diversos",
      },
    ],
  },
  // Adicione mais categorias conforme necessário
}

export default function PecasPage({ params }: { params: { slug: string } }) {
  const peca = pecas[params.slug as keyof typeof pecas]

  if (!peca) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">{peca.title}</h1>
        <p className="mb-12 text-lg text-muted-foreground">{peca.description}</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {peca.content.map((item, index) => (
            <Card key={index} className="group hover:shadow-lg">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Baixar Modelo</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

