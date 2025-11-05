"use client";

import { useState, useEffect } from "react";
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
import { Step3StyleBot } from "./step-3-style-bot";
import { Step4TestBot } from "./step-4-test-bot";
import { useTrainYourOwnBot } from "@/hooks/useTrainYourOwnBot";
import { BotData } from "@/lib/types";

const DEFAULT_STYLE = {
  borderRadius: "0rem",
  font: "inter" as const,
};

export const GeneratedForm = () => {
  const [step, setStep] = useState(0);
  const totalSteps = 4;

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
    sendMessage,
    messagesEndRef,
    error,
    handleFileUpload: hookHandleFileUpload,
    removeFile: hookRemoveFile,
  } = useTrainYourOwnBot();

  // Local state for styling (Step 3)
  const [borderRadius, setBorderRadius] = useState(DEFAULT_STYLE.borderRadius);
  const [font, setFont] = useState<
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

  const handleSubmit = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
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
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !botData.personality) {
      toast.error("Please provide a message and set personality traits");
      return;
    }
    await sendMessage();
  };

  const handleClearMessages = () => {
    setMessages([]);
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

  const handleResetStyle = () => {
    setBorderRadius(DEFAULT_STYLE.borderRadius);
    setFont(DEFAULT_STYLE.font);
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
    "Style Your Bot",
    "Test Bot",
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
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Create Your Bot</CardTitle>
          <CardDescription>
            {stepTitles[step]} - Step {step + 1} of {totalSteps}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <Button type="submit" size="sm" className="font-medium">
                  Next
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

          {step === 2 && (
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
          )}

          {step === 3 && (
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
                />
              </div>

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
                <Button
                  type="button"
                  size="sm"
                  className="font-medium"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
