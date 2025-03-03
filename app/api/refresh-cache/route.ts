import { NextResponse } from 'next/server'
import { refreshAllCaches } from '@/lib/data-service'

export async function POST() {
  try {
    const result = await refreshAllCaches()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to refresh cache' }, { status: 500 })
  }
}