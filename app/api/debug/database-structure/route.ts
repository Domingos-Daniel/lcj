import { NextResponse } from 'next/server';
import { checkDatabaseStructure } from '@/lib/data-service';

export async function GET() {
  try {
    const stats = await checkDatabaseStructure();
    
    return NextResponse.json({
      success: true,
      databaseStats: stats
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}