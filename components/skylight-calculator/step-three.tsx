"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { InstallationType } from "./types";
import { StepNotes } from "./step-notes";

interface StepThreeProps {
  data: InstallationType;
  notes: string;
  onDataChange: (data: InstallationType) => void;
  onNotesChange: (stepKey: string, notes: string) => void;
}

export function StepThree({
  data,
  notes,
  onDataChange,
  onNotesChange,
}: StepThreeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Installation Type</h2>
        <p className="text-muted-foreground">
          Choose the type of skylight installation you need.
        </p>
      </div>

      <RadioGroup
        value={data.type}
        onValueChange={(value: "roof-only" | "complete") =>
          onDataChange({ type: value })
        }
        className="space-y-4"
      >
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="roof-only" id="roof-only" />
              <div className="flex-1">
                <Label
                  htmlFor="roof-only"
                  className="text-base font-medium cursor-pointer"
                >
                  Roof Installation Only
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  We&apos;ll install the skylight in your roof only. You&apos;ll
                  need to arrange interior finishing separately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="complete" id="complete" />
              <div className="flex-1">
                <Label
                  htmlFor="complete"
                  className="text-base font-medium cursor-pointer"
                >
                  Complete Skylight Installation
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Full installation including roof work and interior finishing.
                  Everything handled by our team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </RadioGroup>

      <StepNotes
        stepKey="step3"
        notes={notes}
        onNotesChange={onNotesChange}
        placeholder="Any specific installation requirements or preferences..."
      />
    </div>
  );
}
