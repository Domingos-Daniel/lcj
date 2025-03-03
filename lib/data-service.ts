import fs from 'fs'
import path from 'path'
import axios from 'axios';
import { fetchPosts, fetchCategoryPosts } from '@/utils/api'
// Removi fetchAllCategoryPosts da importação acima

const DATABASE_DIR = path.join(process.cwd(), 'data')
const DATABASE_FILE = path.join(DATABASE_DIR, 'database.json')
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos
const CATEGORIES_TO_CACHE = [21, 22, 23] // Categorias para cachear

// Garantir que o diretório data existe
if (!fs.existsSync(DATABASE_DIR)) {
  fs.mkdirSync(DATABASE_DIR, { recursive: true })
}

// Funções auxiliares existentes
function getCachePath(key: string): string {
  return path.join(DATA_DIRECTORY, `${key}.json`)
}

function isCacheValid(filePath: string): boolean {
  try {
    if (!fs.existsSync(filePath)) return false
    
    const stats = fs.statSync(filePath)
    const now = new Date().getTime()
    const modTime = stats.mtimeMs
    
    return now - modTime < CACHE_DURATION
  } catch (error) {
    console.error('Erro na validação do cache:', error)
    return false
  }
}

// Nova implementação do banco de dados centralizado
interface DatabaseStructure {
  lastUpdated: number
  categories: {
    [categoryId: string]: {
      info: {
        id: number
        name: string
        description: string
      }
      posts: any[]
    }
  }
}

// Função para inicializar o banco de dados se não existir
function initializeDatabase(): DatabaseStructure {
  if (!fs.existsSync(DATABASE_FILE)) {
    const initialData: DatabaseStructure = {
      lastUpdated: 0,
      categories: {}
    }
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(initialData))
    return initialData
  }
  
  try {
    const data = fs.readFileSync(DATABASE_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Erro ao ler banco de dados:', error)
    const initialData: DatabaseStructure = {
      lastUpdated: 0,
      categories: {}
    }
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(initialData))
    return initialData
  }
}

// Verificar se o banco de dados está desatualizado
function isDatabaseStale(): boolean {
  try {
    const db = initializeDatabase()
    const now = Date.now()
    return now - db.lastUpdated > CACHE_DURATION
  } catch (error) {
    console.error('Erro ao verificar atualização do banco:', error)
    return true
  }
}

