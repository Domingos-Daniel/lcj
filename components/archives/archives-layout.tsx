"use client"

import { useState, useEffect } from "react"
import { ArchivesList } from "./archives-list"
import { ArchivesFilter } from "./archives-filter"
import { ArchivesHeader } from "./archives-header"
import { Pagination } from "@/components/ui/pagination"
import { useArchives } from "@/hooks/use-archives"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid2X2, List } from "lucide-react"

export function ArchivesLayout({ categoryId }: { categoryId: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  
  // Estado inicial para filtros - com valores claros
  const [filters, setFilters] = useState({
    sortBy: "date",
    order: "desc" as const,
    categories: [] as string[], // Array vazio por padrão
    subcategory: undefined as string | undefined
  })

  // Log quando os filtros mudam
  useEffect(() => {
    //console.log('🔄 ArchivesLayout: Filtros atualizados:', filters);
  }, [filters]);

  const {
    archives,
    totalPages,
    isLoading,
    category,
    categories,
    subcategories,
    totalResults = 0,
    error
  } = useArchives({
    categoryId,
    page: currentPage,
    search: searchQuery,
    filters,
  })
  
  // Log quando os dados são carregados
  useEffect(() => {
    if (!isLoading) {
      //console.log('🔄 ArchivesLayout: Dados carregados:', {
      //  archivesCount: archives.length,
      //  totalPages,
      //  totalResults,
      //  category,
      //  categoriesCount: categories.length,
      //  subcategoriesCount: subcategories.length
      //});
    }
  }, [archives, totalPages, isLoading, error]);
  
  // Quando os filtros mudarem, volte para a primeira página
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, searchQuery])

  // Função para redefinir tudo
  const handleReset = () => {
    //console.log('🔄 ArchivesLayout: Resetando todos os filtros');
    setSearchQuery("")
    setCurrentPage(1)
    // Garantir que os valores padrão sejam claros e consistentes
    setFilters({
      sortBy: "date",
      order: "desc",
      categories: [],
      subcategory: undefined
    })
  }

  // Processa mudanças nos filtros
  const handleFilterChange = (newFilters: typeof filters) => {
    //console.log('🔄 ArchivesLayout: Mudança nos filtros:', newFilters);
    setFilters(newFilters);
  }

  return (
    <div className="container py-8 space-y-8">
      <ArchivesHeader 
        category={category}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ArchivesFilter 
            filters={filters}
            onChange={handleFilterChange}
            categories={categories}
            mainCategory={category}
            onReset={handleReset}
          />
        </aside>
        
        <main className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {!isLoading && (
                archives.length > 0 
                  ? `Mostrando ${archives.length} de ${totalResults} ${totalResults === 1 ? 'resultado' : 'resultados'}`
                  : 'Nenhum resultado encontrado'
              )}
              {error && (
                <div className="text-red-500 mt-1">Erro: {error}</div>
              )}
            </div>
            
            <Tabs defaultValue="grid" value={view} onValueChange={(v) => setView(v as "grid" | "list")}>
              <TabsList className="grid w-[120px] grid-cols-2">
                <TabsTrigger value="grid">
                  <Grid2X2 className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ArchivesList 
            archives={archives}
            isLoading={isLoading}
            view={view}
          />
          
          {!isLoading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>
    </div>
  )
}