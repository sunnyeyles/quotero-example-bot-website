"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  QuoteFormData,
  PersonalDetails,
  LocationDetails,
  InstallationType,
  RoofDetails,
  SkylightDetails,
  AdditionalSkylight,
  PropertyDetails,
} from "./types";
import { StepOne } from "./step-one";
import { StepTwo } from "./step-two";
import { StepThree } from "./step-three";
import { StepFour } from "./step-four";
import { StepFive } from "./step-five";
import { StepSix } from "./step-six";
import { StepSeven } from "./step-seven";
import { StepEight } from "./step-eight";
import { ImageUpload } from "./image-upload";
import { QuoteResult } from "./quote-result";

const TOTAL_STEPS = 8;

export function QuoteForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showQuote, setShowQuote] = useState(false);
  const [formData, setFormData] = useState<QuoteFormData>({
    personalDetails: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    locationDetails: {
      suburb: "",
      postcode: "",
    },
    installationType: {
      type: "complete",
    },
    roofDetails: {
      type: "tile",
      pitch: "pitched",
    },
    skylightDetails: {
      type: "fixed",
      size: "665x665",
    },
    additionalSkylights: [],
    propertyDetails: {
      storeys: "single",
      inspectionAvailability: "flexible",
    },
    images: [],
    notes: {},
  });

  const updatePersonalDetails = (data: PersonalDetails) => {
    setFormData((prev) => ({ ...prev, personalDetails: data }));
  };

  const updateLocationDetails = (data: LocationDetails) => {
    setFormData((prev) => ({ ...prev, locationDetails: data }));
  };

  const updateInstallationType = (data: InstallationType) => {
    setFormData((prev) => ({ ...prev, installationType: data }));
  };

  const updateRoofDetails = (data: RoofDetails) => {
    setFormData((prev) => ({ ...prev, roofDetails: data }));
  };

  const updateSkylightDetails = (data: SkylightDetails) => {
    setFormData((prev) => ({ ...prev, skylightDetails: data }));
  };

  const updateAdditionalSkylights = (data: AdditionalSkylight[]) => {
    setFormData((prev) => ({ ...prev, additionalSkylights: data }));
  };

  const updatePropertyDetails = (data: PropertyDetails) => {
    setFormData((prev) => ({ ...prev, propertyDetails: data }));
  };

  const updateImages = (images: File[]) => {
    setFormData((prev) => ({ ...prev, images }));
  };

  const updateNotes = (stepKey: string, notes: string) => {
    setFormData((prev) => ({
      ...prev,
      notes: { ...prev.notes, [stepKey]: notes },
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        const { firstName, lastName, email, phone } = formData.personalDetails;
        return !!(firstName && lastName && email && phone);
      case 2:
        return !!formData.locationDetails.suburb;
      case 3:
        return !!formData.installationType.type;
      case 4:
        return !!formData.roofDetails.type;
      case 5:
        return !!formData.roofDetails.pitch;
      case 6:
        return !!(
          formData.skylightDetails.type && formData.skylightDetails.size
        );
      case 7:
        return true; // Optional step
      case 8:
        return !!(
          formData.propertyDetails.storeys &&
          formData.propertyDetails.inspectionAvailability
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
    const stepNotes = formData.notes[`step${currentStep}`] || "";

    switch (currentStep) {
      case 1:
        return (
          <StepOne
            data={formData.personalDetails}
            notes={stepNotes}
            onDataChange={updatePersonalDetails}
            onNotesChange={updateNotes}
          />
        );
      case 2:
        return (
          <StepTwo
            data={formData.locationDetails}
            notes={stepNotes}
            onDataChange={updateLocationDetails}
            onNotesChange={updateNotes}
          />
        );
      case 3:
        return (
          <StepThree
            data={formData.installationType}
            notes={stepNotes}
            onDataChange={updateInstallationType}
            onNotesChange={updateNotes}
          />
        );
      case 4:
        return (
          <StepFour
            data={formData.roofDetails}
            notes={stepNotes}
            onDataChange={updateRoofDetails}
            onNotesChange={updateNotes}
          />
        );
      case 5:
        return (
          <StepFive
            data={formData.roofDetails}
            notes={stepNotes}
            onDataChange={updateRoofDetails}
            onNotesChange={updateNotes}
          />
        );
      case 6:
        return (
          <StepSix
            data={formData.skylightDetails}
            roofPitch={formData.roofDetails.pitch}
            notes={stepNotes}
            onDataChange={updateSkylightDetails}
            onNotesChange={updateNotes}
          />
        );
      case 7:
        return (
          <StepSeven
            data={formData.additionalSkylights}
            roofPitch={formData.roofDetails.pitch}
            notes={stepNotes}
            onDataChange={updateAdditionalSkylights}
            onNotesChange={updateNotes}
          />
        );
      case 8:
        return (
          <StepEight
            data={formData.propertyDetails}
            notes={stepNotes}
            onDataChange={updatePropertyDetails}
            onNotesChange={updateNotes}
          />
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
                Skylight Installation Quote
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Get a personalized quote for your skylight installation project
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

          {currentStep === 8 && (
            <div className="mt-6">
              <ImageUpload
                images={formData.images}
                onImagesChange={updateImages}
              />
            </div>
          )}

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
