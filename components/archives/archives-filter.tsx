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

export function ArchivesFilter({
  filters,
  onChange,
  categories = [],
  mainCategory,
  onReset
}: ArchivesFilterProps) {
  // Log dos filtros recebidos para debug
  console.log("ArchivesFilter recebeu filtros:", filters);
  console.log("ArchivesFilter recebeu categoria principal:", mainCategory);
  
  // Se não houver categorias, criar exemplo
  if (!categories || categories.length === 0) {
    categories = [
      { id: "internal1", name: "Exemplo Interno 1" },
      { id: "internal2", name: "Exemplo Interno 2" }
    ];
  }
  
  // Validar cada categoria
  let validCategories = categories.filter(cat => {
    // Verificar se a categoria existe e possui ID e nome válidos.
    if (!cat) return false;
    if (cat.id === undefined || cat.id === null) return false;
    if (!cat.name) return false;
    return true;
  });

  // Se houver mainCategory, limitar as categorias às que se relacionam com ela
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

  // APLICAR A ORDENAÇÃO das categorias com base nos filtros
  console.log("Aplicando ordenação nas categorias:", 
    filters.sortBy, filters.order, 
    "Total antes:", validCategories.length);
  
  if (filters.sortBy === "title") {
    console.log("Ordenando categorias pelo título!");
    
    // Clonar o array antes de ordenar para evitar mutação
    validCategories = [...validCategories].sort((a, b) => {
      const nameA = a.name.toLocaleLowerCase();
      const nameB = b.name.toLocaleLowerCase();
      
      if (filters.order === 'asc') {
        console.log(`Comparando: ${nameA} vs ${nameB}`);
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    
    console.log("Primeiras 3 categorias após ordenação:", 
      validCategories.slice(0, 3).map(c => c.name));
  }
  
  // Opções de ordenação
  const sortOptions = [
    { value: "date_desc", label: "Mais recentes primeiro" },
    { value: "date_asc", label: "Mais antigos primeiro" },
    { value: "title_asc", label: "Título (A-Z)" },
    { value: "title_desc", label: "Título (Z-A)" },
    { value: "modified_desc", label: "Últimas atualizações" },
    { value: "random", label: "Aleatório" },
  ]

  // Calcula o valor atual para o RadioGroup
  const getCurrentSortValue = () => {
    if (filters.sortBy === 'random') return 'random';
    return `${filters.sortBy}_${filters.order}`;
  }

  // Modificar o método handleSortChange para garantir que ele está atualizando corretamente
  const handleSortChange = (value: string) => {
    console.log("handleSortChange recebeu valor:", value);
    
    let newFilters = {...filters};
    
    if (value === 'title_asc') {
      console.log("Ordenando pelo título (A-Z)");
      newFilters = {
        ...filters,
        sortBy: "title",
        order: "asc"
      };
    } 
    else if (value === 'title_desc') {
      console.log("Ordenando pelo título (Z-A)");
      newFilters = {
        ...filters,
        sortBy: "title",
        order: "desc" 
      };
    }
    else {
      // Outros valores como 'recent', 'oldest', 'random'
      const parts = value.split('_');
      if (parts.length === 2) {
        const [sortBy, order] = parts;
        newFilters = {
          ...filters,
          sortBy,
          order: order as 'asc' | 'desc'
        };
      }
    }
    
    console.log("Novos filtros após mudança:", newFilters);
    onChange(newFilters);
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
          value={getCurrentSortValue()}
          onValueChange={handleSortChange}
          className="space-y-3"
        >
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