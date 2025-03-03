import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export async function GET() {
  try {
    // Essential categories to fetch
    const essentialCategories = [22, 27, 28, 31, 32]; 
    
    // Database path
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    
    // Ensure directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Initialize or load database
    let db;
    try {
      const content = fs.existsSync(dbPath) ? fs.readFileSync(dbPath, 'utf8') : '{}';
      db = JSON.parse(content);
    } catch (e) {
      db = {};
    }
    
    // Initialize structure if needed
    if (!db.categories) db.categories = {};
    
    // Track progress
    let categoriesLoaded = 0;
    const results = [];
    
    // Fetch each essential category
    for (const categoryId of essentialCategories) {
      try {
        // Fetch category posts from WordPress API
        const response = await axios.get(`https://lcj-educa.com/?rest_route=/wp/v2/posts&categories=${categoryId}&per_page=50`);
        
        // Fetch category info
        const catResponse = await axios.get(`https://lcj-educa.com/?rest_route=/wp/v2/categories/${categoryId}`);
        
        // Add to database
        db.categories[categoryId] = {
          info: {
            id: categoryId,
            name: catResponse.data.name || `Categoria ${categoryId}`,
            description: catResponse.data.description || ""
          },
          posts: response.data
        };
        
        categoriesLoaded++;
        results.push({
          categoryId,
          name: catResponse.data.name,
          postsLoaded: response.data.length
        });
      } catch (error) {
        results.push({
          categoryId,
          error: error.message
        });
      }
    }
    
    // Update timestamp
    db.lastUpdated = Date.now();
    
    // Save to file
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    
    return NextResponse.json({
      success: true,
      categoriesLoaded,
      fileSize: `${(fs.statSync(dbPath).size / 1024).toFixed(2)} KB`,
      results
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}