import { QuoteForm } from "@/components/skylight-calculator";

export default function SkylightCalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Skylight Installation Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get an instant quote for your skylight installation project. Our
            comprehensive form will help us provide you with accurate pricing
            and scheduling.
          </p>
        </div>

        <QuoteForm />
      </div>
    </div>
  );
}
