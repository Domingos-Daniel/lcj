import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const response = await axios.get('https://lcj-educa.com/?rest_route=/wp/v2/posts', {
      params: {
        per_page: 100,
        _embed: 1,
        _fields: 'id,date,modified,title,excerpt,content,slug,featured_media,categories,_embedded'
      }
    });

    const allPosts = response.data;

    const transformedPosts = allPosts.map(post => {
      // Extract plain text excerpt
      let plainExcerpt = '';
      if (post.excerpt?.rendered) {
        plainExcerpt = post.excerpt.rendered
          .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
          .replace(/&hellip;/g, "...") // Replace HTML entities
          .trim();
      }

      // Format date
      const formattedDate = post.date ? 
        new Date(post.date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) : '';

      // Get featured image URL
      let featuredImage = null;
      if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
        featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
      }

      // Get category names if available
      let categoryNames = [];
      if (post._embedded?.['wp:term']?.[0]) {
        categoryNames = post._embedded['wp:term'][0].map(cat => cat.name);
      }

      return {
        id: post.id,
        title: post.title?.rendered || '',
        plainExcerpt: plainExcerpt,
        excerpt: post.excerpt,
        content: post.content,
        date: post.date,
        formattedDate: formattedDate,
        modified: post.modified,
        slug: post.slug,
        featured_image: featuredImage,
        categories: post.categories,
        categoryNames: categoryNames
      };
    });

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        // Your pagination data
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message || 'Error fetching posts'
    }, { status: 500 });
  }
}