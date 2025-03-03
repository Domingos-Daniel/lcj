import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronsLeft, ChevronsRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants, Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Array de páginas a serem exibidas
  const getPageNumbers = () => {
    const pages = []
    
    // Sempre mostrar a primeira página
    if (currentPage > 3) {
      pages.push(1)
    }
    
    // Mostrar reticências se estiver muito distante do início
    if (currentPage > 4) {
      pages.push('ellipsis-start')
    }
    
    // Mostrar páginas ao redor da página atual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i)
      }
    }
    
    // Mostrar reticências se estiver muito distante do fim
    if (currentPage < totalPages - 3) {
      pages.push('ellipsis-end')
    }
    
    // Sempre mostrar a última página se houver mais de 1 página
    if (totalPages > 1 && currentPage < totalPages) {
      pages.push(totalPages)
    }
    
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
        <span className="sr-only">Primeira página</span>
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Página anterior</span>
      </Button>
      
      {currentPage > 1 && totalPages > 5 && (
        <div className="flex items-center">
          {getPageNumbers().map((page, i) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
              return <div key={page} className="px-3 py-2">...</div>
            }
            
            const pageNum = page as number
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(pageNum)}
                className="h-9 w-9"
              >
                {pageNum}
              </Button>
            )
          })}
        </div>
      )}
      
      {/* Página atual */}
      {totalPages <= 5 ? (
        <div className="flex items-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page)}
              className="h-9 w-9"
            >
              {page}
            </Button>
          ))}
        </div>
      ) : (
        currentPage === 1 && (
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9"
          >
            1
          </Button>
        )
      )}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Próxima página</span>
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
        <span className="sr-only">Última página</span>
      </Button>
    </div>
  )
}
