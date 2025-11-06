"use client";

import { GlareCard } from "@/components/ui/glare-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingFeature {
  text: string;
}

interface PricingCardProps {
  title: string;
  features: PricingFeature[];
  setupPrice: string;
  monthlyPrice: string;
  specialOffer: string;
  isPro?: boolean;
}

const PricingCard = ({
  title,
  features,
  setupPrice,
  monthlyPrice,
  specialOffer,
  isPro = false,
}: PricingCardProps) => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <GlareCard
      fixedAspectRatio={false}
      className={cn(
        "flex flex-col p-6 sm:p-8 gap-6 h-full min-h-[550px]",
        isPro && "border-primary/20"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          {isPro && (
            <Badge variant="default" className="text-xs">
              Popular
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">
              {setupPrice}
            </span>
            <span className="text-sm text-muted-foreground">setup</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-foreground">
              {monthlyPrice}
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
        </div>

        <Badge variant="secondary" className="w-fit text-xs">
          {specialOffer}
        </Badge>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <ul className="flex flex-col gap-2.5">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckIcon className="size-4 mt-0.5 text-primary shrink-0" />
              <span className="text-sm text-muted-foreground leading-relaxed">
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant={isPro ? "default" : "outline"}
        className="w-full mt-auto"
        size="lg"
        onClick={scrollToContact}
      >
        Get Started
      </Button>
    </GlareCard>
  );
};

export const PricingCards = () => {
  const starterFeatures: PricingFeature[] = [
    {
      text: "Generic chatbot with website embed",
    },
    {
      text: "3 suggested questions",
    },
    {
      text: "1 data upload (e.g. FAQ or PDF)",
    },
    {
      text: "No styling",
    },
  ];

  const proFeatures: PricingFeature[] = [
    {
      text: "Custom styling",
    },
    {
      text: "5 suggested questions",
    },
    {
      text: "Dashboard access for editing/uploading files",
    },
    {
      text: "6 months of updates/support",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-center items-stretch w-full max-w-5xl mx-auto">
      <div className="w-full">
        <PricingCard
          title="Starter"
          features={starterFeatures}
          setupPrice="$380"
          monthlyPrice="$60"
          specialOffer="First 3 months for only $60"
        />
      </div>
      <div className="w-full">
        <PricingCard
          title="Pro"
          features={proFeatures}
          setupPrice="$680"
          monthlyPrice="$90"
          specialOffer="First 3 months for only $90"
          isPro={true}
        />
      </div>
    </div>
  );
};


