"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Step1BotIdentity } from "./step-1-bot-identity";
import { Step2PreviewTraining } from "./step-2-preview-training";
import { Step4TestBot } from "./step-4-test-bot";
import { useTrainYourOwnBot } from "@/hooks/useTrainYourOwnBot";
import { BotData } from "@/lib/types";

const DEFAULT_STYLE = {
  borderRadius: "0rem",
  font: "inter" as const,
};

export const GeneratedForm = () => {
  const [step, setStep] = useState(0);
  const totalSteps = 3; // Temporarily 3 steps (styling step commented out)
  const hasGeneratedOpening = useRef(false);

  // Use the hook for bot functionality
  const {
    botData,
    setBotData,
    manualTrainingData,
    setManualTrainingData,
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isLoading,
    isScraping,
    sendMessage,
    messagesEndRef,
    error,
    handleFileUpload: hookHandleFileUpload,
    removeFile: hookRemoveFile,
    scrapeWebsiteIfProvided,
  } = useTrainYourOwnBot();

  // Local state for styling (Step 3)
  const [borderRadius] = useState(DEFAULT_STYLE.borderRadius);
  const [font] = useState<
    "inter" | "spaceGrotesk" | "spaceMono" | "jetbrainsMono"
  >(DEFAULT_STYLE.font);

  // Convert UploadedFile[] to File[] for Step1BotIdentity compatibility (for display only)
  const files = botData.files.map((uploadedFile) => {
    // Create a File-like object for display purposes
    const blob = new Blob([uploadedFile.content], { type: uploadedFile.type });
    return new File([blob], uploadedFile.name, { type: uploadedFile.type });
  });

  // Uploaded files for display in Step1BotIdentity
  const uploadedFiles = botData.files.map((f) => ({ id: f.id, name: f.name }));

  // Sync botData style with local style state
  useEffect(() => {
    setBotData((prev: BotData) => ({
      ...prev,
      style: {
        borderRadius,
        font,
      },
    }));
  }, [borderRadius, font, setBotData]);

  // Sync personality and websiteUrl with botData
  const personality = botData.personality;
  const setPersonality = (value: string) => {
    setBotData((prev: BotData) => ({ ...prev, personality: value }));
  };

  const websiteUrl = botData.websiteUrl;
  const setWebsiteUrl = (value: string) => {
    setBotData((prev: BotData) => ({ ...prev, websiteUrl: value }));
  };

  // Training data is managed by the hook
  const trainingData = botData.trainingData;

  // Auto-scroll messages (handled by hook, but ensure it works)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Generate opening message when entering Step 3 (Test Bot) - was Step 4 before styling step was commented out
  useEffect(() => {
    // Only proceed if we're on Step 3 (Test Bot) - step 2 in 0-indexed
    if (step !== 2) {
      return;
    }

    // Check conditions
    console.log("Step 3 (Test Bot) opened - checking conditions:", {
      step,
      messagesLength: messages.length,
      botName: botData.name,
      hasGenerated: hasGeneratedOpening.current,
      hasTrainingData: !!botData.trainingData,
      trainingDataLength: botData.trainingData?.length || 0,
    });

    // Only generate if messages are empty (or only has opening message) and we haven't generated yet
    // Check if there are no user messages (opening message is assistant message)
    const hasUserMessages = messages.some((msg) => msg.role === "user");
    const shouldGenerate = !hasUserMessages && !hasGeneratedOpening.current;

    if (shouldGenerate) {
      const generateOpeningMessage = async () => {
        // Check if we have training data, but don't require it (we'll use what we have)
        const trainingDataToUse =
          botData.trainingData || botData.websiteContent || "";

        console.log("Generating opening message with:", {
          botName: botData.name,
          personality: botData.personality,
          hasTrainingData: !!botData.trainingData,
          trainingDataLength: botData.trainingData?.length || 0,
          websiteContentLength: botData.websiteContent?.length || 0,
          trainingDataToUseLength: trainingDataToUse.length,
        });

        try {
          const response = await fetch("/api/generate-opening", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              botName: botData.name || undefined,
              botPersonality: botData.personality || "friendly and helpful",
              trainingData: trainingDataToUse,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.openingMessage) {
              console.log("Generated opening message:", data.openingMessage);
              const openingMsg = {
                id: Date.now().toString(),
                role: "assistant" as const,
                content: data.openingMessage,
                timestamp: new Date(),
              };
              setMessages([openingMsg]);
              hasGeneratedOpening.current = true;
            } else {
              console.warn("No opening message in API response");
              // Fallback opening message
              const fallbackMsg = {
                id: Date.now().toString(),
                role: "assistant" as const,
                content: `Hello! How can I help you today?`,
                timestamp: new Date(),
              };
              setMessages([fallbackMsg]);
              hasGeneratedOpening.current = true;
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.error("API error response:", response.status, errorData);
            // Fallback opening message
            const fallbackMsg = {
              id: Date.now().toString(),
              role: "assistant" as const,
              content: `Hello! How can I help you today?`,
              timestamp: new Date(),
            };
            setMessages([fallbackMsg]);
            hasGeneratedOpening.current = true;
          }
        } catch (err) {
          console.error("Failed to generate opening message:", err);
          // Fallback opening message
          const fallbackMsg = {
            id: Date.now().toString(),
            role: "assistant" as const,
            content: `Hello! How can I help you today?`,
            timestamp: new Date(),
          };
          setMessages([fallbackMsg]);
          hasGeneratedOpening.current = true;
        }
      };

      // Add a delay to ensure training data is populated (training data hook has 500ms debounce)
      const timeoutId = setTimeout(() => {
        generateOpeningMessage();
      }, 600); // Increased delay to ensure training data is ready

      return () => clearTimeout(timeoutId);
    } else {
      console.log("Skipping opening message generation:", {
        messagesLength: messages.length,
        hasUserMessages,
        hasGenerated: hasGeneratedOpening.current,
      });
    }
  }, [
    step,
    botData.name,
    botData.personality,
    botData.trainingData,
    botData.websiteContent,
    messages,
    setMessages,
  ]);

  // Reset the flag when leaving Step 3 (Test Bot)
  useEffect(() => {
    if (step !== 2) {
      hasGeneratedOpening.current = false;
    }
  }, [step]);

  // Scroll form to center when step changes (only when triggered by button clicks)
  const scrollFormToCenter = () => {
    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      const formCard = document.querySelector(
        "[data-form-card]"
      ) as HTMLElement;
      if (formCard) {
        const cardRect = formCard.getBoundingClientRect();
        const cardCenter = cardRect.top + cardRect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const scrollOffset = cardCenter - viewportCenter;

        window.scrollBy({
          top: scrollOffset,
          behavior: "smooth",
        });
      }
    });
  };

  const handleSubmit = async () => {
    // If on step 0 (Bot Identity) and website URL is provided, scrape it first
    // If scraping fails, still allow proceeding (inputs are optional)
    if (step === 0 && botData.websiteUrl.trim()) {
      try {
        await scrapeWebsiteIfProvided();
        // Proceed to next step regardless of scraping result
        setStep(step + 1);
        // Scroll after step change
        setTimeout(() => {
          scrollFormToCenter();
        }, 100);
      } catch (err) {
        // Error is already handled by the hook and shown via toast
        // Still proceed to next step even if scraping failed (inputs are optional)
        console.error("Failed to scrape website:", err);
        setStep(step + 1);
        // Scroll after step change
        setTimeout(() => {
          scrollFormToCenter();
        }, 100);
      }
      return;
    }

    // For other steps, proceed normally
    if (step < totalSteps - 1) {
      setStep(step + 1);
      // Scroll after step change
      setTimeout(() => {
        scrollFormToCenter();
      }, 100);
    } else {
      console.log({
        personality: botData.personality,
        websiteUrl: botData.websiteUrl,
        files: botData.files.map((f) => f.name),
        manualTrainingData,
        trainingData: botData.trainingData,
        style: {
          borderRadius,
          font,
        },
        messages,
      });
      setStep(0);
      toast.success("Bot successfully created!");
      // Scroll after step change
      setTimeout(() => {
        scrollFormToCenter();
      }, 100);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      // Scroll after step change
      setTimeout(() => {
        scrollFormToCenter();
      }, 100);
    }
  };

  const handleSendMessage = async (messageOverride?: string) => {
    const messageToSend = messageOverride || inputMessage;
    if (!messageToSend.trim()) {
      toast.error("Please provide a message");
      return;
    }
    await sendMessage(messageOverride);
  };

  const handleClearMessages = async () => {
    setMessages([]);
    hasGeneratedOpening.current = false; // Reset flag so opening message can be regenerated
    // Regenerate opening message after clearing
    if (step === 2 && botData.trainingData) {
      try {
        const response = await fetch("/api/generate-opening", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            botName: botData.name || undefined,
            botPersonality: botData.personality || "friendly and helpful",
            trainingData: botData.trainingData,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.openingMessage) {
            const openingMsg = {
              id: Date.now().toString(),
              role: "assistant" as const,
              content: data.openingMessage,
              timestamp: new Date(),
            };
            setMessages([openingMsg]);
            hasGeneratedOpening.current = true;
          }
        } else {
          // Fallback opening message
          const fallbackMsg = {
            id: Date.now().toString(),
            role: "assistant" as const,
            content: `Hello! How can I help you today?`,
            timestamp: new Date(),
          };
          setMessages([fallbackMsg]);
          hasGeneratedOpening.current = true;
        }
      } catch (err) {
        console.error("Failed to generate opening message:", err);
        // Fallback opening message
        const fallbackMsg = {
          id: Date.now().toString(),
          role: "assistant" as const,
          content: `Hello! How can I help you today?`,
          timestamp: new Date(),
        };
        setMessages([fallbackMsg]);
        hasGeneratedOpening.current = true;
      }
    }
  };

  // Wrapper for key press that handles both Input and Textarea
  const handleKeyPressWrapper = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Wrapper for file upload that uses the hook's handler
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await hookHandleFileUpload(event);
  };

  // Wrapper for file removal
  const handleRemoveFile = (fileIdOrIndex: string | number) => {
    if (typeof fileIdOrIndex === "string") {
      hookRemoveFile(fileIdOrIndex);
    } else {
      // If it's an index, find the file by index and remove it
      const fileToRemove = botData.files[fileIdOrIndex];
      if (fileToRemove) {
        hookRemoveFile(fileToRemove.id);
      }
    }
  };

  const stepTitles = [
    "Bot Identity & Content Feed",
    "Preview Training Data",
    "Test Bot",
    // "Style Your Bot", // Commented out for now, will be re-enabled later
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "w-4 h-4 rounded-full transition-all duration-300 ease-in-out",
                index <= step ? "bg-primary" : "bg-primary/30",
                index < step && "bg-primary"
              )}
            />
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5",
                  index < step ? "bg-primary" : "bg-primary/30"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <Card className="shadow-sm min-h-[600px] flex flex-col" data-form-card>
        <CardHeader>
          <CardTitle className="text-lg">Create Your Bot</CardTitle>
          <CardDescription>
            {stepTitles[step]} - Step {step + 1} of {totalSteps}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center">
          <div className="w-full">
            {step === 0 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="grid gap-y-4"
              >
                <Step1BotIdentity
                  personality={personality}
                  setPersonality={setPersonality}
                  websiteUrl={websiteUrl}
                  setWebsiteUrl={setWebsiteUrl}
                  files={files}
                  manualTrainingData={manualTrainingData}
                  setManualTrainingData={setManualTrainingData}
                  onFileUpload={handleFileUpload}
                  onRemoveFile={handleRemoveFile}
                  uploadedFiles={uploadedFiles}
                  suggestedQuestions={botData.suggestedQuestions}
                  setSuggestedQuestions={(questions) => {
                    setBotData((prev: BotData) => ({
                      ...prev,
                      suggestedQuestions: questions,
                    }));
                  }}
                  onScrollToCenter={scrollFormToCenter}
                />

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    className="font-medium"
                    size="sm"
                    onClick={handleBack}
                    disabled={true}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="font-medium"
                    disabled={isScraping}
                  >
                    {isScraping ? "Training bot..." : "Next"}
                  </Button>
                </div>
              </form>
            )}

            {step === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="grid gap-y-4"
              >
                <Step2PreviewTraining
                  trainingData={trainingData}
                  setTrainingData={(value: string) => {
                    setBotData((prev: BotData) => ({
                      ...prev,
                      trainingData: value,
                    }));
                  }}
                />

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    className="font-medium"
                    size="sm"
                    onClick={handleBack}
                    disabled={false}
                  >
                    Back
                  </Button>
                  <Button type="submit" size="sm" className="font-medium">
                    Next
                  </Button>
                </div>
              </form>
            )}

            {/* Styling step commented out for now - will be re-enabled later */}
            {/* {step === 2 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="grid gap-y-4"
            >
              <div
                style={
                  {
                    "--radius-sm": borderRadius,
                    "--radius-md": borderRadius,
                    "--radius-lg": borderRadius,
                    "--radius-xl": borderRadius,
                  } as React.CSSProperties & {
                    "--radius-sm": string;
                    "--radius-md": string;
                    "--radius-lg": string;
                    "--radius-xl": string;
                  }
                }
              >
                <Step3StyleBot
                  borderRadius={borderRadius}
                  setBorderRadius={setBorderRadius}
                  font={font}
                  setFont={(value: string) => {
                    if (
                      value === "inter" ||
                      value === "spaceGrotesk" ||
                      value === "spaceMono" ||
                      value === "jetbrainsMono"
                    ) {
                      setFont(value);
                    }
                  }}
                  onReset={handleResetStyle}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  className="font-medium"
                  size="sm"
                  onClick={handleBack}
                  disabled={step <= 0}
                >
                  Back
                </Button>
                <Button type="submit" size="sm" className="font-medium">
                  Next
                </Button>
              </div>
            </form>
          )} */}

            {step === 2 && (
              <div className="grid gap-y-4">
                <div
                  style={
                    {
                      "--radius-sm": borderRadius,
                      "--radius-md": borderRadius,
                      "--radius-lg": borderRadius,
                      "--radius-xl": borderRadius,
                    } as React.CSSProperties & {
                      "--radius-sm": string;
                      "--radius-md": string;
                      "--radius-lg": string;
                      "--radius-xl": string;
                    }
                  }
                >
                  <Step4TestBot
                    messages={messages}
                    inputMessage={inputMessage}
                    setInputMessage={setInputMessage}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                    onKeyPress={handleKeyPressWrapper}
                    messagesEndRef={messagesEndRef}
                    error={error}
                    onClearMessages={handleClearMessages}
                    suggestedQuestions={botData.suggestedQuestions}
                    setMessages={setMessages}
                  />
                </div>

                <div className="flex justify-start pt-4">
                  <Button
                    type="button"
                    className="font-medium"
                    size="sm"
                    onClick={handleBack}
                    disabled={false}
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
