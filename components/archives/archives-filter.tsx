"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { useState, useEffect } from "react"

interface FilterState {
  sortBy: string
  order: 'asc' | 'desc'
  categories?: string[]  
  subcategory?: string   
}

interface Category {
  id: string | number
  name: string
  subcategories?: {
    id: string | number
    name: string
  }[]
}

interface ArchivesFilterProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  categories?: Category[]
  mainCategory?: Category | null
  onReset?: () => void
}

// Atualize o array sortOptions para remover os filtros A-Z e Z-A
const sortOptions = [
  { value: "date_desc", label: "Mais recentes primeiro" },
  { value: "date_asc", label: "Mais antigos primeiro" },
  { value: "random", label: "Aleatório" }
];

// Remova as opções de título na função getCurrentSortValue
function getCurrentSortValue(filters: FilterState) {
  if (!filters) return "date_desc"; // Valor padrão
  
  if (filters.sortBy === "date") {
    return filters.order === "asc" ? "date_asc" : "date_desc";
  }
  
  if (filters.sortBy === "random") {
    return "random";
  }
  
  // Valor padrão para outros casos
  return `${filters.sortBy || "date"}_${filters.order || "desc"}`;
}

export function ArchivesFilter({
  filters,
  onChange,
  categories = [],
  mainCategory,
  onReset
}: ArchivesFilterProps) {
  
  // Obtenha as categorias válidas primeiro
  let validCategories = categories.filter(cat => {
    if (!cat) return false;
    if (cat.id === undefined || cat.id === null) return false;
    if (!cat.name) return false;
    return true;
  });

  // Se houver mainCategory, filtre as categorias relacionadas
  if (mainCategory) {
    // Cria um conjunto para armazenar os IDs relacionados (pai, filho e neto)
    const relatedIds = new Set<string>();
    const mainCatId = String(mainCategory.id);
    relatedIds.add(mainCatId);
    
    // Adiciona as subcategorias definidas em mainCategory (filhos)
    if (mainCategory.subcategories) {
      mainCategory.subcategories.forEach(sub => {
        relatedIds.add(String(sub.id));
      });
    }
    
    // Agora, filtre as categorias válidas:
    // Inclui:
    // - Categorias cujo ID esteja no conjunto (pai ou filho já mapeados)
    // - Categorias cujo campo parent seja igual a um dos IDs do conjunto (netos)
    validCategories = validCategories.filter(cat => {
      const catIdStr = String(cat.id);
      const parentStr = (cat as any).parent ? String((cat as any).parent) : "";
      return relatedIds.has(catIdStr) || relatedIds.has(parentStr);
    });
  }
  
  // Esta função é crucial para aplicar a ordenação corretamente
  const applySort = (items: Category[], sortBy: string, order: 'asc' | 'desc') => {
    // Clone o array para evitar mutação
    const sorted = [...items];
    
    
    if (sortBy === "title") {
      return sorted.sort((a, b) => {
        const titleA = (a.name || '').toLowerCase();
        const titleB = (b.name || '').toLowerCase();
        
        // Log para debug
        
        if (order === "asc") {
          return titleA.localeCompare(titleB);
        } else {
          return titleB.localeCompare(titleA);
        }
      });
    }
    
    // Outros tipos de ordenação, se necessário
    return sorted;
  };
  
  // Aplique a ordenação após a filtragem
  if (filters.sortBy && filters.order) {
    validCategories = applySort(validCategories, filters.sortBy, filters.order);
      validCategories.slice(0, 3).map(c => c.name));
  }
  
  // Função para manipular a mudança de opção de ordenação
  const handleSortChange = (value: string) => {
    
    // Para os casos específicos de título
    if (value === "title_asc" || value === "title_desc") {
      const order = value === "title_asc" ? "asc" : "desc";
      
      // Atualize os filtros explicitamente
      const newFilters = {
        ...filters,
        sortBy: "title",
        order
      };
      
      onChange(newFilters);
      return;
    }
    
    // Para outras opções como data, etc.
    const parts = value.split('_');
    if (parts.length === 2) {
      const [sortBy, order] = parts;
      onChange({
        ...filters,
        sortBy,
        order: order as 'asc' | 'desc'
      });
    }
  };
  
  // Função para aplicar mudanças nos filtros de categoria
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    // Certifica-se que categorias é sempre um array
    let newCategories = [...(filters.categories || [])];
    
    if (checked) {
      // Adicionar categoria se não existir
      if (!newCategories.includes(categoryId)) {
        newCategories.push(categoryId);
      }
    } else {
      // Remover categoria
      newCategories = newCategories.filter(id => id !== categoryId);
    }
    
    // Atualiza os filtros com o novo array de categorias
    onChange({ 
      ...filters, 
      categories: newCategories 
    });
  }

  // Verifica se uma categoria está selecionada
  const isCategorySelected = (categoryId: string) => {
    if (!filters.categories) return false;
    
    // Converter para string para comparação consistente
    const categoryIdStr = String(categoryId);
    const selectedCategories = filters.categories.map(String);
    
    return selectedCategories.includes(categoryIdStr);
  }

  return (
    <div className="space-y-4">
      {/* Card de Ordenação */}
      <Card className="p-5 space-y-4">
        <h3 className="font-medium text-lg">Filtro por Ordenação</h3>
        
        <RadioGroup
          value={getCurrentSortValue(filters)}
          onValueChange={handleSortChange}
          className="space-y-3"
        >
          {/* Remova os itens de título A-Z e Z-A */}
          
          {sortOptions.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
              <Label htmlFor={`sort-${option.value}`} className="cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <Separator className="my-4" />
        
        <Button 
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            // Valores padrão claros
            const defaultFilters = {
              sortBy: "date",
              order: "desc" as const,
              categories: [],
              subcategory: undefined
            };
            
            onChange(defaultFilters);
            
            if (onReset) onReset();
          }}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Resetar filtros
        </Button>
      </Card>
      
      {/* Card de Filtros de Categoria - Sempre visível */}
      <Card className="p-5 space-y-6">
        <div>
          <h3 className="font-medium text-lg mb-4">Filtros por Categoria</h3>
          
          <div className="space-y-1">
            <h4 className="text-sm text-muted-foreground mb-2">
              Categorias Disponíveis {validCategories.length > 0 ? `(${validCategories.length})` : ''}
            </h4>
            
            {validCategories.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {validCategories.map(category => (
                  <div key={`cat-${category.id}`} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.id}`}
                      checked={isCategorySelected(String(category.id))}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(String(category.id), !!checked)
                      }
                    />
                    <Label 
                      htmlFor={`category-${category.id}`}
                      className="text-sm cursor-pointer line-clamp-1"
                    >
                      {category.name || `Categoria ${category.id}`}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Nenhuma categoria disponível para filtrar.
                <div className="mt-2 text-xs">
                  Verifique se as categorias foram carregadas corretamente.
                </div>
              </div>
            )}
          </div>
          
          {filters.categories && filters.categories.length > 0 && (
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange({
                    ...filters,
                    categories: []
                  });
                }}
              >
                Limpar seleção ({filters.categories.length})
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}