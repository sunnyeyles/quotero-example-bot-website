"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonalDetails } from "./types";
import { StepNotes } from "./step-notes";

interface StepOneProps {
  data: PersonalDetails;
  notes: string;
  onDataChange: (data: PersonalDetails) => void;
  onNotesChange: (stepKey: string, notes: string) => void;
}

export function StepOne({
  data,
  notes,
  onDataChange,
  onNotesChange,
}: StepOneProps) {
  const handleChange = (field: keyof PersonalDetails, value: string) => {
    onDataChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Personal Details</h2>
        <p className="text-muted-foreground">
          Please provide your contact information so we can get in touch with
          you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name *
          </Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name *
          </Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Enter your email address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">
          Phone Number *
        </Label>
        <Input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Enter your phone number"
          required
        />
      </div>

      <StepNotes
        stepKey="step1"
        notes={notes}
        onNotesChange={onNotesChange}
        placeholder="Any additional contact preferences or information..."
      />
    </div>
  );
}
