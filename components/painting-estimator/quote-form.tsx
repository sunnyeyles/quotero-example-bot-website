"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  QuoteFormData,
  PaintingDetails,
  RoomDimensions,
  PaintQuality,
  ContactDetails,
} from "./types";
import { StepOne } from "./step-one";
import { StepTwo } from "./step-two";
import { StepThree } from "./step-three";
import { ContactDetailsStep } from "./step-contact";
import { ImageUpload } from "./image-upload";
import { QuoteResult } from "./quote-result";

const TOTAL_STEPS = 4;

export function QuoteForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showQuote, setShowQuote] = useState(false);
  const [formData, setFormData] = useState<QuoteFormData>({
    contactDetails: {
      clientName: "",
      email: "",
      phone: "",
      address: "",
      suburb: "",
      state: "",
      postcode: "",
    },
    paintingDetails: {
      scope: "interior",
      roomType: "",
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      paintQuality: {
        quality: "good",
        pricePerLitre: 35,
      },
      numberOfCoats: 2,
    },
    images: [],
  });

  const updatePaintingDetails = (data: Partial<PaintingDetails>) => {
    setFormData((prev) => ({
      ...prev,
      paintingDetails: { ...prev.paintingDetails, ...data },
    }));
  };

  const updateDimensions = (data: RoomDimensions) => {
    setFormData((prev) => ({
      ...prev,
      paintingDetails: {
        ...prev.paintingDetails,
        dimensions: data,
      },
    }));
  };

  const updatePaintQuality = (data: PaintQuality) => {
    setFormData((prev) => ({
      ...prev,
      paintingDetails: {
        ...prev.paintingDetails,
        paintQuality: data,
      },
    }));
  };

  const updateContactDetails = (data: Partial<ContactDetails>) => {
    setFormData((prev) => ({
      ...prev,
      contactDetails: { ...prev.contactDetails, ...data },
    }));
  };

  const updateImages = (images: File[]) => {
    setFormData((prev) => ({
      ...prev,
      images,
    }));
  };

  const validateStep = (step: number): boolean => {
    const { contactDetails, paintingDetails } = formData;

    switch (step) {
      case 1:
        return !!(
          contactDetails.clientName &&
          contactDetails.email &&
          contactDetails.phone &&
          contactDetails.address &&
          contactDetails.suburb &&
          contactDetails.state &&
          contactDetails.postcode
        );
      case 2:
        return !!(paintingDetails.scope && paintingDetails.roomType);
      case 3:
        const { length, width, height } = paintingDetails.dimensions;
        return !!(length > 0 && width > 0 && height > 0);
      case 4:
        return !!(
          paintingDetails.paintQuality.quality &&
          paintingDetails.numberOfCoats > 0
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS && validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === TOTAL_STEPS && validateStep(currentStep)) {
      setShowQuote(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  if (showQuote) {
    return (
      <QuoteResult
        formData={formData}
        onBackToForm={() => setShowQuote(false)}
      />
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <ContactDetailsStep
              data={formData.contactDetails}
              onDataChange={updateContactDetails}
            />
            <ImageUpload
              images={formData.images}
              onImagesChange={updateImages}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <StepOne
              data={formData.paintingDetails}
              onDataChange={updatePaintingDetails}
            />
            <ImageUpload
              images={formData.images}
              onImagesChange={updateImages}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <StepTwo
              data={formData.paintingDetails.dimensions}
              onDataChange={updateDimensions}
            />
            <ImageUpload
              images={formData.images}
              onImagesChange={updateImages}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <StepThree
              paintQuality={formData.paintingDetails.paintQuality}
              numberOfCoats={formData.paintingDetails.numberOfCoats}
              onPaintQualityChange={updatePaintQuality}
              onNumberOfCoatsChange={(coats) =>
                updatePaintingDetails({ numberOfCoats: coats })
              }
            />
            <ImageUpload
              images={formData.images}
              onImagesChange={updateImages}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="text-center">
              <CardTitle className="text-2xl">
                Painting Cost Estimator
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Get a professional cost breakdown for your painting project
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Step {currentStep} of {TOTAL_STEPS}
                </span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
              className="gap-2"
            >
              {currentStep === TOTAL_STEPS ? "Get Quote" : "Next"}
              {currentStep < TOTAL_STEPS && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
