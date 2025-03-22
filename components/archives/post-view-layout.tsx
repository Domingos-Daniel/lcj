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
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/armember/v1/arm_member_memberships&arm_api_key=${apiKey}&arm_user_id=${user.id}`
          );
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

  const [viewCount, setViewCount] = useState(post.views || 0);

  useEffect(() => {
    async function incrementViews() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/lcj/v1/increment-views`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ post_id: post.id }),
          }
        );
  
        const data = await response.json();
        //console.log("✅ Views atualizadas:", data);
        
        // Update the view count in UI if the API returns the new count
        if (data.views) {
          setViewCount(data.views);
        } else {
          // If the API doesn't return the new count, increment locally
          setViewCount(prev => prev + 1);
        }
      } catch (error) {
        console.error("❌ Erro ao incrementar views:", error);
      }
    }
  
    if (post.id) {
      incrementViews();
    }
  }, [post.id]);
  

  // Access is granted only if the user is logged in and the membership matches:
  // arm_plan_id === "4" or membership name === "Plano Mensal"
  const hasAccess = Boolean(
    user &&
    membership &&
    (membership.arm_plan_id === process.env.NEXT_ARMEMBER_PLAN_ID || membership.name === "Plano Mensal")
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
  
  // Enhanced useEffect for content protection
  useEffect(() => {
    // Helper function to check if an element is part of the search modal or input
    const isSearchElement = (element: Node | null): boolean => {
      if (!element) return false;
      
      // Check if element is an Element node type (not a text node or comment)
      if (element.nodeType !== Node.ELEMENT_NODE) return false;
      
      // Now we can safely cast to HTMLElement and use its properties
      const htmlElement = element as HTMLElement;
      
      // Allow search modal and inputs
      const isSearchInput = 
        htmlElement.tagName === 'INPUT' || 
        htmlElement.classList?.contains('search-modal') ||
        !!htmlElement.closest('[role="dialog"]') ||
        !!htmlElement.closest('.search-modal');
      
      return isSearchInput;
    };

    const handleContextMenu = (e: Event) => {
      // Allow context menu inside content area for highlights or search elements
      if ((contentRef.current?.contains(e.target as Node) && hasAccess) || 
          isSearchElement(e.target as Node)) {
        return;
      }
      e.preventDefault();
    };
  
    const handleCopy = (e: ClipboardEvent) => {
      // Allow copy inside content area for highlights or search elements
      if ((contentRef.current?.contains(e.target as Node) && hasAccess) || 
          isSearchElement(e.target as Node)) {
        return;
      }
      e.preventDefault();
    };
  
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip protection for search-related elements
      if (isSearchElement(e.target as Node)) {
        return;
      }
      
      // Always prevent developer tools shortcuts
      if (e.keyCode === 123) { // F12
        e.preventDefault();
      }
      if (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.ctrlKey && e.key === "U") {
        e.preventDefault();
      }
      
      // Prevent print screen
      if (e.keyCode === 44) {
        e.preventDefault();
        toast({
          title: "Captura de tela não permitida",
          description: "Este conteúdo é protegido contra capturas de tela",
          variant: "destructive",
        });
      }
      
      // Prevent printing shortcuts
      if ((e.ctrlKey && e.key === "p") || (e.metaKey && e.key === "p")) {
        e.preventDefault();
        toast({
          title: "Impressão não permitida",
          description: "Este conteúdo não pode ser impresso",
          variant: "destructive",
        });
      }
      
      // Prevent additional copy shortcuts
      if ((e.ctrlKey && e.key === "c") || (e.metaKey && e.key === "c")) {
        if (!contentRef.current?.contains(e.target as Node) || !hasAccess) {
          e.preventDefault();
        }
      }
    };
    
    // Prevent selection of text
    const handleSelection = (e: Event) => {
      // Skip protection for search-related elements
      if (isSearchElement(e.target as Node)) {
        return;
      }
      
      if (!hasAccess || !contentRef.current?.contains(e.target as Node)) {
        window.getSelection()?.removeAllRanges();
      }
    };
    
    // Prevent printing
    const handleBeforePrint = () => {
      if (!hasAccess) {
        document.body.innerHTML = "Impressão não autorizada";
      }
    };
    
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);
    document.addEventListener("paste", handleCopy);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("selectionchange", handleSelection);
    window.addEventListener("beforeprint", handleBeforePrint);
  
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
      document.removeEventListener("paste", handleCopy);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("selectionchange", handleSelection);
      window.removeEventListener("beforeprint", handleBeforePrint);
    };
  }, [hasAccess, contentRef]);
  
  // Add dynamic watermark to the content when user has access but needs anti-screenshot measures
  const addDynamicWatermark = () => {
    if (!hasAccess || !user) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none select-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-black/5 dark:text-white/5 text-lg font-bold whitespace-nowrap transform -rotate-45"
            style={{
              top: `${10 + (i * 20)}%`,
              left: `-5%`,
              right: 0,
            }}
          >
            {user.email} • {new Date().toLocaleDateString()} • {user.id}
          </div>
        ))}
      </div>
    );
  };
  
  // Add style tag to disable selection and printing at CSS level
  useEffect(() => {
    if (!hasAccess) {
      // Add CSS to disable user selection when no access
      const style = document.createElement('style');
      style.id = 'anti-copy-style';
      style.innerHTML = `
        body {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-print-color-adjust: exact;
        }
        @media print {
          body * { 
            display: none !important; 
          }
          body:after {
            content: "Impressão não autorizada";
            display: block !important;
            font-size: 48px;
            text-align: center;
            margin: 100px auto;
          }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        const styleElement = document.getElementById('anti-copy-style');
        if (styleElement) styleElement.remove();
      };
    }
  }, [hasAccess]);
  
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
            { label: post.title, href: "#" },
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
            
            
            
            <Separator className="mt-2" />
          </div>
          
          {/* Conteúdo principal do artigo - destacado e sem distrações */}
          <article
            className={cn(
              "prose prose-lg dark:prose-invert max-w-none py-10 px-4 md:px-20 border-2 rounded-lg relative",
              !hasAccess && "filter blur-sm pointer-events-none"
            )}
            ref={contentRef}
          >
            {addDynamicWatermark()}
            <div 
              className="formatted-content"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
            
            <Separator className="mt-2" />
            
            
            {/* Seção somente impressão */}
            <div className="hidden print:block mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Este documento foi impresso de {typeof window !== 'undefined' ? window.location.origin : ''} em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}.
                <br />
                Documento protegido. Uso autorizado apenas para {user?.email || "usuários autorizados"}.
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl max-w-md mx-auto text-center">
            <h2 className="text-2xl font-semibold dark:text-white mb-4">
              Acesso Restrito
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Você precisa estar logado e possuir o plano activo para acessar este conteúdo.
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