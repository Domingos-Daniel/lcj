"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, ArrowRight, X, CheckCircle, HelpCircle
} from "lucide-react"
import confetti from 'canvas-confetti'
import { useTheme } from "next-themes"

interface TutorialStep {
  title: string;
  description: string;
  element: string;
  fallbackElement?: string;
  position: "top" | "bottom" | "left" | "right";
}

export function PostViewTutorial() {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [tooltipSize, setTooltipSize] = useState({ width: 320, height: 200 })
  const [hasShownTutorial, setHasShownTutorial] = useState(true) // Assume verdadeiro até verificar
  const [isComplete, setIsComplete] = useState(false)
  const confettiRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  
  // Verificar no localStorage se o tutorial já foi mostrado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tutorialSeen = localStorage.getItem('post-view-tutorial-seen') === 'true'
      setHasShownTutorial(tutorialSeen)
      
      // Se o tutorial não foi visto ainda, inicie-o após um breve atraso
      if (!tutorialSeen) {
        const timer = setTimeout(() => {
          startTutorial()
        }, 1500) // Inicia após 1.5 segundo para garantir que a página carregou
        
        return () => clearTimeout(timer)
      }
    }
  }, [])
  
  // Etapas do tutorial com elementos fallback para melhor rastreamento
  const steps: TutorialStep[] = [
    {
      title: "Voltar para lista",
      description: "Clique aqui para retornar à lista de artigos da categoria.",
      element: 'a[href^="/arquivos/"][class*="Button"]',
      fallbackElement: 'a:has(.lucide-chevron-left)',
      position: "bottom"
    },
    {
      title: "Tela cheia",
      description: "Ative o modo de tela cheia para uma leitura mais imersiva.",
      element: 'button:has(.lucide-maximize), button:has(.lucide-minimize)',
      fallbackElement: '.flex.items-center.gap-2 button:first-child',
      position: "left"
    },
    {
      title: "Painel lateral",
      description: "Este botão abre o painel com artigos relacionados e tags. Nota: Disponível apenas em telas maiores.",
      element: 'button:has(.lucide-panel-right-close), button:has(.lucide-panel-right-open)',
      fallbackElement: '.flex.items-center.gap-2 button:nth-child(2)',
      position: "left"
    },
    {
      title: "Curtir e salvar",
      description: "Mostre sua apreciação pelo artigo e salve-o para leitura posterior.",
      element: '.flex.items-center.gap-4',
      fallbackElement: 'button:has(.lucide-thumbs-up)',
      position: "top"
    },
    {
      title: "Compartilhar",
      description: "Compartilhe este artigo nas redes sociais ou envie por email.",
      element: 'button:has(.lucide-share-2)',
      fallbackElement: '.flex.items-center.justify-between button:has(.lucide-share-2)',
      position: "top"
    }
  ]
  
  // Iniciar o tutorial
  const startTutorial = () => {
    setIsActive(true)
    setCurrentStep(0)
    setIsComplete(false)
    
    // Log de início do tutorial
    console.log('🔍 Iniciando tutorial de visualização de artigo')
    
    setTimeout(() => {
      highlightElement(steps[0].element, steps[0].fallbackElement)
    }, 300)
  }
  
  // Finalizar o tutorial
  const endTutorial = (completed = true) => {
    resetHighlight()
    
    if (completed && !hasShownTutorial) {
      setIsComplete(true)
      launchConfetti()
      
      // Delay para mostrar o confetti antes de fechar
      setTimeout(() => {
        setIsActive(false)
        // Marcar como visto
        if (typeof window !== 'undefined') {
          localStorage.setItem('post-view-tutorial-seen', 'true')
          setHasShownTutorial(true)
        }
      }, 2500)
    } else {
      setIsActive(false)
      if (completed) {
        // Marcar como visto mesmo se cancelou
        if (typeof window !== 'undefined') {
          localStorage.setItem('post-view-tutorial-seen', 'true')
          setHasShownTutorial(true)
        }
      }
    }
  }
  
  // Lançar confetti para comemorar a conclusão do tutorial
  const launchConfetti = () => {
    if (typeof window === 'undefined') return
    
    const canvasConfetti = confetti.create(undefined, { 
      resize: true,
      useWorker: true
    });
    
    canvasConfetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42'],
      disableForReducedMotion: true
    });
  }
  
  // Avançar para o próximo passo
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setTimeout(() => {
        highlightElement(steps[currentStep + 1].element, steps[currentStep + 1].fallbackElement)
      }, 100)
      
      // Log de progresso
      console.log(`✅ Avançou para o passo ${currentStep + 2}: ${steps[currentStep + 1].title}`)
    } else {
      // Finalizar o tutorial se for o último passo
      console.log('🎉 Tutorial concluído com sucesso!')
      endTutorial(true)
    }
  }
  
  // Voltar para o passo anterior
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setTimeout(() => {
        highlightElement(steps[currentStep - 1].element, steps[currentStep - 1].fallbackElement)
      }, 100)
      
      // Log de navegação reversa
      console.log(`⏪ Voltou para o passo ${currentStep}: ${steps[currentStep - 1].title}`)
    }
  }
  
  // Destacar o elemento atual e posicionar o tooltip com melhor rastreamento
  const highlightElement = (selector: string, fallbackSelector?: string) => {
    resetHighlight()
    
    try {
      // Primeiro tenta o seletor principal
      let element = document.querySelector(selector) as HTMLElement
      
      // Se não encontrar, tenta o fallback
      if (!element && fallbackSelector) {
        console.log(`⚠️ Elemento primário não encontrado: ${selector}, tentando fallback`)
        element = document.querySelector(fallbackSelector) as HTMLElement
      }
      
      if (!element) {
        console.warn(`❌ Elementos não encontrados: ${selector} e ${fallbackSelector || 'sem fallback'}`)
        // Posiciona o tooltip no centro da tela como fallback
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        setTooltipPosition({ 
          top: viewportHeight / 2 - tooltipSize.height / 2, 
          left: viewportWidth / 2 - tooltipSize.width / 2 
        })
        return
      }
      
      // Log de sucesso ao encontrar o elemento
      console.log(`🎯 Elemento encontrado para: ${steps[currentStep].title}`)
      
      // Adicionar classe de destaque
      element.classList.add('tutorial-highlight')
      
      // Rolar para o elemento com opção de block dependendo da posição
      const blockPosition = steps[currentStep].position === "top" ? "end" : "center"
      element.scrollIntoView({ behavior: 'smooth', block: blockPosition })
      
      // Obter posição do elemento
      const rect = element.getBoundingClientRect()
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft
      
      // Posicionar o tooltip baseado na posição indicada
      const position = steps[currentStep].position
      const tooltipWidth = tooltipSize.width
      const tooltipHeight = tooltipSize.height
      const elementCenter = rect.left + rect.width / 2
      const viewportWidth = window.innerWidth
      
      let top = 0
      let left = 0
      
      switch (position) {
        case "top":
          top = rect.top + scrollTop - tooltipHeight - 15
          left = elementCenter - tooltipWidth / 2
          break
        case "bottom":
          top = rect.bottom + scrollTop + 15
          left = elementCenter - tooltipWidth / 2
          break
        case "left":
          top = rect.top + scrollTop + rect.height / 2 - tooltipHeight / 2
          left = rect.left + scrollLeft - tooltipWidth - 15
          break
        case "right":
          top = rect.top + scrollTop + rect.height / 2 - tooltipHeight / 2
          left = rect.right + scrollLeft + 15
          break
      }
      
      // Ajustes para manter o tooltip visível na janela
      if (left < 20) left = 20
      if (left + tooltipWidth > viewportWidth - 20) left = viewportWidth - tooltipWidth - 20
      if (top < 20) top = 20
      
      setTooltipPosition({ top, left })
      
    } catch (err) {
      console.error('Erro ao tentar destacar elemento:', err)
      
      // Fallback para posicionamento central se algo der errado
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      setTooltipPosition({ 
        top: viewportHeight / 2 - tooltipSize.height / 2, 
        left: viewportWidth / 2 - tooltipSize.width / 2 
      })
    }
  }
  
  // Remover destaque de todos os elementos
  const resetHighlight = () => {
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight')
    })
  }
  
  // Re-posicionar o tooltip ao redimensionar a tela
  useEffect(() => {
    if (!isActive) return;
    
    const handleResize = () => {
      if (currentStep < steps.length) {
        highlightElement(steps[currentStep].element, steps[currentStep].fallbackElement);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, currentStep]);
  
  const currentStepData = steps[currentStep]
  
  // Se o tutorial já foi mostrado e não está ativo, mostrar apenas o botão para reiniciar
  if (hasShownTutorial && !isActive) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={startTutorial}
        className="fixed bottom-8 right-8 z-40 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <HelpCircle className="h-5 w-5" />
        <span className="sr-only">Mostrar tutorial</span>
      </Button>
    )
  }
  
  // Determinar classes com base no tema atual
  const isDarkMode = theme === 'dark'
  
  return (
    <>
      {/* Estilos para o tutorial com suporte a temas claro/escuro */}
      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 999 !important;
          box-shadow: 0 0 0 4px var(--highlight-color, rgba(59, 130, 246, 0.5)) !important;
          animation: pulse 1.5s infinite;
          border-radius: 4px;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 var(--highlight-color, rgba(59, 130, 246, 0.7));
          }
          70% {
            box-shadow: 0 0 0 6px transparent;
          }
          100% {
            box-shadow: 0 0 0 0 transparent;
          }
        }
        
        .tutorial-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--overlay-color, rgba(0, 0, 0, 0.5));
          z-index: 998;
          pointer-events: none;
        }
        
        .tutorial-tooltip {
          position: absolute;
          background-color: var(--tooltip-bg, var(--background, white));
          color: var(--tooltip-text, var(--foreground, black));
          border-radius: 8px;
          box-shadow: 0 4px 20px var(--tooltip-shadow, rgba(0, 0, 0, 0.15));
          padding: 16px;
          z-index: 1000;
          pointer-events: auto;
          max-width: 90vw;
          width: 320px;
          border: 1px solid var(--tooltip-border, var(--border, transparent));
        }
        
        /* Variáveis de tema */
        :root {
          --highlight-color: rgba(59, 130, 246, 0.5);
          --overlay-color: rgba(0, 0, 0, 0.5);
          --tooltip-bg: white;
          --tooltip-text: black;
          --tooltip-shadow: rgba(0, 0, 0, 0.15);
          --tooltip-border: #f0f0f0;
        }
        
        .dark {
          --highlight-color: rgba(96, 165, 250, 0.5);
          --overlay-color: rgba(0, 0, 0, 0.7);
          --tooltip-bg: #1f1f1f;
          --tooltip-text: #f0f0f0;
          --tooltip-shadow: rgba(0, 0, 0, 0.3);
          --tooltip-border: #333;
        }
      `}</style>
      
      {/* Área para o confetti */}
      <div 
        ref={confettiRef} 
        className="fixed inset-0 pointer-events-none z-[1001]"
        style={{ display: isComplete ? 'block' : 'none' }}
      />
      
      {isActive && (
        <>
          {/* Overlay escuro */}
          <div className="tutorial-overlay" />
          
          {/* Tooltip do tutorial */}
          <div 
            className="tutorial-tooltip"
            style={{ 
              top: tooltipPosition.top, 
              left: tooltipPosition.left, 
              width: tooltipSize.width 
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{currentStepData?.title || "Tutorial"}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => endTutorial(false)} 
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-muted-foreground mb-4">{currentStepData?.description || "Aprenda a usar os recursos desta página."}</p>
            
            <div className="flex items-center justify-between mt-4 pt-2 border-t">
              <div className="text-sm text-muted-foreground">
                Passo {currentStep + 1} de {steps.length}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                
                <Button 
                  size="sm"
                  onClick={nextStep}
                  className="bg-primary hover:bg-primary/90"
                >
                  {currentStep < steps.length - 1 ? (
                    <>
                      Próximo
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    "Concluir"
                  )}
                </Button>
              </div>
            </div>
            
            {isComplete && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">🎉</div>
                  <h3 className="text-xl font-bold mb-2">Tutorial Concluído!</h3>
                  <p className="text-muted-foreground mb-4">
                    Agora você conhece os principais recursos desta página.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}