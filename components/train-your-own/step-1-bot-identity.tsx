import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BotData } from "@/lib/types";

interface Step1BotIdentityProps {
  botData: BotData;
  setBotData: React.Dispatch<React.SetStateAction<BotData>>;
}

export function Step1BotIdentity({
  botData,
  setBotData,
}: Step1BotIdentityProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Bot Identity & Appearance
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bot Name *</label>
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
              Personality *
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
              className="min-h-[120px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
