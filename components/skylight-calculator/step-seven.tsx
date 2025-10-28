"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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
import { Plus, Trash2 } from "lucide-react";
import { AdditionalSkylight, SKYLIGHT_SIZES } from "./types";
import { StepNotes } from "./step-notes";

interface StepSevenProps {
  data: AdditionalSkylight[];
  roofPitch: "flat" | "pitched" | "steep";
  notes: string;
  onDataChange: (data: AdditionalSkylight[]) => void;
  onNotesChange: (stepKey: string, notes: string) => void;
}

export function StepSeven({
  data,
  roofPitch,
  notes,
  onDataChange,
  onNotesChange,
}: StepSevenProps) {
  const isManualSolarAvailable =
    roofPitch === "pitched" || roofPitch === "steep";

  const addSkylight = () => {
    const newSkylight: AdditionalSkylight = {
      id: Date.now().toString(),
      type: "fixed",
      size: SKYLIGHT_SIZES[0],
    };
    onDataChange([...data, newSkylight]);
  };

  const removeSkylight = (id: string) => {
    onDataChange(data.filter((skylight) => skylight.id !== id));
  };

  const updateSkylight = (
    id: string,
    field: "type" | "size",
    value: string
  ) => {
    onDataChange(
      data.map((skylight) =>
        skylight.id === id ? { ...skylight, [field]: value } : skylight
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Additional Skylights</h2>
        <p className="text-muted-foreground">
          Add more skylights if needed. You can skip this step if you only need
          one skylight.
        </p>
      </div>

      {data.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No additional skylights added yet.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={addSkylight}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Another Skylight
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((skylight, index) => (
            <Card key={skylight.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Skylight {index + 2}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkylight(skylight.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Type
                    </Label>
                    <RadioGroup
                      value={skylight.type}
                      onValueChange={(
                        value: "fixed" | "electric" | "manual" | "solar"
                      ) => updateSkylight(skylight.id, "type", value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="fixed"
                          id={`fixed-${skylight.id}`}
                        />
                        <Label
                          htmlFor={`fixed-${skylight.id}`}
                          className="text-sm"
                        >
                          Fixed
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="electric"
                          id={`electric-${skylight.id}`}
                        />
                        <Label
                          htmlFor={`electric-${skylight.id}`}
                          className="text-sm"
                        >
                          Electric
                        </Label>
                      </div>
                      {isManualSolarAvailable && (
                        <>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="manual"
                              id={`manual-${skylight.id}`}
                            />
                            <Label
                              htmlFor={`manual-${skylight.id}`}
                              className="text-sm"
                            >
                              Manual
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="solar"
                              id={`solar-${skylight.id}`}
                            />
                            <Label
                              htmlFor={`solar-${skylight.id}`}
                              className="text-sm"
                            >
                              Solar
                            </Label>
                          </div>
                        </>
                      )}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`size-${skylight.id}`}
                      className="text-sm font-medium"
                    >
                      Size
                    </Label>
                    <Select
                      value={skylight.size}
                      onValueChange={(value) =>
                        updateSkylight(skylight.id, "size", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKYLIGHT_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}mm
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addSkylight}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Another Skylight
          </Button>
        </div>
      )}

      <StepNotes
        stepKey="step7"
        notes={notes}
        onNotesChange={onNotesChange}
        placeholder="Any specific requirements for additional skylights..."
      />
    </div>
  );
}
