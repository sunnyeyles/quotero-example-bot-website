"use client";

import { useState, useCallback } from "react";
import { BotData, Message } from "@/lib/types";
import LZString from "lz-string";

export interface UseBotSharingOptions {
  botData: BotData;
  messages: Message[];
}

export interface UseBotSharingReturn {
  isCopied: boolean;
  shareConversation: () => Promise<void>;
}

export function useBotSharing({
  botData,
  messages,
}: UseBotSharingOptions): UseBotSharingReturn {
  const [isCopied, setIsCopied] = useState(false);

  const shareConversation = useCallback(async () => {
    try {
      // Create shareable data object with all fields
      const shareableData = {
        botData: {
          ...botData,
          files: [], // Don't share file uploads, just the content
        },
        messages: messages,
      };

      // Compress and encode the data
      const jsonString = JSON.stringify(shareableData);
      const compressed = LZString.compressToEncodedURIComponent(jsonString);

      // Create the shareable URL
      const shareableUrl = `${window.location.origin}${window.location.pathname}#${compressed}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareableUrl);

      // Show success feedback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      console.error("Share error:", error);
      throw new Error("Failed to share conversation");
    }
  }, [botData, messages]);

  return {
    isCopied,
    shareConversation,
  };
}

