"use client"

import { useState, useEffect } from "react"
import fs from "fs"
import path from "path"
import axios from "axios"

// Interface para os slides
interface CarouselSlide {
  id?: string | number;
  title?: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  url?: string;
}

// Caminho para o arquivo JSON local (assumo que esteja na pasta public)
const LOCAL_JSON_PATH = '/data/carousel-posts.json';

// Função para buscar JSON local com caching
const fetchLocalJSON = async (): Promise<CarouselSlide[]> => {
  // Verificar se já temos no sessionStorage
  const cached = sessionStorage.getItem('carousel-data');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // Continuar para buscar nova cópia se o cache estiver corrompido
    }
  }
  
  try {
    // Buscar do arquivo JSON local
    const response = await fetch(LOCAL_JSON_PATH);
    
    if (!response.ok) {
      throw new Error(`Falha ao carregar JSON local: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Salvar no cache
    sessionStorage.setItem('carousel-data', JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar JSON local:', error);
    throw error;
  }
};

// Função para buscar dados da API (fallback)
const fetchAPIData = async (): Promise<CarouselSlide[]> => {
  try {
    const response = await fetch('/api/carousel');
    if (!response.ok) {
      throw new Error('Falha ao carregar dados da API');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar da API:', error);
    return [];
  }
};

// Hook otimizado sem SWR
export function useCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Função para carregar o JSON
    const loadCarouselData = async () => {
      try {
        // Buscar diretamente do arquivo JSON com o nome correto
        const response = await fetch('/data/carousel-posts.json');
        
        if (!response.ok) {
          throw new Error(`Falha ao carregar JSON local: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Formato inválido: esperava um array');
        }
        
        //console.log('✅ Dados do carrossel carregados com sucesso:', data.length, 'slides');
        setSlides(data);
        setIsLoading(false);
      } catch (err) {
        console.error('❌ Erro ao carregar dados do carrossel:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
        setIsLoading(false);
        
        // Não definir slides fallback aqui, deixamos o componente lidar com isso
        setSlides([]);
      }
    };
    
    loadCarouselData();
  }, []);
  
  return { slides, isLoading, error };
}