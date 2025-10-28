"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator } from "lucide-react";
import {
  QuoteFormData,
  PaintingCalculation,
  PAINTING_CONSTANTS,
} from "./types";

interface QuoteResultProps {
  formData: QuoteFormData;
  onBackToForm: () => void;
}

export function QuoteResult({ formData, onBackToForm }: QuoteResultProps) {
  const { paintingDetails } = formData;
  const { dimensions, paintQuality, numberOfCoats } = paintingDetails;

  // Calculate areas
  const wallArea =
    2 * (dimensions.length + dimensions.width) * dimensions.height;
  const ceilingArea = dimensions.length * dimensions.width;
  const totalArea = wallArea + ceilingArea;

  // Calculate paint requirements
  const totalPaintLitres = Math.ceil(
    (totalArea / PAINTING_CONSTANTS.COVERAGE_RATE) * numberOfCoats
  );
  const totalPaintCost = totalPaintLitres * paintQuality.pricePerLitre;

  // Calculate labour
  const wallLabourHours = wallArea / PAINTING_CONSTANTS.WALL_SPEED;
  const ceilingLabourHours = ceilingArea / PAINTING_CONSTANTS.CEILING_SPEED;
  const totalLabourHours = wallLabourHours + ceilingLabourHours;
  const totalLabourCost = totalLabourHours * PAINTING_CONSTANTS.LABOUR_RATE;

  // Calculate totals
  const ancillaryMaterialsCost = PAINTING_CONSTANTS.ANCILLARY_MATERIALS;
  const materialsSubtotal = totalPaintCost + ancillaryMaterialsCost;
  const labourSubtotal = totalLabourCost;
  const grandTotal = materialsSubtotal + labourSubtotal;

  const calculation: PaintingCalculation = {
    wallArea,
    ceilingArea,
    totalArea,
    totalPaintLitres,
    totalPaintCost,
    ancillaryMaterialsCost,
    materialsSubtotal,
    totalLabourHours,
    totalLabourCost,
    labourSubtotal,
    grandTotal,
  };

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
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                Painting Cost Estimate
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Professional cost breakdown for your {paintingDetails.scope}{" "}
                painting project
              </p>
            </div>
            <Button variant="outline" onClick={onBackToForm} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Form
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Job Title */}
          <div className="text-center p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold">
              Job Title: Painting a {paintingDetails.roomType} of{" "}
              {dimensions.length}m × {dimensions.width}m × {dimensions.height}m
            </h3>
          </div>

          {/* Cost Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-left font-medium">
                    Metric
                  </th>
                  <th className="border border-border p-3 text-left font-medium">
                    Calculation / Rate
                  </th>
                  <th className="border border-border p-3 text-right font-medium">
                    Cost / Hours
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Material Costs */}
                <tr>
                  <td
                    className="border border-border p-3 font-medium"
                    colSpan={3}
                  >
                    Material Costs
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3">
                    Total Paint Required
                  </td>
                  <td className="border border-border p-3">
                    {calculation.totalPaintLitres} Litres @{" "}
                    {getQualityLabel(paintQuality.quality)} ($
                    {paintQuality.pricePerLitre}/L)
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
                    Fixed Fee (rollers, brushes, tape, drop sheets, fillers)
                  </td>
                  <td className="border border-border p-3 text-right font-medium">
                    {formatCurrency(calculation.ancillaryMaterialsCost)}
                  </td>
                </tr>
                <tr className="bg-muted">
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
                    className="border border-border p-3 font-medium"
                    colSpan={3}
                  >
                    Labour Costs
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3">
                    Total Area Painted
                  </td>
                  <td className="border border-border p-3">
                    {calculation.totalArea.toFixed(1)} m²
                  </td>
                  <td className="border border-border p-3"></td>
                </tr>
                <tr>
                  <td className="border border-border p-3">
                    Estimated Labour Time
                  </td>
                  <td className="border border-border p-3">
                    {formatHours(calculation.totalLabourHours)} Hours @ $
                    {PAINTING_CONSTANTS.LABOUR_RATE}/hr
                  </td>
                  <td className="border border-border p-3 text-right font-medium">
                    {formatCurrency(calculation.totalLabourCost)}
                  </td>
                </tr>
                <tr className="bg-muted">
                  <td className="border border-border p-3 font-medium">
                    Subtotal Labour
                  </td>
                  <td className="border border-border p-3"></td>
                  <td className="border border-border p-3 text-right font-medium">
                    {formatCurrency(calculation.labourSubtotal)}
                  </td>
                </tr>

                {/* Grand Total */}
                <tr className="bg-primary text-primary-foreground">
                  <td className="border border-border p-3 font-bold text-lg">
                    GRAND TOTAL (Estimate)
                  </td>
                  <td className="border border-border p-3"></td>
                  <td className="border border-border p-3 text-right font-bold text-lg">
                    {formatCurrency(calculation.grandTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Additional Information */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Estimate Details:</h4>
            <div className="text-sm space-y-1">
              <p>
                • Coverage Rate: {PAINTING_CONSTANTS.COVERAGE_RATE} m² per litre
                ({numberOfCoats} coats)
              </p>
              <p>• Labour Rate: ${PAINTING_CONSTANTS.LABOUR_RATE} per hour</p>
              <p>• Wall Speed: {PAINTING_CONSTANTS.WALL_SPEED} m² per hour</p>
              <p>
                • Ceiling Speed: {PAINTING_CONSTANTS.CEILING_SPEED} m² per hour
              </p>
              <p>
                • This is a preliminary estimate based on internal, hardcoded
                pricing and standard coverage rates.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button variant="outline" onClick={onBackToForm}>
              Modify Estimate
            </Button>
            <Button>Save Estimate</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
