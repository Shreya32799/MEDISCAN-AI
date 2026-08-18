
"use client";

import { motion } from "framer-motion";
import { FEATURES } from '@/data/landingData';
import {
  HeartPulse,
  Activity,
  Sparkles,
  FileText,
  ShieldCheck,
  Stethoscope,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { useState } from "react";

const featureIconMap: Record<string, React.ReactNode> = {
  HeartPulse: <HeartPulse className="w-6 h-6 text-rose-500" />,
  Activity: <Activity className="w-6 h-6 text-purple-500" />,
  Sparkles: <Sparkles className="w-6 h-6 text-sky-500" />,
  FileText: <FileText className="w-6 h-6 text-indigo-500" />,
  ShieldLock: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
  Stethoscope: <Stethoscope className="w-6 h-6 text-blue-600" />,
};

interface FeaturesProps {
  onOpenAssessment: () => void;
}

export default function Features() {  const [activeCategory, setActiveCategory] = useState<'all' | 'clinical' | 'ai' | 'security'>('all');

  const filteredFeatures = FEATURES.filter((f) =>
    activeCategory === 'all' ? true : f.category === activeCategory
  );

  return (
    <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Core Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Clinical Accuracy & Patient Clarity
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            MediScan-AI combines ensemble machine learning algorithms with transparent explainability to deliver reliable healthcare risk profiles.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-4 flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: 'All Capabilities' },
              { id: 'clinical', label: 'Clinical Models' },
              { id: 'ai', label: 'Explainable AI' },
              { id: 'security', label: 'Data Security' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feat, index) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle card top gradient border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-sky-50 flex items-center justify-center transition-colors border border-slate-200/80">
                    {featureIconMap[feat.iconName]}
                  </div>

                  {feat.badge && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-sky-100 group-hover:text-sky-800 transition-colors border border-slate-200">
                      {feat.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2">
                  {feat.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                  {feat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Validated Feature
                </span>

                <button
                  onClick={() => {}}
                  className="text-xs font-bold text-sky-600 group-hover:text-sky-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Explore Model</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
