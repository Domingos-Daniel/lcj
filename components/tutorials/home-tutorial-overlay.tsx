"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Home, 
  Menu, 
  User, 
  Moon, 
  ArrowUp,
  BookOpen,
  LogIn,
  XCircle,
  CheckCircle2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import confetti from 'canvas-confetti'

interface TutorialStep {
  title: string
  description: string
  targetId: string
  icon: React.ReactNode
  position: 'top' | 'bottom' | 'left' | 'right'
  mobilePosition?: 'top' | 'bottom' | 'left' | 'right'
}

interface HomeTutorialOverlayProps {
  pageKey: string
}

// Adicione uma função para determinar se é mobile e modificar os passos do tutorial

// Atualização para detecção correta do menu mobile e seus elementos

export function HomeTutorialOverlay({ pageKey }: HomeTutorialOverlayProps) {
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isElementVisible, setIsElementVisible] = useState(true)
  const [isMobileView, setIsMobileView] = useState(false)
  const confettiIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { theme } = useTheme()
  
  // Detectar visualização mobile
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);
  
  // Atualize a função getSteps para usar o ID correto para o menu mobile
  // Função getSteps aprimorada para sempre retornar pelo menos um passo válido
  const getSteps = (): TutorialStep[] => {
    // Passos comuns para ambos os layouts
    const commonSteps: TutorialStep[] = [
      {
        title: "Carrossel",
        description: "Veja os destaques e novidades recentes. Use os controles para navegar entre os itens.",
        targetId: "carousel-container",
        icon: <BookOpen className="h-6 w-6" />,
        position: "bottom",
        mobilePosition: "top"
      },
      {
        title: "Tema Escuro/Claro",
        description: "Mude entre os modos claro e escuro conforme sua preferência visual.",
        targetId: "theme-toggle",
        icon: <Moon className="h-6 w-6" />,
        position: "bottom",
        mobilePosition: "bottom"
      }
    ];
    
    // Criar os passos base (sem o botão Voltar ao topo)
    const baseDesktopSteps = [
      {
        title: "Menu Principal",
        description: "Acesse as principais seções do site através deste menu.",
        targetId: "main-menu",
        icon: <Menu className="h-6 w-6" />,
        position: "bottom",
      },
      {
        title: "Menu Dropdown",
        description: "Clique para ver mais opções e categorias disponíveis.",
        targetId: "dropdown-menu",
        icon: <ChevronDown className="h-6 w-6" />,
        position: "bottom",
        mobilePosition: "bottom"
      },
      ...commonSteps,
      {
        title: "Área do Usuário",
        description: "Acesse sua conta ou cadastre-se para utilizar recursos exclusivos da plataforma.",
        targetId: "user-account",
        icon: <LogIn className="h-6 w-6" />,
        position: "bottom",
        mobilePosition: "bottom"
      }
    ];
    
    const baseMobileSteps = [
      {
        title: "Menu Mobile",
        description: "Toque aqui para abrir o menu lateral com todas as opções de navegação.",
        targetId: "mobile-menu-button",
        icon: <Menu className="h-6 w-6" />,
        position: "bottom",
      },
      {
        title: "Entrar na sua Conta",
        description: "Clique aqui para acessar sua conta ou se cadastrar para aceder aos recursos exclusivos.",
        targetId: "user-account",
        icon: <Menu className="h-6 w-6" />,
        position: "left",
      },
      ...commonSteps
    ];
    
    let desktopSteps = [...baseDesktopSteps];
    let mobileSteps = [...baseMobileSteps];
    
    // Fallback para garantir pelo menos um passo
    const fallbackStep: TutorialStep = {
      title: "Bem-vindo!",
      description: "Conheça nossa plataforma e seus recursos principais.",
      targetId: "root",
      icon: <Home className="h-6 w-6" />,
      position: "bottom"
    };
    
    // Retornar os passos apropriados para desktop ou mobile
    let steps = isMobileView ? mobileSteps : desktopSteps;
    return steps.length > 0 ? steps : [fallbackStep];
  };

  const tutorialSteps = getSteps();

  useEffect(() => {
    // Check if tutorial has been shown before for this page
    const hasTutorialBeenShown = localStorage.getItem(`tutorial-${pageKey}`)
    
    // Wait for homepage to fully load
    if (!hasTutorialBeenShown) {
      const timer = setTimeout(() => {
        setShowTutorial(true)
        // Scroll to ensure the first element is visible
        const element = document.getElementById(tutorialSteps[0].targetId)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [pageKey, tutorialSteps])

  // Check if current element is visible
  useEffect(() => {
    if (!showTutorial || showCelebration) return

    const checkElementVisibility = () => {
      const element = document.getElementById(tutorialSteps[currentStep].targetId)
      if (!element) {
        setIsElementVisible(false)
        return
      }

      const rect = element.getBoundingClientRect()
      const isVisible = 
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth

      setIsElementVisible(isVisible)
    }

    checkElementVisibility()
    window.addEventListener('scroll', checkElementVisibility)
    window.addEventListener('resize', checkElementVisibility)
    
    return () => {
      window.removeEventListener('scroll', checkElementVisibility)
      window.removeEventListener('resize', checkElementVisibility)
    }
  }, [showTutorial, showCelebration, currentStep, tutorialSteps])

  // Adicione esta lógica para avançar automaticamente quando um elemento não estiver visível
  useEffect(() => {
    if (!showTutorial || showCelebration) return;

    // Se o elemento atual não estiver visível após um tempo, avance automaticamente
    if (!isElementVisible) {
      const autoAdvanceTimer = setTimeout(() => {
        // Tente uma vez mais verificar a visibilidade
        const element = document.getElementById(tutorialSteps[currentStep].targetId);
        if (!element || !isElementInViewport(element)) {
          console.log(`Elemento ${tutorialSteps[currentStep].targetId} não está visível, avançando...`);
          nextStep();
        }
      }, 3000); // 3 segundos de espera antes de avançar
      
      return () => clearTimeout(autoAdvanceTimer);
    }
  }, [isElementVisible, showTutorial, showCelebration, currentStep]);

  // Função auxiliar para verificar se um elemento está na viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }

  const completeTutorial = () => {
    setShowCelebration(true)
    triggerConfetti()
    
    localStorage.setItem(`tutorial-${pageKey}`, 'true')
    
    // Extended celebration duration (10 seconds)
    setTimeout(() => {
      setShowTutorial(false)
      setShowCelebration(false)
      
      // Clean up confetti if it's still running
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current)
      }
    }, 10000)
  }

  const skipTutorial = () => {
    localStorage.setItem(`tutorial-${pageKey}`, 'true')
    setShowTutorial(false)
    
    // Clean up confetti if it's running
    if (confettiIntervalRef.current) {
      clearInterval(confettiIntervalRef.current)
    }
  }

  const triggerConfetti = () => {
    const duration = 10 * 1000 // 10 seconds of confetti
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    // Store interval reference so we can clear it if needed
    confettiIntervalRef.current = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        if (confettiIntervalRef.current) {
          clearInterval(confettiIntervalRef.current)
        }
        return
      }

      const particleCount = 50 * (timeLeft / duration)
      
      // More varied confetti patterns
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
      
      // Add occasional bursts from center
      if (Math.random() > 0.85) {
        confetti({
          ...defaults,
          particleCount: particleCount * 2,
          origin: { x: 0.5, y: 0.5 },
          gravity: 1.2,
          scalar: 1.2
        })
      }
    }, 250)
  }

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      const nextStepIndex = currentStep + 1
      setCurrentStep(nextStepIndex)
      
      // Scroll to the next element with better positioning
      ensureElementIsVisible(tutorialSteps[nextStepIndex].targetId)
    } else {
      completeTutorial()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1
      setCurrentStep(prevStepIndex)
      
      // Scroll to the previous element with better positioning
      ensureElementIsVisible(tutorialSteps[prevStepIndex].targetId)
    }
  }

  // Enhanced scrolling function to ensure element is properly visible
  const ensureElementIsVisible = (targetId: string) => {
    const element = document.getElementById(targetId)
    if (!element) return
    
    const rect = element.getBoundingClientRect()
    const isFullyVisible = 
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    
    if (!isFullyVisible) {
      // Calculate optimal scroll position
      const scrollTop = window.pageYOffset + rect.top
      
      // Determine if element should be at top, middle or bottom of viewport
      let blockPosition: ScrollLogicalPosition = 'center'
      
      // If element is very tall, aim for top
      if (rect.height > window.innerHeight * 0.7) {
        blockPosition = 'start'
      } 
      // If element is near the bottom of page
      else if (rect.bottom > window.innerHeight) {
        blockPosition = 'center'
      }
      
      element.scrollIntoView({
        behavior: 'smooth',
        block: blockPosition,
        inline: 'nearest'
      })
    }
  }

  // Verificação de segurança antes de renderizar
  if (!showTutorial || tutorialSteps.length === 0) return null;

  if (showCelebration) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/40 dark:bg-black/60 flex items-center justify-center transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-background/80 dark:from-primary/20 dark:to-background/90"></div>
        
        <Card className="w-[92%] max-w-md p-6 md:p-8 text-center shadow-xl border-[1.5px] border-primary/30 z-[101] animate-in fade-in scale-in-95 duration-300">
          <div className="mb-2">
            <CheckCircle2 className="h-12 w-12 md:h-16 md:w-16 text-primary mx-auto mb-4" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">Bem-vindo ao LCJ!</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Estamos muito felizes em ter você conosco! Você está pronto para explorar todos os recursos que nossa plataforma jurídica tem a oferecer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              className="min-w-[150px]"
              onClick={() => {
                setShowTutorial(false)
                setShowCelebration(false)
              }}
            >
              Começar a explorar
            </Button>
            <Button 
              variant="outline"
              className="min-w-[150px] border-primary/30"
              onClick={() => {
                window.open('/sobre', '_blank');
              }}
            >
              Saiba mais sobre nós
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-6">
            Este tutorial estará sempre disponível em "Ajuda" se precisar revisitá-lo.
          </p>
        </Card>
      </div>
    )
  }

  // Adicione esta verificação de segurança
  const step = tutorialSteps[currentStep] || tutorialSteps[0];
  
  // Se ainda não tivermos um passo válido, não renderize nada
  if (!step) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/15 dark:bg-black/25 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/50 dark:from-primary/5 dark:to-background/60"></div>
      
      {/* Spotlight effect on the target element */}
      <SpotlightHighlight 
        targetId={step.targetId} 
        onVisibilityChange={setIsElementVisible} 
      />
      
      {/* Warning if element is not visible */}
      {!isElementVisible && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-500/90 text-white px-4 py-2 rounded-lg z-[102] flex items-center gap-2 shadow-lg animate-pulse max-w-[90%]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Elemento fora de visualização - clique para navegar</span>
        </div>
      )}
      
      {/* Tutorial popup */}
      <FocusedTutorialCard
        step={step}
        currentStep={currentStep}
        totalSteps={tutorialSteps.length}
        onPrev={prevStep}
        onNext={nextStep}
        theme={theme}
      />
      
      {/* Skip button - now more visible and accessible */}
      <Button 
        variant="secondary" 
        size="sm"
        className="absolute top-4 mt-16 right-4 z-[102] text-foreground border-border hover:bg-primary/10 flex gap-2 items-center transition-all shadow-lg"
        onClick={skipTutorial}
      >
        <XCircle className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:inline">Pular tutorial</span>
      </Button>
    </div>
  )
}

