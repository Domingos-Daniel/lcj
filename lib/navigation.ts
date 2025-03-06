// Create this new file to share navigation structure

export interface NavLink {
  title: string;
  href?: string;
  items?: {
    title: string;
    href: string;
    description?: string;
  }[];
}

// Centralized navigation structure
export const getNavigationLinks = (): NavLink[] => {
  return [
    {
      title: "Matérias de Direito",
      href: "/arquivos/22"
    },
    {
      title: "Peças Processuais",
      items: [
        { 
          title: "Peças Processuais de Direito Público", 
          href: "/arquivos/32",
          description: "Petições, recursos e documentos relacionados ao Direito Público, incluindo Administrativo e Constitucional."
        },
        { 
          title: "Peças Processuais de Direito Privado", 
          href: "/arquivos/28",
          description: "Modelos de petições e documentos para casos de Direito Civil, Empresarial e outras áreas privadas."
        },
        { 
          title: "Peças Processuais de Direito Genéricas", 
          href: "/arquivos/31",
          description: "Modelos gerais e formulários que podem ser adaptados para diferentes áreas do Direito."
        },
        { 
          title: "Todas as Peças Processuais", 
          href: "/arquivos/27",
          description: "Acesse a coleção completa de peças processuais disponíveis em nosso acervo."
        }
      ]
    },
    {
      title: "Cadastramento",
      href: "/cadastramento"
    },
    {
      title: "Quem Somos",
      href: "/sobre"
    }
  ];
};