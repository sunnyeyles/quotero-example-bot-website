"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, MapPin } from "lucide-react";
import { QuoteFormData, PaintingCalculation } from "./types";

interface ClientQuoteCardProps {
  formData: QuoteFormData;
  calculation: PaintingCalculation;
  onBackToForm: () => void;
}

export function ClientQuoteCard({
  formData,
  calculation,
  onBackToForm,
}: ClientQuoteCardProps) {
  const { contactDetails, paintingDetails } = formData;
  const { dimensions } = paintingDetails;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  const formatHours = (hours: number) => {
    return hours.toFixed(1);
  };

  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case "good":
        return "Good Quality";
      case "better":
        return "Better Quality";
      case "best":
        return "Best Quality";
      default:
        return quality;
    }
  };

  return (
    <Card className="-mx-4 sm:mx-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2 text-foreground">
              <CheckCircle className="h-5 w-5" />
              Your Painting Estimate
            </CardTitle>
          </div>
          <Button variant="outline" onClick={onBackToForm} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Edit Details
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Project Summary */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="text-base font-semibold text-foreground mb-2">
            Project Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p>
                <strong>Room:</strong> {paintingDetails.roomType}
              </p>
              <p>
                <strong>Scope:</strong> {paintingDetails.scope}
              </p>
              <p>
                <strong>Dimensions:</strong> {dimensions.length}m ×{" "}
                {dimensions.width}m × {dimensions.height}m
              </p>
            </div>
            <div>
              <p>
                <strong>Paint Quality:</strong>{" "}
                {getQualityLabel(paintingDetails.paintQuality.quality)}
              </p>
              <p>
                <strong>Number of Coats:</strong>{" "}
                {paintingDetails.numberOfCoats}
              </p>
              <p>
                <strong>Total Area:</strong> {calculation.totalArea.toFixed(1)}{" "}
                m²
              </p>
            </div>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="text-base font-semibold text-foreground mb-2">
            Cost Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Materials & Paint</span>
              <span className="font-medium">
                {formatCurrency(calculation.materialsSubtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>
                Labour ({formatHours(calculation.totalLabourHours)} hours)
              </span>
              <span className="font-medium">
                {formatCurrency(calculation.labourSubtotal)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold text-foreground border-t pt-2">
              <span>Total Estimate</span>
              <span>{formatCurrency(calculation.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="text-base font-semibold text-foreground mb-2">
            What&apos;s Included
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              <span>High-quality paint</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              <span>Professional preparation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              <span>All tools & materials</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              <span>Clean up & disposal</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              <span>Quality guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              <span>Insurance coverage</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Estimated Timeline
          </h3>
          <div className="text-xs space-y-1">
            <p>
              <strong>Preparation:</strong> 1-2 days
            </p>
            <p>
              <strong>Painting:</strong>{" "}
              {Math.ceil(calculation.totalLabourHours / 8)} days
            </p>
            <p>
              <strong>Total Duration:</strong>{" "}
              {Math.ceil(calculation.totalLabourHours / 8) + 2} days
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Your Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p>
                <strong>Name:</strong> {contactDetails.clientName}
              </p>
              <p>
                <strong>Email:</strong> {contactDetails.email}
              </p>
              <p>
                <strong>Phone:</strong> {contactDetails.phone}
              </p>
            </div>
            <div>
              <p>
                <strong>Address:</strong> {contactDetails.address}
              </p>
              <p>
                <strong>Suburb:</strong> {contactDetails.suburb}
              </p>
              <p>
                <strong>State:</strong> {contactDetails.state}{" "}
                {contactDetails.postcode}
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-4 bg-accent rounded-lg border border-border">
          <h3 className="text-base font-semibold text-accent-foreground mb-2">
            Next Steps
          </h3>
          <div className="text-xs text-accent-foreground space-y-2">
            <p>1. Review this estimate and contact us to confirm</p>
            <p>2. We&apos;ll schedule a site visit to finalise details</p>
            <p>3. Sign the contract and we&apos;ll begin your project</p>
            <p>4. Enjoy your beautifully painted space!</p>
          </div>
        </div>

        {/* Action buttons removed for Client Estimate */}
      </CardContent>
    </Card>
  );
}
