"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X, Plus } from "lucide-react";
import { SuggestedQuestion } from "@/lib/types";
import { useSuggestedQuestions } from "@/hooks/useSuggestedQuestions";

interface Step1BotIdentityProps {
  personality: string;
  setPersonality: (value: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (value: string) => void;
  files: File[];
  setFiles?: (files: File[]) => void;
  manualTrainingData: string;
  setManualTrainingData: (value: string) => void;
  onFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemoveFile?: (fileIdOrIndex: string | number) => void;
  uploadedFiles?: Array<{ id: string; name: string }>;
  suggestedQuestions: SuggestedQuestion[];
  setSuggestedQuestions: (questions: SuggestedQuestion[]) => void;
  onScrollToCenter?: () => void;
}

export function Step1BotIdentity({
  personality,
  setPersonality,
  websiteUrl,
  setWebsiteUrl,
  files,
  setFiles,
  manualTrainingData,
  setManualTrainingData,
  onFileUpload,
  onRemoveFile,
  uploadedFiles,
  suggestedQuestions,
  setSuggestedQuestions,
  onScrollToCenter,
}: Step1BotIdentityProps) {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (onFileUpload) {
      await onFileUpload(event);
    } else if (setFiles) {
      const newFiles = event.target.files;
      if (newFiles) {
        setFiles([...files, ...Array.from(newFiles)]);
      }
    }
  };

  const removeFile = (indexOrId: number | string) => {
    if (onRemoveFile) {
      onRemoveFile(indexOrId);
    } else if (setFiles) {
      setFiles(files.filter((_, i) => i !== indexOrId));
    }
  };

  // Use uploadedFiles if available (from hook), otherwise use files
  const displayFiles =
    uploadedFiles || files.map((f, i) => ({ id: i.toString(), name: f.name }));

  // Use hook for suggested questions logic
  const { addQuestion, removeQuestion, updateQuestion, canAddMore } =
    useSuggestedQuestions({
      suggestedQuestions,
      setSuggestedQuestions,
      maxQuestions: 3,
    });

  // Handle adding question with scroll to center
  const handleAddQuestion = () => {
    addQuestion();
    // Scroll to center after adding question (similar to back/next buttons)
    if (onScrollToCenter) {
      setTimeout(() => {
        onScrollToCenter();
      }, 100);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Personality traits
        </label>
        <Textarea
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          placeholder="Friendly, professional, knowledgeable, concise..."
          className="min-h-[120px]"
        />
      </div>

      <div className="pt-2 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3">Website URL</label>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData("text");
                if (pastedText && pastedText.trim()) {
                  setWebsiteUrl(pastedText.trim());
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

          {displayFiles.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {displayFiles.map((file, index) => (
                  <div
                    key={file.id || index}
                    className="flex items-center p-2 rounded border text-xs min-w-0"
                  >
                    <Upload className="w-3 h-3 mr-1 shrink-0" />
                    <span className="truncate max-w-20 sm:max-w-32">
                      {file.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id || index)}
                      className="ml-1 shrink-0 h-6 w-6 p-0"
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
              onClick={() => document.getElementById("file-upload")?.click()}
              type="button"
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

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium">
              Suggested Questions & Answers
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddQuestion}
              disabled={!canAddMore}
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Question
            </Button>
          </div>

          {suggestedQuestions.length === 0 && (
            <p className="text-sm text-muted-foreground mb-3">
              Add up to 3 suggested questions and answers to help guide users.
            </p>
          )}

          <div className="space-y-4">
            {suggestedQuestions.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Question & Answer {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Question {index + 1}
                  </label>
                  <Input
                    value={item.question}
                    onChange={(e) =>
                      updateQuestion(index, "question", e.target.value)
                    }
                    placeholder="Enter a suggested question..."
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Answer {index + 1}
                  </label>
                  <Textarea
                    value={item.answer}
                    onChange={(e) =>
                      updateQuestion(index, "answer", e.target.value)
                    }
                    placeholder="Enter the answer to this question..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            ))}
          </div>

          {suggestedQuestions.length >= 3 && (
            <p className="text-xs text-muted-foreground mt-2">
              Maximum of 3 suggested questions reached.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
