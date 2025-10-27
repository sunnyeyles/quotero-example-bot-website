import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { BotData } from "@/lib/types";

interface Step3PreviewProps {
  botData: BotData;
  setBotData: React.Dispatch<React.SetStateAction<BotData>>;
}

export function Step3Preview({ botData, setBotData }: Step3PreviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Preview Training Data</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Review and edit your bot&apos;s training data before testing. You can
          modify the content below to fine-tune your bot&apos;s knowledge.
        </p>

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
    </div>
  );
}
