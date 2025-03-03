import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/data-service';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get all posts
    const { posts } = getAllPosts();
    
    // Check raw database file
    const DATABASE_FILE = path.join(process.cwd(), 'data', 'database.json');
    let rawDBExists = false;
    let rawDBSize = 0;
    let rawDBSample = '';
    
    try {
      if (fs.existsSync(DATABASE_FILE)) {
        rawDBExists = true;
        const stats = fs.statSync(DATABASE_FILE);
        rawDBSize = stats.size;
        
        // Get a sample of the raw JSON
        const rawData = fs.readFileSync(DATABASE_FILE, 'utf8');
        rawDBSample = rawData.substring(0, 1000) + '...';
      }
    } catch (e) {
      console.error('Error accessing raw database file:', e);
    }
    
    // Get the first few posts to inspect
    const samplePosts = posts.slice(0, 2);
    
    return NextResponse.json({
      success: true,
      totalPosts: posts.length,
      databaseFile: {
        exists: rawDBExists,
        sizeBytes: rawDBSize,
        sample: rawDBSample
      },
      samplePosts: samplePosts.map(post => ({
        id: post.id,
        title: typeof post.title === 'object' ? post.title.rendered : post.title,
        excerpt: post.excerpt,
        plainExcerpt: post.plainExcerpt,
        date: post.date,
        formattedDate: post.formattedDate,
        hasExcerptField: Boolean(post.excerpt),
        hasExcerptRendered: Boolean(post.excerpt?.rendered),
        hasPlainExcerpt: Boolean(post.plainExcerpt),
        hasDateField: Boolean(post.date),
        hasFormattedDate: Boolean(post.formattedDate)
      }))
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Error debugging database'
    }, { status: 500 });
  }
}