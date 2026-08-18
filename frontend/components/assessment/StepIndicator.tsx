"use client";

import { Check } from "lucide-react";
import { assessmentSteps } from "./AssessmentSteps";

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="flex justify-between items-center mb-12 overflow-x-auto">
      {assessmentSteps.map((step) => (
        <div
          key={step.id}
          className="flex flex-col items-center flex-1"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all
              ${
                step.id < currentStep
                  ? "bg-green-500 text-white"
                  : step.id === currentStep
                  ? "bg-sky-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
          >
            {step.id < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              step.id
            )}
          </div>

          <h4 className="mt-3 font-semibold text-slate-800">
            {step.title}
          </h4>

          <p className="text-xs text-slate-500 text-center">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}