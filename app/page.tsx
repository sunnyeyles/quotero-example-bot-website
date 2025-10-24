import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link href="/bots/train-your-own">Check it out</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
