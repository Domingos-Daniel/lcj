import { NextResponse } from 'next/server'
import { getCarouselContent } from '@/lib/api-service'

export async function GET() {
  try {
    // Buscar dados do carrossel usando nossa função de serviço
    const carouselData = await getCarouselContent()
    
    return NextResponse.json(carouselData)
  } catch (error) {
    console.error('Erro ao buscar dados do carrossel:', error)
    return NextResponse.json(
      { error: 'Falha ao carregar o carrossel' },
      { status: 500 }
    )
  }
}