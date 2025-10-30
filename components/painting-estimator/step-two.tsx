"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/shadcn-studio/input/input-40";
import { RoomDimensions } from "./types";

interface StepTwoProps {
  data: RoomDimensions;
  onDataChange: (data: RoomDimensions) => void;
}

export function StepTwo({ data, onDataChange }: StepTwoProps) {
  const handleDimensionChange = (
    field: keyof RoomDimensions,
    value: number
  ) => {
    const numValue = typeof value === "number" && !isNaN(value) ? value : 0;
    onDataChange({ ...data, [field]: numValue });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Room Dimensions</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Enter the dimensions of the room or area to be painted in metres.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="length">Length (m)</Label>
            <NumberInput
              id="length"
              label={undefined}
              step={0.1}
              minValue={0}
              value={data.length || 0}
              onChange={(v) => handleDimensionChange("length", v)}
              inputClassName="text-left"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">Width (m)</Label>
            <NumberInput
              id="width"
              step={0.1}
              minValue={0}
              value={data.width || 0}
              onChange={(v) => handleDimensionChange("width", v)}
              inputClassName="text-left"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (m)</Label>
            <NumberInput
              id="height"
              step={0.1}
              minValue={0}
              value={data.height || 0}
              onChange={(v) => handleDimensionChange("height", v)}
              inputClassName="text-left"
            />
          </div>
        </div>

        {data.length > 0 && data.width > 0 && data.height > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Area Calculation Preview:</h4>
            <div className="text-sm space-y-1">
              <p>
                Wall Area:{" "}
                {((data.length + data.width) * 2 * data.height).toFixed(1)} m²
              </p>
              <p>Ceiling Area: {(data.length * data.width).toFixed(1)} m²</p>
              <p>
                Total Area:{" "}
                {(
                  (data.length + data.width) * 2 * data.height +
                  data.length * data.width
                ).toFixed(1)}{" "}
                m²
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
