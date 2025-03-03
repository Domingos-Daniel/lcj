import { ArchivesLayout } from "@/components/archives/archives-layout"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conteúdos Jurídicos | LCJ",
  description: "Biblioteca digital de documentos jurídicos organizados por categoria",
}

export default function ArchivesPage({ params }: { params: { categoryId: string } }) {
  // Add this log at the top of your component
  //console.log('Archive data:', archives);
  return <ArchivesLayout categoryId={params.categoryId} />
}