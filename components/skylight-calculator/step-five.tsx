"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { RoofDetails } from "./types";
import { StepNotes } from "./step-notes";

interface StepFiveProps {
  data: RoofDetails;
  notes: string;
  onDataChange: (data: RoofDetails) => void;
  onNotesChange: (stepKey: string, notes: string) => void;
}

export function StepFive({
  data,
  notes,
  onDataChange,
  onNotesChange,
}: StepFiveProps) {
  const handlePitchChange = (pitch: "flat" | "pitched" | "steep") => {
    onDataChange({ ...data, pitch });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Roof Pitch</h2>
        <p className="text-muted-foreground">
          What is the pitch (angle) of your roof? This affects installation
          complexity and skylight options.
        </p>
      </div>

      <RadioGroup
        value={data.pitch}
        onValueChange={handlePitchChange}
        className="space-y-4"
      >
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="flat" id="flat" />
              <div className="flex-1">
                <Label
                  htmlFor="flat"
                  className="text-base font-medium cursor-pointer"
                >
                  Flat Roof
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Minimal slope (0-10 degrees). Requires special installation
                  techniques.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="pitched" id="pitched" />
              <div className="flex-1">
                <Label
                  htmlFor="pitched"
                  className="text-base font-medium cursor-pointer"
                >
                  Pitched Roof
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Standard residential pitch (10-30 degrees). Most common roof
                  type.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="steep" id="steep" />
              <div className="flex-1">
                <Label
                  htmlFor="steep"
                  className="text-base font-medium cursor-pointer"
                >
                  Steep Roof
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  High pitch (30+ degrees). Requires specialised safety
                  equipment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </RadioGroup>

      <StepNotes
        stepKey="step5"
        notes={notes}
        onNotesChange={onNotesChange}
        placeholder="Any specific details about your roof pitch or access challenges..."
      />
    </div>
  );
}
