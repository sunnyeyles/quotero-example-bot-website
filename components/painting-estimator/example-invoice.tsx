"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Mail } from "lucide-react";
import { QuoteFormData, PaintingCalculation } from "./types";

interface ExampleInvoiceProps {
  formData: QuoteFormData;
  calculation: PaintingCalculation;
}

export function ExampleInvoice({ formData, calculation }: ExampleInvoiceProps) {
  const { contactDetails } = formData;
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  const invoiceDate = new Date().toLocaleDateString("en-AU");
  const dueDate = new Date(
    Date.now() + 14 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-AU");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  return (
    <Card className="-mx-4 sm:mx-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Example Invoice
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Invoice Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">From:</h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">Professional Painters Co.</p>
              <p>123 Business Street</p>
              <p>Melbourne VIC 3000</p>
              <p>Phone: (03) 1234 5678</p>
              <p>Email: info@professionalpainters.com.au</p>
              <p>ABN: 12 345 678 901</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Invoice Details:</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>Invoice #:</strong> {invoiceNumber}
              </p>
              <p>
                <strong>Date:</strong> {invoiceDate}
              </p>
              <p>
                <strong>Due Date:</strong> {dueDate}
              </p>
              <p>
                <strong>Payment Terms:</strong> 14 days
              </p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
          <div className="text-sm space-y-1">
            <p className="font-medium">{contactDetails.clientName}</p>
            <p>{contactDetails.address}</p>
            <p>
              {contactDetails.suburb} {contactDetails.state}{" "}
              {contactDetails.postcode}
            </p>
            <p>Email: {contactDetails.email}</p>
            <p>Phone: {contactDetails.phone}</p>
          </div>
        </div>

        {/* Invoice Items */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Services:</h3>
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-right p-3 font-medium">Qty</th>
                  <th className="text-right p-3 font-medium">Rate</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3">
                    <div>
                      <p className="font-medium">Interior Painting Service</p>
                      <p className="text-sm text-gray-600">
                        Professional painting of{" "}
                        {formData.paintingDetails.roomType}(
                        {calculation.totalArea.toFixed(1)} m²)
                      </p>
                      <p className="text-sm text-gray-600">
                        {formData.paintingDetails.paintQuality.quality} quality
                        paint,
                        {formData.paintingDetails.numberOfCoats} coats
                      </p>
                    </div>
                  </td>
                  <td className="p-3 text-right">1</td>
                  <td className="p-3 text-right">
                    {formatCurrency(calculation.grandTotal)}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatCurrency(calculation.grandTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-between sm:justify-end">
          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(calculation.grandTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (10%):</span>
              <span>{formatCurrency(calculation.gstAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(calculation.totalIncludingGst)}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Payment Information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Bank Transfer:</strong>
              </p>
              <p>BSB: 123-456</p>
              <p>Account: 12345678</p>
              <p>Reference: {invoiceNumber}</p>
            </div>
            <div>
              <p>
                <strong>Cheque:</strong>
              </p>
              <p>Payable to: Professional Painters Co.</p>
              <p>Mail to: 123 Business Street, Melbourne VIC 3000</p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="text-sm text-gray-600">
          <p>
            <strong>Terms & Conditions:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Payment is due within 14 days of invoice date</li>
            <li>Late payments may incur additional charges</li>
            <li>Work will commence upon receipt of deposit (50%)</li>
            <li>Balance due upon completion of work</li>
            <li>All work guaranteed for 2 years</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
          <Button variant="outline" className="w-full sm:w-auto">
            <Mail className="h-4 w-4 mr-2" />
            Email Invoice
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