// Atualiza o banco de dados com dados da API
export async function updateDatabase(maxRetries = 3): Promise<boolean> {
  let retryCount = 0;
  
  while (retryCount <= maxRetries) {
    try {
      console.log(`Atualizando banco de dados (tentativa ${retryCount + 1})...`);
      const db = initializeDatabase();
      
      // Get all category IDs instead of using the hard-coded array
      const allCategoryIds = await fetchAllCategoryIds();
      console.log(`Encontradas ${allCategoryIds.length} categorias para cachear`);
      
      // Contador para monitorar progresso
      let completedCategories = 0;
      
      // Atualizar cada categoria
      for (const categoryId of allCategoryIds) {
        try {
          console.log(`Buscando dados para categoria ${categoryId} (${completedCategories + 1}/${allCategoryIds.length})...`);
          
          // Use a função existente para buscar posts
          const response = await fetchCategoryPosts(categoryId, {
            page: 1,
            search: "",
            type: "all",
            sortBy: "recent"
          });
          
          // Armazene no banco de dados
          if (!db.categories[categoryId]) {
            db.categories[categoryId] = {
              info: response.category,
              posts: []
            };
          }
          
          // Buscar todas as páginas
          let allPosts = [...response.posts];
          const totalPages = response.totalPages;
          
          if (totalPages > 1) {
            for (let page = 2; page <= totalPages; page++) {
              const pageData = await fetchCategoryPosts(categoryId, {
                page,
                search: "",
                type: "all",
                sortBy: "recent"
              });
              allPosts = [...allPosts, ...pageData.posts];
            }
          }
          
          // Atualizar os posts
          db.categories[categoryId].posts = allPosts;
          completedCategories++;
          
        } catch (categoryError) {
          console.error(`Erro ao buscar categoria ${categoryId}:`, categoryError);
          // Continue com as outras categorias mesmo se uma falhar
          continue;
        }
      }
      
      // Atualizar timestamp
      db.lastUpdated = Date.now();
      
      // Salvar banco de dados
      const dbJson = JSON.stringify(db);
      
      // Salvar em um arquivo temporário primeiro para evitar corrupção
      const tempFilePath = `${DATABASE_FILE}.temp`;
      fs.writeFileSync(tempFilePath, dbJson);
      
      // Renomear para substituir o arquivo original
      fs.renameSync(tempFilePath, DATABASE_FILE);
      
      console.log(`Banco de dados atualizado com sucesso. ${completedCategories} categorias processadas.`);
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar banco de dados (tentativa ${retryCount + 1}):`, error);
      retryCount++;
      
      // Se não for a última tentativa, esperar antes de tentar novamente
      if (retryCount <= maxRetries) {
        const waitTime = 2000 * retryCount; // Espera progressiva
        console.log(`Tentando novamente em ${waitTime/1000} segundos...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  console.error(`❌ Falha na atualização do banco de dados após ${maxRetries} tentativas.`);
  return false;
}

// Função para buscar posts de uma categoria do banco de dados local
// Remova a primeira declaração da função getCategoryPosts (linhas 144-500 aproximadamente)
// e mantenha apenas a versão atualizada que começa em torno da linha 620

// Remova esta primeira implementação:
// export function getCategoryPosts(categoryId: number, options: { ... }) { ... }

// E mantenha apenas a implementação mais recente que começa com:
// Filtragem de categorias atualizada
export async function getCategoryPosts(categoryId: number, options: {
  page: number,
  search: string,
  sort: string,
  categories?: string[],
  subcategory?: string
}) {
  try {
    // Verificar se precisa atualizar
    if (isDatabaseStale()) {
      updateDatabase().catch(err => console.error('Erro na atualização automática:', err));
    }
    
    // Ler banco de dados
    const db = initializeDatabase();
    
    // Verificar se a categoria existe
    if (!db.categories[categoryId]) {
      const categoryData = await fetchCategoryOnDemand(categoryId);
      if (!categoryData) {
        return {
          posts: [],
          totalPages: 0,
          category: null,
          categories: [],
          subcategories: [],
          totalResults: 0
        };
      }
    }
    
    // Obter todos os posts da categoria
    let posts = [...db.categories[categoryId].posts];
    
    // Filtrar por categorias selecionadas se houver alguma
    if (options.categories && options.categories.length > 0) {
      // Converter IDs de categorias selecionadas para ambos formatos (string e número)
      const selectedCategoryIds = new Set();
      const selectedCategoryIdsNumeric = new Set();
      
      options.categories.forEach(id => {
        selectedCategoryIds.add(id);
        if (!isNaN(parseInt(id))) {
          selectedCategoryIdsNumeric.add(parseInt(id));
        }
      });
      
      posts = posts.filter(post => {
        // ESTRATÉGIA 1: Verificar o array de categorias
        if (post.categories && Array.isArray(post.categories)) {
          for (const catId of post.categories) {
            if (selectedCategoryIds.has(String(catId)) || 
                selectedCategoryIdsNumeric.has(Number(catId))) {
              return true;
            }
          }
        }
        
        // ESTRATÉGIA 2: Verificar campo category_id
        if (post.category_id !== undefined) {
          if (selectedCategoryIds.has(String(post.category_id)) || 
              selectedCategoryIdsNumeric.has(Number(post.category_id))) {
            return true;
          }
        }
        
        // ESTRATÉGIA 3: Verificar campo category
        if (post.category !== undefined) {
          if (selectedCategoryIds.has(String(post.category)) || 
              selectedCategoryIdsNumeric.has(Number(post.category))) {
            return true;
          }
        }
        
        // ESTRATÉGIA 4: Verificar se o post tem uma propriedade com o nome da categoria
        for (const id of selectedCategoryIds) {
          const catKey = `category_${id}`;
          if (post[catKey] === true) {
            return true;
          }
        }
        
        return false;
      });
      
      // Se não encontrou nenhum post, faça diagnóstico
      if (posts.length === 0) {
        const categoryCounts = {};
        db.categories[categoryId].posts.forEach(post => {
          if (post.categories && Array.isArray(post.categories)) {
            post.categories.forEach(catId => {
              categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
            });
          }
          
          if (post.category_id !== undefined) {
            categoryCounts[post.category_id] = (categoryCounts[post.category_id] || 0) + 1;
          }
          
          if (post.category !== undefined) {
            categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
          }
        });
      }
    }
    
    // Aplicar filtro de pesquisa
    if (options.search && options.search.trim() !== '') {
      const searchLower = options.search.toLowerCase();
      
      posts = posts.filter(post => {
        // Extrair título e conteúdo
        const title = typeof post.title === 'object' ? post.title.rendered : (post.title || '');
        const excerpt = typeof post.excerpt === 'object' ? post.excerpt.rendered : (post.excerpt || '');
        const content = typeof post.content === 'object' ? post.content.rendered : (post.content || '');
        
        // Remover HTML e converter para minúsculas
        const titleText = title.toString().toLowerCase();
        const excerptText = excerpt.toString().replace(/<\/?[^>]+(>|$)/g, "").toLowerCase();
        const contentText = content.toString().replace(/<\/?[^>]+(>|$)/g, "").toLowerCase();
        
        // Verificar se o termo de busca está presente
        return titleText.includes(searchLower) || 
               excerptText.includes(searchLower) || 
               contentText.includes(searchLower);
      });
    }
    
    // Aplicar ordenação
    if (options.sort === 'random') {
      // Ordenação aleatória
      const shuffledPosts = [...posts];
      for (let i = shuffledPosts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPosts[i], shuffledPosts[j]] = [shuffledPosts[j], shuffledPosts[i]];
      }
      posts = shuffledPosts;
    } else {
      // Parse do parâmetro sort
      const parts = options.sort ? options.sort.split('_') : ['date', 'desc'];
      
      if (parts.length === 2) {
        const [field, order] = parts;
        const isAsc = order === 'asc';
        
        switch (field) {
          case 'title':
            posts = posts.sort((a, b) => {
              // Extrair os títulos (que podem ser objetos do WordPress)
              const titleA = typeof a.title === 'object' ? a.title.rendered : (a.title || '');
              const titleB = typeof b.title === 'object' ? b.title.rendered : (b.title || '');
              
              // Garantir que estamos comparando strings
              const strA = String(titleA).toLowerCase();
              const strB = String(titleB).toLowerCase();
              
              // Comparar os títulos
              return isAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
            });
            break;
          
          case 'modified':
            posts = posts.sort((a, b) => {
              // Obter as datas de modificação
              let dateA, dateB;
              
              try {
                dateA = new Date(a.modified || a.modified_gmt || a.date || 0).getTime();
              } catch (e) {
                dateA = 0;
              }
              
              try {
                dateB = new Date(b.modified || b.modified_gmt || a.date || 0).getTime();
              } catch (e) {
                dateB = 0;
              }
              
              // Ordenar por data de modificação
              return isAsc ? dateA - dateB : dateB - dateA;
            });
            break;
            
          case 'date':
          default:
            posts = posts.sort((a, b) => {
              // Extrair valores de data
              let dateA, dateB;
              
              // Usar uma ordem específica de propriedades para procurar a data
              const dateProperties = ['date', 'date_gmt', 'created_at', 'timestamp'];
              
              // Encontrar a primeira propriedade de data válida para o post A
              for (const prop of dateProperties) {
                if (a[prop]) {
                  try {
                    const parsed = new Date(a[prop]);
                    if (!isNaN(parsed.getTime())) {
                      dateA = parsed.getTime();
                      break;
                    }
                  } catch (e) {
                    continue;
                  }
                }
              }
              
              // Encontrar a primeira propriedade de data válida para o post B
              for (const prop of dateProperties) {
                if (b[prop]) {
                  try {
                    const parsed = new Date(b[prop]);
                    if (!isNaN(parsed.getTime())) {
                      dateB = parsed.getTime();
                      break;
                    }
                  } catch (e) {
                    continue;
                  }
                }
              }
              
              // Se não encontrou data válida, usar 0 (mais antigo possível)
              if (dateA === undefined) dateA = 0;
              if (dateB === undefined) dateB = 0;
              
              // Ordenar conforme especificado
              return isAsc ? dateA - dateB : dateB - dateA;
            });
            break;
        }
      } else {
        posts.sort((a, b) => {
          let dateA, dateB;
          try {
            dateA = new Date(a.date || a.date_gmt || 0).getTime();
          } catch (e) {
            dateA = 0;
          }
          try {
            dateB = new Date(b.date || b.date_gmt || 0).getTime();
          } catch (e) {
            dateB = 0;
          }
          return dateB - dateA; // Ordenação decrescente por padrão
        });
      }
    }

    // Garantir que cada post tenha o nome da categoria
    posts = posts.map(post => {
      if (post.categoryName) return post;
      
      let categoryName = null;
      
      if (post.category) {
        for (const catId in db.categories) {
          if (String(db.categories[catId].info?.id) === String(post.category)) {
            categoryName = db.categories[catId].info?.name;
            break;
          }
        }
      }
      
      if (!categoryName && post.categories && post.categories.length > 0) {
        const firstCatId = post.categories[0];
        for (const catId in db.categories) {
          if (String(db.categories[catId].info?.id) === String(firstCatId)) {
            categoryName = db.categories[catId].info?.name;
            break;
          }
        }
      }
      
      return {
        ...post,
        categoryName: categoryName
      };
    });

    // Process each post to add needed fields
    const processedPosts = posts.map(post => {
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
      
      return {
        ...post,
        plainExcerpt,
        formattedDate
      };
    });

    // Aplicar paginação
    const pageSize = 10;
    const totalResults = processedPosts.length;
    const totalPages = Math.ceil(totalResults / pageSize);
    const startIndex = (options.page - 1) * pageSize;

    // Mapeie os posts para adicionar os nomes das categorias
    const pageItems = processedPosts.slice(startIndex, startIndex + pageSize).map(post => {
      // Criar cópia do post para modificação
      const enhancedPost = { ...post };
      
      // Função para buscar nome da categoria por ID
      const getCategoryNameById = (categoryId) => {
        if (!categoryId) return null;
        
        const idStr = String(categoryId);
        
        for (const catId in db.categories) {
          const category = db.categories[catId].info;
          if (category && String(category.id) === idStr) {
            return category.name;
          }
        }
        
        return null;
      };
      
      // Caso 1: Temos categories como array
      if (enhancedPost.categories && Array.isArray(enhancedPost.categories) && enhancedPost.categories.length > 0) {
        const primaryCategoryId = enhancedPost.categories[0];
        const categoryName = getCategoryNameById(primaryCategoryId);
        
        if (categoryName) {
          enhancedPost.categoryName = categoryName;
        }
      }
      
      // Caso 2: Temos category como ID único
      if (!enhancedPost.categoryName && enhancedPost.category) {
        const categoryName = getCategoryNameById(enhancedPost.category);
        
        if (categoryName) {
          enhancedPost.categoryName = categoryName;
        }
      }
      
      // Caso especial para WordPress: Se o post tem um objeto de categorias
      if (!enhancedPost.categoryName && enhancedPost.categories && typeof enhancedPost.categories === 'object' && !Array.isArray(enhancedPost.categories)) {
        const wpCategories = Object.values(enhancedPost.categories);
        if (wpCategories.length > 0) {
          const wpCategory = wpCategories[0];
          if (typeof wpCategory === 'object' && wpCategory.name) {
            enhancedPost.categoryName = wpCategory.name;
          } else if (typeof wpCategory === 'string' || typeof wpCategory === 'number') {
            const categoryName = getCategoryNameById(wpCategory);
            if (categoryName) {
              enhancedPost.categoryName = categoryName;
            }
          }
        }
      }
      
      // Se ainda não temos categoryName, tentar deduzir da relação da categoria principal
      if (!enhancedPost.categoryName && db.categories[categoryId] && db.categories[categoryId].info) {
        enhancedPost.categoryName = db.categories[categoryId].info.name;
      }
      
      return enhancedPost;
    });

    // Extrair categorias associadas
    const associatedCategories = extractAssociatedCategories(db, categoryId);

    return {
      posts: pageItems,
      totalPages,
      category: db.categories[categoryId]?.info || { id: categoryId, name: `Categoria ${categoryId}` },
      categories: getAllAvailableCategories(db),
      subcategories: extractSubcategories(db, categoryId),
      totalResults
    };
  } catch (error) {
    console.error('❌ Erro ao buscar posts:', error);
    return {
      posts: [],
      totalPages: 0,
      category: null,
      categories: [],
      subcategories: [],
      totalResults: 0
    };
  }
}

// Nova função para extrair categorias associadas à categoria principal
function extractAssociatedCategories(db, mainCategoryId) {
  try {
    // Coletar todas as categorias usadas pelos posts na categoria principal
    const mainCategoryPosts = db.categories[mainCategoryId]?.posts || []
    const usedCategoryIds = new Set()
    
    // Coletar todos os IDs de categorias usados nos posts
    mainCategoryPosts.forEach(post => {
      if (post.categories && Array.isArray(post.categories)) {
        post.categories.forEach(catId => usedCategoryIds.add(String(catId)))
      }
    })
    
    // Converter para array de objetos categoria
    const categories = []
    usedCategoryIds.forEach(id => {
      // Buscar informações da categoria no banco de dados
      for (const catId in db.categories) {
        if (String(catId) === String(id) || String(db.categories[catId].info?.id) === String(id)) {
          categories.push(db.categories[catId].info)
          break
        }
      }
    })
    
    return categories
  } catch (error) {
    console.error('Erro ao extrair categorias associadas:', error)
    return []
  }
}

// Função auxiliar para extrair categorias
function extractCategories(db, mainCategoryId) {
  try {
    // Se tivermos uma listagem de categorias no banco de dados
    if (db.categories) {
      return Object.values(db.categories)
        .map((cat: any) => cat.info)
        .filter((cat: any) => cat.id !== mainCategoryId) // Exclui a categoria principal
    }
    return []
  } catch (error) {
    console.error('Erro ao extrair categorias:', error)
    return []
  }
}

// Função auxiliar para extrair subcategorias
function extractSubcategories(db, categoryId) {
  try {
    // First, try to extract subcategories based on parent field
    const allCategories = getAllAvailableCategories(db);
    const subcategories = allCategories.filter(cat => 
      cat.parent && String(cat.parent) === String(categoryId)
    );
    
    if (subcategories.length > 0) {
      return subcategories;
    }
    
    // If no subcategories found with parent field, try extracting from posts
    if (db.categories[categoryId]?.posts) {
      const subcatMap = new Map();
      
      db.categories[categoryId].posts.forEach((post: any) => {
        if (post.subcategory) {
          const key = post.subcategory.toString();
          if (!subcatMap.has(key)) {
            subcatMap.set(key, {
              id: post.subcategory,
              name: post.subcategoryName || `Subcategoria ${post.subcategory}`,
              parentId: categoryId
            });
          }
        }
      });
      
      return Array.from(subcatMap.values());
    }
    
    return [];
  } catch (error) {
    console.error('❌ Erro ao extrair subcategorias:', error);
    return [];
  }
}

// Função para buscar todos os posts de uma categoria
export function getAllCategoryPosts(categoryId: number) {
  try {
    // Verificar se precisa atualizar
    if (isDatabaseStale()) {
      console.log('Banco de dados desatualizado, atualizando em segundo plano...')
      updateDatabase().catch(err => console.error('Erro na atualização automática:', err))
    }
    
    // Ler banco de dados
    const db = initializeDatabase()
    
    // Verificar se a categoria existe
    if (!db.categories[categoryId]) {
      console.log(`Categoria ${categoryId} não encontrada no banco de dados`)
      return {
        posts: [],
        category: null,
        totalPosts: 0
      }
    }
    
    return {
      posts: db.categories[categoryId].posts,
      category: db.categories[categoryId].info,
      totalPosts: db.categories[categoryId].posts.length
    }
  } catch (error) {
    console.error('Erro ao buscar todos os posts do banco de dados local:', error)
    return {
      posts: [],
      category: null,
      totalPosts: 0
    }
  }
}

// Manter as funções originais para compatibilidade
export async function getCarouselPosts() {
  // Implementação existente
  const cacheKey = 'carousel-posts'
  const cachePath = getCachePath(cacheKey)
  
  if (isCacheValid(cachePath)) {
    const cacheData = fs.readFileSync(cachePath, 'utf8')
    return JSON.parse(cacheData)
  }
  
  try {
    const posts = await fetchPosts()
    fs.writeFileSync(cachePath, JSON.stringify(posts))
    return posts
  } catch (error) {
    console.error('Error fetching carousel posts:', error)
    
    if (fs.existsSync(cachePath)) {
      const cacheData = fs.readFileSync(cachePath, 'utf8')
      return JSON.parse(cacheData)
    }
    
    return []
  }
}

// Substitua a função getAllAvailableCategories por esta versão mais robusta
function getAllAvailableCategories(db) {
  try {
    const categoriesArray = [];
    
    if (!db || !db.categories) {
      return [];
    }
    
    // Para cada categoria no banco de dados
    for (const catId in db.categories) {
      if (db.categories[catId] && db.categories[catId].info) {
        const category = db.categories[catId].info;
        
        const cleanCategory = {
          id: category.id || catId,
          name: category.name || `Categoria ${catId}`,
          slug: category.slug,
          count: category.count || 0,
          parent: category.parent
        };
        
        categoriesArray.push(cleanCategory);
      } else {
        categoriesArray.push({
          id: catId,
          name: `Categoria ${catId}`,
          count: 0
        });
      }
    }
    
    // Se não há categorias, adicionar exemplos
    if (categoriesArray.length === 0) {
      categoriesArray.push(
        { id: "1", name: "Categoria Exemplo 1", count: 5 },
        { id: "2", name: "Categoria Exemplo 2", count: 3 },
        { id: "3", name: "Categoria Exemplo 3", count: 7 }
      );
    }
    
    return categoriesArray;
  } catch (error) {
    console.error('❌ Erro ao extrair todas as categorias:', error);
    return [
      { id: "error1", name: "Erro ao carregar categorias", count: 0 }
    ];
  }
}

// Add this function to fetch all available category IDs
async function fetchAllCategoryIds() {
  try {
    console.log('📊 Buscando todas as categorias disponíveis...');
    // WordPress REST API endpoint for categories
    const response = await axios.get("https://lcj-educa.com/?rest_route=/wp/v2/categories", {
      params: {
        per_page: 100, // Maximum allowed by WordPress API
        _fields: 'id,name,parent,slug,count' // Get only what we need
      }
    });
    
    if (!response.data || !Array.isArray(response.data)) {
      console.error('❌ Resposta inválida ao buscar categorias:', response.data);
      return [21, 22]; // Default fallback
    }
    
    const categories = response.data;
    console.log(`✅ Encontradas ${categories.length} categorias (incluindo subcategorias)`);
    
    // Extract IDs from response
    return categories.map(category => category.id);
  } catch (error) {
    console.error('❌ Erro ao buscar IDs de categorias:', error);
    // Return default categories as fallback
    return [21, 22, 27, 28, 31, 32];
  }
}

// Add this function near getCategoryPosts
async function fetchCategoryOnDemand(categoryId: number) {
  console.log(`Categoria ${categoryId} não encontrada no cache, buscando sob demanda...`);
  try {
    const response = await fetchCategoryPosts(categoryId, {
      page: 1,
      search: "",
      type: "all",
      sortBy: "recent"
    });
    
    // Add to database
    const db = initializeDatabase();
    db.categories[categoryId] = {
      info: response.category,
      posts: response.posts
    };
    
    // Save to database
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(db));
    
    return db.categories[categoryId];
  } catch (error) {
    console.error(`Erro ao buscar categoria ${categoryId} sob demanda:`, error);
    return null;
  }
}