// SpotlightHighlight modificado para lidar com elementos móveis

function SpotlightHighlight({ 
  targetId, 
  onVisibilityChange 
}: { 
  targetId: string,
  onVisibilityChange?: (isVisible: boolean) => void
}) {
  // Verificação de segurança para o targetId
  if (!targetId) {
    console.error("SpotlightHighlight recebeu targetId inválido");
    if (onVisibilityChange) onVisibilityChange(false);
    return null;
  }
  
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updatePosition = () => {
      const element = document.getElementById(targetId);
      if (!element) {
        console.log(`Tutorial target element not found: ${targetId}`);
        setIsVisible(false);
        if (onVisibilityChange) onVisibilityChange(false);
        return false;
      }
      
      const rect = element.getBoundingClientRect();
      
      // Se o elemento não tem dimensões visíveis
      if (rect.width <= 1 || rect.height <= 1) {
        console.log(`Element has zero/minimal dimensions: ${targetId} (${rect.width}x${rect.height})`);
        
        // Tente obter dimensões através de estilos computados
        const computedStyle = window.getComputedStyle(element);
        const computedWidth = parseFloat(computedStyle.width);
        const computedHeight = parseFloat(computedStyle.height);
        
        if (computedWidth > 1 && computedHeight > 1) {
          // Use as dimensões computadas se disponíveis
          setPosition({
            top: rect.top,
            left: rect.left,
            width: computedWidth,
            height: computedHeight
          });
        } else {
          // Último recurso: dimensões fixas para elementos sem tamanho
          setPosition({
            top: rect.top,
            left: rect.left,
            width: 40, // Tamanho mínimo razoável para um botão
            height: 40
          });
        }
      } else {
        // Elemento tem dimensões normais
        setPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      }
      
      // Verifique se o elemento está visível na viewport
      const isInViewport = 
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0;
      
      setIsVisible(isInViewport);
      
      // Notificar o componente pai sobre mudanças na visibilidade
      if (onVisibilityChange) {
        onVisibilityChange(isInViewport);
      }
      
      return isInViewport;
    };
    
    // Tentar várias vezes para lidar com elementos que são carregados dinamicamente
    let attempts = 0;
    const maxAttempts = 10;
    
    const attemptToFindElement = () => {
      const result = updatePosition();
      attempts++;
      
      if (!result && attempts < maxAttempts) {
        setTimeout(attemptToFindElement, 300);
      }
    };
    
    attemptToFindElement();
    
    // Resto do código de eventos...
  }, [targetId, onVisibilityChange]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className="absolute transition-all duration-500 ease-out pointer-events-none"
      style={{
        top: `${position.top - 10}px`,
        left: `${position.left - 10}px`,
        width: `${position.width + 20}px`,
        height: `${position.height + 20}px`,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.35)',
        borderRadius: '8px',
        border: '2px solid hsl(var(--primary))',
        zIndex: 50
      }}
    />
  )
}

