"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Upload,
  Send,
  X,
  Bot,
  User,
  Loader2,
  Share2,
  Check,
} from "lucide-react";
import { useTrainYourOwnBot } from "@/hooks/useTrainYourOwnBot";
import Stepper, { Step } from "@/components/ui/form-stepper";

export default function TrainYourOwnBot() {
  const {
    // State
    botData,
    manualTrainingData,
    messages,
    inputMessage,
    isLoading,
    error,
    isCopied,
    messagesEndRef,

    // Setters
    setBotData,
    setManualTrainingData,
    setInputMessage,
    setMessages,

    // Functions
    handleFileUpload,
    removeFile,
    sendMessage,
    handleKeyPress,
    shareConversation,
    scrapeWebsiteIfProvided,
  } = useTrainYourOwnBot();

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Train Your Own Bot
        </h1>
        <p className="text-sm sm:text-base">
          We create intelligent AI assistants tailored to your business needs.
          Our custom bots handle customer inquiries, streamline operations, and
          boost productivity so you can focus on growing your business.
        </p>
      </div>

      <Stepper
        initialStep={1}
        onStepChange={async (step) => {
          // When moving from step 1 to 2, submit Website URL (scrape + analyze)
          if (step === 2 && botData.websiteUrl?.trim()) {
            await scrapeWebsiteIfProvided();
          }
        }}
        onFinalStepCompleted={() => {
          // Optional: handle completion
        }}
        stepNames={["Bot Identity & Content Feed", "Preview", "Test Bot"]}
        showFinalStepButtons={false}
      >
        <Step>
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Bot Identity & Content Feed
              </h2>
              <p className="text-muted-foreground">
                Define your bot&apos;s personality and provide knowledge sources
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Personality traits *
                </label>
                <Textarea
                  value={botData.personality}
                  onChange={(e) =>
                    setBotData((prev) => ({
                      ...prev,
                      personality: e.target.value,
                    }))
                  }
                  placeholder="Friendly, professional, knowledgeable, concise..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="pt-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Website URL
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
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
                        }
                      }}
                      placeholder="https://example.com"
                      className="flex-1"
                    />
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
                            className="flex items-center p-2 rounded border text-xs min-w-0"
                          >
                            <Upload className="w-3 h-3 mr-1 shrink-0" />
                            <span className="truncate max-w-20 sm:max-w-32">
                              {file.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="ml-1 shrink-0"
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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Additional Training Data
                  </label>
                  <Textarea
                    value={manualTrainingData}
                    onChange={(e) => setManualTrainingData(e.target.value)}
                    placeholder="Add any additional information about your business, products, services, or policies..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </Step>

        <Step>
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Preview Training Data</h2>
              <p className="text-muted-foreground">
                Review and edit your bot&apos;s training data before testing
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Training Data (Editable)
              </label>
              <Textarea
                value={botData.trainingData}
                onChange={(e) =>
                  setBotData((prev) => ({
                    ...prev,
                    trainingData: e.target.value,
                  }))
                }
                placeholder="Your combined training data will appear here automatically"
                className="min-h-[400px]"
              />
            </div>
          </div>
        </Step>

        <Step>
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Test Your Bot</h2>
              <p className="text-muted-foreground">
                Try out your bot and see how it responds to different questions
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Chat with Your Bot
                </label>
                <Card className="p-4 h-[400px] flex flex-col">
                  {error && (
                    <div className="mb-4 p-3 rounded border text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <Bot className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">
                          Start a conversation with your bot!
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
                            className={`max-w-[80%] rounded-lg p-2 text-xs ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              {message.role === "assistant" && (
                                <Bot className="w-3 h-3 mt-0.5 shrink-0" />
                              )}
                              {message.role === "user" && (
                                <User className="w-3 h-3 mt-0.5 shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs wrap-break-word">
                                  {message.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="rounded-lg p-2 flex items-center space-x-2">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span className="text-xs">Bot is thinking...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) =>
                        handleKeyPress(
                          e as unknown as React.KeyboardEvent<HTMLTextAreaElement>
                        )
                      }
                      placeholder="Type your message..."
                      disabled={isLoading}
                      className="text-xs flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      size="sm"
                    >
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    variant="outline"
                    onClick={shareConversation}
                    disabled={messages.length === 0}
                    className="w-full sm:w-auto"
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
                  <Button
                    variant="outline"
                    onClick={() => setMessages([])}
                    disabled={messages.length === 0}
                    className="w-full sm:w-auto"
                  >
                    Clear Conversation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}
