"use client"

import { useState, useEffect } from "react"
import axios from 'axios'

export function useAllArchives(categoryId: string) {
  const [archives, setArchives] = useState([])
  const [category, setCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAllArchives = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await axios.get(`/api/categories/${categoryId}/all`)
        setArchives(response.data.posts)
        setCategory(response.data.category)
      } catch (err) {
        setError('Falha ao carregar todos os arquivos')
        console.error('Erro ao carregar arquivos:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllArchives()
  }, [categoryId])

  return { archives, category, isLoading, error }
}