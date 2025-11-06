"use client";

import { useEffect, useRef } from "react";
import { BotData, UploadedFile } from "@/lib/types";

export interface UseBotTrainingDataOptions {
  botData: BotData;
  manualTrainingData: string;
  setBotData: React.Dispatch<React.SetStateAction<BotData>>;
}

export function useBotTrainingData({
  botData,
  manualTrainingData,
  setBotData,
}: UseBotTrainingDataOptions) {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // Auto-update training data when name, personality, website content, or files change
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer with 500ms debounce
    debounceTimerRef.current = setTimeout(() => {
      // Combine all sources
      const personalityTrainingData = botData.personality
        ? `Bot Name: ${botData.name}\n\nBot Personality and Behavior Guidelines:\n${botData.personality}\n\n`
        : botData.name
        ? `Bot Name: ${botData.name}\n\n`
        : "";

      const websiteTrainingData = botData.websiteContent
        ? botData.websiteContent + "\n\n"
        : "";
      const filesTrainingData =
        botData.files && botData.files.length > 0
          ? botData.files
              .map((f: UploadedFile) => `File: ${f.name}\n${f.content}`)
              .join("\n\n") + "\n\n"
          : "";

      const manualData = manualTrainingData
        ? `Additional Training Data:\n${manualTrainingData}\n\n`
        : "";

      // Combine everything
      const combinedTrainingData = [
        personalityTrainingData,
        websiteTrainingData,
        filesTrainingData,
        manualData,
      ]
        .filter(Boolean)
        .join("\n");

      setBotData((prev: BotData) => ({
        ...prev,
        trainingData: combinedTrainingData,
      }));
    }, 500);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    botData.name,
    botData.personality,
    botData.websiteContent,
    botData.files,
    manualTrainingData,
    setBotData,
  ]);
}

