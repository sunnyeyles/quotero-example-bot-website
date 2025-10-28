import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Loader2, Globe } from "lucide-react";
import { BotData } from "@/lib/types";

interface Step2ContentFeedProps {
  botData: BotData;
  setBotData: React.Dispatch<React.SetStateAction<BotData>>;
  manualTrainingData: string;
  setManualTrainingData: React.Dispatch<React.SetStateAction<string>>;
  isScraping: boolean;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  removeFile: (fileId: string) => void;
  handleWebsiteScrape: () => Promise<void>;
}

export function Step2ContentFeed({
  botData,
  setBotData,
  manualTrainingData,
  setManualTrainingData,
  isScraping,
  handleFileUpload,
  removeFile,
  handleWebsiteScrape,
}: Step2ContentFeedProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-3 tracking-tight">
          Content & Knowledge Feed
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Provide your bot with knowledge by uploading files, scraping websites,
          or adding manual content
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <label className="block text-lg font-semibold mb-4">
            Website URL
          </label>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
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
              className="flex-1 text-lg py-3"
            />
            <Button
              onClick={handleWebsiteScrape}
              disabled={isScraping || !botData.websiteUrl}
              variant="outline"
              className="sm:w-auto w-full text-lg py-3 px-6"
            >
              {isScraping ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <Globe className="w-5 h-5 mr-2" />
                  Get Website Data
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-lg font-semibold mb-4">
            Upload Training Data Files
          </label>

          {botData.files && botData.files.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-3">
                {botData.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center p-3 rounded-lg border shadow-sm text-sm min-w-0 bg-muted/50"
                  >
                    <Upload className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate max-w-32 sm:max-w-48 font-medium">
                      {file.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="ml-2 shrink-0 h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
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
              className="w-full text-lg py-3 px-6"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="w-5 h-5 mr-2" />
              Choose Files
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-lg font-semibold mb-4">
            Additional Training Data
          </label>
          <Textarea
            value={manualTrainingData}
            onChange={(e) => setManualTrainingData(e.target.value)}
            placeholder="Add any additional information about your business, products, services, policies, or anything else you want your bot to know..."
            className="min-h-[200px] text-lg py-3"
          />
        </div>
      </div>
    </div>
  );
}
