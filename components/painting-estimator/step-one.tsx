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
import { PaintingDetails, ROOM_TYPES } from "./types";

interface StepOneProps {
  data: PaintingDetails;
  onDataChange: (data: Partial<PaintingDetails>) => void;
}

export function StepOne({ data, onDataChange }: StepOneProps) {
  const handleScopeChange = (scope: "interior" | "exterior") => {
    onDataChange({ scope });
  };

  const handleRoomTypeChange = (roomType: string) => {
    onDataChange({ roomType });
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
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Room Type</h3>
        <p className="text-sm text-muted-foreground mb-4">
          What type of room or area are you painting?
        </p>

        <Select value={data.roomType} onValueChange={handleRoomTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            {ROOM_TYPES.map((roomType) => (
              <SelectItem key={roomType} value={roomType}>
                {roomType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
