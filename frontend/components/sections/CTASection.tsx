import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="px-6 py-20 text-center">
      <h2 className="text-3xl font-bold">
        Start Your Health Analysis Today
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Use AI-powered prediction to understand your health risks.
      </p>

      <Button className="mt-6">
        Get Started
      </Button>
    </section>
  );
}