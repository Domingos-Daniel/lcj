import { NextResponse } from 'next/server'
import { getAllCategoryPosts } from '@/lib/data-service'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const categoryId = parseInt(params.id, 10)
  
  try {
    const data = getAllCategoryPosts(categoryId)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar todos os posts da categoria' }, { status: 500 })
  }
}