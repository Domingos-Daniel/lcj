"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle2,
  User,
  Lock,
  CreditCard,
  Settings,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import confetti from 'canvas-confetti'; // Import canvas-confetti

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  target: string;
}

interface ProfileTutorialOverlayProps {
  onClose: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Seu Perfil",
    description: "Bem-vindo(a) à página do seu perfil! Aqui você pode gerenciar suas informações pessoais, assinatura e segurança.",
    target: ".md\\:col-span-1 > div", // Targeting the profile card
  },
  {
    id: 2,
    title: "Dados Pessoais",
    description: "Na aba 'Perfil', você pode atualizar seus dados como nome, email e telefone.",
    target: "TabsTrigger[value='profile']", // Targeting the Profile tab
  },
  {
    id: 3,
    title: "Editar Perfil",
    description: "Clique no botão de editar para modificar suas informações. Não se esqueça de salvar as alterações!",
    target: "div[class*='CardHeader'] > div > button", // Targeting the edit button
  },
  {
    id: 4,
    title: "Gerenciar Plano",
    description: "Na aba 'Plano', você pode verificar os detalhes da sua assinatura atual.",
    target: "TabsTrigger[value='membership']", // Targeting the Membership tab
  },
  {
    id: 5,
    title: "Histórico de Pagamentos",
    description: "A aba 'Pagamentos' mostra o histórico de suas transações.",
    target: "TabsTrigger[value='payments']", // Targeting the Payments tab
  },
  {
    id: 6,
    title: "Segurança da Conta",
    description: "Na aba 'Segurança', você pode alterar sua senha para manter sua conta protegida.",
    target: "TabsTrigger[value='security']", // Targeting the Security tab
  },
  {
    id: 7,
    title: "Sair da Conta",
    description: "Para sair da sua conta, basta clicar no botão 'Sair da conta' no seu perfil.",
    target: "CardFooter > Button[variant='outline']", // Targeting the logout button
  },
];

const ProfileTutorialOverlay: React.FC<ProfileTutorialOverlayProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false); // State for tutorial completion
  const currentStep = tutorialSteps.find(s => s.id === step) || tutorialSteps[0];
  const targetElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    targetElement.current = document.querySelector(currentStep.target) as HTMLElement;
    console.log(`Step ${step} target:`, currentStep.target, "Element:", targetElement.current); // Debugging
  }, [currentStep.target, step]);

  const runConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const goToNextStep = () => {
    if (step < tutorialSteps.length) {
      setStep(step + 1);
    } else {
      setCompleted(true); // Set completed to true when tutorial finishes
      runConfetti(); // Trigger confetti
      setTimeout(() => {
        onClose();
      }, 3000); // Close after 3 seconds
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
      <Card className="relative w-[90%] max-w-md">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <XCircle className="h-4 w-4" />
        </Button>
        <div className="p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">{currentStep.title}</h2>
          <p className="text-sm text-gray-500 mb-4">{currentStep.description}</p>
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousStep}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <Button size="sm" onClick={goToNextStep}>
              {step === tutorialSteps.length ? (
                <>
                  Concluir
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileTutorialOverlay;