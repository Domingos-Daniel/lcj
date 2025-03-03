import { NextResponse } from 'next/server'
import { refreshAllCaches } from '@/lib/data-service'

// This endpoint will be triggered by a real cron job service
export async function GET(request: Request) {
  // Simple authorization check (replace with a proper auth approach)
  const { searchParams } = new URL(request.url)
  const apiKey = searchParams.get('key')
  
  if (apiKey !== process.env.CRON_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const result = await refreshAllCaches()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to refresh cache' }, { status: 500 })
  }
}