// Add this function after updateDatabase()

// Function to ensure the database directory exists
function ensureDatabaseDirectory() {
  if (!fs.existsSync(DATABASE_DIR)) {
    console.log(`📂 Criando diretório ${DATABASE_DIR}...`);
    try {
      fs.mkdirSync(DATABASE_DIR, { recursive: true });
      console.log(`✅ Diretório ${DATABASE_DIR} criado com sucesso`);
    } catch (error) {
      console.error(`❌ Erro ao criar diretório ${DATABASE_DIR}:`, error);
      throw error;
    }
  }
}

// Enhanced database existence check with detailed logging
export async function ensureDatabaseExists(): Promise<boolean> {
  try {
    console.log(`🔍 Verificando banco de dados em ${DATABASE_FILE}...`);
    
    // Make sure the directory exists
    ensureDatabaseDirectory();
    
    // Check if database file exists
    const databaseExists = fs.existsSync(DATABASE_FILE);
    
    if (!databaseExists) {
      console.log('⚠️ Banco de dados não encontrado. Criando novo...');
      
      // Initialize empty database structure
      const initialData = {
        lastUpdated: 0,
        categories: {}
      };
      
      // Write initial structure to file
      fs.writeFileSync(DATABASE_FILE, JSON.stringify(initialData, null, 2));
      console.log(`✅ Estrutura inicial do banco de dados criada em ${DATABASE_FILE}`);
      
      // Now update the database with API data
      console.log('🔄 Inicializando banco de dados com dados da API...');
      return await updateDatabase();
    }
    
    // If database exists, check if content is valid
    try {
      const fileContent = fs.readFileSync(DATABASE_FILE, 'utf8');
      JSON.parse(fileContent); // Test if it's valid JSON
      console.log('✓ Conteúdo do banco de dados validado com sucesso');
    } catch (jsonError) {
      console.error('⚠️ Banco de dados existente contém JSON inválido, recriando...');
      
      // Initialize empty database structure
      const initialData = {
        lastUpdated: 0,
        categories: {}
      };
      
      // Write initial structure to file
      fs.writeFileSync(DATABASE_FILE, JSON.stringify(initialData, null, 2));
      console.log(`✅ Banco de dados recriado com estrutura inicial`);
      
      // Now update the database with API data
      return await updateDatabase();
    }
    
    // If database exists and is valid, check if it's stale
    if (isDatabaseStale()) {
      console.log('⏱️ Banco de dados desatualizado. Atualizando...');
      try {
        const updated = await updateDatabase();
        if (!updated) {
          console.log('⚠️ Falha na atualização automática, mas o banco de dados existe');
          return true; // Return true anyway since the database exists
        }
        return true;
      } catch (updateError) {
        console.error('⚠️ Erro na atualização automática:', updateError);
        return true; // Return true anyway since the database exists
      }
    }
    
    console.log('✅ Banco de dados existe e está atualizado.');
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar/criar banco de dados:', error);
    return false;
  }
}

