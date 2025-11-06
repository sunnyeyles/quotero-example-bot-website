"use client";

import { useState, useEffect, useCallback } from "react";
import { BotData } from "@/lib/types";
import LZString from "lz-string";

const DEFAULT_STYLE = {
  borderRadius: "0rem",
  font: "inter" as const,
};

const DEFAULT_BOT_DATA: BotData = {
  name: "",
  personality: "",
  trainingData: "",
  files: [],
  websiteUrl: "",
  websiteContent: "",
  suggestedQuestions: [],
  style: DEFAULT_STYLE,
};

export interface UseBotDataReturn {
  botData: BotData;
  setBotData: React.Dispatch<React.SetStateAction<BotData>>;
  updateBotData: (updates: Partial<BotData>) => void;
}

export function useBotData(): UseBotDataReturn {
  const [botData, setBotData] = useState<BotData>(DEFAULT_BOT_DATA);

  // Persist botData to sessionStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("botData", JSON.stringify(botData));
      } catch {
        // Ignore storage errors
      }
    }
  }, [botData]);

  // Initialize state from sessionStorage after component mounts to prevent hydration mismatch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("botData");
      if (stored) {
        try {
          const parsedData = JSON.parse(stored);
          setBotData({
            ...parsedData,
            suggestedQuestions: parsedData.suggestedQuestions || [],
            style: {
              ...DEFAULT_STYLE,
              ...(parsedData.style || {}),
            },
          });
        } catch (error) {
          console.error("Failed to parse stored bot data:", error);
        }
      }
    }
  }, []);

  // Load shared conversation from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      if (hash) {
        try {
          const decompressed = LZString.decompressFromEncodedURIComponent(hash);
          if (decompressed) {
            const sharedData = JSON.parse(decompressed);
            if (sharedData.botData) {
              // Ensure all fields exist with defaults
              setBotData({
                name: sharedData.botData.name || "",
                personality: sharedData.botData.personality || "",
                trainingData: sharedData.botData.trainingData || "",
                files: sharedData.botData.files || [],
                websiteUrl: sharedData.botData.websiteUrl || "",
                websiteContent: sharedData.botData.websiteContent || "",
                suggestedQuestions: sharedData.botData.suggestedQuestions || [],
                style: {
                  ...DEFAULT_STYLE,
                  ...((sharedData.botData.style as BotData["style"]) || {}),
                },
              });
            }
            // Clear the hash after loading
            window.history.replaceState(null, "", window.location.pathname);
          }
        } catch (error) {
          console.error("Failed to load shared conversation:", error);
        }
      }
    }
  }, []);

  const updateBotData = useCallback((updates: Partial<BotData>) => {
    setBotData((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    botData,
    setBotData,
    updateBotData,
  };
}

