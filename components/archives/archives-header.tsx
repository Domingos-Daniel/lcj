"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface ArchivesHeaderProps {
  category: {
    name: string
    description: string
  } | null
  searchQuery: string
  onSearch: (query: string) => void
}

export function ArchivesHeader({ category, searchQuery, onSearch }: ArchivesHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {category?.name || "Arquivos"}
        </h1>
        {category?.description && (
          <p className="text-muted-foreground mt-2">
            {category.description}
          </p>
        )}
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Pesquisar documentos..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  )
}