"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import "./post-view.css"
import { 
  ChevronLeft, ChevronRight, Clock, Calendar, User, Share2, Bookmark, 
  Eye, ThumbsUp, Facebook, Twitter, 
  Linkedin, Mail, PanelRightClose, PanelRightOpen,
  Maximize, Minimize
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
import { useAuth } from "@/context/auth-context"  // << Import useAuth

interface PostViewLayoutProps {
  post: any
  categoryId: string
  categorySlug?: string
}

export function PostViewLayout({ post, categoryId, categorySlug = categoryId }: PostViewLayoutProps) {
  const { user } = useAuth()

  // Fetch membership data from the API when a user is present
  const [membership, setMembership] = useState<any>(null)
  useEffect(() => {
    async function fetchMembership() {
      if (user) {
        try {
          // Replace with your actual API key and endpoint as needed
          const apiKey = process.env.NEXT_PUBLIC_ARMEMBER_KEY;
          const response = await fetch(`https://lcj-educa.com/?rest_route=/armember/v1/arm_member_memberships&arm_api_key=${apiKey}&arm_user_id=${user.id}`);
          const data = await response.json();
          if (data.status === 1 && data.response?.result?.memberships?.length > 0) {
            const membershipData = data.response.result.memberships[0];
            setMembership(membershipData);
          } else {
            setMembership(null);
          }
        } catch (error) {
          console.error("Erro ao buscar associação:", error);
          setMembership(null);
        }
      }
    }
    fetchMembership();
  }, [user]);

  // Access is granted only if the user is logged in and the membership matches:
  // arm_plan_id === "4" or membership name === "Plano Mensal"
  const hasAccess = Boolean(
    user &&
    membership &&
    (membership.arm_plan_id === "4" || membership.name === "Plano Mensal")
  )

  // ... existing state and effects for bookmark, like, sidebar, etc.
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(post.likes || 0)
  const [hasLiked, setHasLiked] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Verificar se o post foi salvo anteriormente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
      setIsBookmarked(savedPosts.includes(post.id));
    }
  }, [post.id]);
  
  // Barra de progresso
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const element = contentRef.current;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const contentHeight = element.scrollHeight;
      const documentHeight = element.offsetHeight;
      
      const maxScroll = contentHeight - windowHeight;
      const progress = Math.min(1, scrollY / maxScroll);
      
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
  
  const toggleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Erro ao entrar em tela cheia:", err);
      });
    }
    setIsFullScreen(!isFullScreen);
  }
  
  return (
    <div className="container max-w-5xl py-6 md:py-8 relative">
      {/* Barra de progresso */}
      <div
        className="fixed top-0 left-0 w-full h-2 bg-primary z-50"
        style={{
          transformOrigin: '0%',
          transform: `scaleX(${scrollProgress})`
        }}
      />
      
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
              
              {/* Botões de controle */}
              <div className="flex items-center gap-2">
                {/* Botão de tela cheia */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleFullScreen}
                >
                  {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  <span className="sr-only">{isFullScreen ? "Sair da tela cheia" : "Tela cheia"}</span>
                </Button>
                
                {/* Botão para toggle do sidebar - apenas visível em desktop */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSidebar}
                  className="hidden lg:flex"
                  aria-label={sidebarOpen ? "Fechar painel lateral" : "Abrir painel lateral"}
                >
                  {sidebarOpen ? (
                    <PanelRightClose className="h-6 w-6" />
                  ) : (
                    <PanelRightOpen className="h-6 w-6" />
                  )}
                </Button>
              </div>
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
          <article
            className={cn(
              "prose prose-lg dark:prose-invert max-w-none py-10 px-4 md:px-20 border-2 rounded-lg",
              !hasAccess && "filter blur-sm pointer-events-none"
            )}
            ref={contentRef}
          >
            <div 
              className="formatted-content"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
            
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
      
      {/* Modal overlay if user has no access */}
      {!hasAccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md mx-auto text-center">
            <h2 className="text-xl font-bold mb-4">Acesso Restrito</h2>
            <p className="mb-4">
              Você precisa estar logado e possuir o plano "Plano Mensal" ativo ou o plano com arm_plan_id 4 para acessar este conteúdo.
            </p>
            <Button onClick={() => window.location.href="/profile"} className="w-full">
              Ir para Assinatura
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}