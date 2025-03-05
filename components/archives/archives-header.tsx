"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface ArchivesHeaderProps {
  category: any
  onSearch: (query: string) => void
  searchQuery: string
  searchId?: string // New prop for tutorial
}

export function ArchivesHeader({ 
  category, 
  onSearch, 
  searchQuery,
  searchId = "search-field" // Default value
}: ArchivesHeaderProps) {
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
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id={searchId} // Use the ID here
            type="search"
            placeholder="Pesquisar documentos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}