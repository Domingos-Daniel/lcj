import { NextResponse } from 'next/server';
import { debugCategory } from '@/lib/data-service';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = parseInt(params.id, 10);
    
    if (isNaN(categoryId)) {
      return NextResponse.json({ 
        error: 'Invalid category ID' 
      }, { status: 400 });
    }
    
    const categoryInfo = await debugCategory(categoryId);
    
    return NextResponse.json(categoryInfo);
  } catch (error) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}