// Enhanced version of getAllPosts to properly extract data regardless of structure
export function getAllPosts() {
  try {
    console.log('🔍 Getting all posts from database...');
    const db = initializeDatabase();
    
    // Log database structure to help debug
    console.log(`📊 Database structure keys: ${Object.keys(db).join(', ')}`);
    
    // Extract all posts from all categories
    let allPosts = [];
    
    // Method 1: Check if we have allPosts array at the root level
    if (db.allPosts && Array.isArray(db.allPosts) && db.allPosts.length > 0) {
      console.log(`Found ${db.allPosts.length} posts in db.allPosts array`);
      allPosts = db.allPosts;
    }
    // Method 2: If you have categories structure
    else if (db.categories && Object.keys(db.categories).length > 0) {
      console.log(`Found ${Object.keys(db.categories).length} categories to extract posts from`);
      
      Object.keys(db.categories).forEach(categoryId => {
        const categoryPosts = db.categories[categoryId]?.posts || [];
        console.log(`Category ${categoryId} has ${categoryPosts.length} posts`);
        allPosts = [...allPosts, ...categoryPosts];
      });
    }
    // Method 3: Try posts at the root level
    else if (db.posts && Array.isArray(db.posts)) {
      console.log(`Found ${db.posts.length} posts in db.posts array`);
      allPosts = db.posts;
    }
    
    if (allPosts.length === 0) {
      console.log('⚠️ No posts found in any expected location in the database');
      // Dump a sample of the database structure to help debugging
      console.log('Database sample:', JSON.stringify(db).substring(0, 500) + '...');
    } else {
      console.log(`✅ Found ${allPosts.length} total posts across all categories`);
    }
    
    // Process each post to ensure it has necessary fields
    const processedPosts = allPosts.map(post => {
      // Skip if post is null or undefined
      if (!post) return null;
      
      // Ensure excerpt is extracted properly
      let plainExcerpt = '';
      if (post.plainExcerpt) {
        plainExcerpt = post.plainExcerpt;
      } else if (post.excerpt) {
        if (typeof post.excerpt === 'object' && post.excerpt.rendered) {
          plainExcerpt = post.excerpt.rendered
            .replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/&hellip;/g, "...")
            .trim();
        } else if (typeof post.excerpt === 'string') {
          plainExcerpt = post.excerpt
            .replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/&hellip;/g, "...")
            .trim();
        }
      } else if (post.content) {
        if (typeof post.content === 'object' && post.content.rendered) {
          plainExcerpt = post.content.rendered
            .replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/&hellip;/g, "...")
            .trim()
            .substring(0, 150) + '...';
        } else if (typeof post.content === 'string') {
          plainExcerpt = post.content
            .replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/&hellip;/g, "...")
            .trim()
            .substring(0, 150) + '...';
        }
      }
      
      // Ensure date is formatted properly
      let formattedDate = null;
      if (post.formattedDate) {
        formattedDate = post.formattedDate;
      } else if (post.date) {
        try {
          formattedDate = new Date(post.date).toLocaleDateString('pt-BR', {
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
          });
        } catch (e) {
          console.error(`Error formatting date for post ${post.id}:`, e);
        }
      } else if (post.created_at) {
        try {
          formattedDate = new Date(post.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
          });
        } catch (e) {
          console.error(`Error formatting date for post ${post.id}:`, e);
        }
      }
      
      return {
        ...post,
        plainExcerpt,
        formattedDate
      };
    })
    .filter(post => post !== null); // Remove null posts
    
    return { posts: processedPosts };
  } catch (error) {
    console.error('❌ Error getting all posts:', error);
    return { posts: [] };
  }
}

