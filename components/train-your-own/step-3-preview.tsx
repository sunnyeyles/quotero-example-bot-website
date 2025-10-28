import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { BotData } from "@/lib/types";

interface Step3PreviewProps {
  botData: BotData;
  setBotData: React.Dispatch<React.SetStateAction<BotData>>;
}

export function Step3Preview({ botData, setBotData }: Step3PreviewProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-3 tracking-tight">
          Preview Training Data
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Review and edit your bot&apos;s training data before testing. You can
          modify the content below to fine-tune your bot&apos;s knowledge.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          <label className="block text-lg font-semibold mb-4">
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
            placeholder="Your combined training data will appear here automatically..."
            className="min-h-[500px] text-lg py-4 font-mono"
          />
        </div>
      </div>
    </div>
  );
}
