"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaintingDetails } from "./types";

interface StepOneProps {
  data: PaintingDetails;
  onDataChange: (data: Partial<PaintingDetails>) => void;
}

export function StepOne({ data, onDataChange }: StepOneProps) {
  const handleScopeChange = (scope: "interior" | "exterior" | "both") => {
    onDataChange({ scope });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Project Scope</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select whether this is an interior or exterior painting project.
        </p>

        <RadioGroup
          value={data.scope}
          onValueChange={handleScopeChange}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="interior" id="interior" />
            <Label htmlFor="interior" className="text-base">
              Interior Painting
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="exterior" id="exterior" />
            <Label htmlFor="exterior" className="text-base">
              Exterior Painting
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both" className="text-base">
              Both
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
