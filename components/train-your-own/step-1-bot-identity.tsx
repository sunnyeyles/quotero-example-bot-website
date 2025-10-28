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
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-3 tracking-tight">
          Bot Identity & Appearance
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Define your bot&apos;s personality and characteristics to create a
          unique AI assistant
        </p>
      </div>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-3">
          <label className="block text-lg font-semibold mb-3">Bot Name *</label>
          <Input
            value={botData.name}
            onChange={(e) =>
              setBotData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="e.g., Sarah"
            className="text-lg py-3"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-lg font-semibold mb-3">
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
            placeholder="Friendly, professional, helpful, knowledgeable about your business..."
            className="min-h-[160px] text-lg py-3"
          />
        </div>
      </div>
    </div>
  );
}
