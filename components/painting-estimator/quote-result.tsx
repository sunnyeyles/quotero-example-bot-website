"use client";

import React, { useEffect, useState } from "react";
import {
  QuoteFormData,
  PaintingCalculation,
  PAINTING_CONSTANTS,
  getPaintCategoryKey,
} from "./types";
import { usePaintPrices } from "@/hooks/usePaintPrices";
import { ClientQuoteCard } from "./client-quote-card";
import { BusinessBreakdownCard } from "./business-breakdown-card";
import { ExampleInvoice } from "./example-invoice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuoteResultProps {
  formData: QuoteFormData;
  onBackToForm: () => void;
}

export function QuoteResult({ formData, onBackToForm }: QuoteResultProps) {
  const { paintingDetails } = formData;
  const { dimensions, paintQuality, numberOfCoats, scope } = paintingDetails;

  const { paintData, getPriceByCategory } = usePaintPrices();
  const [calculation, setCalculation] = useState<PaintingCalculation | null>(
    null
  );

  // Calculate areas
  const wallArea =
    2 * (dimensions.length + dimensions.width) * dimensions.height;
  const ceilingArea = dimensions.length * dimensions.width;
  const totalArea = wallArea + ceilingArea;

  // Calculate paint requirements
  const totalPaintLitres = Math.ceil(
    (totalArea / PAINTING_CONSTANTS.COVERAGE_RATE) * numberOfCoats
  );

  // Update calculation when paint prices change
  useEffect(() => {
    if (paintData) {
      const categoryKey = getPaintCategoryKey(scope, paintQuality.quality);
      const realTimePrice = getPriceByCategory(categoryKey);

      // Use real-time price if available, otherwise fall back to default
      const pricePerLitre =
        realTimePrice > 0 ? realTimePrice : paintQuality.pricePerLitre;
      const totalPaintCost = totalPaintLitres * pricePerLitre;

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
      const gstAmount = grandTotal * 0.1; // 10% GST
      const totalIncludingGst = grandTotal + gstAmount;

      // Get relevant paint products for this category
      const relevantProducts = paintData.products
        .filter((p) => p.category === categoryKey)
        .slice(0, 3) // Show top 3 products
        .map((p) => ({
          name: p.name,
          price: p.price,
          brand: p.brand,
          category: p.category,
        }));

      const newCalculation: PaintingCalculation = {
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
        gstAmount,
        totalIncludingGst,
        priceData: {
          isRealTime: realTimePrice > 0,
          source: "Bunnings Warehouse",
          lastUpdated: paintData.lastUpdated || new Date().toISOString(),
          paintProducts: relevantProducts,
        },
      };

      setCalculation(newCalculation);
    } else {
      // Fallback calculation with default prices
      const totalPaintCost = totalPaintLitres * paintQuality.pricePerLitre;
      const wallLabourHours = wallArea / PAINTING_CONSTANTS.WALL_SPEED;
      const ceilingLabourHours = ceilingArea / PAINTING_CONSTANTS.CEILING_SPEED;
      const totalLabourHours = wallLabourHours + ceilingLabourHours;
      const totalLabourCost = totalLabourHours * PAINTING_CONSTANTS.LABOUR_RATE;
      const ancillaryMaterialsCost = PAINTING_CONSTANTS.ANCILLARY_MATERIALS;
      const materialsSubtotal = totalPaintCost + ancillaryMaterialsCost;
      const labourSubtotal = totalLabourCost;
      const grandTotal = materialsSubtotal + labourSubtotal;
      const gstAmount = grandTotal * 0.1; // 10% GST
      const totalIncludingGst = grandTotal + gstAmount;

      setCalculation({
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
        gstAmount,
        totalIncludingGst,
        priceData: {
          isRealTime: false,
          source: "Default Pricing",
          lastUpdated: new Date().toISOString(),
        },
      });
    }
  }, [
    paintData,
    scope,
    paintQuality.quality,
    paintQuality.pricePerLitre,
    totalPaintLitres,
    wallArea,
    ceilingArea,
    totalArea,
    getPriceByCategory,
  ]);

  if (!calculation) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading paint prices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Business Input Explanation */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">For Business Use</h3>
        <p className="text-sm text-gray-600">
          This calculator generates both client quotes and detailed business
          breakdowns. Businesses can customise pricing, margins, and rates in
          the configuration. The system pulls live paint prices from Bunnings
          and calculates accurate material/labour costs.
        </p>
      </div>

      {/* Tabbed Cards */}
      <Tabs defaultValue="client-quote" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="client-quote">Client Quote</TabsTrigger>
          <TabsTrigger value="business-breakdown">
            Business Breakdown
          </TabsTrigger>
          <TabsTrigger value="example-invoice">Example Invoice</TabsTrigger>
        </TabsList>

        <TabsContent value="client-quote" className="mt-6">
          <ClientQuoteCard
            formData={formData}
            calculation={calculation}
            onBackToForm={onBackToForm}
          />
        </TabsContent>

        <TabsContent value="business-breakdown" className="mt-6">
          <BusinessBreakdownCard
            formData={formData}
            calculation={calculation}
            onBackToForm={onBackToForm}
          />
        </TabsContent>

        <TabsContent value="example-invoice" className="mt-6">
          <ExampleInvoice formData={formData} calculation={calculation} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
