"use client"
import axios from 'axios';
import { useState, useEffect, memo } from "react";
import { useCarousel } from "@/hooks/use-carousel";
import fs from 'fs/promises';
import path from 'path';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://lcj-educa.com/wp-json/wp/v2'

// Interface para os slides do carrossel 
export interface CarouselSlide {
  title: string
  description: string
  imageUrl: string
}

// Função para buscar dados do carrossel da API
export async function getCarouselContent(): Promise<CarouselSlide[]> {
  try {
    // Verificar primeiro se temos o JSON local
    try {
      const filePath = path.join(process.cwd(), 'data', 'carousel-posts.json')
      const data = await fs.readFile(filePath, 'utf-8')
      const jsonData = JSON.parse(data)
      
      // Verificar se os dados são válidos e não estão expirados
      if (jsonData && jsonData.slides && Date.now() - jsonData.timestamp < 24 * 60 * 60 * 1000) {
        console.log('📦 Usando cache local do carrossel')
        return jsonData.slides
      }
    } catch (err) {
      // Silenciosamente ignora se o arquivo não existe
      console.log('🔍 Cache local não encontrado ou expirado, buscando da API')
    }
    
    // Se não encontrou o cache local, buscar da API
    // Aqui você substituiria pela chamada real à sua API
    const response = await axios.get(`${API_URL}/posts`, {
      params: {
        categories: process.env.NEXT_PUBLIC_CAROUSEL_CATEGORY_ID || '1', // ID da categoria do carrossel
        _embed: true,
        per_page: 5
      }
    })

    // Processar dados da API WordPress
    const slides: CarouselSlide[] = response.data.map((post: any) => ({
      title: post.title.rendered || '',
      description: post.excerpt.rendered || '',
      imageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                process.env.NEXT_PUBLIC_DEFAULT_IMAGE || 'https://lcj-educa.com/wp-content/uploads/2024/05/placeholder.jpeg'
    }))

    // Salvar no cache local
    try {
      await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })
      await fs.writeFile(
        path.join(process.cwd(), 'data', 'carousel-posts.json'),
        JSON.stringify({
          slides,
          timestamp: Date.now()
        }, null, 2),
        'utf-8'
      )
      console.log('💾 Cache do carrossel atualizado')
    } catch (writeErr) {
      console.error('Erro ao salvar cache:', writeErr)
    }

    return slides
    
  } catch (error) {
    console.error('Erro ao buscar dados do carrossel:', error)
    
    // Retornar dados de fallback em caso de erro
    return [
      {
        title: 'LCJ Educa',
        description: 'Laboratório de Comunicação e Jornalismo',
        imageUrl: process.env.NEXT_PUBLIC_DEFAULT_IMAGE || 'https://lcj-educa.com/wp-content/uploads/2024/05/placeholder.jpeg'
      },
      {
        title: 'Conteúdos Educacionais',
        description: 'Recursos e materiais para estudantes e professores',
        imageUrl: process.env.NEXT_PUBLIC_DEFAULT_IMAGE || 'https://lcj-educa.com/wp-content/uploads/2024/05/placeholder.jpeg'
      }
    ]
  }
}