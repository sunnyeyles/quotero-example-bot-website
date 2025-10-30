"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NumberInput } from "@/components/shadcn-studio/input/input-40";
import { PaintQuality, PAINT_QUALITIES } from "./types";

interface StepThreeProps {
  paintQuality: PaintQuality;
  numberOfCoats: number;
  onPaintQualityChange: (quality: PaintQuality) => void;
  onNumberOfCoatsChange: (coats: number) => void;
}

export function StepThree({
  paintQuality,
  numberOfCoats,
  onPaintQualityChange,
  onNumberOfCoatsChange,
}: StepThreeProps) {
  const handleQualityChange = (quality: "good" | "better" | "best") => {
    const selectedQuality = PAINT_QUALITIES.find((q) => q.quality === quality);
    if (selectedQuality) {
      onPaintQualityChange({
        quality: selectedQuality.quality,
        pricePerLitre: selectedQuality.pricePerLitre,
      });
    }
  };

  const handleCoatsChange = (value: number) => {
    const coats = Number.isFinite(value) ? value : 2;
    onNumberOfCoatsChange(coats);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Paint Quality</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select the quality of paint you prefer. Higher quality paints offer
          better coverage and durability.
        </p>

        <RadioGroup
          value={paintQuality.quality}
          onValueChange={handleQualityChange}
          className="space-y-3"
        >
          {PAINT_QUALITIES.map((quality) => (
            <div key={quality.quality} className="flex items-center space-x-2">
              <RadioGroupItem value={quality.quality} id={quality.quality} />
              <Label htmlFor={quality.quality} className="text-base flex-1">
                <div className="flex justify-between items-center">
                  <span>{quality.label}</span>
                  <span className="text-muted-foreground">
                    ${quality.pricePerLitre}/L
                  </span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Number of Coats</h3>
        <p className="text-sm text-muted-foreground mb-4">
          How many coats of paint do you want? Most interior projects require 2
          coats for optimal coverage.
        </p>

        <div className="space-y-2">
          <Label htmlFor="coats">Number of Coats</Label>
          <NumberInput
            id="coats"
            minValue={1}
            maxValue={5}
            value={numberOfCoats}
            onChange={(v) => handleCoatsChange(v)}
            className="w-32"
          />
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Coverage Information:</h4>
          <div className="text-sm space-y-1">
            <p>• Standard coverage: 14 m² per litre (2 coats)</p>
            <p>• More coats = better coverage and durability</p>
            <p>• Primer may be required for new surfaces</p>
          </div>
        </div>
      </div>
    </div>
  );
}
