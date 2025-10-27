"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Step1BotIdentity } from "@/components/train-your-own";
import { useState } from "react";
import { BotData } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [botData, setBotData] = useState<BotData>({
    name: "",
    personality: "",
    trainingData: "",
    files: [],
    websiteUrl: "",
    websiteContent: "",
  });

  const handleStep1Submit = () => {
    if (botData.name.trim() && botData.personality.trim()) {
      // Store bot data in sessionStorage to persist across navigation
      sessionStorage.setItem("botData", JSON.stringify(botData));
      // Navigate to train-your-own page
      router.push("/bots/train-your-own");
    }
  };

  const isStep1Valid =
    botData.name.trim() !== "" && botData.personality.trim() !== "";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Streamline Your
              <span> Quote Management</span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Create, manage, and track quotes effortlessly with Quotero&apos;s
              powerful platform. Boost your business efficiency and close more
              deals.
            </p>
          </div>
        </div>
      </section>

      {/* Bot Identity Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Create Your AI Assistant
            </h2>
            <p className="text-lg text-muted-foreground">
              Start by defining your bot&apos;s identity and personality
            </p>
          </div>

          <Card className="p-8">
            <Step1BotIdentity botData={botData} setBotData={setBotData} />

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleStep1Submit}
                disabled={!isStep1Valid}
                size="lg"
                className="text-lg px-8"
              >
                Continue to Training
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
