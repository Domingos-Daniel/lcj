"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { 
  ChevronLeft, ChevronRight, Clock, Calendar, User, Share2, Bookmark, 
  Eye, MessageSquare, ThumbsUp, Facebook, Twitter, 
  Linkedin, Mail, PanelRightClose, PanelRightOpen
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import { cn } from "@/lib/utils"
import { Breadcrumbs } from "@/components/breadcrumbs"

interface PostViewLayoutProps {
  post: any
  categoryId: string
  categorySlug?: string
}

export function PostViewLayout({ post, categoryId, categorySlug = categoryId }: PostViewLayoutProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(post.likes || 0)
  const [hasLiked, setHasLiked] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Verificar se o post foi salvo anteriormente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
      setIsBookmarked(savedPosts.includes(post.id));
    }
  }, [post.id]);
  
  const handleBookmark = () => {
    if (typeof window !== 'undefined') {
      const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
      
      if (isBookmarked) {
        const updatedPosts = savedPosts.filter((id: string) => id !== post.id);
        localStorage.setItem('savedPosts', JSON.stringify(updatedPosts));
      } else {
        savedPosts.push(post.id);
        localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
      }
      
      setIsBookmarked(!isBookmarked);
      toast({
        title: isBookmarked ? "Artigo removido dos favoritos" : "Artigo salvo nos favoritos",
        duration: 2000
      });
    }
  }
  
  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1)
      setHasLiked(true)
      
      // Salvar o like no localStorage
      if (typeof window !== 'undefined') {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        if (!likedPosts.includes(post.id)) {
          likedPosts.push(post.id);
          localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        }
      }
      
      toast({ title: "Obrigado pela sua avaliação!", duration: 2000 })
    }
  }
  
  const handleShare = (platform: string) => {
    if (typeof window === 'undefined') return;
    
    const url = window.location.href
    let shareUrl = ""
    
    switch(platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Confira este artigo: ${url}`)}`
        break
      case "copy":
        navigator.clipboard.writeText(url)
        toast({ title: "Link copiado para a área de transferência", duration: 2000 })
        return
    }
    
    if (shareUrl) window.open(shareUrl, "_blank")
  }
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  
  return (
    <div className="container max-w-5xl py-6 md:py-8">
      {/* Navegação */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <Breadcrumbs 
          items={[
            { label: "Início", href: "/" },
            { label: "Arquivos", href: "/arquivos" },
            { label: post.category?.name || "Categoria", href: `/arquivos/${categorySlug}` },
            { label: post.title, href: "#", current: true }
          ]}
        />
        
        <Button 
          variant="outline" 
          size="sm" 
          asChild 
          className="group"
        >
          <Link href={`/arquivos/${categorySlug}`}>
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Voltar para lista
          </Link>
        </Button>
      </div>
      
      {/* Layout principal com sidebar colapsível */}
      <div className="flex flex-col lg:flex-row gap-6 relative">
        {/* Conteúdo principal - usar mais espaço por padrão */}
        <div className={cn(
          "w-full transition-all duration-300",
          sidebarOpen ? "lg:w-[68%]" : "mx-auto max-w-4xl w-full"
        )}>
          {/* Cabeçalho do post - simplificado e focado */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                {post.title}
              </h1>
              
              {/* Botão para toggle do sidebar - apenas visível em desktop */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="hidden lg:flex"
                aria-label={sidebarOpen ? "Fechar painel lateral" : "Abrir painel lateral"}
              >
                {sidebarOpen ? (
                  <PanelRightClose className="h-4 w-4" />
                ) : (
                  <PanelRightOpen className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Informações básicas e essenciais */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.createdAt}>
                  {post.createdAt && format(new Date(post.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime || "5 min de leitura"}</span>
              </div>
              {post.author && (
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{post.views || 0} visualizações</span>
              </div>
            </div>
            
            
            <Separator className="mt-2" />
          </div>
          
          {/* Conteúdo principal do artigo - destacado e sem distrações */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {/* Seção somente impressão */}
            <div className="hidden print:block mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Este documento foi impresso de {typeof window !== 'undefined' ? window.location.origin : ''} em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}.
              </p>
            </div>
          </article>
          
          {/* Feedback e interações - simplificado */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLike}
                className={cn("flex gap-2", hasLiked && "bg-primary/10 border-primary/20")}
              >
                <ThumbsUp className={cn("h-4 w-4", hasLiked && "fill-primary text-primary")} />
                <span>{likes}</span>
              </Button>
              
              {/* Ações principais sempre visíveis */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBookmark}
              >
                <Bookmark className={cn("h-4 w-4 mr-2", isBookmarked && "fill-primary text-primary")} />
                {isBookmarked ? "Salvo" : "Salvar"}
              </Button>
            </div>
            
            {/* Compartilhar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleShare("facebook")}>
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("twitter")}>
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("email")}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("copy")}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Copiar link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Seção de comentários - simplificada */}
          <div className="mt-12 pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">Comentários</h3>
            <div className="text-center py-8">
              <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Comentários serão implementados em breve.
              </p>
            </div>
          </div>
        </div>
        
        {/* Sidebar colapsível - minimal e informativo */}
        <div 
          className={cn(
            "space-y-5 print:hidden transition-all duration-300 ease-in-out",
            sidebarOpen ? "lg:w-[32%] opacity-100" : "lg:w-0 overflow-hidden opacity-0 hidden lg:block"
          )}
        >
          {/* Artigos relacionados */}
          {post.relatedPosts?.length > 0 && (
            <Collapsible className="w-full border rounded-lg" defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
                <span>Artigos relacionados</span>
                <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-4 pt-2">
                  {post.relatedPosts?.slice(0, 3).map((related: any) => (
                    <div key={related.id} className="group">
                      <Link 
                        href={`/arquivos/${categorySlug}/${related.slug || related.id}`} 
                        className="block"
                      >
                        <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <div className="text-xs text-muted-foreground mt-1">
                          {related.createdAt && format(new Date(related.createdAt), "dd/MM/yyyy")}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Collapsible className="w-full border rounded-lg" defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
                <span>Tags</span>
                <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="flex flex-wrap gap-2 pt-2">
                  {post.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </div>
  )
}