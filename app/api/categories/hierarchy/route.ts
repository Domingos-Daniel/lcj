import { NextResponse } from 'next/server';
import { getCategoryHierarchy } from '@/lib/data-service';
import { initializeDatabase } from '@/lib/data-service';

export async function GET() {
  try {
    // Initialize database to ensure it exists
    const db = initializeDatabase();
    
    // Get category hierarchy
    const hierarchyData = getCategoryHierarchy(db);
    
    return NextResponse.json({
      success: true,
      rootCategories: hierarchyData.hierarchy,
      totalCategories: Object.keys(hierarchyData.flatMap).length
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Error fetching category hierarchy'
    }, { status: 500 });
  }
}