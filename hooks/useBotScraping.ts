"use client";

import { useState, useCallback } from "react";
import { BotData } from "@/lib/types";

export interface UseBotScrapingOptions {
  botData: BotData;
  setBotData: React.Dispatch<React.SetStateAction<BotData>>;
  setError: (error: string | null) => void;
}

export interface UseBotScrapingReturn {
  isScraping: boolean;
  scrapeWebsiteIfProvided: () => Promise<void>;
}

export function useBotScraping({
  botData,
  setBotData,
  setError,
}: UseBotScrapingOptions): UseBotScrapingReturn {
  const [isScraping, setIsScraping] = useState(false);

  const scrapeWebsiteIfProvided = useCallback(async () => {
    if (!botData.websiteUrl.trim()) return;
    setIsScraping(true);
    setError(null);

    try {
      const response = await fetch("/api/scrape-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: botData.websiteUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const scrapedData = await response.json();

      if (scrapedData.error) {
        const errorMessage = `Failed to scrape website: ${scrapedData.error}`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const websiteContent = `Title: ${scrapedData.title}
Content: ${scrapedData.content}
${
  scrapedData.links.length > 0 ? `Links: ${scrapedData.links.join("\n")}` : ""
}`;

      try {
        const analysisResponse = await fetch("/api/analyse-business", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ websiteData: websiteContent }),
        });

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          if (analysisData.success && analysisData.businessAnalysis) {
            setBotData((prev: BotData) => ({
              ...prev,
              websiteContent: analysisData.businessAnalysis,
            }));
          }
        }
      } catch (analysisError) {
        console.error("Business analysis failed:", analysisError);
        setBotData((prev: BotData) => ({
          ...prev,
          websiteContent: "",
        }));
      }
    } catch (err) {
      setError(
        `Error scraping website: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsScraping(false);
    }
  }, [botData.websiteUrl, setBotData, setError]);

  return {
    isScraping,
    scrapeWebsiteIfProvided,
  };
}

