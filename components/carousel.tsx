"use client"
import { useState, useEffect, memo } from "react";
import { useCarousel } from "@/hooks/use-carousel";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const DEFAULT_IMAGE = "https://lcj-educa.com/wp-content/uploads/2025/02/legislacion-ii.png";

interface Slide {
  title: string;
  description: string;
  image: string;
  url?: string;
  category?: string;
}

// Componente para o carrossel
export function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [slides, setSlides] = useState<Slide[]>([]);
  const { slides: apiSlides, isLoading, error } = useCarousel();

  // Debug: mostrar dados carregados
  useEffect(() => {
    if (error) {
      console.error('⚠️ Erro em useCarousel:', error.message);
    }
    if (apiSlides && apiSlides.length > 0) {
      //console.log('📊 Primeiro slide:', apiSlides[0]);
    }
  }, [apiSlides, isLoading, error]);

  // Formatar slides quando carregados
  useEffect(() => {
    if (apiSlides && Array.isArray(apiSlides) && apiSlides.length > 0) {
      const formattedSlides = apiSlides.map((slide) => ({
        title: slide.title || "Sem título",
        description: slide.description || "Sem descrição",
        image: slide.imageUrl || DEFAULT_IMAGE,
        category: slide.category || "Geral",
        url: slide.url || "#",
      }));
      setSlides(formattedSlides);
    } else if (!isLoading) {
      console.warn('⚠️ Nenhum slide encontrado, usando fallback');
      setSlides([
        {
          title: "Bem-vindo ao LCJ Educa",
          description: "Conteúdo educacional de qualidade",
          image: DEFAULT_IMAGE,
          category: "Destaque",
          url: "#"
        },
        {
          title: "Novidades em Breve",
          description: "Estamos atualizando nossos conteúdos",
          image: DEFAULT_IMAGE,
          category: "Anúncio",
          url: "#"
        }
      ]);
    }
  }, [apiSlides, isLoading]);

  // Auto-avanço
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const timer = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => clearTimeout(timer);
  }, [activeIndex, isPlaying, slides.length]);

  const handlePrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  // Renderizar estado de carregamento
  if (isLoading) {
    return (
      <div className="w-full h-[450px] bg-muted animate-pulse rounded-md relative overflow-hidden mt-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Verificar se temos slides
  if (slides.length === 0) {
    return (
      <div className="w-full h-[450px] bg-muted rounded-md relative overflow-hidden mt-4">
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
          <p className="text-xl font-medium text-muted-foreground">
            Não foi possível carregar o carrossel
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  // Carousel principal
  return (
    <div className="relative mt-0"> {/* Distância do topo ajustada */}
      {/* Carousel principal */}
      <div className="relative w-full h-[450px] rounded-lg overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === activeIndex ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Imagem de fundo com gradiente */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover transition-opacity duration-700 ease-in-out"
              priority={index === activeIndex}
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

            {/* Conteúdo */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-xl text-white">
                  <span className="inline-block mb-2 py-1 px-3 bg-primary text-xs font-medium rounded">
                    {slide.category}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-bold mb-3">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-lg mb-6 opacity-90 line-clamp-2">
                    {slide.description}
                  </p>
                  <Link href={slide.url || "#"}>
                    <Button size="lg" className="font-medium">
                      Ler mais
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Controles */}
        <div className="absolute right-6 bottom-6 flex space-x-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={handlePrevious}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={handleNext}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Miniaturas centralizadas abaixo */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`relative w-16 h-16 cursor-pointer rounded overflow-hidden transition-transform duration-300 hover:scale-110 ${
              index === activeIndex ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="64px"
            />
            {index === activeIndex && (
              <div
                className="absolute bottom-0 left-0 h-1 bg-white rounded-full"
                style={{
                  width: isPlaying ? "100%" : "0%",
                  transition: isPlaying ? "width 6s linear" : "none",
                }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}