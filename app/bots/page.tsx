import Link from "next/link";
import {
  Bot,
  ArrowRight,
  ExternalLink,
  Play,
  Code,
  Database,
  MessageSquare,
  BarChart3,
  Settings,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Bots() {
  const botCards = [
    {
      title: "Train Your Own",
      description:
        "Create and train your own custom AI bot tailored to your specific business needs",
      icon: <Play className="w-8 h-8 text-blue-600" />,
      link: "/bots/train-your-own",
      featured: true,
      color: "blue",
    },
    {
      title: "Quote Generator Bot",
      description:
        "Automatically create professional quotes based on customer requirements",
      icon: <Code className="w-8 h-8 text-green-600" />,
      link: "/quote-bot",
      featured: false,
      color: "green",
    },
    {
      title: "Customer Support Bot",
      description:
        "24/7 AI assistant that handles customer inquiries and support tickets",
      icon: <MessageSquare className="w-8 h-8 text-purple-600" />,
      link: "/support-bot",
      featured: false,
      color: "purple",
    },
    {
      title: "Analytics Bot",
      description:
        "AI-powered insights and recommendations for your business performance",
      icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
      link: "/analytics-bot",
      featured: false,
      color: "orange",
    },
    {
      title: "Integration Bot",
      description:
        "Connect with your existing tools and automate data synchronization",
      icon: <Database className="w-8 h-8 text-indigo-600" />,
      link: "/integration-bot",
      featured: false,
      color: "indigo",
    },
    {
      title: "Workflow Bot",
      description:
        "Automate repetitive tasks and streamline your business processes",
      icon: <Settings className="w-8 h-8 text-red-600" />,
      link: "/workflow-bot",
      featured: false,
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered <span className="text-blue-600">Quote Bots</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choose from our collection of specialized bots designed to
              automate and enhance your quote management process.
            </p>
          </div>
        </div>
      </section>

      {/* Bot Cards Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Available Bots
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each bot is designed for specific tasks and can be customized to
              fit your business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {botCards.map((bot, index) => (
              <Card
                key={index}
                className={`group relative transition-all duration-300 hover:shadow-xl ${
                  bot.featured
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "hover:border-gray-300"
                }`}
              >
                {bot.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Featured</Badge>
                  </div>
                )}

                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      bot.color === "blue"
                        ? "bg-blue-100"
                        : bot.color === "green"
                        ? "bg-green-100"
                        : bot.color === "purple"
                        ? "bg-purple-100"
                        : bot.color === "orange"
                        ? "bg-orange-100"
                        : bot.color === "indigo"
                        ? "bg-indigo-100"
                        : "bg-red-100"
                    }`}
                  >
                    {bot.icon}
                  </div>

                  <CardTitle className="text-xl mb-3">{bot.title}</CardTitle>
                  <CardDescription className="text-gray-600 mb-6">
                    {bot.description}
                  </CardDescription>

                  <Button
                    asChild
                    variant="ghost"
                    className="group-hover:gap-3 transition-all duration-200"
                  >
                    <Link href={bot.link}>
                      Explore Bot
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Need a Custom Bot?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We can create specialized bots tailored to your specific business
            requirements and workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/prices">
                View Pricing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