// Add a helper function to extract plain text if not already present
function extractPlainText(content) {
  if (!content) return '';
  
  // If it's an object with a rendered property (WordPress format)
  if (typeof content === 'object' && content.rendered) {
    return content.rendered
      .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
      .replace(/&hellip;/g, "...") // Replace HTML entities
      .trim();
  }
  
  // If it's already a string
  if (typeof content === 'string') {
    return content
      .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
      .replace(/&hellip;/g, "...") // Replace HTML entities
      .trim();
  }
  
  return '';
}

// Add this function to build a hierarchical structure of categories
export function getCategoryHierarchy(db) {
  try {
    // Get all categories as flat array
    const allCategories = getAllAvailableCategories(db);
    
    // Create a map for quick category lookup by ID
    const categoryMap = {};
    allCategories.forEach(category => {
      // Make sure we have consistent ID types (string)
      const id = String(category.id);
      categoryMap[id] = {
        ...category,
        children: [] // Will hold subcategories
      };
    });
    
    // Build the hierarchy
    const rootCategories = [];
    
    // For each category, add it to its parent's children array
    allCategories.forEach(category => {
      const id = String(category.id);
      const parent = category.parent ? String(category.parent) : null;
      
      if (parent && categoryMap[parent]) {
        // Add as child to parent
        categoryMap[parent].children.push(categoryMap[id]);
      } else {
        // This is a root category
        rootCategories.push(categoryMap[id]);
      }
    });
    
    return {
      hierarchy: rootCategories,
      flatMap: categoryMap
    };
  } catch (error) {
    console.error('❌ Erro ao criar hierarquia de categorias:', error);
    return {
      hierarchy: [],
      flatMap: {}
    };
  }
}

