import { NextResponse } from 'next/server'
import { updateDatabase } from '@/lib/data-service'

export async function POST(request: Request) {
  try {
    const success = await updateDatabase()
    return NextResponse.json({ success })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Falha ao atualizar banco de dados' }, { status: 500 })
  }
}