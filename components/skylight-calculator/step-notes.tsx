"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface StepNotesProps {
  stepKey: string;
  notes: string;
  onNotesChange: (stepKey: string, notes: string) => void;
  placeholder?: string;
}

export function StepNotes({
  stepKey,
  notes,
  onNotesChange,
  placeholder,
}: StepNotesProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`notes-${stepKey}`} className="text-sm font-medium">
        Additional Notes (Optional)
      </Label>
      <Textarea
        id={`notes-${stepKey}`}
        placeholder={
          placeholder ||
          "Add any additional information or special requirements..."
        }
        value={notes}
        onChange={(e) => onNotesChange(stepKey, e.target.value)}
        className="min-h-[80px] resize-none"
      />
    </div>
  );
}
