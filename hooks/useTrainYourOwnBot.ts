"use client";

import { useState, useEffect } from "react";
import { BotData, Message } from "@/lib/types";
import { useBotData } from "./useBotData";
import { useBotFileUpload } from "./useBotFileUpload";
import { useBotTrainingData } from "./useBotTrainingData";
import { useBotScraping } from "./useBotScraping";
import { useBotChat } from "./useBotChat";
import { useBotSteps } from "./useBotSteps";
import { useBotSharing } from "./useBotSharing";
import { toast } from "sonner";

export function useTrainYourOwnBot() {
  const [manualTrainingData, setManualTrainingData] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Use bot data hook
  const { botData, setBotData, updateBotData } = useBotData();

  // Use file upload hook
  const { handleFileUpload, removeFile } = useBotFileUpload({
    botData,
    setBotData,
    setError,
  });

  // Use training data hook
  useBotTrainingData({
    botData,
    manualTrainingData,
    setBotData,
  });

  // Use scraping hook
  const { isScraping, scrapeWebsiteIfProvided } = useBotScraping({
    botData,
    setBotData,
    setError,
  });

  // Use chat hook
  const {
    messages,
    inputMessage,
    isLoading,
    error: chatError,
    messagesEndRef,
    setMessages,
    setInputMessage,
    setError: setChatError,
    sendMessage,
    handleKeyPress,
  } = useBotChat({
    botData,
  });

  // Sync chat error with main error state
  useEffect(() => {
    if (chatError) {
      setError(chatError);
    }
  }, [chatError, setError]);

  // Use steps hook
  const { currentStep, setCurrentStep, nextStep, prevStep, canProceedToNext } =
    useBotSteps({
      botData,
      manualTrainingData,
    });

  // Use sharing hook
  const { isCopied, shareConversation } = useBotSharing({
    botData,
    messages,
  });

  // Bot data saving function
  const saveBotData = async () => {
    console.log("Bot Data:", botData);
    setError(null);

    // Training data is already auto-combined from all sources
    const allTrainingData = botData.trainingData;

    // Generate intelligent opening message based on training data
    let openingMessage = "";

    if (allTrainingData.trim()) {
      try {
        // Call AI to generate a relevant opening message
        const response = await fetch("/api/generate-opening", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            botName: botData.name,
            botPersonality: botData.personality,
            trainingData: allTrainingData,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.openingMessage) {
            openingMessage = data.openingMessage;
          }
        }
      } catch (err) {
        console.error("Failed to generate opening message:", err);
      }
    }

    // Fallback to basic opening if AI generation fails
    if (!openingMessage) {
      const companyName = botData.name || "this business";
      openingMessage = `Hello! I'm ${
        botData.name || "your assistant"
      } from ${companyName}. I'm here to help you with your business needs. How can I assist you today?`;
    }

    // Create the opening message
    const openingMsg: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: openingMessage,
      timestamp: new Date(),
    };

    // Add the opening message to the conversation
    setMessages([openingMsg]);

    // Here you could save to a database or local storage
    toast.success("Bot data saved! Your bot is ready to chat.");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    // State
    currentStep,
    botData,
    manualTrainingData,
    messages,
    inputMessage,
    isLoading,
    isScraping,
    error,
    isCopied,
    messagesEndRef,

    // Setters
    setBotData,
    setManualTrainingData,
    setInputMessage,
    setError,
    setMessages,

    // Functions
    nextStep,
    prevStep,
    canProceedToNext,
    handleFileUpload,
    removeFile,
    saveBotData,
    sendMessage,
    handleKeyPress,
    shareConversation,
    scrollToTop,
    scrapeWebsiteIfProvided,
  };
}
