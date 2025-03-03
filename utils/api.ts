import axios from 'axios';

interface Post {
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

interface PostResponse {
  id: number
  title: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  date: string
  date_gmt: string
  type: string
  meta?: {
    downloads?: number
    views?: number
    file_url?: string
  }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
    }>
  }
  link: string
}

interface CategoryResponse {
  id: number
  name: string
  description: string
}

export async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await axios.get('https://lcj-educa.com/?rest_route=/wp/v2/posts', {
      params: {
        categories: 21,
        _embed: true, // Ensure embedded data is included
      },
    });

    //console.log('API response:', response.data); // Log the API response

    return response.data.map((post: any) => ({
      title: post.title.rendered,
      category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Unknown Category',
      imageUrl: post.featured_media ? post._embedded?.['wp:featuredmedia']?.[0]?.source_url : '/placeholder.svg',
      description: post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 40),
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function fetchCategoryPosts(categoryId: number, options: {
  page: number
  search: string
  type: string
  sortBy: string
}) {
  try {
    const response = await axios.get(`https://lcj-educa.com/?rest_route=/wp/v2/posts`, {
      params: {
        categories: categoryId,
        page: options.page,
        search: options.search,
        per_page: 10,
        _embed: true,
        orderby: options.sortBy === 'recent' ? 'date' : 'title',
        order: options.sortBy === 'recent' ? 'desc' : 'asc'
      },
    });

    const totalPages = Number(response.headers['x-wp-totalpages']) || 1;

    const posts = response.data.map((post: any) => ({
      id: post.id,
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, ""),
      type: post.type || 'post',
      created_at: post.date_gmt || post.date || null, // Use GMT date or fallback to local date
      downloads: Number(post.meta?.downloads) || 0,
      views: Number(post.meta?.views) || 0,
      file_url: post.meta?.file_url || post.link || '',
      category: categoryId,
      featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
    }));

    // Fetch category details
    const categoryResponse = await axios.get(`https://lcj-educa.com/?rest_route=/wp/v2/categories/${categoryId}`);
    const category = {
      id: categoryResponse.data.id,
      name: categoryResponse.data.name,
      description: categoryResponse.data.description
    };

    return {
      posts,
      totalPages,
      category
    };

  } catch (error) {
    console.error('Error fetching category posts:', error);
    throw new Error('Failed to fetch category posts');
  }
}

// Função para buscar todos os posts de uma categoria sem paginação
export async function fetchAllCategoryPosts(categoryId: number) {
  try {
    //console.log('Iniciando fetchAllCategoryPosts para categoria:', categoryId);
    
    // Primeiro, vamos buscar a primeira página para obter o número total de páginas
    const firstPageResponse = await axios.get(`https://lcj-educa.com/?rest_route=/wp/v2/posts`, {
      params: {
        categories: categoryId,
        page: 1,
        per_page: 100, // Use um valor maior para reduzir o número de chamadas
        _embed: true
      },
    });
    
    const totalPages = Number(firstPageResponse.headers['x-wp-totalpages']) || 1;
    //console.log(`Total de páginas: ${totalPages}`);
    
    let allPosts = [...firstPageResponse.data];
    
    // Se houver mais páginas, busque-as
    if (totalPages > 1) {
      const remainingPagePromises = [];
      
      for (let page = 2; page <= totalPages; page++) {
        remainingPagePromises.push(
          axios.get(`https://lcj-educa.com/?rest_route=/wp/v2/posts`, {
            params: {
              categories: categoryId,
              page: page,
              per_page: 100,
              _embed: true
            },
          })
        );
      }
      
      const remainingResponses = await Promise.all(remainingPagePromises);
      
      for (const response of remainingResponses) {
        allPosts = [...allPosts, ...response.data];
      }
    }
    
    //console.log(`Total de posts obtidos: ${allPosts.length}`);
    
    // Transforma os dados
    const posts = allPosts.map((post: any) => ({
      id: post.id,
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, ""),
      content: post.content.rendered,
      type: post.type || 'post',
      created_at: post.date_gmt || post.date || null,
      downloads: Number(post.meta?.downloads) || 0,
      views: Number(post.meta?.views) || 0,
      file_url: post.meta?.file_url || post.link || '',
      category: categoryId,
      featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
    }));

    // Busca os detalhes da categoria
    const categoryResponse = await axios.get(`https://lcj-educa.com/?rest_route=/wp/v2/categories/${categoryId}`);
    const category = {
      id: categoryResponse.data.id,
      name: categoryResponse.data.name,
      description: categoryResponse.data.description
    };

    return {
      posts,
      category,
      totalPosts: posts.length
    };
    
  } catch (error) {
    console.error('Erro ao buscar todos os posts da categoria:', error);
    throw new Error('Falha ao buscar todos os posts da categoria');
  }
}