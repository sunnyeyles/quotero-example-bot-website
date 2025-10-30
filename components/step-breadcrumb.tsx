"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StepBreadcrumbItem {
  step: number;
  label: string;
  href?: string;
  completed?: boolean;
}

interface StepBreadcrumbProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  itemsToDisplay?: number;
}

const TRAINING_STEPS: StepBreadcrumbItem[] = [
  { step: 1, label: "Bot Identity & Appearance" },
  { step: 2, label: "Content & Knowledge Feed" },
  { step: 3, label: "Preview Training Data" },
  { step: 4, label: "Test Your Bot" },
];

const DEFAULT_ITEMS_TO_DISPLAY = 3;

export function StepBreadcrumb({
  currentStep,
  onStepClick,
  itemsToDisplay = DEFAULT_ITEMS_TO_DISPLAY,
}: StepBreadcrumbProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Create breadcrumb items with navigation
  const breadcrumbItems = [
    ...TRAINING_STEPS.map((step) => ({
      href: step.step <= currentStep ? `#step-${step.step}` : undefined,
      label: step.step < currentStep ? `✓ ${step.label}` : step.label,
      step: step.step,
      completed: step.step < currentStep,
    })),
  ];

  const handleStepClick = (step: number) => {
    if (onStepClick && step <= currentStep) {
      onStepClick(step);
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.length > itemsToDisplay ? (
          <>
            <BreadcrumbItem>
              {isDesktop ? (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger
                    className="flex items-center gap-1"
                    aria-label="Toggle menu"
                  >
                    <BreadcrumbEllipsis className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {breadcrumbItems.slice(0, -2).map((item, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => item.step && handleStepClick(item.step)}
                        className={`${
                          item.step && item.step > currentStep
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        } ${item.completed ? "text-primary" : ""}`}
                      >
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger aria-label="Toggle Menu">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>Navigate to Step</DrawerTitle>
                      <DrawerDescription>
                        Select a step to navigate to.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-1 px-4">
                      {breadcrumbItems.slice(0, -2).map((item, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            item.step && handleStepClick(item.step)
                          }
                          disabled={item.step ? item.step > currentStep : false}
                          className={`py-1 text-sm text-left ${
                            item.step && item.step > currentStep
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer hover:text-primary"
                          } ${item.completed ? "text-primary" : ""}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ) : null}
        {breadcrumbItems.slice(-itemsToDisplay).map((item, index) => (
          <BreadcrumbItem key={index}>
            {item.href ? (
              <>
                <BreadcrumbLink
                  asChild
                  className={`max-w-20 truncate md:max-w-none ${
                    item.completed ? "text-primary" : ""
                  }`}
                >
                  <button
                    onClick={() => item.step && handleStepClick(item.step)}
                    disabled={item.step ? item.step > currentStep : false}
                    className={`hover:text-foreground transition-colors ${
                      item.step && item.step > currentStep
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {item.label}
                  </button>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                {item.label}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
