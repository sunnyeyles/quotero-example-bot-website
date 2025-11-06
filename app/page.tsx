"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { GeneratedForm } from "@/components/create-bot/example";
import { ThemeToggle } from "@/components/theme-toggle";
import { MorphingText } from "@/components/ui/morphing-text";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <ThemeToggle />
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 sm:mb-6 px-4 py-12">
              <MorphingText
                texts={[
                  "Custom Chatbots Fitted to Your Business",
                  "Custom Chatbots Fitted to Your Gym",
                  "Custom Chatbots Fitted to Your Yoga Studio",
                  "Custom Chatbots Fitted to Your Cafe",
                  "Custom Chatbots Fitted to Your Beauty Salon",
                  "Custom Chatbots Fitted to Your Physiotherapy Clinic",
                  "Custom Chatbots Fitted to Your Dental Practice",
                  "Custom Chatbots Fitted to Your Real Estate Agency",
                  "Custom Chatbots Fitted to Your Veterinary Clinic",
                  "Custom Chatbots Fitted to Your Hairdresser",
                ]}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="default"
              className="w-full sm:w-auto text-lg"
              onClick={() => router.push("/")}
            >
              Book a Demo
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:w-auto text-lg"
              onClick={() => router.push("/")}
            >
              Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Bot Identity Section */}
      <section className="">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Create your own AI chatbot
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Start by defining your bot&apos;s identity and personality
            </p>
          </div>

          <GeneratedForm />
        </div>
      </section>
      {/* setup lazy loading for the planet background */}
      {/* <PlanetBackground /> */}
    </div>
  );
}
