"use client";

import { useState, useCallback } from "react";
import { BotData } from "@/lib/types";

export interface UseBotStepsOptions {
  botData: BotData;
  manualTrainingData: string;
  initialStep?: number;
}

export interface UseBotStepsReturn {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  canProceedToNext: () => boolean;
}

export function useBotSteps({
  botData,
  manualTrainingData,
  initialStep = 1,
}: UseBotStepsOptions): UseBotStepsReturn {
  const [currentStep, setCurrentStep] = useState(initialStep);

  // Step validation functions - all steps are optional, always allow proceeding
  const isStep1Valid = useCallback(() => {
    return true;
  }, []);

  const isStep2Valid = useCallback(() => {
    return true;
  }, []);

  const isStep3Valid = useCallback(() => {
    return true;
  }, []);

  const isStep4Valid = useCallback(() => {
    return true;
  }, []);

  const nextStep = useCallback(async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const canProceedToNext = useCallback(() => {
    switch (currentStep) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      case 4:
        return isStep4Valid();
      default:
        return false;
    }
  }, [currentStep, isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid]);

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    canProceedToNext,
  };
}

