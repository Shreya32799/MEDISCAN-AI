"use client";

import { motion } from "framer-motion";
import { Brain, Zap, Layers, Code, Terminal, Palette, Sparkles } from "lucide-react";

const TECH_ITEMS = [
  {
    name: "Machine Learning (Random Forest)",
    category: "Scikit-Learn Ensemble",
    icon: Brain,
    description: "Trained Random Forest classifiers with StandardScaler preprocessing and probability calibration.",
    color: "rose",
  },
  {
    name: "FastAPI Backend",
    category: "Async Python REST API",
    icon: Zap,
    description: "High-performance Pydantic schema validation with sub-50ms model inferencing.",
    color: "amber",
  },
  {
    name: "Next.js 16 (App Router)",
    category: "React Server Framework",
    icon: Layers,
    description: "Modern web architecture with optimized server routing and streaming asset delivery.",
    color: "sky",
  },
  {
    name: "React 19 & TypeScript",
    category: "Type-Safe Client UI",
    icon: Code,
    description: "State synchronization, accessible multi-step wizard forms, and interactive visualization.",
    color: "indigo",
  },
  {
    name: "Python 3.13 & Joblib",
    category: "Model Serialization",
    icon: Terminal,
    description: "Joblib binary model loading and NumPy/Pandas automated feature alignment.",
    color: "teal",
  },
  {
    name: "Tailwind CSS",
    category: "Design System",
    icon: Palette,
    description: "Healthcare-inspired clean aesthetic with soft shadows, responsive typography, and generous whitespace.",
    color: "emerald",
  },
];

export default function Technology() {
  return (
    <section id="features" className="scroll-mt-28 py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Technology Architecture
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built with Modern AI & Web Technologies
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal">
            A modular stack combining Python machine learning pipelines with Next.js and FastAPI for reliable real-time screening.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECH_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 hover:bg-white hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sky-700 block">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
