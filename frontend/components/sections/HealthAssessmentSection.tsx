"use client";

import { motion } from "framer-motion";
import { Heart, Flame, ArrowRight, Activity, Sparkles, CheckCircle2 } from "lucide-react";
import { DiseaseType } from "@/components/assessment/PredictionModal";

interface HealthAssessmentSectionProps {
  onSelectAssessment: (disease: DiseaseType) => void;
}

export default function HealthAssessmentSection({
  onSelectAssessment,
}: HealthAssessmentSectionProps) {
  return (
    <section id="predictions" className="scroll-mt-28 py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Specialized Screening Modules
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choose Your Health Assessment
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Select a dedicated machine learning screening tool to analyze your cardiovascular or metabolic risk parameters in real-time.
          </p>
        </div>

        {/* 2 Large Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Card 1: Heart Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 hover:border-rose-300 hover:shadow-xl hover:bg-white transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200 group-hover:scale-105 transition-transform">
                  <Heart className="w-7 h-7 fill-rose-500/20" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  Cardiovascular ML
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-rose-700 transition-colors">
                Heart Health Assessment
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Assess cardiovascular disease risk using clinical health parameters including blood pressure, serum cholesterol, resting ECG patterns, and treadmill stress test ST metrics.
              </p>

              <div className="space-y-2 mb-8 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-500" />
                  <span>12 Verified Clinical Biomarkers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-500" />
                  <span>Trained Random Forest Classifier (~84% Test Acc)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-500" />
                  <span>Calibrated Risk Probability & Plain-Language Summary</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectAssessment("heart")}
              className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              id="assess-heart-risk-btn"
            >
              <span>Assess Heart Risk</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Card 2: Diabetes Risk */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 hover:border-amber-300 hover:shadow-xl hover:bg-white transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform">
                  <Flame className="w-7 h-7 fill-amber-500/20" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Metabolic AI
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-amber-700 transition-colors">
                Diabetes Risk Assessment
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Estimate diabetes risk using commonly used health parameters including fasting plasma glucose, body mass index (BMI), blood pressure, insulin levels, and family pedigree history.
              </p>

              <div className="space-y-2 mb-8 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>8 Standard Metabolic Health Inputs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>Trained Random Forest Classifier (~80% Test Acc)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>Instant Lifestyle & Decision-Support Action Steps</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectAssessment("diabetes")}
              className="w-full py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              id="assess-diabetes-risk-btn"
            >
              <span>Assess Diabetes Risk</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
