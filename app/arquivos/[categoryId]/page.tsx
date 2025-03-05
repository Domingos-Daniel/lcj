import { ArchivesLayout } from "@/components/archives/archives-layout"
import { Metadata } from "next"
import { TutorialOverlay } from "@/components/tutorials/tutorial-overlay"

export const metadata: Metadata = {
  title: "Conteúdos Jurídicos",
  description: "Biblioteca digital de documentos jurídicos organizados por categoria",
}

export default function ArchivesPage({ params }: { params: { categoryId: string } }) {
  return (
    <>
      <TutorialOverlay pageKey="archives" />
      <ArchivesLayout categoryId={params.categoryId} />
    </>
  )
}