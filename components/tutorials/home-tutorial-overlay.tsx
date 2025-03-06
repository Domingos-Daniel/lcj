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
  mobilePosition?: 'top' | 'bottom' // Optional override for mobile
}

interface HomeTutorialOverlayProps {
  pageKey: string
}

export function HomeTutorialOverlay({ pageKey }: HomeTutorialOverlayProps) {
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isElementVisible, setIsElementVisible] = useState(true)
  const confettiIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { theme } = useTheme()
  
  // Tutorial steps for homepage with improved mobile positioning
  const tutorialSteps: TutorialStep[] = [
    {
      title: "Menu Principal",
      description: "Acesse as principais seções do site através deste menu.",
      targetId: "main-menu",
      icon: <Menu className="h-6 w-6" />,
      position: "bottom",
      mobilePosition: "bottom"
    },
    {
      title: "Menu Dropdown",
      description: "Clique para ver mais opções e categorias disponíveis.",
      targetId: "dropdown-menu",
      icon: <ChevronDown className="h-6 w-6" />,
      position: "bottom",
      mobilePosition: "bottom"
    },
    {
      title: "Carrossel",
      description: "Veja os destaques e novidades recentes. Use os controles para navegar entre os itens.",
      targetId: "carousel-container",
      icon: <BookOpen className="h-6 w-6" />,
      position: "bottom",
      mobilePosition: "top"
    },
    {
      title: "Controles do Carrossel",
      description: "Navegue entre os slides usando estas setas ou aguarde a troca automática.",
      targetId: "carousel-controls",
      icon: <><ChevronLeft className="h-5 w-5 inline-block" /><ChevronRight className="h-5 w-5 inline-block ml-2" /></>,
      position: "left",
      mobilePosition: "bottom"
    },
    {
      title: "Tema Escuro/Claro",
      description: "Mude entre os modos claro e escuro conforme sua preferência visual.",
      targetId: "theme-toggle",
      icon: <Moon className="h-6 w-6" />,
      position: "left",
      mobilePosition: "bottom"
    },
    {
      title: "Voltar ao Topo",
      description: "Clique para retornar rapidamente ao topo da página quando estiver navegando pelo conteúdo.",
      targetId: "scroll-to-top",
      icon: <ArrowUp className="h-6 w-6" />,
      position: "left",
      mobilePosition: "top"
    },
    {
      title: "Área do Usuário",
      description: "Acesse sua conta ou cadastre-se para utilizar recursos exclusivos da plataforma.",
      targetId: "user-account",
      icon: <LogIn className="h-6 w-6" />,
      position: "left",
      mobilePosition: "bottom"
    }
  ]

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
  }, [pageKey])

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

  if (!showTutorial) return null

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

  const step = tutorialSteps[currentStep]
  return (
    <div className="fixed inset-0 z-[100] bg-black/30 dark:bg-black/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/80 dark:from-primary/10 dark:to-background/90"></div>
      
      {/* Spotlight effect on the target element */}
      <SpotlightHighlight targetId={step.targetId} />
      
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
      
      {/* Skip button - responsive */}
      <Button 
        variant="outline" 
        size="sm"
        className="absolute top-4 right-4 text-foreground border-border hover:bg-primary/10 flex gap-2 items-center transition-all"
        onClick={skipTutorial}
      >
        <XCircle className="h-4 w-4 md:mr-1" />
        <span className="hidden md:inline">Pular tutorial</span>
      </Button>
    </div>
  )
}

