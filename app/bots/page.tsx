import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calculator, Bot, Paintbrush } from "lucide-react";

export default function Bots() {
  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Breadcrumbs */}
      <div className="mb-4 sm:mb-6">Breadcrumbs</div>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">AI Bots</h1>
        <p className="text-sm sm:text-base">
          Explore our custom AI solutions for your business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Skylight Calculator */}
        <Link href="/bots/skylight-calculator">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-6 w-6 text-primary" />
                <CardTitle>Skylight Calculator</CardTitle>
              </div>
              <CardDescription>
                Get instant quotes for skylight installation projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive form-based estimator for skylight installation
                with detailed pricing breakdown.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Painting Estimator */}
        <Link href="/bots/painting-estimator">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Paintbrush className="h-6 w-6 text-primary" />
                <CardTitle>Painting Estimator</CardTitle>
              </div>
              <CardDescription>
                Professional material and labour cost estimates for painting
                projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Australian painting estimator providing detailed cost breakdowns
                based on room dimensions and paint quality.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Train Your Own Bot */}
        <Link href="/bots/train-your-own">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <CardTitle>Train Your Own Bot</CardTitle>
              </div>
              <CardDescription>
                Create a custom AI assistant for your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Build and train your own AI bot with custom knowledge and
                personality for your Australian small business.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
