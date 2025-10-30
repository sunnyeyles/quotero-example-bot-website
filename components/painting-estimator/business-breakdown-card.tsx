"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  FileText,
  Clock,
  DollarSign,
  User,
  Camera,
} from "lucide-react";
import {
  QuoteFormData,
  PaintingCalculation,
  PAINTING_CONSTANTS,
} from "./types";

interface BusinessBreakdownCardProps {
  formData: QuoteFormData;
  calculation: PaintingCalculation;
  forceEdited?: boolean;
}

export function BusinessBreakdownCard({
  formData,
  calculation,
  forceEdited = false,
}: BusinessBreakdownCardProps) {
  const [hasEdited, setHasEdited] = React.useState(!!forceEdited);
  const { contactDetails, paintingDetails, images } = formData;
  const { dimensions, paintQuality, numberOfCoats, scope } = paintingDetails;

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

  // Calculate GST (10% in Australia)
  const gstAmount = calculation.grandTotal * 0.1;
  const totalIncludingGst = calculation.grandTotal + gstAmount;

  // Calculate profit margins
  const materialCost = calculation.materialsSubtotal;
  const labourCost = calculation.labourSubtotal;
  const totalCost = materialCost + labourCost;
  const profitMargin =
    ((calculation.grandTotal - totalCost) / calculation.grandTotal) * 100;

  return (
    <Card className="-mx-4 sm:mx-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5" />
              Business Cost Breakdown
            </CardTitle>
            <p className="text-primary mt-2">
              Detailed cost analysis for {contactDetails.clientName}&apos;s
              painting project
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Client Information */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            Client Information
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

        {/* Project Details */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="text-base font-semibold text-foreground mb-2">
            Project Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <p>
                <strong>Room Type:</strong> {paintingDetails.roomType}
              </p>
              <p>
                <strong>Scope:</strong> {scope}
              </p>
              <p>
                <strong>Dimensions:</strong> {dimensions.length}m ×{" "}
                {dimensions.width}m × {dimensions.height}m
              </p>
            </div>
            <div>
              <p>
                <strong>Paint Quality:</strong>{" "}
                {getQualityLabel(paintQuality.quality)}
              </p>
              <p>
                <strong>Number of Coats:</strong> {numberOfCoats}
              </p>
              <p>
                <strong>Total Area:</strong> {calculation.totalArea.toFixed(1)}{" "}
                m²
              </p>
            </div>
            <div>
              <p>
                <strong>Wall Area:</strong> {calculation.wallArea.toFixed(1)} m²
              </p>
              <p>
                <strong>Ceiling Area:</strong>{" "}
                {calculation.ceilingArea.toFixed(1)} m²
              </p>
              <p>
                <strong>Paint Required:</strong> {calculation.totalPaintLitres}L
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Cost Breakdown */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Detailed Cost Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-left font-medium">
                    Item
                  </th>
                  <th className="border border-border p-3 text-left font-medium">
                    Details
                  </th>
                  <th className="border border-border p-3 text-right font-medium">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Material Costs */}
                <tr>
                  <td
                    className="border border-border p-3 font-medium bg-card"
                    colSpan={3}
                  >
                    Material Costs
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Paint</td>
                  <td className="border border-border p-3">
                    {calculation.totalPaintLitres}L @{" "}
                    {getQualityLabel(paintQuality.quality)}
                    {calculation.priceData?.isRealTime ? (
                      <span className="text-primary font-medium">
                        {" "}
                        (Live: $
                        {(
                          calculation.totalPaintCost /
                          calculation.totalPaintLitres
                        ).toFixed(2)}
                        /L)
                      </span>
                    ) : (
                      <span> (${paintQuality.pricePerLitre}/L)</span>
                    )}
                  </td>
                  <td className="border border-border p-3 text-right font-medium">
                    {formatCurrency(calculation.totalPaintCost)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3">
                    Ancillary Materials
                  </td>
                  <td className="border border-border p-3">
                    Rollers, brushes, tape, drop sheets, fillers
                  </td>
                  <td className="border border-border p-3 text-right font-medium">
                    {formatCurrency(calculation.ancillaryMaterialsCost)}
                  </td>
                </tr>
                <tr className="bg-card">
                  <td className="border border-border p-3 font-medium">
                    Subtotal Materials
                  </td>
                  <td className="border border-border p-3"></td>
                  <td className="border border-border p-3 text-right font-medium">
                    {formatCurrency(calculation.materialsSubtotal)}
                  </td>
                </tr>

                {/* Labour Costs */}
                <tr>
                  <td
                    className="border border-border p-3 font-medium bg-card"
                    colSpan={3}
                  >
                    Labour Costs
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Wall Painting</td>
                  <td className="border border-border p-3">
                    {calculation.wallArea.toFixed(1)} m² @{" "}
                    {PAINTING_CONSTANTS.WALL_SPEED} m²/hr
                  </td>
                  <td className="border border-border p-3 text-right font-medium">
                    {formatCurrency(
                      (calculation.wallArea / PAINTING_CONSTANTS.WALL_SPEED) *
                        PAINTING_CONSTANTS.LABOUR_RATE
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Ceiling Painting</td>
                  <td className="border border-border p-3">
                    {calculation.ceilingArea.toFixed(1)} m² @{" "}
                    {PAINTING_CONSTANTS.CEILING_SPEED} m²/hr
                  </td>
                  <td className="border border-border p-3 text-right font-medium">
                    {formatCurrency(
                      (calculation.ceilingArea /
                        PAINTING_CONSTANTS.CEILING_SPEED) *
                        PAINTING_CONSTANTS.LABOUR_RATE
                    )}
                  </td>
                </tr>
                <tr className="bg-card">
                  <td className="border border-border p-3 font-medium">
                    Subtotal Labour
                  </td>
                  <td className="border border-border p-3">
                    {formatHours(calculation.totalLabourHours)} hours @ $
                    {PAINTING_CONSTANTS.LABOUR_RATE}/hr
                  </td>
                  <td className="border border-border p-3 text-right font-medium">
                    {formatCurrency(calculation.labourSubtotal)}
                  </td>
                </tr>

                {/* Totals */}
                <tr className="bg-muted">
                  <td className="border border-border p-3 font-medium">
                    Subtotal (Excl. GST)
                  </td>
                  <td className="border border-border p-3"></td>
                  <td className="border border-border p-3 text-right font-medium">
                    {formatCurrency(calculation.grandTotal)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3">GST (10%)</td>
                  <td className="border border-border p-3"></td>
                  <td className="border border-border p-3 text-right font-medium">
                    {formatCurrency(gstAmount)}
                  </td>
                </tr>
                <tr className="bg-muted">
                  <td className="border border-border p-3 font-bold text-base">
                    Total (Incl. GST)
                  </td>
                  <td className="border border-border p-3"></td>
                  <td className="border border-border p-3 text-right font-bold text-base">
                    {formatCurrency(totalIncludingGst)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Profit Analysis */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="text-base font-semibold text-foreground mb-2">
            Profit Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="text-center p-3 bg-primary/10 rounded border">
              <p className="font-medium text-primary">Total Revenue</p>
              <p className="text-base font-bold text-primary">
                {formatCurrency(calculation.grandTotal)}
              </p>
            </div>
            <div className="text-center p-3 bg-destructive/10 rounded border">
              <p className="font-medium text-destructive">Total Costs</p>
              <p className="text-base font-bold text-destructive">
                {formatCurrency(totalCost)}
              </p>
            </div>
            <div className="text-center p-3 bg-card rounded border">
              <p className="font-medium text-foreground">Profit Margin</p>
              <p className="text-base font-bold text-primary">
                {profitMargin.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Timeline & Scheduling */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timeline & Scheduling
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p>
                <strong>Preparation Time:</strong> 1-2 days
              </p>
              <p>
                <strong>Painting Time:</strong>{" "}
                {Math.ceil(calculation.totalLabourHours / 8)} days
              </p>
              <p>
                <strong>Total Duration:</strong>{" "}
                {Math.ceil(calculation.totalLabourHours / 8) + 2} days
              </p>
            </div>
            <div>
              <p>
                <strong>Labour Hours:</strong>{" "}
                {formatHours(calculation.totalLabourHours)} hours
              </p>
              <p>
                <strong>Daily Rate:</strong>{" "}
                {formatCurrency(PAINTING_CONSTANTS.LABOUR_RATE * 8)}/day
              </p>
              <p>
                <strong>Coverage Rate:</strong>{" "}
                {PAINTING_CONSTANTS.COVERAGE_RATE} m²/L
              </p>
            </div>
          </div>
        </div>

        {/* Paint Products */}
        {calculation.priceData?.paintProducts &&
          calculation.priceData.paintProducts.length > 0 && (
            <div className="p-4 bg-card rounded-lg border border-border">
              <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Recommended Paint Products (Bunnings)
                {calculation.priceData?.isRealTime && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-muted text-foreground"
                  >
                    Live Prices
                  </Badge>
                )}
              </h3>
              <div className="space-y-2">
                {calculation.priceData.paintProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-white rounded border"
                  >
                    <div>
                      <p className="font-medium text-xs">{product.name}</p>
                      <p className="text-[10px] text-primary">
                        {product.brand}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-[10px] text-primary">per 4L</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Project Photos */}
        {images.length > 0 && (
          <div className="p-4 bg-card rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Project Photos ({images.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Project photo ${index + 1}`}
                    width={150}
                    height={150}
                    className="rounded border object-cover"
                  />
                  <p className="text-xs text-primary mt-1 truncate">
                    {image.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons (enabled but no-ops) */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setHasEdited(true)}
          >
            Edit Details
          </Button>
          <Button className="w-full sm:w-auto" onClick={() => {}}>
            {hasEdited
              ? "Send Updated Estimate to Client"
              : "Send Confirmed Estimate to Client"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