// Function to get subcategories of a specific category
export function getSubcategories(categoryId) {
  try {
    const db = initializeDatabase();
    const { flatMap } = getCategoryHierarchy(db);
    
    // Get the category with the given ID
    const categoryKey = String(categoryId);
    const category = flatMap[categoryKey];
    
    if (!category) return [];
    
    // Return its children
    return category.children || [];
  } catch (error) {
    console.error(`❌ Erro ao buscar subcategorias para categoria ${categoryId}:`, error);
    return [];
  }
}

// At the bottom of the file, keep only this one:
console.log('🚀 Inicializando serviço de dados...');
ensureDatabaseExists().catch(error => {
  console.error('❌ Falha na inicialização do banco de dados:', error);
});

// Variáveis de controle para atualização
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutos em milissegundos
let isUpdateInProgress = false;
let lastUpdateAttempt = 0;

// Função para verificar se os posts mudaram
function havePostsChanged(existingPosts, newPosts) {
  if (!existingPosts || !Array.isArray(existingPosts) || !newPosts || !Array.isArray(newPosts)) {
    return true;
  }
  
  // Verificação rápida: número diferente de posts
  if (existingPosts.length !== newPosts.length) {
    console.log(`📊 Alteração detectada: ${existingPosts.length} posts antigos vs ${newPosts.length} novos`);
    return true;
  }
  
  // Criar um mapa dos posts existentes por ID para busca rápida
  const existingPostsMap = new Map();
  existingPosts.forEach(post => {
    if (post && post.id) {
      existingPostsMap.set(post.id, post);
    }
  });
  
  // Verificar se algum post novo difere dos existentes
  for (const newPost of newPosts) {
    if (!newPost || !newPost.id) continue;
    
    const existingPost = existingPostsMap.get(newPost.id);
    
    // Post não existe ou data de modificação diferente
    if (!existingPost) {
      console.log(`📝 Post novo detectado: ID ${newPost.id}`);
      return true;
    }
    
    // Verificar data de modificação (que pode estar em vários campos)
    const newModified = newPost.modified || newPost.modified_gmt || newPost.date_modified || '';
    const oldModified = existingPost.modified || existingPost.modified_gmt || existingPost.date_modified || '';
    
    if (newModified !== oldModified) {
      console.log(`🔄 Post modificado detectado: ID ${newPost.id}`);
      return true;
    }
  }
  
  return false;
}

