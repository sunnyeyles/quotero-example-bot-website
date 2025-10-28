"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, Mail, ArrowLeft } from "lucide-react";
import { QuoteFormData, QuoteCalculation, PREMIUM_SUBURBS } from "./types";

interface QuoteResultProps {
  formData: QuoteFormData;
  onBackToForm: () => void;
}

export function QuoteResult({ formData, onBackToForm }: QuoteResultProps) {
  const calculateQuote = (): QuoteCalculation => {
    const {
      installationType,
      roofDetails,
      skylightDetails,
      additionalSkylights,
      locationDetails,
      propertyDetails,
    } = formData;

    // Base installation cost
    const baseInstallation = installationType.type === "roof-only" ? 800 : 2000;

    // Roof type adjustment
    const roofTypeAdjustment =
      roofDetails.type === "metal"
        ? 300
        : roofDetails.type === "tile"
        ? 500
        : 0;

    // Roof pitch adjustment
    const roofPitchAdjustment =
      roofDetails.pitch === "flat"
        ? 200
        : roofDetails.pitch === "pitched"
        ? 400
        : 0;

    // Skylight type cost
    const skylightTypeCosts = {
      fixed: 800,
      electric: 1500,
      manual: 1200,
      solar: 1800,
    };
    const skylightTypeCost = skylightTypeCosts[skylightDetails.type];

    // Additional skylights cost
    const additionalSkylightsCost = additionalSkylights.reduce(
      (total, skylight) => {
        return total + skylightTypeCosts[skylight.type];
      },
      0
    );

    // Storeys adjustment
    const storeysAdjustment = propertyDetails.storeys === "double" ? 800 : 0;

    // Premium suburb adjustment
    const premiumSuburbAdjustment = PREMIUM_SUBURBS.includes(
      locationDetails.suburb
    )
      ? 50
      : 0;

    // Calculate totals
    const subtotal =
      baseInstallation +
      roofTypeAdjustment +
      roofPitchAdjustment +
      skylightTypeCost +
      additionalSkylightsCost +
      storeysAdjustment +
      premiumSuburbAdjustment;
    const gst = subtotal * 0.1;
    const total = subtotal + gst;

    return {
      baseInstallation,
      roofTypeAdjustment,
      roofPitchAdjustment,
      skylightTypeCost,
      additionalSkylightsCost,
      storeysAdjustment,
      premiumSuburbAdjustment,
      subtotal,
      gst,
      total,
    };
  };

  const quote = calculateQuote();

  const handleDownloadPDF = () => {
    // Placeholder for PDF generation
    console.log("Downloading PDF quote...");
    // In a real implementation, you would generate and download a PDF
  };

  const handleEmailQuote = () => {
    // Placeholder for email functionality
    console.log("Emailing quote...");
    // In a real implementation, you would send an email with the quote
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Your Skylight Quote</h1>
        <p className="text-muted-foreground">
          Thank you for your interest in our skylight installation services.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quote Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  Base Installation (
                  {formData.installationType.type === "roof-only"
                    ? "Roof Only"
                    : "Complete"}
                  )
                </span>
                <span>${quote.baseInstallation.toLocaleString()}</span>
              </div>

              {quote.roofTypeAdjustment > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Roof Type ({formData.roofDetails.type})</span>
                  <span>+${quote.roofTypeAdjustment.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Roof Pitch ({formData.roofDetails.pitch})</span>
                <span>+${quote.roofPitchAdjustment.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Skylight Type ({formData.skylightDetails.type})</span>
                <span>${quote.skylightTypeCost.toLocaleString()}</span>
              </div>

              {quote.additionalSkylightsCost > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Additional Skylights ({formData.additionalSkylights.length})
                  </span>
                  <span>
                    +${quote.additionalSkylightsCost.toLocaleString()}
                  </span>
                </div>
              )}

              {quote.storeysAdjustment > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Double Storey</span>
                  <span>+${quote.storeysAdjustment.toLocaleString()}</span>
                </div>
              )}

              {quote.premiumSuburbAdjustment > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Premium Suburb</span>
                  <span>
                    +${quote.premiumSuburbAdjustment.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>${quote.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>GST (10%)</span>
                <span>${quote.gst.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${quote.total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Contact Information</h4>
              <div className="text-sm space-y-1">
                <p>
                  {formData.personalDetails.firstName}{" "}
                  {formData.personalDetails.lastName}
                </p>
                <p>{formData.personalDetails.email}</p>
                <p>{formData.personalDetails.phone}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Location</h4>
              <div className="text-sm">
                <p>
                  {formData.locationDetails.suburb},{" "}
                  {formData.locationDetails.postcode}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Installation Details</h4>
              <div className="text-sm space-y-1">
                <p>
                  Type:{" "}
                  {formData.installationType.type === "roof-only"
                    ? "Roof Only"
                    : "Complete Installation"}
                </p>
                <p>
                  Roof: {formData.roofDetails.type} (
                  {formData.roofDetails.pitch} pitch)
                </p>
                <p>
                  Skylight: {formData.skylightDetails.type} -{" "}
                  {formData.skylightDetails.size}mm
                </p>
                {formData.additionalSkylights.length > 0 && (
                  <p>
                    Additional: {formData.additionalSkylights.length}{" "}
                    skylight(s)
                  </p>
                )}
                <p>Storeys: {formData.propertyDetails.storeys}</p>
                <p>
                  Inspection: {formData.propertyDetails.inspectionAvailability}
                </p>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Images Uploaded</h4>
                <p className="text-sm text-muted-foreground">
                  {formData.images.length} image(s) provided
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleDownloadPDF} className="gap-2">
          <Download className="h-4 w-4" />
          Download PDF Quote
        </Button>
        <Button variant="outline" onClick={handleEmailQuote} className="gap-2">
          <Mail className="h-4 w-4" />
          Email Quote
        </Button>
        <Button variant="ghost" onClick={onBackToForm} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Form
        </Button>
      </div>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• This quote is valid for 30 days from the date of issue.</p>
            <p>• Final pricing may vary based on site inspection findings.</p>
            <p>
              • Installation timeline will be confirmed after site inspection.
            </p>
            <p>• All work is covered by our comprehensive warranty.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
