import { NextResponse } from 'next/server';
import { getSubcategories } from '@/lib/data-service';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;
    
    // Get subcategories
    const subcategories = getSubcategories(categoryId);
    
    return NextResponse.json({
      success: true,
      categoryId,
      subcategories,
      count: subcategories.length
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Error fetching subcategories'
    }, { status: 500 });
  }
}