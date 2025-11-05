"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface Step3StyleBotProps {
  borderRadius: string;
  setBorderRadius: (value: string) => void;
  font: string;
  setFont: (value: string) => void;
  onReset: () => void;
}

export function Step3StyleBot({ onReset }: Step3StyleBotProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
        <Button variant="outline" onClick={onReset} type="button">
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}
