"use client";

import React, {
  useState,
  Children,
  useRef,
  useLayoutEffect,
  HTMLAttributes,
  ReactNode,
} from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface FormStepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepNames?: string[];
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  showFinalStepButtons?: boolean;
}

export default function FormStepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepNames = [],
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  showFinalStepButtons = true,
  ...rest
}: FormStepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  const handleBreadcrumbClick = (step: number) => {
    if (step !== currentStep && step <= totalSteps) {
      setDirection(step > currentStep ? 1 : -1);
      updateStep(step);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4" {...rest}>
      <Card className="border-2 border-border bg-white">
        <CardContent className="p-4">
          {/* Breadcrumb Navigation */}
          <div className="mb-6 flex justify-center">
            <Breadcrumb>
              <BreadcrumbList>
                {(() => {
                  const items = [];
                  const totalSteps = stepsArray.length;

                  // Always show first step
                  const firstStep = 1;
                  const isFirstCurrent = firstStep === currentStep;
                  const isFirstCompleted = firstStep < currentStep;
                  const firstStepName = stepNames[0] || `Step ${firstStep}`;

                  items.push(
                    <BreadcrumbItem key={firstStep}>
                      {isFirstCurrent ? (
                        <BreadcrumbPage className="text-primary font-semibold">
                          {firstStepName}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          onClick={() => handleBreadcrumbClick(firstStep)}
                          className={cn(
                            "cursor-pointer",
                            isFirstCompleted && "text-success"
                          )}
                        >
                          {firstStepName}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  );

                  if (totalSteps > 1) {
                    items.push(<BreadcrumbSeparator key="sep1" />);
                  }

                  // Show middle steps with ellipsis if needed
                  if (totalSteps > 3) {
                    // Show ellipsis if current step is not near the beginning or end
                    if (currentStep > 2 && currentStep < totalSteps - 1) {
                      items.push(
                        <BreadcrumbItem key="ellipsis1">
                          <BreadcrumbEllipsis />
                        </BreadcrumbItem>
                      );
                      items.push(<BreadcrumbSeparator key="sep2" />);
                    }

                    // Show current step (if not first or last)
                    if (currentStep > 1 && currentStep < totalSteps) {
                      const currentStepName =
                        stepNames[currentStep - 1] || `Step ${currentStep}`;
                      items.push(
                        <BreadcrumbItem key={currentStep}>
                          <BreadcrumbPage className="text-primary font-semibold">
                            {currentStepName}
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      );
                      items.push(<BreadcrumbSeparator key="sep3" />);
                    }

                    // Show ellipsis if current step is not near the end
                    if (currentStep < totalSteps - 1) {
                      items.push(
                        <BreadcrumbItem key="ellipsis2">
                          <BreadcrumbEllipsis />
                        </BreadcrumbItem>
                      );
                      items.push(<BreadcrumbSeparator key="sep4" />);
                    }
                  } else {
                    // Show all steps if 3 or fewer
                    for (let i = 2; i <= totalSteps; i++) {
                      const isCurrent = i === currentStep;
                      const isCompleted = i < currentStep;
                      const stepName = stepNames[i - 1] || `Step ${i}`;

                      items.push(
                        <BreadcrumbItem key={i}>
                          {isCurrent ? (
                            <BreadcrumbPage className="text-primary font-semibold">
                              {stepName}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink
                              onClick={() => handleBreadcrumbClick(i)}
                              className={cn(
                                "cursor-pointer",
                                isCompleted && "text-success"
                              )}
                            >
                              {stepName}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      );

                      if (i < totalSteps) {
                        items.push(<BreadcrumbSeparator key={`sep${i}`} />);
                      }
                    }
                  }

                  // Show last step only when we are in the condensed (ellipsis) mode to avoid duplicates
                  if (totalSteps > 3) {
                    const lastStep = totalSteps;
                    const isLastCurrent = lastStep === currentStep;
                    const isLastCompleted = lastStep < currentStep;
                    const lastStepName =
                      stepNames[lastStep - 1] || `Step ${lastStep}`;

                    items.push(
                      <BreadcrumbItem key={lastStep}>
                        {isLastCurrent ? (
                          <BreadcrumbPage className="text-primary font-semibold">
                            {lastStepName}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            onClick={() => handleBreadcrumbClick(lastStep)}
                            className={cn(
                              "cursor-pointer",
                              isLastCompleted && "text-success"
                            )}
                          >
                            {lastStepName}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    );
                  }

                  return items;
                })()}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Content with Sliding Animation */}
          <StepContentWrapper
            isCompleted={isCompleted}
            currentStep={currentStep}
            direction={direction}
            className={cn("py-4", contentClassName)}
          >
            {stepsArray[currentStep - 1]}
          </StepContentWrapper>

          {/* Navigation Buttons */}
          {!isCompleted && !isLastStep && (
            <div
              className={cn(
                "mt-4 pt-4 border-t border-border/50",
                footerClassName
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-4",
                  currentStep !== 1 ? "justify-between" : "justify-end"
                )}
              >
                {currentStep !== 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    {...backButtonProps}
                  >
                    {backButtonText}
                  </Button>
                )}
                <Button onClick={handleNext} {...nextButtonProps}>
                  {nextButtonText}
                </Button>
              </div>
            </div>
          )}

          {!isCompleted && isLastStep && showFinalStepButtons && (
            <div
              className={cn(
                "mt-4 pt-4 border-t border-border/50",
                footerClassName
              )}
            >
              <div className="flex items-center justify-between">
                {currentStep !== 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    {...backButtonProps}
                  >
                    {backButtonText}
                  </Button>
                )}
                <Button
                  onClick={handleComplete}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-2"
                  {...nextButtonProps}
                >
                  Generate Quote
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className,
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (h: number) => void;
}

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="absolute left-0 right-0 top-0"
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "-50%" : "50%",
    opacity: 0,
  }),
};

interface StepProps {
  children: ReactNode;
}

export function Step({ children }: StepProps): JSX.Element {
  return <div className="p-3">{children}</div>;
}
