"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search, X, Tag, Clock } from "lucide-react"
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  excerpt: string
  slug: string
  categorySlug?: string
  tags?: string[]
  date?: string
}

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    } else {
      // Clear search query when modal closes
      setQuery("")
      setResults([])
    }
  }, [open])

  // Search function with debounce
  useEffect(() => {
    if (!open) return

    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/lcj/v1/search&query=${encodeURIComponent(query)}`
        )
        
        const data = await response.json()
        
        if (data && Array.isArray(data)) {
          setResults(data)
        } else {
          setResults([])
        }
      } catch (error) {
        console.error("Erro ao buscar resultados:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, open])

  const handleSelectItem = (item: SearchResult) => {
    onOpenChange(false)
    const url = item.categorySlug 
      ? `/arquivos/${item.categorySlug}/${item.slug}`
      : `/arquivos/${item.slug}`
    router.push(url)
  }

  function highlightMatch(text: string, query: string) {
    if (!text || !query) return text
    
    try {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
      return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
    } catch {
      return text
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className="w-full sm:max-w-xl p-0 mx-auto mt-16 search-modal">
        <SheetHeader className="sr-only">
          <SheetTitle>Pesquisar conteúdo</SheetTitle>
        </SheetHeader>
        
        <div className="rounded-lg border shadow-lg bg-background">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar artigos, tutoriais, tags..."
              className="h-11 w-full bg-transparent px-1 py-3 text-sm outline-none placeholder:text-muted-foreground search-input"
              autoComplete="off"
              aria-label="Campo de pesquisa"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {query.trim().length < 2 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Digite pelo menos 2 caracteres para pesquisar
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : results.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Nenhum resultado encontrado
              </div>
            ) : (
              results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className="cursor-pointer rounded-md px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 mb-1"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSelectItem(item);
                    }
                  }}
                >
                  <div className="font-medium mb-1">
                    <span dangerouslySetInnerHTML={{ __html: highlightMatch(item.title, query) }} />
                  </div>
                  {item.excerpt && (
                    <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      <span dangerouslySetInnerHTML={{ __html: highlightMatch(item.excerpt, query) }} />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground mt-1">
                    {item.date && (
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{item.date}</span>
                      </div>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index} 
                            className={cn(
                              "bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5",
                              tag.toLowerCase().includes(query.toLowerCase()) && 
                              "bg-yellow-100 dark:bg-yellow-900"
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && <span>+{item.tags.length - 3}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}