// Função para buscar todos os posts da API WordPress
async function fetchAllPostsFromAPI() {
  let totalPosts = 0;
  let totalPages = 1;
  let currentPage = 1;
  const perPage = 100; // Máximo permitido pela API WordPress
  
  const allPosts = [];
  let keepFetching = true;
  
  console.log('📥 Buscando posts da API WordPress...');
  
  while (keepFetching) {
    try {
      console.log(`📄 Buscando página ${currentPage}...`);
      const response = await axios.get('https://lcj-educa.com/?rest_route=/wp/v2/posts', {
        params: {
          per_page: perPage,
          page: currentPage,
          _embed: 1, // Include embedded data like featured media, categories, etc.
          // Request specific fields to make response smaller
          _fields: 'id,date,modified,title,excerpt,content,slug,featured_media,categories,_embedded'
        }
      });
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Process each post to ensure consistent data format
        const processedPosts = response.data.map(post => {
          const processedPost = {
            ...post,
            // Ensure we have formatted dates
            formattedDate: post.date ? new Date(post.date).toLocaleDateString() : null,
            formattedModified: post.modified ? new Date(post.modified).toLocaleDateString() : null,
            
            // Extract plain text excerpt
            plainExcerpt: post.excerpt?.rendered ? 
              post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").trim() : 
              (typeof post.excerpt === 'string' ? post.excerpt : ''),
              
            // Get featured image URL if available
            featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
            
            // Get category names if available
            categoryNames: post._embedded?.['wp:term']?.[0]?.map(cat => cat.name) || []
          };
          
          return processedPost;
        });
        
        allPosts.push(...processedPosts);
        totalPosts += response.data.length;
        
        // Verificar se há mais páginas
        if (response.headers && response.headers['x-wp-totalpages']) {
          totalPages = parseInt(response.headers['x-wp-totalpages']);
        } else {
          // Se não tiver o cabeçalho, mas recebemos posts completos, assumimos que há mais
          if (response.data.length === perPage) {
            totalPages = currentPage + 1;
          } else {
            totalPages = currentPage;
          }
        }
        
        if (currentPage >= totalPages) {
          keepFetching = false;
        } else {
          currentPage++;
        }
      } else {
        keepFetching = false;
      }
    } catch (error) {
      console.error(`❌ Erro ao buscar página ${currentPage}:`, error.message);
      keepFetching = false;
    }
  }
  
  console.log(`✅ Buscados ${totalPosts} posts no total de ${currentPage} páginas`);
  return allPosts;
}

