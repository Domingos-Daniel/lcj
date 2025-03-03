import { NextRequest, NextResponse } from 'next/server'
import { getCategoryPosts, checkAndUpdateDatabase } from '@/lib/data-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se é hora de atualizar o banco de dados
    await checkAndUpdateDatabase();

    const { id } = params
    const categoryId = parseInt(id)
    
    // Obter parâmetros da URL
    const url = new URL(request.url)
    
    // Extrair e processar parâmetros
    const page = parseInt(url.searchParams.get('page') || '1')
    const search = url.searchParams.get('search') || ''
    const sort = url.searchParams.get('sort') || 'date_desc'
    
    // Processar categorias (podem ser passadas como lista separada por vírgulas)
    let categories: string[] = []
    const categoriesParam = url.searchParams.get('categories')
    if (categoriesParam) {
      try {
        categories = JSON.parse(categoriesParam);
      } catch (e) {
        // If parsing fails, treat as comma-separated list
        categories = categoriesParam.split(',').filter(Boolean);
      }
    }
    
    // Log detalhado dos parâmetros recebidos
    console.log('📡 API - Parâmetros recebidos:', { 
      categoryId, 
      page, 
      search, 
      sort,
      categories: categories.length > 0 ? categories : 'nenhuma' 
    })
    
    // Processar subcategoria
    const subcategory = url.searchParams.get('subcategory') || undefined
    
    // Buscar dados com os parâmetros processados
    const data = await getCategoryPosts(categoryId, {
      page,
      search,
      sort,
      categories,
      subcategory
    }).catch(error => {
      console.error(`Error in getCategoryPosts:`, error);
      // Return fallback data
      return {
        posts: [],
        totalPages: 0,
        category: { id: categoryId, name: `Category ${categoryId}` },
        categories: [],
        subcategories: [],
        totalResults: 0
      };
    });
    
    // Log de resposta
    console.log('📡 API - Resposta:', { 
      posts: data.posts?.length,
      totalPages: data.totalPages,
      categoriesReturned: data.categories?.length || 0
    })
    
    // Update the response to ensure consistent fields
    return NextResponse.json({
      ...data,
      posts: data.posts.map(post => ({
        id: post.id,
        title: post.title?.rendered || post.title || '',
        excerpt: post.plainExcerpt || post.excerpt?.rendered || '',
        content: post.content?.rendered || post.content || '',
        date: post.formattedDate || post.date || '',
        modified: post.formattedModified || post.modified || '',
        slug: post.slug || '',
        featuredImage: post.featuredImage || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        categories: post.categories || [],
        categoryNames: post.categoryNames || []
      }))
    });
  } catch (error) {
    console.error('❌ Erro no processamento da API:', error)
    return NextResponse.json(
      { error: error.message || 'Falha ao processar requisição' },
      { status: 500 }
    )
  }
}