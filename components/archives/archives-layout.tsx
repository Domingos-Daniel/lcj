"use client"

import { useState, useEffect } from "react"
import { ArchivesList } from "./archives-list"
import { ArchivesFilter } from "./archives-filter"
import { ArchivesHeader } from "./archives-header"
import { Pagination } from "@/components/ui/pagination"
import { useArchives } from "@/hooks/use-archives"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid2X2, List, Filter, Grid } from "lucide-react"
// Fix the incorrect import
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function ArchivesLayout({ categoryId }: { categoryId: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
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
  
  // Quando os filtros mudarem, volte para a primeira página
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, searchQuery])

  // Função para redefinir tudo
  const handleReset = () => {
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
    setFilters(newFilters);
  }

  return (
    <div className="container py-8 space-y-8">
      <ArchivesHeader 
        category={category}
        onSearch={(query) => {
          // Add id to the search field in ArchivesHeader
          document.getElementById('search-field')?.focus();
          setSearchQuery(query);
        }}
        searchQuery={searchQuery}
        searchId="search-field" // Pass this prop to ArchivesHeader
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr] gap-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden flex justify-end">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <div className="py-4">
                <ArchivesFilter 
                  filters={filters}
                  onChange={handleFilterChange}
                  categories={categories}
                  mainCategory={category}
                  onReset={handleReset}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filter Button */}
        <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-12 w-12 rounded-full shadow-lg"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <div className="py-4">
                <ArchivesFilter 
                  filters={filters}
                  onChange={handleFilterChange}
                  categories={categories}
                  mainCategory={category}
                  onReset={handleReset}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <main className="space-y-6">
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
            
            <div className="flex items-center gap-4">
              {filters.categories && filters.categories.length > 0 && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Filtros ativos:</span>
                  <span className="ml-1 font-medium">{filters.categories.length}</span>
                </div>
              )}
              
              <Tabs 
                id="view-toggle" 
                defaultValue="grid" 
                value={view} 
                onValueChange={(v) => setView(v as "grid" | "list")}
              >
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
          </div>

          <ArchivesList 
            archives={archives}
            isLoading={isLoading}
            view={view}
          />
          
          {!isLoading && totalPages > 1 && (
            <div id="pagination" className="flex items-center justify-center mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}