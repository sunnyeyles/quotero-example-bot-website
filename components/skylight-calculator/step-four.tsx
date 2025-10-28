"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { RoofDetails } from "./types";
import { StepNotes } from "./step-notes";

interface StepFourProps {
  data: RoofDetails;
  notes: string;
  onDataChange: (data: RoofDetails) => void;
  onNotesChange: (stepKey: string, notes: string) => void;
}

export function StepFour({
  data,
  notes,
  onDataChange,
  onNotesChange,
}: StepFourProps) {
  const handleTypeChange = (type: "tile" | "metal" | "other") => {
    onDataChange({ ...data, type });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Roof Type</h2>
        <p className="text-muted-foreground">
          What type of roof do you have? This affects installation complexity
          and pricing.
        </p>
      </div>

      <RadioGroup
        value={data.type}
        onValueChange={handleTypeChange}
        className="space-y-4"
      >
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="tile" id="tile" />
              <div className="flex-1">
                <Label
                  htmlFor="tile"
                  className="text-base font-medium cursor-pointer"
                >
                  Tile Roof
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Traditional tile roofing (clay, concrete, or terracotta tiles)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="metal" id="metal" />
              <div className="flex-1">
                <Label
                  htmlFor="metal"
                  className="text-base font-medium cursor-pointer"
                >
                  Metal Roof
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Metal roofing (Colorbond, zinc, or other metal materials)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="other" id="other" />
              <div className="flex-1">
                <Label
                  htmlFor="other"
                  className="text-base font-medium cursor-pointer"
                >
                  Other
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Other roofing materials (slate, shingles, etc.)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </RadioGroup>

      <StepNotes
        stepKey="step4"
        notes={notes}
        onNotesChange={onNotesChange}
        placeholder="Any specific details about your roof type or condition..."
      />
    </div>
  );
}
