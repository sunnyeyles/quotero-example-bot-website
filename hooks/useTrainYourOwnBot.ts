"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Message,
  BotData,
  UploadedFile,
  ChatRequest,
  ChatResponse,
} from "@/lib/types";
import mammoth from "mammoth";
import LZString from "lz-string";
import { toast } from "sonner";

export function useTrainYourOwnBot() {
  // State management - Initialize with default values to prevent hydration mismatch
  const [currentStep, setCurrentStep] = useState(1);
  const [botData, setBotData] = useState<BotData>({
    name: "",
    personality: "",
    trainingData: "",
    files: [],
    websiteUrl: "",
    websiteContent: "",
  });

  const [manualTrainingData, setManualTrainingData] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // Utility functions
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Step validation functions
  const isStep1Valid = useCallback(() => {
    return botData.name.trim() !== "" && botData.personality.trim() !== "";
  }, [botData.name, botData.personality]);

  const isStep2Valid = useCallback(() => {
    return (
      botData.websiteUrl.trim() !== "" ||
      botData.files.length > 0 ||
      manualTrainingData.trim() !== ""
    );
  }, [botData.websiteUrl, botData.files.length, manualTrainingData]);

  const isStep3Valid = useCallback(() => {
    return botData.trainingData.trim() !== "";
  }, [botData.trainingData]);

  const isStep4Valid = useCallback(() => {
    return botData.trainingData.trim() !== "";
  }, [botData.trainingData]);

  // Navigation functions
  const nextStep = useCallback(async () => {
    if (currentStep < 4) {
      // If moving from step 2 to step 3, scrape website if URL is provided
      if (currentStep === 2 && botData.websiteUrl.trim()) {
        // Inline website scraping logic to avoid circular dependency
        setIsScraping(true);
        setError(null);

        try {
          // Use server-side scraping to avoid CORS issues
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
            setError(`Failed to scrape website: ${scrapedData.error}`);
            return;
          }

          const websiteContent = `Title: ${scrapedData.title}
Content: ${scrapedData.content}
${
  scrapedData.links.length > 0 ? `Links: ${scrapedData.links.join("\n")}` : ""
}`;

          // Now call the business analysis API to get intelligent insights
          try {
            const analysisResponse = await fetch("/api/analyze-business", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ websiteData: websiteContent }),
            });

            if (analysisResponse.ok) {
              const analysisData = await analysisResponse.json();
              if (analysisData.success && analysisData.businessAnalysis) {
                // Only set website content if we have AI-generated natural language analysis
                setBotData((prev: BotData) => ({
                  ...prev,
                  websiteContent: analysisData.businessAnalysis,
                }));
              }
            }
          } catch (analysisError) {
            console.error("Business analysis failed:", analysisError);
            // Don't set any website content if analysis fails
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
      }
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, botData.websiteUrl]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const canProceedToNext = useCallback(() => {
    switch (currentStep) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      case 4:
        return isStep4Valid();
      default:
        return false;
    }
  }, [currentStep, isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid]);

  // File handling functions
  const isValidFileType = useCallback((file: File): boolean => {
    const validTypes = [
      "text/plain",
      "text/markdown",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return (
      validTypes.includes(file.type) ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".doc") ||
      file.name.endsWith(".docx")
    );
  }, []);

  const extractTextFromFile = useCallback(
    async (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
          try {
            const content = e.target?.result;
            if (!content) {
              reject(new Error("Failed to read file content"));
              return;
            }

            if (
              file.type === "application/msword" ||
              file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
              // Handle Word documents
              const result = await mammoth.extractRawText({
                arrayBuffer: content as ArrayBuffer,
              });
              resolve(result.value);
            } else {
              // Handle text files
              resolve(content as string);
            }
          } catch (err) {
            reject(err);
          }
        };

        reader.onerror = () => reject(new Error("Failed to read file"));

        if (
          file.type === "application/msword" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsText(file);
        }
      });
    },
    []
  );

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      for (const file of Array.from(files)) {
        if (!isValidFileType(file)) {
          setError(
            `Invalid file type: ${file.name}. Please upload .txt, .md, .doc, or .docx files.`
          );
          continue;
        }

        try {
          const content = await extractTextFromFile(file);
          const uploadedFile: UploadedFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            content,
            size: file.size,
          };

          setBotData((prev: BotData) => ({
            ...prev,
            files: [...prev.files, uploadedFile],
          }));
        } catch (err) {
          setError(
            `Error processing file ${file.name}: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
        }
      }
    },
    [isValidFileType, extractTextFromFile]
  );

  const removeFile = useCallback((fileId: string) => {
    setBotData((prev: BotData) => {
      const fileToRemove = prev.files.find((f) => f.id === fileId);
      if (!fileToRemove) return prev;

      const updatedFiles = prev.files.filter((f) => f.id !== fileId);

      return {
        ...prev,
        files: updatedFiles,
      };
    });
  }, []);

  // Bot data saving function
  const saveBotData = useCallback(async () => {
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
  }, [botData]);

  // Chat functions
  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !botData.name || !botData.personality) {
      setError(
        "Please provide a message and complete bot configuration (name and personality)"
      );
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      const request: ChatRequest = {
        message: inputMessage,
        botData,
        conversationHistory: messages,
      };

      const response = await fetch("/api/bots/train-your-own", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data: ChatResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev: Message[]) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, botData, messages]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  // Sharing function
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
      setError("Failed to share conversation");
      console.error("Share error:", error);
    }
  }, [botData, messages]);

  // Effects
  // Initialize state from sessionStorage after component mounts to prevent hydration mismatch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("botData");
      if (stored) {
        try {
          const parsedData = JSON.parse(stored);
          setBotData(parsedData);
          // If we have name and personality from homepage, start at step 2
          if (parsedData.name && parsedData.personality) {
            setCurrentStep(2);
          }
        } catch (error) {
          console.error("Failed to parse stored bot data:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

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
              });
            }
            if (sharedData.messages && Array.isArray(sharedData.messages)) {
              // Convert timestamp strings back to Date objects
              const messagesWithDates = sharedData.messages.map(
                (msg: Message) => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp),
                })
              );
              setMessages(messagesWithDates);
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
  ]);

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
  };
}
