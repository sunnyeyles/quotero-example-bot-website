"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { LocationDetails, SUBURBS } from "./types";
import { StepNotes } from "./step-notes";

interface StepTwoProps {
  data: LocationDetails;
  notes: string;
  onDataChange: (data: LocationDetails) => void;
  onNotesChange: (stepKey: string, notes: string) => void;
}

export function StepTwo({
  data,
  notes,
  onDataChange,
  onNotesChange,
}: StepTwoProps) {
  const [open, setOpen] = useState(false);

  const handleSuburbSelect = (suburb: string) => {
    const suburbData = SUBURBS.find((s) => s.name === suburb);
    onDataChange({
      suburb,
      postcode: suburbData?.postcode || "",
    });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Location Details</h2>
        <p className="text-muted-foreground">
          Please select your suburb so we can provide accurate pricing and
          scheduling.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Suburb *</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {data.suburb || "Select suburb..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search suburbs..." />
              <CommandEmpty>No suburb found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {SUBURBS.map((suburb) => (
                  <CommandItem
                    key={suburb.name}
                    value={suburb.name}
                    onSelect={() => handleSuburbSelect(suburb.name)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        data.suburb === suburb.name
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span>{suburb.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {suburb.postcode}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {data.suburb && (
        <div className="space-y-2">
          <Label htmlFor="postcode" className="text-sm font-medium">
            Postcode
          </Label>
          <Input
            id="postcode"
            value={data.postcode}
            disabled
            className="bg-muted"
          />
        </div>
      )}

      <StepNotes
        stepKey="step2"
        notes={notes}
        onNotesChange={onNotesChange}
        placeholder="Any specific location details or access information..."
      />
    </div>
  );
}