interface FocusedTutorialCardProps {
  step: TutorialStep
  currentStep: number
  totalSteps: number
  onPrev: () => void
  onNext: () => void
  theme?: string
}

// Posicionamento do card adaptado para mobile

function FocusedTutorialCard({ step, currentStep, totalSteps, onPrev, onNext, theme }) {
  // Verificação de segurança para o step
  if (!step || !step.targetId) {
    console.error("FocusedTutorialCard recebeu step inválido");
    return null;
  }
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  const [cardWidth, setCardWidth] = useState(320); // Default width
  const [isPositioned, setIsPositioned] = useState(false);
  
  // Ajuste o tamanho do card baseado na tela
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 340) {
        setCardWidth(220);
      } else if (width < 640) {
        setCardWidth(280);
      } else {
        setCardWidth(320);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Ajuste a posição do card para garantir que sempre esteja visível na tela
  useEffect(() => {
    const updatePosition = () => {
      const element = document.getElementById(step.targetId);
      if (!element) {
        // Elemento não encontrado, posicione o card no centro da tela
        setPosition({
          top: '50%',
          left: '50%'
        });
        setIsPositioned(true);
        return;
      }
      
      // Obter dimensões
      const rect = element.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isMobile = viewportWidth < 768;
      
      // Obter dimensões do card
      const cardHeight = cardRef.current?.offsetHeight || 200;
      const safeCardWidth = cardWidth + 40; // Adicionar margem de segurança
      
      // Para mobile, sempre centralizar horizontalmente na parte inferior ou central
      if (isMobile) {
        setPosition({
          top: `${Math.min(viewportHeight - cardHeight - 20, viewportHeight * 0.7)}px`,
          left: '50%'
        });
        setIsPositioned(true);
        return;
      }
      
      // Para desktop, calcular posição baseada na direção, mas garantir que fique dentro da tela
      let top, left;
      
      // Preferência pela posição definida no step
      switch (step.position) {
        case 'top':
          top = rect.top - cardHeight - 20;
          left = rect.left + rect.width / 2;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + 20;
          break;
        case 'bottom':
          top = rect.bottom + 20;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - safeCardWidth;
          break;
        default:
          top = rect.bottom + 20;
          left = rect.left + rect.width / 2;
      }
      
      // Garantir que o card fique dentro dos limites da tela
      
      // Limite vertical superior
      if (top < 20) {
        top = 20;
      }
      
      // Limite vertical inferior
      if (top + cardHeight > viewportHeight - 20) {
        top = viewportHeight - cardHeight - 20;
      }
      
      // Limites horizontais
      if (['top', 'bottom'].includes(step.position)) {
        // Para cards que são centralizados horizontalmente
        if (left - safeCardWidth / 2 < 20) {
          left = safeCardWidth / 2 + 20;
        } else if (left + safeCardWidth / 2 > viewportWidth - 20) {
          left = viewportWidth - safeCardWidth / 2 - 20;
        }
      } else {
        // Para cards posicionados à esquerda/direita
        if (left < 20) {
          left = 20;
        } else if (left + safeCardWidth > viewportWidth - 20) {
          left = viewportWidth - safeCardWidth - 20;
        }
      }
      
      setPosition({
        top: `${top}px`,
        left: `${left}px`
      });
      setIsPositioned(true);
    };
    
    // Atualiza a posição inicialmente e a cada resize
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    // Também atualiza após um pequeno delay para permitir animações de renderização
    const timeoutId = setTimeout(updatePosition, 200);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(timeoutId);
    };
  }, [step, cardWidth]);

  return (
    <div 
      ref={cardRef}
      className={`
        fixed z-[101] shadow-xl transition-all duration-500
        ${!isPositioned ? 'opacity-0' : 'opacity-100'}
        ${window.innerWidth < 768 ? 'left-1/2 -translate-x-1/2' : ''}
        ${['top', 'bottom'].includes(step.position) && window.innerWidth >= 768 ? '-translate-x-1/2' : ''}
        ${['left', 'right'].includes(step.position) && window.innerWidth >= 768 ? '-translate-y-1/2' : ''}
      `}
      style={{
        top: position.top,
        left: position.left,
        maxWidth: '90vw',
      }}
    >
      <Card className={`
        p-3 md:p-6 shadow-xl border-[1.5px] border-primary/30
        bg-card/95 backdrop-blur 
        transition-all animate-in fade-in zoom-in-95 
        duration-300 rounded-xl
      `}
      style={{ width: `${cardWidth}px`, maxWidth: '95vw' }}
      >
        {/* Conteúdo do card com tamanhos ajustados para mobile */}
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-primary/15 dark:bg-primary/20 p-1.5 md:p-2.5 rounded-full shrink-0">
            {step.icon}
          </div>
          <h3 className="text-sm md:text-lg font-semibold tracking-tight">{step.title}</h3>
        </div>
        
        <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-5 leading-relaxed">
          {step.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-0.5 overflow-x-auto pb-1 -mb-1 max-w-[40%]">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div 
                key={idx} 
                className={`
                  h-1 md:h-1.5 w-3 md:w-6 rounded-full transition-colors duration-300 flex-shrink-0
                  ${idx === currentStep ? 'bg-primary' : 'bg-muted'}
                `} 
              />
            ))}
          </div>
          <div className="flex gap-1 md:gap-2">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onPrev}
                className="border-primary/30 hover:bg-primary/10 text-xs py-1 h-7 md:h-8 px-2 md:px-3"
              >
                <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" /> 
                <span className="sr-only md:not-sr-only md:inline">Anterior</span>
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={onNext} 
              className="gap-1 text-xs md:text-sm py-1 h-7 md:h-8 px-2 md:px-3"
            >
              {currentStep < totalSteps - 1 ? (
                <>
                  <span className="sr-only md:not-sr-only">Próximo</span>
                  <span className="inline md:hidden">Próx</span>
                  <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                </>
              ) : (
                "Concluir"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}