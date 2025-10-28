"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyDetails } from "./types";
import { StepNotes } from "./step-notes";

interface StepEightProps {
  data: PropertyDetails;
  notes: string;
  onDataChange: (data: PropertyDetails) => void;
  onNotesChange: (stepKey: string, notes: string) => void;
}

export function StepEight({
  data,
  notes,
  onDataChange,
  onNotesChange,
}: StepEightProps) {
  const handleStoreysChange = (storeys: "single" | "double") => {
    onDataChange({ ...data, storeys });
  };

  const handleInspectionChange = (
    inspectionAvailability: "weekdays" | "weekends" | "flexible"
  ) => {
    onDataChange({ ...data, inspectionAvailability });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Property Details</h2>
        <p className="text-muted-foreground">
          Help us understand your property and schedule preferences.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Number of Storeys *
          </Label>
          <RadioGroup
            value={data.storeys}
            onValueChange={handleStoreysChange}
            className="space-y-3"
          >
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="single" id="single" />
                  <div className="flex-1">
                    <Label
                      htmlFor="single"
                      className="text-base font-medium cursor-pointer"
                    >
                      Single Storey
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ground level installation, easier access and lower cost.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="double" id="double" />
                  <div className="flex-1">
                    <Label
                      htmlFor="double"
                      className="text-base font-medium cursor-pointer"
                    >
                      Double Storey
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upper level installation, requires additional safety
                      equipment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">
            Inspection Availability *
          </Label>
          <RadioGroup
            value={data.inspectionAvailability}
            onValueChange={handleInspectionChange}
            className="space-y-3"
          >
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="weekdays" id="weekdays" />
                  <div className="flex-1">
                    <Label
                      htmlFor="weekdays"
                      className="text-base font-medium cursor-pointer"
                    >
                      Weekdays Only
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monday to Friday availability for site inspection.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="weekends" id="weekends" />
                  <div className="flex-1">
                    <Label
                      htmlFor="weekends"
                      className="text-base font-medium cursor-pointer"
                    >
                      Weekends Only
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Saturday and Sunday availability for site inspection.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <div className="flex-1">
                    <Label
                      htmlFor="flexible"
                      className="text-base font-medium cursor-pointer"
                    >
                      Flexible
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Available any day of the week for site inspection.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </div>
      </div>

      <StepNotes
        stepKey="step8"
        notes={notes}
        onNotesChange={onNotesChange}
        placeholder="Any specific property details or access requirements..."
      />
    </div>
  );
}
