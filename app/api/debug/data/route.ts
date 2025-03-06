// Novo arquivo

import { NextResponse } from 'next/server'
import { getAllPosts, initializeDatabase } from '@/lib/data-service'

export async function GET() {
  try {
    const db = initializeDatabase()
    const categoriesObject = db.categories || {}
    
    // Conversão para array mais fácil de analisar
    const categories = Object.keys(categoriesObject).map(key => ({
      id: key,
      ...categoriesObject[key]?.info
    }))
    
    // Pegar uma amostra de posts para análise
    const posts = await getAllPosts()
    const samplePosts = posts.slice(0, 10)
    
    // Dados de diagnóstico detalhados
    const diagnosticInfo = {
      categoriesCount: categories.length,
      postsCount: posts.length,
      sampleCategories: categories.slice(0, 10),
      samplePosts,
      // Estatísticas sobre os posts
      postStats: {
        withCategory: posts.filter(p => p.category || p.categories?.length).length,
        withCategoryName: posts.filter(p => p.categoryName).length,
        withDate: posts.filter(p => p.date || p.created_at).length,
        withFormattedDate: posts.filter(p => p.formattedDate).length,
        withExcerpt: posts.filter(p => p.excerpt || p.plainExcerpt).length,
      },
      // Detalhes sobre os tipos de dados
      firstPostDetails: posts[0] ? {
        categoryType: typeof posts[0].category,
        categoriesType: Array.isArray(posts[0].categories) ? 'array' : typeof posts[0].categories,
        titleType: typeof posts[0].title,
        excerptType: typeof posts[0].excerpt
      } : null
    }
    
    return NextResponse.json(diagnosticInfo)
  } catch (error: any) {
    console.error('Erro na API de diagnóstico:', error)
    return NextResponse.json(
      { error: error.message || 'Erro desconhecido' },
      { status: 500 }
    )
  }
}