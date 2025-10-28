import React from "react";

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition-all duration-300 ${
                step <= currentStep
                  ? "bg-primary text-primary-foreground scale-110"
                  : "bg-muted text-muted-foreground scale-100"
              }`}
            >
              {step}
            </div>
            <div className="ml-4 text-sm font-semibold hidden sm:block max-w-32">
              {step === 1 && "Bot Identity & Appearance"}
              {step === 2 && "Content & Knowledge Feed"}
              {step === 3 && "Preview & Launch"}
            </div>
            <div className="ml-3 text-xs font-semibold sm:hidden">
              {step === 1 && "Identity"}
              {step === 2 && "Content"}
              {step === 3 && "Preview"}
            </div>
            {step < 3 && (
              <div
                className={`hidden sm:block w-20 h-1 mx-6 rounded-full transition-all duration-300 ${
                  step < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