// Atualizar o banco de dados somente se houver mudanças
export async function updateDatabaseIfChanged(): Promise<boolean> {
  // Evitar atualizações simultâneas
  if (isUpdateInProgress) {
    console.log('⏳ Atualização já em andamento, pulando...');
    return false;
  }
  
  try {
    isUpdateInProgress = true;
    lastUpdateAttempt = Date.now();
    
    console.log('🔍 Verificando se há alterações no conteúdo...');
    
    // Verificar se o banco de dados existe
    const db = initializeDatabase();
    
    // Garantir que o diretório existe
    ensureDatabaseDirectory();
    
    // Buscar posts novos da API
    const newPosts = await fetchAllPostsFromAPI();
    
    // Comparar com os posts existentes
    const existingPosts = db.allPosts || [];
    
    if (havePostsChanged(existingPosts, newPosts)) {
      console.log('🔄 Alterações detectadas, atualizando banco de dados...');
      
      // Atualizar todos os posts
      db.allPosts = newPosts;
      
      // Organizar posts por categoria
      console.log('📊 Organizando posts por categoria...');
      
      // Buscar todas as categorias primeiro
      let categories;
      try {
        const categoryResponse = await axios.get('https://lcj-educa.com/?rest_route=/wp/v2/categories', {
          params: { per_page: 100 }
        });
        categories = categoryResponse.data;
        
        // Inicializar estrutura de categorias
        if (!db.categories) db.categories = {};
        
        // Atualizar informações das categorias
        categories.forEach(category => {
          const categoryId = category.id;
          
          if (!db.categories[categoryId]) {
            db.categories[categoryId] = {
              info: {
                id: categoryId,
                name: category.name || `Categoria ${categoryId}`,
                description: category.description || "",
                slug: category.slug || ""
              },
              posts: []
            };
          } else {
            // Atualizar informações, manter posts
            db.categories[categoryId].info = {
              id: categoryId,
              name: category.name || `Categoria ${categoryId}`,
              description: category.description || "",
              slug: category.slug || ""
            };
          }
        });
      } catch (categoryError) {
        console.error('❌ Erro ao buscar categorias:', categoryError);
        // Continue mesmo se não conseguir buscar categorias
      }
      
      // Limpar posts existentes em categorias
      for (const categoryId in db.categories) {
        if (db.categories[categoryId].posts) {
          db.categories[categoryId].posts = [];
        }
      }
      
      // Organizar posts por categoria
      newPosts.forEach(post => {
        if (post.categories && Array.isArray(post.categories)) {
          post.categories.forEach(categoryId => {
            if (db.categories[categoryId]) {
              if (!db.categories[categoryId].posts) {
                db.categories[categoryId].posts = [];
              }
              db.categories[categoryId].posts.push(post);
            }
          });
        }
      });
      
      // Atualizar timestamp
      db.lastUpdated = Date.now();
      
      // Salvar no arquivo
      const tempFilePath = `${DATABASE_FILE}.temp`;
      fs.writeFileSync(tempFilePath, JSON.stringify(db, null, 2));
      fs.renameSync(tempFilePath, DATABASE_FILE);
      
      console.log(`✅ Banco de dados atualizado com ${newPosts.length} posts.`);
      return true;
    } else {
      console.log('✓ Nenhuma alteração detectada, banco de dados atualizado.');
      
      // Atualizar apenas o timestamp para não verificar novamente tão cedo
      db.lastUpdated = Date.now();
      fs.writeFileSync(DATABASE_FILE, JSON.stringify(db, null, 2));
      
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar banco de dados:', error);
    return false;
  } finally {
    isUpdateInProgress = false;
  }
}

// Função para verificar e atualizar o banco de dados quando necessário
export async function checkAndUpdateDatabase(): Promise<void> {
  // Verificar se passaram 5 minutos desde a última tentativa
  const now = Date.now();
  const timeSinceLastAttempt = now - lastUpdateAttempt;
  
  if (timeSinceLastAttempt >= UPDATE_INTERVAL) {
    console.log('⏰ Verificando atualizações após 5 minutos...');
    updateDatabaseIfChanged().catch(error => {
      console.error('❌ Erro durante verificação de atualização:', error);
    });
  }
}

// Also, add this function to check your database structure
export async function checkDatabaseStructure() {
  try {
    const db = initializeDatabase();
    
    // Count posts in various locations
    let allPostsCount = db.allPosts && Array.isArray(db.allPosts) ? db.allPosts.length : 0;
    let rootPostsCount = db.posts && Array.isArray(db.posts) ? db.posts.length : 0;
    let categoriesCount = db.categories ? Object.keys(db.categories).length : 0;
    
    // Count posts in categories
    let categoriesPostCount = 0;
    if (db.categories) {
      Object.keys(db.categories).forEach(catId => {
        const catPosts = db.categories[catId]?.posts || [];
        categoriesPostCount += catPosts.length;
      });
    }
    
    // Gather full database statistics
    const stats = {
      databaseExists: fs.existsSync(DATABASE_FILE),
      databaseSize: fs.existsSync(DATABASE_FILE) ? Math.round(fs.statSync(DATABASE_FILE).size / 1024) + ' KB' : 'N/A',
      lastUpdated: db.lastUpdated ? new Date(db.lastUpdated).toLocaleString() : 'Never',
      postCounts: {
        allPostsArray: allPostsCount,
        rootPostsArray: rootPostsCount,
        categoriesTotal: categoriesCount,
        postsInCategories: categoriesPostCount,
        totalAccessible: allPostsCount + rootPostsCount + categoriesPostCount
      },
      structureKeys: Object.keys(db)
    };
    
    return stats;
  } catch (error) {
    return {
      error: error.message,
      stack: error.stack
    };
  }
}