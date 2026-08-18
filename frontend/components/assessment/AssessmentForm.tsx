"use client";

import { useState } from "react";
import ProgressBar from "./ProgressBar";
import StepIndicator from "./StepIndicator";
import PersonalStep from "./PersonalStep";
import LifestyleStep from "./LifestyleStep";
import MedicalStep from "./MedicalStep";
import LaboratoryStep from "./LaboratoryStep";
import ReviewStep from "./ReviewStep";

export default function AssessmentForm() {
  const [formData, setFormData] = useState({
  age: "",
  gender: "",
  height: "",
  weight: "",

  smoking: "",
  alcohol: "",

  diabetes: "",
  hypertension: "",
  heartDisease: "",

  glucose: "",
  cholesterol: "",
  hba1c: "",
  systolicBP: "",
  diastolicBP: "",
});
  const [currentStep, setCurrentStep] = useState(1);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-5xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-sky-100 text-sky-700 font-semibold text-sm">
            AI Health Assessment
          </span>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Complete Your Health Assessment
          </h1>

          <p className="mt-3 text-slate-600">
            Enter your health information to receive AI-powered risk predictions.
          </p>
        </div>
        <ProgressBar currentStep={currentStep} totalSteps={5} />

        <StepIndicator currentStep={currentStep} />
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">

          {currentStep === 1 && (
              <PersonalStep
                formData={formData}
                handleChange={handleChange}
              />
            )}

            {currentStep === 2 && (
              <LifestyleStep
                formData={formData}
                handleChange={handleChange}
              />
            )}

            {currentStep === 3 && (
              <MedicalStep
                formData={formData}
                handleChange={handleChange}
              />
            )}

            {currentStep === 4 && (
              <LaboratoryStep
                formData={formData}
                handleChange={handleChange}
              />
            )}

            {currentStep === 5 && (
              <ReviewStep
                formData={formData}
              />
            )}

          <div className="mt-10 flex justify-between">

              <button
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep(currentStep - 1);
                  }
                }}
                disabled={currentStep === 1}
                className="px-8 py-3 rounded-xl border border-slate-300 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={() => {
                  if (currentStep < 5) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    alert("Prediction API will be connected next!");
                  }
                }}
                className="px-8 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold"
              >
                {currentStep === 5 ? "Predict Risk" : "Continue"}
              </button>

            </div>

        </div>

      </div>
    </section>
  );
}