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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Content & Knowledge Feed</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">
              Website URL
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
                onClick={() => document.getElementById("file-upload")?.click()}
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
  );
}
