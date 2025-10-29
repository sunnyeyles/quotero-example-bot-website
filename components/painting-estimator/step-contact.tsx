"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { ContactDetails } from "./types";

interface ContactDetailsStepProps {
  data: ContactDetails;
  onDataChange: (data: Partial<ContactDetails>) => void;
}

export function ContactDetailsStep({
  data,
  onDataChange,
}: ContactDetailsStepProps) {
  const handleInputChange = (field: keyof ContactDetails, value: string) => {
    onDataChange({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <p className="text-muted-foreground">
          Please provide your contact details so we can send you the quote and
          follow up.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Full Name *</Label>
            <Input
              id="clientName"
              value={data.clientName}
              onChange={(e) => handleInputChange("clientName", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={data.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter your street address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="suburb">Suburb *</Label>
            <Input
              id="suburb"
              value={data.suburb}
              onChange={(e) => handleInputChange("suburb", e.target.value)}
              placeholder="Enter your suburb"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Combobox
              options={[
                { value: "NSW", label: "New South Wales" },
                { value: "VIC", label: "Victoria" },
                { value: "QLD", label: "Queensland" },
                { value: "WA", label: "Western Australia" },
                { value: "SA", label: "South Australia" },
                { value: "TAS", label: "Tasmania" },
                { value: "ACT", label: "Australian Capital Territory" },
                { value: "NT", label: "Northern Territory" },
              ]}
              value={data.state}
              onValueChange={(value) => handleInputChange("state", value)}
              placeholder="Select your state"
              searchPlaceholder="Search states..."
              emptyMessage="No state found."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postcode">Postcode *</Label>
            <Input
              id="postcode"
              value={data.postcode}
              onChange={(e) => handleInputChange("postcode", e.target.value)}
              placeholder="Enter your postcode"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
