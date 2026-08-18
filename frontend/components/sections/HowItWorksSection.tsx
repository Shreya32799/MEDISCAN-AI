const steps = [
  "Enter health information",
  "AI analyzes your parameters",
  "Receive prediction and report",
];

export default function HowItWorksSection() {
  return (
    <section className="px-6 py-20">
      <h2 className="mb-10 text-center text-3xl font-bold">
        How MediScan-AI Works
      </h2>

      <div className="mx-auto max-w-3xl space-y-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className="rounded-xl border p-5"
          >
            {index + 1}. {step}
          </div>
        ))}
      </div>
    </section>
  );
}