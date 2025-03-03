import { NextResponse } from 'next/server'
import { updateDatabase } from '@/lib/data-service'

// Esta rota será chamada na inicialização para garantir que temos dados atualizados
export async function GET() {
  try {
    const success = await updateDatabase()
    return NextResponse.json({ success })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Falha na inicialização' }, { status: 500 })
  }
}