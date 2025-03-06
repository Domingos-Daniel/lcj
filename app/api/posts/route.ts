import { getEnhancedPosts } from '@/lib/data-service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await getEnhancedPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in posts API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}