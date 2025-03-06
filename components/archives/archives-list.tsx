"use client"

import { Card } from "@/components/ui/card"
import { ArrowRight, Calendar, CalendarDays, ChevronRight, Eye, FileText, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Content } from "next/font/google"

// Helper function to extract plain text
function extractPlainText(content: any): string {
  if (!content) return '';
  
  // If it's an object with a rendered property (WordPress format)
  if (typeof content === 'object' && content.rendered) {
    // Remove HTML tags
    return content.rendered.replace(/<\/?[^>]+(>|$)/g, "").trim();
  }
  
  // If it's already a string
  if (typeof content === 'string') {
    // Remove HTML tags if present
    return content.replace(/<\/?[^>]+(>|$)/g, "").trim();
  }
  
  // Fallback
  return String(content);
}

interface Archive {
  id: string | number
  title: string | { rendered: string }
  excerpt?: string | { rendered: string }
  plainExcerpt?: string
  description: string | { rendered: string }
  category: string | number
  categoryName?: string
  categories?: any[]  
  type?: string
  created_at: string
  date?: string
  formattedDate?: string
  modified_at?: string
  modified?: string
  formattedModified?: string
  downloads?: number
  views?: number
  fileUrl?: string
  featured_image?: string | null
}

interface ArchivesListProps {
  archives: Archive[]
  isLoading: boolean
  view: "grid" | "list"
}

const DEFAULT_IMAGE = "https://lcj-educa.com/wp-content/uploads/2025/02/legislacion-ii.png"

// New interface for WordPress categories
interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
}

