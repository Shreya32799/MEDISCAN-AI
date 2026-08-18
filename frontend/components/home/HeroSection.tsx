"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Heart,
  Flame,
  CheckCircle2,
  FileCheck2,
  Lock,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

interface HeroProps {
  onStartPrediction: (disease?: "heart" | "diabetes") => void;
  onExploreHowItWorks?: () => void;
}

export default function HeroSection({
  onStartPrediction,
  onExploreHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  },
}: HeroProps) {
  return (
    <section
      id="home"
      className="relative pt-32 pb-20 lg:pt-38 lg:pb-28 overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-white"
    >
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200/90 text-sky-800 text-xs font-bold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Machine Learning Health Screening Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              AI-Powered Health{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-600 to-sky-700">
                Risk Screening
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              MediScan-AI helps you understand potential health risks using machine learning-based screening for cardiovascular disease and diabetes.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => onStartPrediction("heart")}
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-sky-600 via-teal-600 to-sky-700 hover:from-sky-500 hover:to-teal-500 rounded-2xl shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
                id="hero-start-assessment-btn"
              >
                <span>Start Health Assessment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreHowItWorks}
                className="w-full sm:w-auto px-7 py-4 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="hero-how-it-works-btn"
              >
                <span>Explore How It Works</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-600 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>AI-Powered Screening</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Machine Learning Based</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Privacy-Conscious Design</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Clean Medical Interactive Preview Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            {/* Visual Healthcare Card Container */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/90 relative overflow-hidden space-y-5">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Clinical Screening Hub</h4>
                    <p className="text-[11px] text-slate-400">Random Forest Inference Models</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ready for Assessment
                </span>
              </div>

              {/* Assessment Modules Preview */}
              <div className="space-y-3">
                {/* Heart Module */}
                <div
                  onClick={() => onStartPrediction("heart")}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-rose-50/50 border border-slate-200/80 hover:border-rose-300 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Heart className="w-5 h-5 fill-rose-500/20" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 group-hover:text-rose-700 transition-colors">
                        Cardiovascular Risk Screening
                      </h5>
                      <p className="text-[11px] text-slate-500">12 Clinical Parameters • ~84% Test Accuracy</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-rose-600 transition-all" />
                </div>

                {/* Diabetes Module */}
                <div
                  onClick={() => onStartPrediction("diabetes")}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-300 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Flame className="w-5 h-5 fill-amber-500/20" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 group-hover:text-amber-700 transition-colors">
                        Diabetes & Glycemic Risk Screening
                      </h5>
                      <p className="text-[11px] text-slate-500">8 Health Measurements • ~80% Test Accuracy</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
                </div>
              </div>

              {/* Sample Output Mini Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-sky-700" />
                  <span className="font-semibold text-slate-700">Digital Health Report & PDF Export</span>
                </div>
                <span className="text-[10px] font-bold text-sky-700 uppercase">Included</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
