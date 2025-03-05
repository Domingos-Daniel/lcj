"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Grid, List, Filter, ChevronLeft, ChevronRight, XCircle, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import confetti from 'canvas-confetti'

interface TutorialStep {
  title: string
  description: string
  targetId: string
  icon: React.ReactNode
  position: 'top' | 'bottom' | 'left' | 'right'
}

interface TutorialOverlayProps {
  pageKey: string
}

export function TutorialOverlay({ pageKey }: TutorialOverlayProps) {
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const { theme } = useTheme()
  
  // Tutorial steps specific to the archives page
  const tutorialSteps: TutorialStep[] = [
    {
      title: "Pesquisa",
      description: "Digite palavras-chave para encontrar documentos específicos rapidamente.",
      targetId: "search-field",
      icon: <Search className="h-6 w-6" />,
      position: "bottom"
    },
    {
      title: "Filtros",
      description: "Use os filtros para refinar sua busca por categoria, data ou tipo de documento.",
      targetId: "filters-button",
      icon: <Filter className="h-6 w-6" />,
      position: "right"
    },
    {
      title: "Visualização",
      description: "Alterne entre visualização em grade ou lista conforme sua preferência.",
      targetId: "view-toggle",
      icon: <><Grid className="h-6 w-6 inline-block" /><List className="h-6 w-6 inline-block ml-2" /></>,
      position: "left"
    },
    {
      title: "Navegação",
      description: "Use a paginação para explorar todos os documentos disponíveis.",
      targetId: "pagination",
      icon: <><ChevronLeft className="h-4 w-4 inline-block" /><ChevronRight className="h-4 w-4 inline-block ml-2" /></>,
      position: "top"
    }
  ]

  useEffect(() => {
    // Check if tutorial has been shown before for this page
    const hasTutorialBeenShown = localStorage.getItem(`tutorial-${pageKey}`)
    
    // For development: uncommemt to always show tutorial
    // localStorage.removeItem(`tutorial-${pageKey}`)
    
    if (!hasTutorialBeenShown) {
      // Wait for the components to render before showing tutorial
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
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [pageKey])

  const completeTutorial = () => {
    // Show celebration message instead of immediately closing
    setShowCelebration(true)
    
    // Trigger confetti
    triggerConfetti()
    
    // Save to localStorage so tutorial doesn't show again
    localStorage.setItem(`tutorial-${pageKey}`, 'true')
    
    // Close the tutorial after celebration (3 seconds)
    setTimeout(() => {
      setShowTutorial(false)
      setShowCelebration(false)
    }, 3000)
  }

  const skipTutorial = () => {
    localStorage.setItem(`tutorial-${pageKey}`, 'true')
    setShowTutorial(false)
  }

  const triggerConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      // Trigger confetti from random positions
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
    }, 250)
  }

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      const nextStepIndex = currentStep + 1
      setCurrentStep(nextStepIndex)
      
      // Scroll to the next element
      const element = document.getElementById(tutorialSteps[nextStepIndex].targetId)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    } else {
      completeTutorial()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1
      setCurrentStep(prevStepIndex)
      
      // Scroll to the previous element
      const element = document.getElementById(tutorialSteps[prevStepIndex].targetId)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  }

  if (!showTutorial) return null

  if (showCelebration) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/30 dark:bg-black/50 flex items-center justify-center transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-background/80 dark:from-primary/20 dark:to-background/90"></div>
        
        <Card className="w-[90%] max-w-md p-8 text-center shadow-xl border-[1.5px] border-primary/30 z-[101] animate-in fade-in scale-in-95 duration-300">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Parabéns!</h2>
          <p className="text-muted-foreground mb-6">
            Você concluiu o tutorial e agora está pronto para explorar todos os recursos do nosso sistema!
          </p>
          <Button 
            className="min-w-[150px]"
            onClick={() => {
              setShowTutorial(false)
              setShowCelebration(false)
            }}
          >
            Começar a explorar
          </Button>
        </Card>
      </div>
    )
  }

  const step = tutorialSteps[currentStep]
  return (
    <div className="fixed inset-0 z-[100] bg-black/30 dark:bg-black/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/80 dark:from-primary/10 dark:to-background/90"></div>
      
      {/* Spotlight effect on the target element - no blur */}
      <SpotlightHighlight targetId={step.targetId} />
      
      {/* Tutorial popup */}
      <FocusedTutorialCard
        step={step}
        currentStep={currentStep}
        totalSteps={tutorialSteps.length}
        onPrev={prevStep}
        onNext={nextStep}
        theme={theme}
      />
      
      {/* Skip button - now responsive */}
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

  useEffect(() => {
    const updatePosition = () => {
      const element = document.getElementById(targetId)
      if (!element) return
      
      const rect = element.getBoundingClientRect()
      setPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      })
    }
    
    updatePosition()
    
    // Update on resize and scroll
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)
    
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [targetId])

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
        // Remove backdrop-filter to prevent blur
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
  const isDark = theme === 'dark'
  
  // Handle responsive card width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 380) {
        setCardWidth(260) // Narrower on very small devices
      } else if (window.innerWidth < 640) {
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
      
      // Check if element is pagination and adjust position
      if (step.targetId === 'pagination') {
        // Special case for pagination to ensure it's always visible
        if (isMobile) {
          // For mobile, position above the element
          top = `${Math.max(rect.top - 180, 100)}px`
        } else {
          top = `${Math.min(rect.top - 180, viewportHeight - 300)}px`
        }
        left = `${rect.left + (rect.width / 2)}px`
      } else {
        // Responsive positioning based on screen size and element position
        if (isMobile) {
          // On mobile, prefer positioning above or below the element
          if (rect.top > viewportHeight / 2) {
            // Element is in bottom half, position above
            top = `${Math.max(rect.top - 180, 80)}px`
          } else {
            // Element is in top half, position below
            top = `${Math.min(rect.bottom + 20, viewportHeight - 200)}px`
          }
          left = `${Math.min(Math.max(viewportWidth / 2, rect.left), viewportWidth - 20)}px`
        } else {
          // On desktop, use the specified position with bounds checking
          switch (step.position) {
            case 'top':
              top = `${Math.max(rect.top - 220, 100)}px`
              left = `${rect.left + (rect.width / 2)}px`
              break
            case 'bottom':
              top = `${Math.min(rect.bottom + 20, viewportHeight - 200)}px`
              left = `${rect.left + (rect.width / 2)}px`
              break
            case 'left':
              top = `${rect.top + (rect.height / 2)}px`
              left = `${Math.max(rect.left - (cardWidth + 40), 20)}px`
              break
            case 'right':
              top = `${rect.top + (rect.height / 2)}px`
              left = `${Math.min(rect.right + 20, viewportWidth - cardWidth - 20)}px`
              break
          }
        }
      }
      
      setPosition({ top, left })
    }
    
    // Initial position calculation
    const timer = setTimeout(updatePosition, 100)
    
    // Update position when window is resized or scrolled
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
      clearTimeout(timer)
    }
  }, [step, cardWidth])

  return (
    <div 
      className="absolute z-[101] transition-all duration-300 ease-out"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Card className={`
        p-4 md:p-6 shadow-xl border-[1.5px] border-primary/30
        bg-card/90 backdrop-blur 
        transition-all animate-in fade-in zoom-in-95 
        duration-300 rounded-xl
      `}
      style={{ width: `${cardWidth}px` }}
      >
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <div className="bg-primary/15 dark:bg-primary/20 p-2 md:p-2.5 rounded-full">
            {step.icon}
          </div>
          <h3 className="text-base md:text-lg font-semibold tracking-tight">{step.title}</h3>
        </div>
        
        <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-5 leading-relaxed">
          {step.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div 
                key={idx} 
                className={`
                  h-1 md:h-1.5 w-4 md:w-6 rounded-full transition-colors duration-300
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