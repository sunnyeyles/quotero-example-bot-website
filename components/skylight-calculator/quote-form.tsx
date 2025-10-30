"use client";

import React, { useState } from "react";
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
import Stepper, { Step } from "@/components/ui/form-stepper";

export function QuoteForm() {
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

  if (showQuote) {
    return (
      <QuoteResult
        formData={formData}
        onBackToForm={() => setShowQuote(false)}
      />
    );
  }

  return (
    <Stepper
      initialStep={1}
      onStepChange={() => {
        // Optional: handle step changes if needed
      }}
      onFinalStepCompleted={() => setShowQuote(true)}
      stepNames={[
        "Personal Details",
        "Location Details",
        "Installation Type",
        "Roof Type",
        "Roof Pitch",
        "Skylight Details",
        "Additional Skylights",
        "Property Details",
      ]}
    >
      <Step>
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Personal Details</h2>
            <p className="text-muted-foreground">
              Let&apos;s start with your contact information
            </p>
          </div>
          <StepOne
            data={formData.personalDetails}
            notes={formData.notes["step1"] || ""}
            onDataChange={updatePersonalDetails}
            onNotesChange={updateNotes}
          />
        </div>
      </Step>

      <Step>
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Location Details</h2>
            <p className="text-muted-foreground">
              Where is your property located?
            </p>
          </div>
          <StepTwo
            data={formData.locationDetails}
            notes={formData.notes["step2"] || ""}
            onDataChange={updateLocationDetails}
            onNotesChange={updateNotes}
          />
        </div>
      </Step>

      <Step>
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Installation Type</h2>
            <p className="text-muted-foreground">
              What type of installation do you need?
            </p>
          </div>
          <StepThree
            data={formData.installationType}
            notes={formData.notes["step3"] || ""}
            onDataChange={updateInstallationType}
            onNotesChange={updateNotes}
          />
        </div>
      </Step>

      <Step>
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Roof Type</h2>
            <p className="text-muted-foreground">
              What type of roof do you have?
            </p>
          </div>
          <StepFour
            data={formData.roofDetails}
            notes={formData.notes["step4"] || ""}
            onDataChange={updateRoofDetails}
            onNotesChange={updateNotes}
          />
        </div>
      </Step>

      <Step>
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Roof Pitch</h2>
            <p className="text-muted-foreground">What is your roof pitch?</p>
          </div>
          <StepFive
            data={formData.roofDetails}
            notes={formData.notes["step5"] || ""}
            onDataChange={updateRoofDetails}
            onNotesChange={updateNotes}
          />
        </div>
      </Step>

      <Step>
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Skylight Details</h2>
            <p className="text-muted-foreground">
              Choose your skylight specifications
            </p>
          </div>
          <StepSix
            data={formData.skylightDetails}
            roofPitch={formData.roofDetails.pitch}
            notes={formData.notes["step6"] || ""}
            onDataChange={updateSkylightDetails}
            onNotesChange={updateNotes}
          />
        </div>
      </Step>

      <Step>
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Additional Skylights</h2>
            <p className="text-muted-foreground">
              Add any additional skylights (optional)
            </p>
          </div>
          <StepSeven
            data={formData.additionalSkylights}
            roofPitch={formData.roofDetails.pitch}
            notes={formData.notes["step7"] || ""}
            onDataChange={updateAdditionalSkylights}
            onNotesChange={updateNotes}
          />
        </div>
      </Step>

      <Step>
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Property Details</h2>
            <p className="text-muted-foreground">
              Final details about your property
            </p>
          </div>
          <StepEight
            data={formData.propertyDetails}
            notes={formData.notes["step8"] || ""}
            onDataChange={updatePropertyDetails}
            onNotesChange={updateNotes}
          />
          <div className="mt-6">
            <ImageUpload
              images={formData.images}
              onImagesChange={updateImages}
            />
          </div>
        </div>
      </Step>
    </Stepper>
  );
}
