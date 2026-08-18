import { Brain, HeartPulse, FileText } from "lucide-react";

const features = [
  {
    icon: HeartPulse,
    title: "Disease Risk Prediction",
    description:
      "Predict heart disease and diabetes risks using trained machine learning models.",
  },
  {
    icon: Brain,
    title: "AI Health Insights",
    description:
      "Receive intelligent analysis based on your health parameters.",
  },
  {
    icon: FileText,
    title: "Medical Reports",
    description:
      "Generate professional healthcare reports with prediction results.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-2xl border p-6 shadow-sm"
            >
              <Icon className="mb-4 h-10 w-10 text-primary" />

              <h3 className="text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}