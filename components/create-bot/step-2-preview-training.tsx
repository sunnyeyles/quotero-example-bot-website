"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface Step2PreviewTrainingProps {
  trainingData: string;
  setTrainingData: (value: string) => void;
}

export function Step2PreviewTraining({
  trainingData,
  setTrainingData,
}: Step2PreviewTrainingProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-3">
          Training Data (Editable)
        </label>
        <Textarea
          value={trainingData}
          onChange={(e) => setTrainingData(e.target.value)}
          placeholder="Your combined training data will appear here automatically"
          className="min-h-[400px]"
        />
      </div>
    </div>
  );
}

