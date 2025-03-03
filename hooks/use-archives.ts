"use client"

import { useState, useEffect } from "react"
import axios from 'axios'

export function useArchives({
  categoryId,
  page,
  search,
  filters
}: {
  categoryId: string
  page: number
  search: string
  filters: { 
    sortBy: string
    order: "asc" | "desc"
    categories?: string[]
    subcategory?: string
  }
}) {
  const [archives, setArchives] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArchives = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
    
        
        // Construir parâmetro de ordenação
        let sortParam
        
        if (filters.sortBy === 'random') {
          sortParam = 'random'
        } else {
          // Verifique se sortBy e order são válidos
          if (!filters.sortBy || !filters.order) {
            //console.warn('⚠️ Valores de ordenação inválidos:', filters);
            sortParam = 'date_desc';  // Valor padrão seguro
          } else {
            sortParam = `${filters.sortBy}_${filters.order}`
          }
        }
        
        //console.log(`🔄 Parâmetro de ordenação final: ${sortParam}`);
        
        // Construir parâmetros da requisição
        const params = {
          page,
          search: search || undefined,
          sort: sortParam
        }
        
        // Adicionar categorias se existirem
        if (filters.categories && filters.categories.length > 0) {
          params.categories = filters.categories.join(',')
          //console.log('🔄 Categorias selecionadas:', params.categories)
        }
        
        // Adicionar subcategoria se existir
        if (filters.subcategory) {
          params.subcategory = filters.subcategory
        }
        
        //console.log('🔄 Enviando requisição com parâmetros:', params)
        
        const response = await axios.get(`/api/categories/${categoryId}/posts`, { params })
        
        //console.log('✅ Recebida resposta com', response.data.posts?.length, 'posts');
        
        // Verificar se os posts retornados estão ordenados como esperado
        if (response.data.posts?.length > 1 && filters.sortBy === 'date') {
          const firstPost = response.data.posts[0];
          const lastPost = response.data.posts[response.data.posts.length - 1];
          
          
        }
        
        setArchives(response.data.posts || [])
        setTotalPages(response.data.totalPages || 1)
        setCategory(response.data.category || null)
        setCategories(response.data.categories || [])
        setSubcategories(response.data.subcategories || [])
        setTotalResults(response.data.totalResults || 0)
      } catch (error) {
        console.error('❌ Erro ao buscar dados:', error)
        setError('Falha ao carregar os dados')
        setArchives([])
        setTotalPages(1)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArchives()
  }, [categoryId, page, search, filters])

  return { 
    archives, 
    totalPages, 
    isLoading, 
    category,
    categories,
    subcategories,
    error,
    isEmpty: !isLoading && archives.length === 0,
    totalResults
  }
}