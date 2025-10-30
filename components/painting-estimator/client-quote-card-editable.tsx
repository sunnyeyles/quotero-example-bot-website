"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { QuoteFormData, PaintingCalculation } from "./types";

interface ClientQuoteCardEditableProps {
  formData: QuoteFormData;
  calculation: PaintingCalculation;
}

export function ClientQuoteCardEditable({
  formData,
  calculation,
}: ClientQuoteCardEditableProps) {
  const [materialsSubtotal, setMaterialsSubtotal] = React.useState<number>(
    calculation.materialsSubtotal
  );
  const [labourSubtotal, setLabourSubtotal] = React.useState<number>(
    calculation.labourSubtotal
  );
  const [notes, setNotes] = React.useState<string>(
    formData.additionalDetails?.notes || ""
  );

  const grandTotal = materialsSubtotal + labourSubtotal;
  const gstAmount = grandTotal * 0.1;
  const totalIncludingGst = grandTotal + gstAmount;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount || 0);

  return (
    <Card className="-mx-4 sm:mx-0">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-foreground">
          <CheckCircle className="h-5 w-5" />
          Client Estimate (Editable)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Editable Cost Summary */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="text-base font-semibold text-foreground mb-3">
            Cost Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Materials & Paint
              </label>
              <Input
                type="number"
                inputMode="decimal"
                value={materialsSubtotal}
                onChange={(e) =>
                  setMaterialsSubtotal(parseFloat(e.target.value || "0"))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Labour</label>
              <Input
                type="number"
                inputMode="decimal"
                value={labourSubtotal}
                onChange={(e) =>
                  setLabourSubtotal(parseFloat(e.target.value || "0"))
                }
              />
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Subtotal (excl. GST)
              </span>
              <span className="font-medium">{formatCurrency(grandTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (10%)</span>
              <span className="font-medium">{formatCurrency(gstAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-foreground border-t pt-2">
              <span>Total (incl. GST)</span>
              <span>{formatCurrency(totalIncludingGst)}</span>
            </div>
          </div>
        </div>

        {/* Optional message to client */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="text-base font-semibold text-foreground mb-2">
            Message to Client (Optional)
          </h3>
          <Textarea
            placeholder="Add a short greeting or outline next steps..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Read-only context */}
        <div className="p-4 bg-muted/40 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">
            Editing here adjusts the client-facing totals only. Your internal
            breakdown remains unchanged.
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => {}}>Send Updated Estimate to Client</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ClientQuoteCardEditable;
