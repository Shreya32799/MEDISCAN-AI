"use client";

import { motion } from "framer-motion";
import { Eye, Lock, HeartHandshake, ShieldAlert, Sparkles, ShieldCheck } from "lucide-react";

const PRINCIPLES = [
  {
    title: "Transparent",
    description: "Results clearly explain estimated risk probabilities, contributing physiological markers, and how models derive their scores.",
    icon: Eye,
    color: "sky",
  },
  {
    title: "Privacy-Conscious",
    description: "Screening data is processed in-memory for model inference. We avoid unnecessary collection of sensitive personal health records.",
    icon: Lock,
    color: "teal",
  },
  {
    title: "Human-Centered",
    description: "Designed with intuitive guidance, plain-language terminology explanations, and tools to assist informed discussions with doctors.",
    icon: HeartHandshake,
    color: "indigo",
  },
  {
    title: "Not a Diagnosis",
    description: "Clearly defined as an artificial intelligence risk screening assistant. It does not replace professional medical evaluations or clinical care.",
    icon: ShieldAlert,
    color: "rose",
  },
];

export default function ResponsibleAI() {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Ethical Healthcare AI
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed with Responsible AI Principles
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Prioritizing clarity, data safety, and patient awareness in every stage of our machine learning pipeline.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRINCIPLES.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100 mb-4">
                  <Icon className="w-6 h-6 text-sky-600" />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {p.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