// This component creates a spotlight effect on the target element
function SpotlightHighlight({ targetId }: { targetId: string }) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updatePosition = () => {
      const element = document.getElementById(targetId)
      if (!element) {
        setIsVisible(false)
        return
      }
      
      const rect = element.getBoundingClientRect()
      setPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      })
      
      // Check if element is at least partially in viewport
      setIsVisible(
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
      )
    }
    
    updatePosition()
    
    // Update on resize and scroll with throttling
    let requestId: number | null = null
    
    const handleUpdate = () => {
      if (requestId) return
      
      requestId = window.requestAnimationFrame(() => {
        updatePosition()
        requestId = null
      })
    }
    
    window.addEventListener('resize', handleUpdate)
    window.addEventListener('scroll', handleUpdate)
    
    // Also update position periodically to catch dynamic elements
    const interval = setInterval(updatePosition, 500)
    
    return () => {
      window.removeEventListener('resize', handleUpdate)
      window.removeEventListener('scroll', handleUpdate)
      clearInterval(interval)
      if (requestId) window.cancelAnimationFrame(requestId)
    }
  }, [targetId])

  if (!isVisible) {
    // Return a small indicator for offscreen elements
    return (
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-primary text-white text-sm rounded-full animate-bounce shadow-lg z-50">
        Elemento fora da tela - clique para navegar
      </div>
    )
  }

  return (
    <div 
      className="absolute transition-all duration-500 ease-out pointer-events-none"
      style={{
        top: `${position.top - 10}px`,
        left: `${position.left - 10}px`,
        width: `${position.width + 20}px`,
        height: `${position.height + 20}px`,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
        borderRadius: '8px',
        border: '2px solid hsl(var(--primary))',
        zIndex: 50,
        backdropFilter: 'none'
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

function FocusedTutorialCard({
  step,
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  theme
}: FocusedTutorialCardProps) {
  const [position, setPosition] = useState({ top: '50%', left: '50%' })
  const [cardWidth, setCardWidth] = useState(320) // Default width
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Handle responsive card width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 340) {
        setCardWidth(240) // Very small phones
      } else if (width < 380) {
        setCardWidth(260) // Narrower on small devices
      } else if (width < 640) {
        setCardWidth(290) // Small devices
      } else {
        setCardWidth(320) // Default for larger screens
      }
    }
    
    handleResize() // Initial setting
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  useEffect(() => {
    // Calculate position after rendering
    const updatePosition = () => {
      const element = document.getElementById(step.targetId)
      if (!element) return
      
      const rect = element.getBoundingClientRect()
      let top, left
      
      // Get viewport dimensions
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const isMobile = viewportWidth < 768
      const isVeryNarrow = viewportWidth < 380
      
      // Get card dimensions
      const cardHeight = cardRef.current?.offsetHeight || 180
      const cardWidthWithMargin = cardWidth + 40
      
      // Function to ensure card stays within viewport
      const constrainToViewport = (x: number, y: number) => {
        // Constrain horizontally
        x = Math.max(cardWidthWithMargin / 2 + 10, x)
        x = Math.min(viewportWidth - (cardWidthWithMargin / 2) - 10, x)
        
        // Constrain vertically
        y = Math.max(cardHeight / 2 + 10, y)
        y = Math.min(viewportHeight - (cardHeight / 2) - 10, y)
        
        return { x, y }
      }
      
      if (isMobile) {
        // Mobile positioning strategy - prefer top/bottom based on specified mobile position
        const mobilePos = step.mobilePosition || (rect.top > viewportHeight / 2 ? 'top' : 'bottom')
        
        if (mobilePos === 'top') {
          // Position above element
          top = `${Math.max(rect.top - (cardHeight + 20), 20)}px`
          // Center horizontally if possible
          left = `${isVeryNarrow ? (viewportWidth / 2) : (rect.left + rect.width / 2)}px`
        } else {
          // Position below element
          top = `${rect.bottom + 20}px`
          // Center horizontally
          left = `${isVeryNarrow ? (viewportWidth / 2) : (rect.left + rect.width / 2)}px`
        }
        
        // If the element is very wide (like the carousel), center the card
        if (rect.width > viewportWidth * 0.7) {
          left = `${viewportWidth / 2}px`
        }
      } else {
        // Desktop positioning based on specified position
        switch (step.position) {
          case 'top':
            top = `${rect.top - (cardHeight + 20)}px`
            left = `${rect.left + (rect.width / 2)}px`
            break
          case 'bottom':
            top = `${rect.bottom + 20}px`
            left = `${rect.left + (rect.width / 2)}px`
            break
          case 'left':
            top = `${rect.top + (rect.height / 2)}px`
            left = `${rect.left - (cardWidth + 20)}px`
            break
          case 'right':
            top = `${rect.top + (rect.height / 2)}px`
            left = `${rect.right + 20}px`
            break
        }
        
        // Ensure the card stays within viewport bounds
        const constrained = constrainToViewport(parseFloat(left), parseFloat(top))
        left = `${constrained.x}px`
        top = `${constrained.y}px`
      }
      
      setPosition({ top, left })
    }
    
    // Initial position calculation with a slight delay to ensure DOM is ready
    const timer = setTimeout(updatePosition, 100)
    
    // Update position when window is resized or scrolled
    let requestId: number | null = null
    
    const handleUpdate = () => {
      if (requestId) return
      
      requestId = window.requestAnimationFrame(() => {
        updatePosition()
        requestId = null
      })
    }
    
    window.addEventListener('resize', handleUpdate)
    window.addEventListener('scroll', handleUpdate)
    
    return () => {
      window.removeEventListener('resize', handleUpdate)
      window.removeEventListener('scroll', handleUpdate)
      clearTimeout(timer)
      if (requestId) window.cancelAnimationFrame(requestId)
    }
  }, [step, cardWidth])

  return (
    <div 
      ref={cardRef}
      className="fixed z-[101] transition-all duration-300 ease-out transform -translate-x-1/2 -translate-y-1/2"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <Card className={`
        p-4 md:p-6 shadow-xl border-[1.5px] border-primary/30
        bg-card/90 backdrop-blur 
        transition-all animate-in fade-in zoom-in-95 
        duration-300 rounded-xl
      `}
      style={{ width: `${cardWidth}px`, maxWidth: '95vw' }}
      >
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <div className="bg-primary/15 dark:bg-primary/20 p-2 md:p-2.5 rounded-full shrink-0">
            {step.icon}
          </div>
          <h3 className="text-base md:text-lg font-semibold tracking-tight">{step.title}</h3>
        </div>
        
        <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-5 leading-relaxed">
          {step.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-1 overflow-x-auto pb-1 -mb-1 max-w-[40%]">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div 
                key={idx} 
                className={`
                  h-1 md:h-1.5 w-4 md:w-6 rounded-full transition-colors duration-300 flex-shrink-0
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
                className="border-primary/30 hover:bg-primary/10 text-xs md:text-sm py-1 h-8"
              >
                <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 md:mr-1" /> 
                <span className="hidden md:inline">Anterior</span>
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={onNext} 
              className="gap-1 text-xs md:text-sm py-1 h-8"
            >
              {currentStep < totalSteps - 1 ? (
                <>
                  <span className="hidden md:inline">Próximo</span>
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
  )
}