// Crie este novo arquivo para depurar posts específicos

import { NextRequest, NextResponse } from 'next/server'
import { getPostById, enhancePostData } from '@/lib/data-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Obter post original
    const originalPost = await getPostById(parseInt(id))
    
    // Aplicar aprimoramentos manualmente
    const enhancedPost = enhancePostData(originalPost)
    
    // Retornar comparação
    return NextResponse.json({
      original: originalPost,
      enhanced: enhancedPost,
      comparison: {
        categoryBefore: originalPost.categoryName || originalPost.category || '(não definido)',
        categoryAfter: enhancedPost.categoryName || '(não aprimorado)',
        dateBefore: originalPost.formattedDate || originalPost.date || '(não definido)',
        dateAfter: enhancedPost.formattedDate || '(não aprimorado)',
        excerptBefore: originalPost.plainExcerpt || '(não definido)',
        excerptAfter: enhancedPost.plainExcerpt || '(não aprimorado)'
      }
    })
  } catch (error) {
    console.error('Erro ao depurar post:', error)
    return NextResponse.json(
      { error: 'Falha ao obter dados do post para depuração' },
      { status: 500 }
    )
  }
}