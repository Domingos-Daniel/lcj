import { NextResponse } from 'next/server';
import { initializeDatabase, getCategoryHierarchy } from '@/lib/data-service';

export async function GET(request: Request) {
  try {
    // Get database
    const db = initializeDatabase();
    
    // Get category hierarchy
    const { hierarchy, flatMap } = getCategoryHierarchy(db);
    
    // Get all categories as flat list
    const allCategories = Object.keys(db.categories || {}).map(catId => {
      const category = db.categories[catId].info;
      return {
        id: category.id,
        name: category.name,
        parent: category.parent,
        slug: category.slug,
        postCount: (db.categories[catId].posts || []).length
      };
    });
    
    // Return category information
    return NextResponse.json({
      success: true,
      categoriesCount: allCategories.length,
      categories: allCategories,
      hierarchy
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}