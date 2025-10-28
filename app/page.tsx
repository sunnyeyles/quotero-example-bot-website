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
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Custom AI Workers
              <span className="block sm:inline"> for Your Business</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto px-4 sm:px-0">
              We create intelligent AI assistants tailored to your business
              needs. Our custom bots handle customer inquiries, streamline
              operations, and boost productivity so you can focus on growing
              your business.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="w-full sm:w-auto">Example Employees</Button>
            <Button variant="outline" className="w-full sm:w-auto">
              See Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Bot Identity Section */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Create a Simple Chatbot
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Start by defining your bot&apos;s identity and personality
            </p>
          </div>

          <Card className="p-4 sm:p-6 md:p-8">
            <Step1BotIdentity botData={botData} setBotData={setBotData} />

            <div className="mt-6 sm:mt-8 flex justify-center">
              <Button
                onClick={handleStep1Submit}
                disabled={!isStep1Valid}
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
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
