import { NextResponse } from 'next/server';
import axios from 'axios';

// This function will fetch all categories from WordPress API
async function fetchAllCategories() {
  try {
    let allCategories = [];
    let page = 1;
    let hasMorePages = true;
    
    // WordPress has pagination limits, so we need to fetch all pages
    while (hasMorePages) {
      const response = await axios.get("https://lcj-educa.com/?rest_route=/wp/v2/categories", {
        params: {
          per_page: 100, // Maximum allowed by WordPress API
          page: page
        }
      });
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        allCategories = [...allCategories, ...response.data];
        
        // Check if there are more pages
        const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1');
        if (page >= totalPages) {
          hasMorePages = false;
        } else {
          page++;
        }
      } else {
        hasMorePages = false;
      }
    }
    
    return allCategories;
  } catch (error) {
    console.error('Error fetching all categories from WordPress API:', error);
    return []; 
  }
}

export async function GET() {
  try {
    const categories = await fetchAllCategories();
    console.log(`API route: Fetched ${categories.length} categories`);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error in categories API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}