"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Scale, BookOpen, Award, Search, User, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Importar CSS para o carousel
import styles from "./styles.module.css";

export default function SobrePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    modelos: 0,
    artigos: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
    
    // Função para buscar estatísticas do WordPress
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Usando o formato padrão da REST API do WordPress com sufixo /wp-json/
        const [usersResponse, modelosResponse, artigosResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/wp/v2/users`),
          fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/wp/v2/posts?categories=22&per_page=1`),
          fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/wp/v2/posts/`)
        ]);
        
        // Se a API não estiver configurada dessa forma, tente com o formato alternativo
        // As APIs retornam cabeçalhos com o número total de itens
        const totalUsers = parseInt(usersResponse.headers.get('X-WP-Total') || '100');
        const totalModelos = parseInt(modelosResponse.headers.get('X-WP-Total') || '300');
        const totalArtigos = parseInt(artigosResponse.headers.get('X-WP-Total') || '200');
        
        setStats({
          users: totalUsers,
          modelos: totalModelos,
          artigos: totalArtigos
        });
        
        console.log("Estatísticas obtidas:", { totalUsers, totalModelos, totalArtigos });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        // Em caso de erro, definimos valores fixos para não deixar a interface vazia
        setStats({
          users: 150,
          modelos: 85,
          artigos: 220
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Função para formatar números com separador de milhar
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section com animação */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[250px] sm:h-[300px] md:h-[350px] overflow-hidden"
        >
          <Image
            src="/image4.jpeg"
            alt="Fundo"
            fill
            sizes="100vw"
            priority
            className="object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 text-center text-white">
              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg"
              >
                Quem Somos
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mx-auto mb-6 max-w-2xl text-base sm:text-lg drop-shadow-md px-2"
              >
                LCJ-Educa é uma plataforma inovadora dedicada a fornecer recursos
                jurídicos de alta qualidade para profissionais e estudantes de
                direito.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button variant="default" className="mx-auto">
                  Saiba Mais
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Seção "SOBRE NÓS" com animação */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="py-10 md:py-16 px-4 md:px-10"
        >
          <div className="container mx-auto px-2 md:px-4">
            <motion.h2
              variants={fadeIn}
              className="mb-6 text-center text-2xl md:text-3xl font-bold"
            >
              SOBRE NÓS
            </motion.h2>
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <motion.div variants={fadeIn} className="order-2 md:order-1">
                <motion.h3
                  variants={fadeIn}
                  className="mb-4 text-xl md:text-2xl font-bold"
                >
                  POR QUE O LCJ-EDUCA.COM?
                </motion.h3>
                <motion.p
                  variants={fadeIn}
                  className="mb-4 text-sm md:text-base text-muted-foreground"
                >
                  Com o lcj-educa.com é possível aprender o Direito sem sequer
                  frequentar uma Faculdade de Direito. O LCJ auxilia estudantes
                  de direito, advogados, juízes, procuradores e todos os
                  operadores do Direito – e não só – a se familiarizarem com
                  conteúdo jurídico de forma fácil, simples e nacional,
                  proporcionando o conforto de sua residência.
                </motion.p>
                <motion.p
                  variants={fadeIn}
                  className="mb-4 text-sm md:text-base text-muted-foreground"
                >
                  A apresentação de matérias, legislações e peças processuais
                  com características totalmente angolanas facilita o trabalho
                  dos operadores do Direito e dos estudantes.
                </motion.p>
                <motion.p
                  variants={fadeIn}
                  className="text-sm md:text-base text-muted-foreground"
                >
                  Ajuda os cidadãos a estarem em dia com os seus direitos de uma
                  forma fácil e simples.
                </motion.p>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.7 },
                  },
                }}
                className="relative aspect-[2/3] w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] mx-auto order-1 md:order-2"
              >
                <Image
                  src="https://lcj-educa.com/wp-content/uploads/2024/09/Arnaldo-.jpg"
                  alt="Arnaldo"
                  fill
                  sizes="(max-width: 768px) 300px, 400px"
                  className="rounded-lg shadow-lg object-cover"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Nova Seção "SOBRE NÓS" adicional com animação */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="py-10 md:py-16 px-4 md:px-10"
        >
          <div className="container mx-auto px-2 md:px-4">
            <motion.h2
              variants={fadeIn}
              className="mb-6 text-center text-2xl md:text-3xl font-bold"
            >
              SOBRE NÓS
            </motion.h2>
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.7 },
                  },
                }}
                className="relative aspect-[4/3] w-full max-w-[350px] md:max-w-[500px] mx-auto"
              >
                <Image
                  src="/image4.jpeg"
                  alt="LCJ-educa"
                  fill
                  sizes="(max-width: 768px) 350px, 500px"
                  className="rounded-lg shadow-lg object-cover"
                />
              </motion.div>
              <motion.div variants={staggerContainer}>
                <motion.h3
                  variants={fadeIn}
                  className="mb-4 text-xl md:text-2xl font-bold"
                >
                  O QUE É LCJ-educa.com?
                </motion.h3>
                <motion.p
                  variants={fadeIn}
                  className="mb-4 text-sm md:text-base text-muted-foreground"
                >
                  O lcj-educa.com, nomeadamente "laboratório de ciências
                  Jurídicos", é um site que foi criado e desenvolvido pelo
                  jurista "Arnaldo Leandro Gonga Miguel". É uma plataforma
                  única e exclusiva que contém matérias de Direito e conteúdo
                  Jurídico totalmente nacional!
                </motion.p>
                <motion.h3
                  variants={fadeIn}
                  className="mb-4 text-xl md:text-2xl font-bold"
                >
                  QUANDO FOI CRIADO O LCJ-educa.com?
                </motion.h3>
                <motion.p
                  variants={fadeIn}
                  className="text-sm md:text-base text-muted-foreground"
                >
                  O lcj-educa.com foi criado e elaborado em 2017 pelo jurista
                  ARNALDO MIGUEL, com o objectivo de albergar conteúdos de cunho
                  jurídico, tendo o seu desenvolvimento substancial expandido em
                  2019.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Stats Section com animação */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="py-10 md:py-20"
        >
          <div className="container mx-auto px-4">
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-2 md:grid-cols-4">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.1 },
                  },
                }}
              >
                <Card className="p-3 sm:p-4 md:p-6 text-center h-full">
                  <Users className="mx-auto mb-2 md:mb-4 h-8 w-8 md:h-12 md:w-12 text-primary" />
                  <h3 className="mb-1 md:mb-2 text-xl sm:text-2xl md:text-3xl font-bold">
                    {isLoading ? (
                      <span className="inline-block w-16 h-6 md:h-8 bg-muted/40 animate-pulse rounded"></span>
                    ) : (
                      `+${formatNumber(stats.users)}`
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Usuários Ativos
                  </p>
                </Card>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.2 },
                  },
                }}
              >
                <Card className="p-3 sm:p-4 md:p-6 text-center h-full">
                  <Scale className="mx-auto mb-2 md:mb-4 h-8 w-8 md:h-12 md:w-12 text-primary" />
                  <h3 className="mb-1 md:mb-2 text-xl sm:text-2xl md:text-3xl font-bold">
                    {isLoading ? (
                      <span className="inline-block w-16 h-6 md:h-8 bg-muted/40 animate-pulse rounded"></span>
                    ) : (
                      `+${formatNumber(stats.modelos)}`
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Modelos Jurídicos
                  </p>
                </Card>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.3 },
                  },
                }}
              >
                <Card className="p-3 sm:p-4 md:p-6 text-center h-full">
                  <BookOpen className="mx-auto mb-2 md:mb-4 h-8 w-8 md:h-12 md:w-12 text-primary" />
                  <h3 className="mb-1 md:mb-2 text-xl sm:text-2xl md:text-3xl font-bold">
                    {isLoading ? (
                      <span className="inline-block w-16 h-6 md:h-8 bg-muted/40 animate-pulse rounded"></span>
                    ) : (
                      `+${formatNumber(stats.artigos)}`
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Artigos Publicados
                  </p>
                </Card>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.4 },
                  },
                }}
              >
                <Card className="p-3 sm:p-4 md:p-6 text-center h-full">
                  <Award className="mx-auto mb-2 md:mb-4 h-8 w-8 md:h-12 md:w-12 text-primary" />
                  <h3 className="mb-1 md:mb-2 text-xl sm:text-2xl md:text-3xl font-bold">98%</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Satisfação</p>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Partners Section com animação - Versão responsiva */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="py-10 md:py-16 bg-muted/30"
        >
          <div className="container mx-auto px-4">
            <motion.h2
              variants={fadeIn}
              className="mb-6 md:mb-12 text-center text-2xl md:text-3xl font-bold"
            >
              Nossos Parceiros
            </motion.h2>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.8 },
                },
              }}
              className="overflow-hidden whitespace-nowrap"
            >
              <div className="inline-block animate-scroll">
                {/* Ajuste as alturas das imagens para serem responsivas */}
                <img
                  src="https://lcj-educa.com/wp-content/uploads/2025/01/Captura-de-ecra-2025-01-02-010801-768x437.png"
                  alt="Parceiro 1"
                  className="inline-block h-[80px] sm:h-[100px] md:h-[150px] mx-4 sm:mx-6 md:mx-10 align-middle rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://lcj-educa.com/wp-content/uploads/2024/09/NS_Logo.jpeg-768x768.jpg"
                  alt="Parceiro 2"
                  className="inline-block h-[80px] sm:h-[100px] md:h-[150px] mx-4 sm:mx-6 md:mx-10 align-middle rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://lcj-educa.com/wp-content/uploads/2024/05/IMG-20240426-WA0004-768x451.jpg"
                  alt="Parceiro 3"
                  className="inline-block h-[80px] sm:h-[100px] md:h-[150px] mx-4 sm:mx-6 md:mx-10 align-middle rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />

                <img
                  src="https://lcj-educa.com/wp-content/uploads/2025/01/Captura-de-ecra-2025-01-02-010801-768x437.png"
                  alt="Parceiro 1"
                  className="inline-block h-[80px] sm:h-[100px] md:h-[150px] mx-4 sm:mx-6 md:mx-10 align-middle rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://lcj-educa.com/wp-content/uploads/2024/09/NS_Logo.jpeg-768x768.jpg"
                  alt="Parceiro 2"
                  className="inline-block h-[80px] sm:h-[100px] md:h-[150px] mx-4 sm:mx-6 md:mx-10 align-middle rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://lcj-educa.com/wp-content/uploads/2024/05/IMG-20240426-WA0004-768x451.jpg"
                  alt="Parceiro 3"
                  className="inline-block h-[80px] sm:h-[100px] md:h-[150px] mx-4 sm:mx-6 md:mx-10 align-middle rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Suggestions Form Section com animação */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="py-10 md:py-20 px-4"
        >
          <div className="container mx-auto max-w-3xl">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8 },
                },
              }}
              className="bg-card rounded-lg border shadow-lg p-4 sm:p-6 md:p-8"
            >
              <motion.h2
                variants={fadeIn}
                className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center"
              >
                Envie sua Sugestão
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 text-center"
              >
                Sua opinião é importante para nós. Ajude-nos a melhorar nossa
                plataforma.
              </motion.p>

              <motion.form variants={staggerContainer} className="space-y-4 md:space-y-6">
                <motion.div variants={fadeIn} className="grid gap-4 md:gap-6 md:grid-cols-2">
                  <div className="space-y-1 md:space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nome Completo
                    </label>
                    <Input
                      id="name"
                      placeholder="Digite seu nome"
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      className="w-full"
                    />
                  </div>
                </motion.div>

                <motion.div variants={fadeIn} className="space-y-1 md:space-y-2">
                  <label htmlFor="suggestion" className="text-sm font-medium">
                    Sua Sugestão
                  </label>
                  <Textarea
                    id="suggestion"
                    placeholder="Compartilhe suas ideias e sugestões para melhorarmos nosso serviço..."
                    required
                    className="min-h-[100px] md:min-h-[150px]"
                  />
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, delay: 0.2 },
                    },
                  }}
                  className="flex justify-center md:justify-start"
                >
                  <Button type="submit" className="w-full sm:w-auto">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Sugestão
                  </Button>
                </motion.div>
              </motion.form>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

