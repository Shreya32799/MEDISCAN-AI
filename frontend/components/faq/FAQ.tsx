"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "What is MediScan-AI?",
    a: "MediScan-AI is a healthcare risk screening platform that uses machine learning to estimate cardiovascular and diabetes risk from routine clinical parameters. It is built to support early health awareness and facilitate informed discussions with doctors.",
  },
  {
    q: "How does the prediction work?",
    a: "MediScan-AI employs trained Random Forest machine learning models built with Scikit-Learn. The system preprocesses, encodes, and normalizes your entered health numbers against validated clinical datasets to output a calibrated risk probability and tier (Low, Moderate, or High).",
  },
  {
    q: "What information is required?",
    a: "For Heart Disease: age, sex, chest pain type, resting blood pressure, cholesterol, resting ECG, max heart rate, exercise angina, ST depression, and ST slope. For Diabetes: pregnancies, glucose, blood pressure, skin thickness, insulin, BMI, diabetes pedigree function, and age. Instant sample presets are provided for easy testing.",
  },
  {
    q: "Is MediScan-AI a medical diagnosis tool?",
    a: "No. MediScan-AI is strictly an artificial intelligence screening and decision-support tool. It does not provide medical diagnoses, prescriptions, or emergency care. All medical decisions should be made with a licensed physician.",
  },
  {
    q: "How accurate are the models?",
    a: "The Heart Disease Random Forest model achieves approximately 84% test accuracy on the UCI clinical benchmark dataset, and the Diabetes model achieves approximately 80% test accuracy. These are measured test benchmarks from real validation sets.",
  },
  {
    q: "How is my information handled?",
    a: "MediScan-AI operates with a privacy-conscious architecture. Parameter inputs are processed in-memory for model inference and are not stored permanently or shared with third parties.",
  },
  {
    q: "Can I download my report?",
    a: "Yes. Every completed assessment allows you to download a structured, vector-crisp PDF screening report complete with a unique Report ID, entered parameters table, risk probability, and physician discussion prompts.",
  },
  {
    q: "How does the AI Assistant work?",
    a: "The floating MediScan AI Assistant is a context-aware health information guide. When you complete an assessment, it automatically reads your screening results to explain your risk score, define medical terms (like BMI or ST Depression), and provide general wellness tips.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="scroll-mt-28 py-20 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            Common Questions
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-base text-slate-600 font-normal">
            Everything you need to know about MediScan-AI models, screening reports, and data privacy.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? "bg-slate-50 border-sky-300 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-sm text-slate-900">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-sky-600" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 font-normal">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
