import { getPostsWithCategories } from '@/lib/data-service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await getPostsWithCategories();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in enhanced posts API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enhanced posts' },
      { status: 500 }
    );
  }
}