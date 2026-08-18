"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-10">
      <div className="flex justify-between text-sm text-slate-600 mb-2">
        <span>
          Step {currentStep} of {totalSteps}
        </span>

        <span>{Math.round(progress)}%</span>
      </div>

      <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}