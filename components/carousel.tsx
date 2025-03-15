"use client"
import { useState, useEffect, useRef, memo } from "react";
import { useCarousel } from "@/hooks/use-carousel";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_IMAGE = process.env.NEXT_PUBLIC_DEFAULT_IMAGE;

interface Slide {
  title: string;
  description: string;
  image: string;
  url?: string;
  category?: string;
}

const SlideContent = memo(({ slide, isActive }) => (
  <motion.div
    initial="carousel-enter"
    animate={isActive ? "carousel-enter-active" : "carousel-exit"}
    exit="carousel-exit-active"
    variants={{
      carouselEnter: { opacity: 0, y: 20 },
      carouselEnterActive: { opacity: 1, y: 0 },
      carouselExit: { opacity: 1 },
      carouselExitActive: { opacity: 0 },
    }}
    transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
    className={`absolute inset-0 transition-opacity duration-700 ${
      isActive ? "opacity-100" : "opacity-0"
    }`}
  >
    <Image
      src={slide.image}
      alt={slide.title}
      fill
      className="object-cover transition-transform duration-700 ease-in-out"
      priority={isActive}
      sizes="(max-width: 768px) 100vw, 1200px"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
    <div className="absolute inset-0 flex items-center px-4">
      <div className="max-w-xl text-white">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-block mb-2 py-1 px-3 bg-primary text-xs font-medium rounded"
        >
          {slide.category}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-5xl font-bold mb-3"
        >
          {slide.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-base md:text-lg mb-6 opacity-90 line-clamp-2"
        >
          {slide.description}
        </motion.p>
        <Link href={slide.url || "#"}>
          <Button size="lg" className="font-medium">
            Ler mais
          </Button>
        </Link>
      </div>
    </div>
  </motion.div>
));

export function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const [hasMounted, setHasMounted] = useState(false);
  const { slides: apiSlides, isLoading, error } = useCarousel();
  const animationFrame = useRef();

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

  useEffect(() => {
    startTimeRef.current = Date.now();
    setProgress(0);
  }, [activeIndex]);

  useEffect(() => {
    const updateProgress = () => {
      if (!isPlaying || slides.length <= 1) return;

      const elapsedTime = Date.now() - startTimeRef.current;
      const newProgress = (elapsedTime / 6000) * 100;

      if (newProgress >= 100) {
        setActiveIndex((prev) => (prev + 1) % slides.length);
        return;
      }

      setProgress(newProgress);
      animationFrame.current = requestAnimationFrame(updateProgress);
    };

    if (isPlaying) {
      animationFrame.current = requestAnimationFrame(updateProgress);
    }

    return () => cancelAnimationFrame(animationFrame.current);
  }, [isPlaying, activeIndex, slides.length]);

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    setIsPlaying(false);
  };

  return (
    <div className={`relative mt-0 ${hasMounted ? 'animate-fade-in' : ''}`}>
      <div className="relative w-full h-[450px] rounded-lg overflow-hidden">
        <AnimatePresence initial={false} custom={activeIndex}>
          {slides.map((slide, index) => (
            <SlideContent
              key={index}
              slide={slide}
              isActive={index === activeIndex}
            />
          ))}
        </AnimatePresence>

        <div id="carousel-controls" className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-transform duration-300"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 thumbnail-pulse" />
            )}
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setActiveIndex((prev) => (prev + 1) % slides.length)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`relative w-20 h-20 cursor-pointer rounded overflow-hidden transition-transform duration-300 hover:scale-110 ${
              index === activeIndex ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleThumbnailClick(index)}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="80px"
            />
            <div
              className={`absolute bottom-0 left-0 h-1 rounded-full ${
                index === activeIndex ? "progress-gradient" : "bg-white/30"
              }`}
              style={{
                width: index === activeIndex ? `${progress}%` : "100%",
                transition: index === activeIndex ? "width 0.3s linear" : "none",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}