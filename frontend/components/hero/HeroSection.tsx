import { Button } from "@/components/ui/button";
import { ArrowRight, HeartPulse } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

export default function HeroSection() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6">
      
      <FadeIn>
        <div className="max-w-4xl text-center">

          <div className="mb-6 flex justify-center">
            <HeartPulse className="h-16 w-16 text-primary" />
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            AI Powered Healthcare
            <span className="block text-primary">
              Risk Prediction Platform
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            MediScan-AI uses Machine Learning to analyze health parameters
            and predict disease risks with intelligent insights.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Button>
              Start Prediction
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button variant="outline">
              Learn More
            </Button>
          </div>

        </div>
      </FadeIn>

    </section>
  );
}