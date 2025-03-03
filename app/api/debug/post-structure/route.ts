import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/data-service';

export async function GET() {
  try {
    // Get a single post for inspection
    const { posts } = getAllPosts();
    const samplePost = posts[0];
    
    // Return detailed structure information
    return NextResponse.json({
      fullStructure: samplePost,
      hasExcerpt: Boolean(samplePost.excerpt),
      excerptType: typeof samplePost.excerpt,
      excerptRendered: Boolean(samplePost.excerpt?.rendered),
      excerptText: samplePost.excerpt?.rendered,
      plainExcerpt: samplePost.plainExcerpt,
      
      hasDate: Boolean(samplePost.date),
      dateValue: samplePost.date,
      formattedDate: samplePost.formattedDate,
      
      hasFeaturedImage: Boolean(samplePost.featured_image),
      featuredImageUrl: samplePost.featured_image,
      
      // Also check for embedded data
      hasEmbedded: Boolean(samplePost._embedded),
      embeddedMedia: samplePost._embedded?.['wp:featuredmedia']?.[0]?.source_url
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message || 'Error debugging post structure'
    }, { status: 500 });
  }
}