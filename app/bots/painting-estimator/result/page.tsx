"use client";

import { QuoteResult } from "@/components/painting-estimator/quote-result";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { QuoteFormData } from "@/components/painting-estimator/types";

export default function EstimateResultPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<QuoteFormData | null>(null);

  useEffect(() => {
    // Try to get form data from sessionStorage (set when navigating from form)
    const stored = sessionStorage.getItem("estimateFormData");
    if (stored) {
      try {
        setFormData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse form data", e);
        router.push("/bots/painting-estimator");
      }
    } else {
      // If no data, redirect back to form
      router.push("/bots/painting-estimator");
    }
  }, [router]);

  const handleBackToForm = () => {
    router.push("/bots/painting-estimator");
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading estimate...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <Link href="/bots/painting-estimator">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Estimator
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-4">Your Estimate is Ready</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Review your estimate summary and see how the automated workflow
            streamlines your business process from estimate to client delivery.
          </p>
        </div>

        {/* Results */}
        <QuoteResult formData={formData} onBackToForm={handleBackToForm} />
      </div>
    </div>
  );
}
