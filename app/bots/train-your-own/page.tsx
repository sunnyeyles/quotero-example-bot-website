"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Message,
  BotData,
  UploadedFile,
  ChatRequest,
  ChatResponse,
} from "@/lib/types";
import { Upload, Send, X, Bot, User, Loader2, Globe } from "lucide-react";
import mammoth from "mammoth";
import { scrapeWebsite } from "@/lib/web-scraper";

export default function TrainYourOwnBot() {
  const [botData, setBotData] = useState<BotData>({
    name: "",
    personality: "",
    trainingData: "",
    files: [],
    websiteUrl: "",
    websiteContent: "",
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

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
          trainingData:
            prev.trainingData + (prev.trainingData ? "\n\n" : "") + content,
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
      const updatedTrainingData = prev.trainingData
        .replace(fileToRemove.content, "")
        .replace(/\n\n+/g, "\n\n")
        .trim();

      return {
        ...prev,
        files: updatedFiles,
        trainingData: updatedTrainingData,
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

      const websiteContent = `Website: ${botData.websiteUrl}
Title: ${scrapedData.title}
Content: ${scrapedData.content}
${
  scrapedData.links.length > 0 ? `Links: ${scrapedData.links.join("\n")}` : ""
}`;

      // Create a summary for the manual data textarea
      const websiteSummary = `Website Summary:
URL: ${botData.websiteUrl}
Title: ${scrapedData.title}
Key Content: ${scrapedData.content.substring(0, 500)}${
        scrapedData.content.length > 500 ? "..." : ""
      }
${
  scrapedData.links.length > 0
    ? "Important Links: " + scrapedData.links.slice(0, 5).join(", ")
    : ""
}`;

      // First, set the raw website content
      setBotData((prev) => ({
        ...prev,
        websiteContent,
      }));

      // Website data loaded successfully

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
            // Update both website content and manual data with the AI-generated business analysis
            setBotData((prev) => ({
              ...prev,
              websiteContent: analysisData.businessAnalysis,
              trainingData: analysisData.businessAnalysis,
            }));
          }
        }
      } catch (analysisError) {
        console.error("Business analysis failed:", analysisError);
        // Keep the raw content if analysis fails
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

    // Combine all training data sources
    const allTrainingData = [
      botData.trainingData,
      botData.websiteContent,
      ...botData.files.map((f) => f.content),
    ]
      .filter(Boolean)
      .join("\n\n");

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Train Your Own Bot
          </h1>
          <p className="text-gray-600">
            Create a custom AI assistant for your Australian small business
          </p>
        </div>

        {/* Main Training Area */}
        <Card className="p-6 mb-8">
          {/* Two Equal Containers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Container: Bot Config + Website Data + Upload Files */}
            <div className="space-y-6">
              {/* Bot Configuration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Bot Configuration
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
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
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
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
                      className="w-full h-16"
                    />
                  </div>
                </div>
              </div>

              {/* Website Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Website Data
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
                    placeholder="https://example.com"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleWebsiteScrape}
                    disabled={isScraping || !botData.websiteUrl}
                    variant="outline"
                    className="px-6"
                  >
                    {isScraping ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Scraping...
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        Scrape Website
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Files
                </label>

                {/* File Thumbnails */}
                {botData.files.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {botData.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center bg-gray-50 p-2 rounded border text-xs"
                        >
                          <Upload className="w-3 h-3 text-blue-600 mr-1" />
                          <span className="text-gray-700 truncate max-w-20">
                            {file.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto ml-1"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
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

            {/* Right Container: Training Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Training Data
              </label>
              <Textarea
                value={botData.trainingData}
                onChange={(e) =>
                  setBotData((prev) => ({
                    ...prev,
                    trainingData: e.target.value,
                  }))
                }
                placeholder="Add FAQs, company info, etc."
                className="w-full min-h-[400px]"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={saveBotData}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!botData.name || !botData.personality}
            >
              Save Bot Configuration
            </Button>
          </div>
        </Card>

        {/* Summary and Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bot Summary Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 h-[600px] flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Conversation Summary
                </h2>
              </div>

              <div className="space-y-4 flex-1">
                {/* Conversation Overview */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    What we're discussing
                  </h3>
                  {messages.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No conversation yet. Start chatting to see topics here.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{messages.length}</span>{" "}
                        messages exchanged
                      </div>
                      <div className="text-sm text-gray-600">
                        Last message:{" "}
                        {messages[
                          messages.length - 1
                        ]?.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Topics */}
                {messages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Recent Topics
                    </h3>
                    <div className="space-y-1">
                      {messages.slice(-3).map((message, index) => (
                        <div
                          key={message.id}
                          className="text-xs text-gray-600 bg-gray-50 p-2 rounded"
                        >
                          <div className="flex items-center mb-1">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                message.role === "user"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            <span className="font-medium">
                              {message.role === "user" ? "You" : "Bot"}
                            </span>
                          </div>
                          <p className="line-clamp-2">
                            {message.content.substring(0, 100)}
                            {message.content.length > 100 && "..."}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bot Context */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Bot Context
                  </h3>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Name:</span>{" "}
                      {botData.name || "Not set"}
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Personality:</span>{" "}
                      {botData.personality ? "Configured" : "Not set"}
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Training:</span>{" "}
                      {botData.trainingData.trim() ||
                      botData.files.length > 0 ||
                      botData.websiteUrl
                        ? "Data loaded"
                        : "No data"}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setMessages([])}
                      disabled={messages.length === 0}
                    >
                      Clear Conversation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={saveBotData}
                      disabled={!botData.name || !botData.personality}
                    >
                      Save Bot
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-[600px] flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Test Your Bot
                </h2>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Bot className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Start a conversation with your bot!</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Make sure to configure your bot and add training data
                      first
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900"
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
                    <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-600">
                        Bot is thinking...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
