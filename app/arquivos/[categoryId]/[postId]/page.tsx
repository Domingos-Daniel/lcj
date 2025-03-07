import { Metadata } from "next"
import { notFound } from "next/navigation"
import { PostViewLayout } from "@/components/archives/post-view-layout"
import { getPostById } from "@/lib/data-service"
import { PostViewTutorial } from "@/components/tutorials/post-view-tutorial"

interface PostPageProps {
  params: {
    categoryId: string
    postId: string
  }
}

// Gerar metadata dinâmicos baseados no post
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostById(params.postId)
  
  if (!post) {
    return {
      title: "Post não encontrado",
      description: "O conteúdo jurídico que você procura não foi encontrado"
    }
  }
  
  return {
    title: `Lendo: ${post.title}`,
    description: post.excerpt || "Conteúdo jurídico detalhado da Linguagem Claríssima Jurídica",
  }
}

export default async function PostPage({ params }: PostPageProps) {
  // Buscar o post usando o ID
  const post = await getPostById(params.postId)
  
  // Se não encontrar o post, mostrar 404
  if (!post) {
    notFound()
  }
  
  return (
    <>
      <PostViewLayout post={post} categoryId={params.categoryId} />
      <PostViewTutorial />
    </>
  )
}