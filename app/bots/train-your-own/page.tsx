"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Message,
  BotData,
  UploadedFile,
  ChatRequest,
  ChatResponse,
} from "@/lib/types";
import {
  Upload,
  Send,
  X,
  Bot,
  User,
  Loader2,
  Globe,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import mammoth from "mammoth";
import LZString from "lz-string";

export default function TrainYourOwnBot() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

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
              .map((f) => `File: ${f.name}\n${f.content}`)
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

      setBotData((prev) => ({
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

        setBotData((prev) => ({
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
  };

  const isValidFileType = (file: File): boolean => {
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
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
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
  };

  const removeFile = (fileId: string) => {
    setBotData((prev) => {
      const fileToRemove = prev.files.find((f) => f.id === fileId);
      if (!fileToRemove) return prev;

      const updatedFiles = prev.files.filter((f) => f.id !== fileId);

      return {
        ...prev,
        files: updatedFiles,
      };
    });
  };

  const handleWebsiteScrape = async () => {
    if (!botData.websiteUrl) {
      setError("Please enter a website URL");
      return;
    }

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
      // Only store the parsed natural language content in training data
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
            setBotData((prev) => ({
              ...prev,
              websiteContent: analysisData.businessAnalysis,
            }));
          }
        }
      } catch (analysisError) {
        console.error("Business analysis failed:", analysisError);
        // Don't set any website content if analysis fails
        setBotData((prev) => ({
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
  };

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
    alert("Bot data saved! Your bot is ready to chat.");
  };

  const sendMessage = async () => {
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

    setMessages((prev) => [...prev, userMessage]);
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

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const shareConversation = async () => {
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
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Train Your Own Bot</h1>
        <p>Create a custom AI assistant for your Australian small business</p>
      </div>

      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Bot Configuration
              </label>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bot Name
                  </label>
                  <Input
                    value={botData.name}
                    onChange={(e) =>
                      setBotData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g., Sarah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Personality
                  </label>
                  <Textarea
                    value={botData.personality}
                    onChange={(e) =>
                      setBotData((prev) => ({
                        ...prev,
                        personality: e.target.value,
                      }))
                    }
                    placeholder="Friendly, professional..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Paste Your Website URL
              </label>
              <div className="flex space-x-3">
                <Input
                  value={botData.websiteUrl}
                  onChange={(e) =>
                    setBotData((prev) => ({
                      ...prev,
                      websiteUrl: e.target.value,
                    }))
                  }
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData("text");
                    if (pastedText && pastedText.trim()) {
                      setBotData((prev) => ({
                        ...prev,
                        websiteUrl: pastedText.trim(),
                      }));
                      // Small delay to ensure state is updated before scraping
                      setTimeout(() => {
                        handleWebsiteScrape();
                      }, 100);
                    }
                  }}
                  placeholder="https://example.com"
                />
                <Button
                  onClick={handleWebsiteScrape}
                  disabled={isScraping || !botData.websiteUrl}
                  variant="outline"
                >
                  {isScraping ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      Get Website Data
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Upload Training Data Files
              </label>

              {botData.files && botData.files.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {botData.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center p-2 rounded border text-xs"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-20">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <input
                  type="file"
                  multiple
                  accept=".txt,.md,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              Training Data (Auto-generated from all sources)
            </label>
            <Textarea
              value={botData.trainingData}
              readOnly
              placeholder="Your combined training data will appear here automatically"
              className="min-h-[400px] bg-white"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <Button
            onClick={saveBotData}
            className="w-full"
            disabled={!botData.name || !botData.personality}
          >
            Save Bot Configuration
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6 h-[600px] flex flex-col">
            <div className="flex items-center mb-4">
              <Bot className="w-4 h-4 mr-3" />
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={scrollToTop}
                >
                  Update Bot Training
                </Button>
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={shareConversation}
                  disabled={messages.length === 0 || !botData.name}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Your Bot
                    </>
                  )}
                </Button>
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setMessages([])}
                  disabled={messages.length === 0}
                >
                  Clear Conversation
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-6 h-[600px] flex flex-col">
            <div className="flex items-center mb-4">
              <Bot className="w-4 h-4 mr-3" />
              <h2 className="text-xl font-semibold">Test Your Bot</h2>
            </div>

            {error && <div className="mb-4 p-3 rounded border">{error}</div>}

            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 mx-auto mb-2" />
                  <p>Start a conversation with your bot!</p>
                  <p className="text-sm mt-1">
                    Make sure to configure your bot and add training data first
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === "assistant" && (
                          <Bot className="w-4 h-4 mt-1 shrink-0" />
                        )}
                        {message.role === "user" && (
                          <User className="w-4 h-4 mt-1 shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg p-3 flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Bot is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
