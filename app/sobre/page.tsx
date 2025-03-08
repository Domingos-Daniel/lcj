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

  useEffect(() => {
    setIsLoaded(true);
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

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section com animação */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[350px] overflow-hidden"
        >
          <Image
            src="/image4.jpeg"
            alt="Fundo"
            layout="fill"
            objectFit="cover"
            quality={90}
            className="transition-all duration-300"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 text-center text-white">
              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-4 text-4xl font-bold md:text-5xl drop-shadow-lg"
              >
                Quem Somos
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mx-auto mb-6 max-w-2xl text-lg drop-shadow-md"
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
          className="py-16 px-10"
        >
          <div className="container mx-auto px-4">
            <motion.h2
              variants={fadeIn}
              className="mb-6 text-center text-3xl font-bold"
            >
              SOBRE NÓS
            </motion.h2>
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <motion.div variants={fadeIn}>
                <motion.h3
                  variants={fadeIn}
                  className="mb-4 text-2xl font-bold"
                >
                  POR QUE O LCJ-EDUCA.COM?
                </motion.h3>
                <motion.p
                  variants={fadeIn}
                  className="mb-4 text-base text-muted-foreground"
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
                  className="mb-4 text-base text-muted-foreground"
                >
                  A apresentação de matérias, legislações e peças processuais
                  com características totalmente angolanas facilita o trabalho
                  dos operadores do Direito e dos estudantes.
                </motion.p>
                <motion.p
                  variants={fadeIn}
                  className="text-base text-muted-foreground"
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
                className="relative h-[600px] w-[400px] mx-auto"
              >
                <Image
                  src="https://lcj-educa.com/wp-content/uploads/2024/09/Arnaldo-.jpg"
                  alt="Arnaldo"
                  layout="fill"
                  objectFit="cover"
                  quality={90}
                  className="rounded-lg shadow-lg"
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
          className="py-16 px-10"
        >
          <div className="container mx-auto px-4">
            <motion.h2
              variants={fadeIn}
              className="mb-6 text-center text-3xl font-bold"
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
                className="relative h-[400px] w-full md:w-[500px] mx-auto"
              >
                <Image
                  src="/image4.jpeg"
                  alt="LCJ-educa"
                  layout="fill"
                  objectFit="cover"
                  quality={90}
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
              <motion.div variants={staggerContainer}>
                <motion.h3
                  variants={fadeIn}
                  className="mb-4 text-2xl font-bold"
                >
                  O QUE É LCJ-educa.com?
                </motion.h3>
                <motion.p
                  variants={fadeIn}
                  className="mb-4 text-base text-muted-foreground"
                >
                  O lcj-educa.com, nomeadamente "laboratório de ciências
                  Jurídicos", é um site que foi criado e desenvolvido pelo
                  jurista "Arnaldo Leandro Gonga Miguel". É uma plataforma
                  única e exclusiva que contém matérias de Direito e conteúdo
                  Jurídico totalmente nacional!
                </motion.p>
                <motion.h3
                  variants={fadeIn}
                  className="mb-4 text-2xl font-bold"
                >
                  QUANDO FOI CRIADO O LCJ-educa.com?
                </motion.h3>
                <motion.p
                  variants={fadeIn}
                  className="text-base text-muted-foreground"
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
          className="py-20"
        >
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                <Card className="p-6 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-3xl font-bold">+5000</h3>
                  <p className="text-sm text-muted-foreground">
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
                <Card className="p-6 text-center">
                  <Scale className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-3xl font-bold">+1000</h3>
                  <p className="text-sm text-muted-foreground">
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
                <Card className="p-6 text-center">
                  <BookOpen className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-3xl font-bold">+100</h3>
                  <p className="text-sm text-muted-foreground">
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
                <Card className="p-6 text-center">
                  <Award className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-3xl font-bold">98%</h3>
                  <p className="text-sm text-muted-foreground">Satisfação</p>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Partners Section com animação */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="py-16 bg-muted/30"
        >
          <div className="container mx-auto px-4">
            <motion.h2
              variants={fadeIn}
              className="mb-12 text-center text-3xl font-bold"
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
              className={`overflow-hidden whitespace-nowrap`}
            >
              <div className="inline-block animate-scroll">
                <img
                  src="https://lcj-educa.com/wp-content/uploads/2025/01/Captura-de-ecra-2025-01-02-010801-768x437.png"
                  alt="Parceiro 1"
                  className="inline-block h-[150px] mx-10 align-middle rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://lcj-educa.com/wp-content/uploads/2024/09/NS_Logo.jpeg-768x768.jpg"
                  alt="Parceiro 2"
                  className="inline-block h-[150px] mx-10 align-middle rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://lcj-educa.com/wp-content/uploads/2024/05/IMG-20240426-WA0004-768x451.jpg"
                  alt="Parceiro 3"
                  className="inline-block h-[150px] mx-10 align-middle rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />

                <img
                  src="https://lcj-educa.com/wp-content/uploads/2025/01/Captura-de-ecra-2025-01-02-010801-768x437.png"
                  alt="Parceiro 1"
                  className="inline-block h-[150px] mx-10 align-middle rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://lcj-educa.com/wp-content/uploads/2024/09/NS_Logo.jpeg-768x768.jpg"
                  alt="Parceiro 2"
                  className="inline-block h-[150px] mx-10 align-middle rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://lcj-educa.com/wp-content/uploads/2024/05/IMG-20240426-WA0004-768x451.jpg"
                  alt="Parceiro 3"
                  className="inline-block h-[150px] mx-10 align-middle rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
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
          className="py-20 px-4"
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
              className="bg-card rounded-lg border shadow-lg p-8"
            >
              <motion.h2
                variants={fadeIn}
                className="text-3xl font-bold mb-8 text-center"
              >
                Envie sua Sugestão
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-muted-foreground mb-8 text-center"
              >
                Sua opinião é importante para nós. Ajude-nos a melhorar nossa
                plataforma.
              </motion.p>

              <motion.form variants={staggerContainer} className="space-y-6">
                <motion.div variants={fadeIn} className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
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
                  <div className="space-y-2">
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

                <motion.div variants={fadeIn} className="space-y-2">
                  <label htmlFor="suggestion" className="text-sm font-medium">
                    Sua Sugestão
                  </label>
                  <Textarea
                    id="suggestion"
                    placeholder="Compartilhe suas ideias e sugestões para melhorarmos nosso serviço..."
                    required
                    className="min-h-[150px]"
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
                >
                  <Button type="submit" className="w-full md:w-auto">
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

