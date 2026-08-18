"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  Cpu,
  BarChart3,
  FileText,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Enter Health Information",
    description: "Provide standard vitals and lab numbers such as blood pressure, glucose, cholesterol, and BMI through our guided wizard.",
    icon: ClipboardList,
    detail: "Sample presets provided for fast demonstration",
  },
  {
    step: "02",
    title: "AI Processes Parameters",
    description: "Trained Random Forest decision tree models preprocess, scale, and evaluate your health biomarkers in milliseconds.",
    icon: Cpu,
    detail: "Validated Scikit-Learn clinical models",
  },
  {
    step: "03",
    title: "Receive Risk Screening",
    description: "View an estimated probability score categorized into Low, Moderate, or High risk with transparent visual indicators.",
    icon: BarChart3,
    detail: "Non-diagnostic decision support",
  },
  {
    step: "04",
    title: "Understand Your Result",
    description: "Explore plain-language biomarker explanations, tailored lifestyle tips, download a professional PDF, or ask the AI Assistant.",
    icon: FileText,
    detail: "Vector PDF report export included",
  },
];

interface HowItWorksProps {
  onStartAssessment: () => void;
}

export default function HowItWorks({ onStartAssessment }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Simple 4-Step Process
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How MediScan-AI Works
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal">
            From entering your clinical parameters to receiving an understandable screening report in under a second.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-sky-300 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 font-black text-sm flex items-center justify-center border border-sky-100">
                      {s.step}
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700 group-hover:scale-105 group-hover:text-sky-600 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {s.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{s.detail}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button
            onClick={onStartAssessment}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold text-white bg-slate-900 hover:bg-sky-600 rounded-2xl shadow-md transition-all cursor-pointer active:scale-95"
            id="how-it-works-start-btn"
          >
            <span>Try the Guided Assessment Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