// Component to fetch and manage categories
export function ArchivesList({ archives, isLoading, view = "grid" }: ArchivesListProps) {
  // State to store dynamically fetched categories
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Update the useEffect hook to use our API route
  useEffect(() => {
    async function fetchCategories() {
      try {
        setCategoriesLoading(true);
        
        // Use our API endpoint
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        
        const categories = await response.json();
        
        if (!Array.isArray(categories) || categories.length === 0) {
          console.warn('Categories API returned empty or invalid data', categories);
          throw new Error('No categories data available');
        }
        
        // Convert to category map
        const categoryMap: Record<string, string> = {};
        categories.forEach((category: WordPressCategory) => {
          categoryMap[String(category.id)] = category.name;
        });
        
        setCategories(categoryMap);
        //console.log('✅ Fetched categories:', Object.keys(categoryMap).length);
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        // Fallback to direct WordPress API call
        try {
          console.log('⚠️ Trying fallback to direct WordPress API...');
          const wpResponse = await fetch('https://lcj-educa.com/?rest_route=/wp/v2/categories?per_page=100');
          const wpCategories = await wpResponse.json();
          
          const fallbackMap: Record<string, string> = {};
          wpCategories.forEach((cat: WordPressCategory) => {
            fallbackMap[String(cat.id)] = cat.name;
          });
          
          setCategories(fallbackMap);
          //console.log('✅ Fallback successful, fetched:', Object.keys(fallbackMap).length);
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError);
          // Ultimate fallback to hardcoded categories
          setCategories({
            '1': 'Sem Categoria',
            '22': 'Materias de Direito',
            '31': 'Materias de Contabilidade',
            '51': 'Documentos Importantes'
          });
        }
      } finally {
        setCategoriesLoading(false);
      }
    }
    
    fetchCategories();
  }, []);
  
  // Updated function to get category name dynamically with better debugging
  function getCategoryDisplayName(archive: Archive): string {
    // Log the current state for debugging
    
    
    // Check categories array first
    if (Array.isArray(archive.categories) && archive.categories.length > 0) {
      const firstCategory = archive.categories[0];
      const categoryId = String(firstCategory);
      
      // Use our dynamically loaded categories
      if (categories[categoryId]) {
        return categories[categoryId];
      }
      
      // Fallback if category not found in our map
      return archive.categoryName || `Processando... ${categoryId}`;
    }
    
    // If we don't have categories array, try other properties
    if (archive.categoryName) {
      return archive.categoryName;
    }
    
    if (archive.category) {
      const categoryId = String(archive.category);
      if (categories[categoryId]) {
        return categories[categoryId];
      }
      return `Categoria ${categoryId}`;
    }
    
    return 'Sem categoria';
  }

  // Adicione/atualize a função para obter um array de nomes de categorias
  function getCategoryDisplayNames(archive: Archive): string[] {
    let names: string[] = [];
    
    if (Array.isArray(archive.categories) && archive.categories.length > 0) {
      names = archive.categories.map(catId => {
        const idStr = String(catId);
        return categories[idStr] || `Categoria ${idStr}`;
      });
    } else if (archive.categoryName) {
      names = [archive.categoryName];
    } else if (archive.category) {
      const idStr = String(archive.category);
      names = [categories[idStr] || `Categoria ${idStr}`];
    }
    
    // Se não encontrar nenhum nome, retorna valor padrão
    return names.length ? names : ['Sem categoria'];
  }

  // Debug function remains the same
  function debugArchiveObject(archive: any) {
    // Extract and log all possible content fields
    
  }

  // The rest of your component remains the same
  // Handle loading state
  if (isLoading) {
    return view === "grid" ? (
      // Loading skeleton for grid view
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="overflow-hidden flex flex-col h-full animate-pulse">
            <div className="relative h-48 bg-muted"></div>
            <div className="p-5 flex flex-col flex-grow space-y-4">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="flex items-center gap-3">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-10 bg-muted rounded w-full mt-4"></div>
            </div>
          </Card>
        ))}
      </div>
    ) : (
      // Loading skeleton for list view
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-[30%] h-64 md:h-auto bg-muted"></div>
              <div className="p-6 flex flex-col flex-1 space-y-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="pt-4 border-t flex justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                  <div className="h-8 bg-muted rounded w-28"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Handle empty archives
  if (!archives?.length) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-xl font-medium">Nenhum documento encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar seus filtros ou tente novamente mais tarde.
          </p>
        </div>
      </Card>
    );
  }

  // Grid View
  if (view === "grid") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {archives.map((archive, index) => {
          // Extract category name
          const categoryDisplayName = getCategoryDisplayName(archive);
          
          // Extract excerpt with fallbacks
          const excerpt = (() => {
            // Log all possible excerpt sources for debugging
            //debugArchiveObject(archive);
            
            // Try all possible sources
            if (archive.plainExcerpt) {
              return archive.plainExcerpt;
            }
            
            if (archive.excerpt) {
              if (typeof archive.excerpt === 'object' && archive.excerpt.rendered) {
                return extractPlainText(archive.excerpt.rendered);
              }
              if (typeof archive.excerpt === 'string') {
                return archive.excerpt;
              }
            }
            
            if (archive.content) {
              if (typeof archive.content === 'object' && archive.content.rendered) {
                const extractedText = extractPlainText(archive.content.rendered);
                return extractedText.substring(0, 150) + (extractedText.length > 150 ? '...' : '');
              }
              if (typeof archive.content === 'string') {
                return archive.content.substring(0, 150) + (archive.content.length > 150 ? '...' : '');
              }
            }
            
            return "Sem descrição disponível";
          })();
          
          // Extract date with fallbacks
          const displayDate = (() => {
            try {
              if (archive.formattedDate) return archive.formattedDate;
              if (archive.date) return formatDate(archive.date);
              if (archive.created_at) return formatDate(archive.created_at);
              return ""; // Fallback to empty string if no date available
            } catch (error) {
              console.error("Error formatting date:", error);
              // Fallback to raw date or empty string
              return archive.date || archive.created_at || "";
            }
          })();
          
          return (
            <Card 
              key={index} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-48">
                <Image
                  src={archive.featured_image || DEFAULT_IMAGE}
                  alt={typeof archive.title === 'object' ? archive.title.rendered : archive.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                  {getCategoryDisplayNames(archive).map((cat, idx) => (
                    <Badge key={idx} className="bg-primary/80 hover:bg-primary">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold line-clamp-2 mb-2">
                  {typeof archive.title === 'object' ? archive.title.rendered : archive.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {displayDate}
                  </span>
                  
                  {archive.views !== undefined && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {archive.views} visualizações
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
                  {excerpt}
                </p>
                
                <div className="mt-4 pt-3 border-t">
                  <Link href={archive.fileUrl || `/arquivo/${archive.id}`}>
                    <Button 
                      variant="outline" 
                      className="w-full flex justify-between items-center"
                    >
                      <span>Ver detalhes</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }
  
  // List View (when view !== "grid")
  return (
    <div className="space-y-6">
      {archives.map((archive, index) => {
        // Extract category name
        const categoryDisplayName = getCategoryDisplayName(archive);
        
        // Extract excerpt with fallbacks
        const excerpt = (() => {
          // Log all possible excerpt sources for debugging
          
          
          // Try all possible sources
          if (archive.plainExcerpt) {
            return archive.plainExcerpt;
          }
          
          if (archive.excerpt) {
            if (typeof archive.excerpt === 'object' && archive.excerpt.rendered) {
              return extractPlainText(archive.excerpt.rendered);
            }
            if (typeof archive.excerpt === 'string') {
              return archive.excerpt;
            }
          }
          
          if (archive.content) {
            if (typeof archive.content === 'object' && archive.content.rendered) {
              const extractedText = extractPlainText(archive.content.rendered);
              return extractedText.substring(0, 150) + (extractedText.length > 150 ? '...' : '');
            }
            if (typeof archive.content === 'string') {
              return archive.content.substring(0, 150) + (archive.content.length > 150 ? '...' : '');
            }
          }
          
          return "Sem descrição disponível";
        })();
        
        // Extract date with fallbacks
        const displayDate = (() => {
          try {
            if (archive.formattedDate) return archive.formattedDate;
            if (archive.date) return formatDate(archive.date);
            if (archive.created_at) return formatDate(archive.created_at);
            return ""; // Fallback to empty string if no date available
          } catch (error) {
            console.error("Error formatting date:", error);
            // Fallback to raw date or empty string
            return archive.date || archive.created_at || "";
          }
        })();
        
        return (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl border border-muted/40 shadow-lg"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image with 30% width */}
              <div className="relative w-full md:w-[30%] cursor-pointer h-64 md:h-auto lg:h-auto overflow-hidden">
                <Image
                  src={archive.featured_image || DEFAULT_IMAGE}
                  alt={typeof archive.title === 'object' ? archive.title.rendered : archive.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105 rounded-t-xl md:rounded-l-xl md:rounded-r-none"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />

                <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                  {getCategoryDisplayNames(archive).map((cat, idx) => (
                    <Badge key={idx} className=" bg-gradient-to-r from-primary to-secondary hover:bg-primary">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Content with 70% width */}
              <div className="p-6 flex flex-col flex-1 space-y-4">
                <h3 className="text-xl font-bold tracking-tight text-foreground /90 line-clamp-2">
                  {typeof archive.title === 'object' ? archive.title.rendered : archive.title}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {excerpt || content.rendered}
                </p>
                
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-muted/30">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 opacity-70" />
                      {displayDate}
                    </span>
                    
                    {archive.views !== undefined && (
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4 opacity-70" />
                        {archive.views} visualizações
                      </span>
                    )}
                  </div>
                  
                  <Link href={archive.fileUrl || `/arquivo/${archive.id}`}>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="bg-primary/90 hover:bg-primary transition-colors duration-200"
                    >
                      Ver detalhes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default ArchivesList