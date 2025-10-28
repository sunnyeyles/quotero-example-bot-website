"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { SkylightDetails, SKYLIGHT_SIZES } from "./types";
import { StepNotes } from "./step-notes";

interface StepSixProps {
  data: SkylightDetails;
  roofPitch: "flat" | "pitched" | "steep";
  notes: string;
  onDataChange: (data: SkylightDetails) => void;
  onNotesChange: (stepKey: string, notes: string) => void;
}

export function StepSix({
  data,
  roofPitch,
  notes,
  onDataChange,
  onNotesChange,
}: StepSixProps) {
  const handleTypeChange = (
    type: "fixed" | "electric" | "manual" | "solar"
  ) => {
    onDataChange({ ...data, type });
  };

  const handleSizeChange = (size: string) => {
    onDataChange({ ...data, size });
  };

  const isManualSolarAvailable =
    roofPitch === "pitched" || roofPitch === "steep";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Skylight Type & Size</h2>
        <p className="text-muted-foreground">
          Choose the type and size of skylight you want to install.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Skylight Type *
          </Label>
          <RadioGroup
            value={data.type}
            onValueChange={handleTypeChange}
            className="space-y-3"
          >
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <div className="flex-1">
                    <Label
                      htmlFor="fixed"
                      className="text-base font-medium cursor-pointer"
                    >
                      Fixed Skylight
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Non-opening skylight for natural light only. Most
                      cost-effective option.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="electric" id="electric" />
                  <div className="flex-1">
                    <Label
                      htmlFor="electric"
                      className="text-base font-medium cursor-pointer"
                    >
                      Electric Skylight
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Motorized opening skylight with remote control. Perfect
                      for ventilation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isManualSolarAvailable && (
              <>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="manual" id="manual" />
                      <div className="flex-1">
                        <Label
                          htmlFor="manual"
                          className="text-base font-medium cursor-pointer"
                        >
                          Manual Skylight
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Hand-operated opening skylight. Available for pitched
                          roofs only.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="solar" id="solar" />
                      <div className="flex-1">
                        <Label
                          htmlFor="solar"
                          className="text-base font-medium cursor-pointer"
                        >
                          Solar Skylight
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Solar-powered opening skylight. Available for pitched
                          roofs only.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size" className="text-sm font-medium">
            Skylight Size *
          </Label>
          <Select value={data.size} onValueChange={handleSizeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select skylight size" />
            </SelectTrigger>
            <SelectContent>
              {SKYLIGHT_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}mm
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Size is measured in millimeters (width x height)
          </p>
        </div>
      </div>

      <StepNotes
        stepKey="step6"
        notes={notes}
        onNotesChange={onNotesChange}
        placeholder="Any specific requirements for skylight type or size..."
      />
    </div>
  );
}
