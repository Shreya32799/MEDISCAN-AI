"use client";

import { motion } from "framer-motion";
import { Brain, Heart, Flame, ShieldCheck } from "lucide-react";

const STATS = [
  {
    value: "2",
    label: "AI Screening Models",
    description: "Trained Random Forest classifiers",
    icon: Brain,
    color: "sky",
  },
  {
    value: "12",
    label: "Heart Health Parameters",
    description: "Blood pressure, cholesterol, ECG, ST metrics",
    icon: Heart,
    color: "rose",
  },
  {
    value: "8",
    label: "Diabetes Parameters",
    description: "Glucose, BMI, insulin, pedigree function",
    icon: Flame,
    color: "amber",
  },
  {
    value: "2",
    label: "Health Risk Assessments",
    description: "Cardiovascular & metabolic risk screening",
    icon: ShieldCheck,
    color: "teal",
  },
];

export default function HeroStats() {
  return (
    <section className="py-10 bg-white border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 hover:bg-white hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </span>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 group-hover:scale-105 transition-transform">
                    <Icon
                      className={`w-5 h-5 ${
                        stat.color === "rose"
                          ? "text-rose-500"
                          : stat.color === "amber"
                          ? "text-amber-500"
                          : stat.color === "teal"
                          ? "text-teal-600"
                          : "text-sky-600"
                      }`}
                    />
                  </div>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sky-700 transition-colors">
                  {stat.label}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
