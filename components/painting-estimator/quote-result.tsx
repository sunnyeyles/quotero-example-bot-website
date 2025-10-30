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
import { ClientQuoteCardEditable } from "./client-quote-card-editable";
import { BusinessBreakdownCard } from "./business-breakdown-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Mail, Eye, Send } from "lucide-react";
// Render results inside the Timeline component

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

  // Calculate areas (supports per-room when available)
  let wallArea = 2 * (dimensions.length + dimensions.width) * dimensions.height;
  let ceilingArea = dimensions.length * dimensions.width;
  if (Array.isArray(formData.rooms) && (formData.rooms?.length || 0) > 0) {
    wallArea = formData.rooms.reduce(
      (sum, r) => sum + (r.includeWalls ? r.wallsAreaSqm || 0 : 0),
      0
    );
    ceilingArea = formData.rooms.reduce(
      (sum, r) => sum + (r.includeCeilings ? r.ceilingAreaSqm || 0 : 0),
      0
    );
  }
  const totalArea = wallArea + ceilingArea;

  // Calculate paint requirements
  const totalPaintLitres = Math.ceil(
    (totalArea / PAINTING_CONSTANTS.COVERAGE_RATE) * numberOfCoats
  );

  // Update calculation when paint prices change
  useEffect(() => {
    if (paintData) {
      const scopeNormalized = scope === "both" ? "interior" : scope;
      const categoryKey = getPaintCategoryKey(
        scopeNormalized as "interior" | "exterior",
        paintQuality.quality
      );
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
    <div className="max-w-7xl mx-auto">
      <TimelineWithModals
        formData={formData}
        calculation={calculation}
        onBackToForm={onBackToForm}
      />
    </div>
  );
}

interface TimelineWithModalsProps {
  formData: QuoteFormData;
  calculation: PaintingCalculation;
  onBackToForm: () => void;
}

function TimelineWithModals({
  formData,
  calculation,
  onBackToForm,
}: TimelineWithModalsProps) {
  const steps = [
    {
      key: "client" as const,
      company: "Step 1 - Client Estimate",
      title: "Concise client-facing summary",
      description:
        "A concise summary of your estimate including totals, timeline, and inclusions.",
      icon: FileText,
    },
    {
      key: "business" as const,
      company: "Step 2 - Detailed internal breakdown",
      title: "Emailed to you with quick-action buttons",
      description:
        "We email you a detailed internal breakdown (materials, labour, rates) with buttons to Review, Accept or Edit — no apps to install.",
      icon: Mail,
    },
    {
      key: "review" as const,
      company: "Step 3 - Business Review",
      title: "Review the estimate",
      description:
        "Optionally edit the price estimate directly in the email. Adjust rates, terms, or pricing to fit your needs.",
      icon: Eye,
    },
    {
      key: "compose" as const,
      company: "Step 4 - Notify Client",
      title: "Email the client with the click of a button",
      description:
        "You can include an optional greeting or outline next steps. When you're ready, send it to the client with one click.",
      icon: Send,
    },
  ];

  const [openKey, setOpenKey] = React.useState<
    "client" | "business" | "review" | null
  >(null);

  return (
    <div className="max-w-[40rem] mx-auto py-6 md:py-8 px-2 sm:px-4">
      <div className="relative ml-3">
        {/* Timeline vertical line */}
        <div className="absolute left-0 top-4 bottom-0 border-l-2" />

        {steps.map(({ company, description, title, key, icon: Icon }) => (
          <div key={key} className="relative pl-8 pb-16 last:pb-0">
            {/* Timeline dot */}
            <div className="absolute h-3 w-3 -translate-x-1/2 left-px top-3 rounded-full border-2 border-primary bg-background" />

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="shrink-0 h-9 w-9 bg-accent rounded-full flex items-center justify-center">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="text-base font-medium">{company}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground text-pretty">
                {description}
              </p>

              {(key === "client" || key === "business" || key === "review") && (
                <div className="pt-1">
                  <Button size="sm" onClick={() => setOpenKey(key)}>
                    View Example
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={openKey !== null}
        onOpenChange={(open) => !open && setOpenKey(null)}
      >
        <DialogContent className="max-w-[64rem] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {openKey === "client"
                ? "Client Estimate"
                : openKey === "business"
                ? "Business Breakdown"
                : "Preview"}
            </DialogTitle>
          </DialogHeader>

          {openKey === "client" && (
            <ClientQuoteCard
              formData={formData}
              calculation={calculation}
              onBackToForm={onBackToForm}
            />
          )}
          {openKey === "business" && (
            <BusinessBreakdownCard
              formData={formData}
              calculation={calculation}
            />
          )}
          {openKey === "review" && (
            <ClientQuoteCardEditable
              formData={formData}
              calculation={calculation}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
