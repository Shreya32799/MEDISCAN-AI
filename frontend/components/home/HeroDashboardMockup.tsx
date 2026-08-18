"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  HeartPulse,
  Activity,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Brain,
  FileCheck2,
  Dna,
} from 'lucide-react';

export default function HeroDashboardMockup() {
  const [heartRate, setHeartRate] = useState(72);
  const [activeTab, setActiveTab] = useState<'cardiac' | 'metabolic'>('cardiac');

  // Simulate slight fluctuation in real-time heart rate for visual dynamics
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(68 + Math.floor(Math.random() * 8));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Background ambient glow behind mockup */}
      <div className="absolute -top-6 -left-6 -right-6 -bottom-6 bg-gradient-to-tr from-sky-400/20 via-indigo-500/15 to-emerald-400/20 blur-3xl rounded-3xl -z-10" />

      {/* Main Glassmorphic Dashboard Window */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden text-slate-900 transition-all duration-300">
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-400 ml-2 border-l border-slate-700 pl-3">
              mediscan-core-v2.4 // active_session
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              AI Live Stream
            </span>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Patient Overview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm border border-sky-200 shadow-sm">
                PT
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-base">
                    Patient #8429-A
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    Age 52 • Male
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <span>Last Sync: 2 mins ago</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">
                    14 Parameters Verified
                  </span>
                </p>
              </div>
            </div>

            {/* Model Switcher */}
            <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-semibold self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('cardiac')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'cardiac'
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🫀 Heart AI
              </button>
              <button
                onClick={() => setActiveTab('metabolic')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'metabolic'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🩸 Diabetes AI
              </button>
            </div>
          </div>

          {/* AI Risk Score Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Primary Risk Box */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-emerald-50/50 border border-emerald-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Calculated Risk</span>
                <span className="text-emerald-600 font-bold">Optimal</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {activeTab === 'cardiac' ? '12.4%' : '8.2%'}
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -4.1%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: activeTab === 'cardiac' ? '12.4%' : '8.2%' }}
                />
              </div>
            </div>

            {/* Heart Rate Vitals */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-sky-50/50 border border-sky-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Live Pulse</span>
                <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-slate-900">
                  {heartRate}
                </span>
                <span className="text-xs text-slate-500 font-medium">BPM</span>
              </div>
              <span className="text-[11px] text-sky-700 font-medium block mt-1">
                Resting Rhythm Normal
              </span>
            </div>

            {/* AI Model Confidence */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-indigo-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>AI Confidence</span>
                <Brain className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  98.6%
                </span>
              </div>
              <span className="text-[11px] text-indigo-700 font-medium block mt-1">
                XGBoost + SHAP Validated
              </span>
            </div>
          </div>

          {/* Animated Simulated ECG / Waveform Canvas */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                SIMULATED LEAD II ECG WAVEFORM
              </span>
              <span className="text-emerald-400 font-semibold">25 mm/s</span>
            </div>

            {/* ECG Line Graphic SVG */}
            <div className="h-16 w-full relative flex items-center overflow-hidden">
              <svg
                className="w-full h-full stroke-emerald-400 fill-none"
                viewBox="0 0 500 80"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,40 L60,40 L70,35 L75,45 L80,10 L88,75 L95,35 L102,40 L160,40 L170,35 L175,45 L180,10 L188,75 L195,35 L202,40 L260,40 L270,35 L275,45 L280,10 L288,75 L295,35 L302,40 L360,40 L370,35 L375,45 L380,10 L388,75 L395,35 L402,40 L500,40"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Scanning overlay bar */}
              <div className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent animate-ecg-scan pointer-events-none" />
            </div>
          </div>

          {/* Biomarkers / Key AI Parameters */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>CONTRIBUTING BIOMARKERS</span>
              <span className="text-sky-600 hover:underline cursor-pointer">
                View SHAP Breakdown
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">
                  Blood Pressure
                </span>
                <span className="font-bold text-slate-800">118 / 78 mmHg</span>
                <span className="text-[10px] text-emerald-600 block font-medium">
                  ✓ Ideal Target
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">
                  Serum Cholesterol
                </span>
                <span className="font-bold text-slate-800">185 mg/dL</span>
                <span className="text-[10px] text-emerald-600 block font-medium">
                  ✓ Normal Range
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">
                  Fasting HbA1c
                </span>
                <span className="font-bold text-slate-800">5.4 %</span>
                <span className="text-[10px] text-emerald-600 block font-medium">
                  ✓ Non-Diabetic
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mockup Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Diagnostic Report Ready for Export</span>
          </div>
          <span className="font-semibold text-sky-600 hover:text-sky-700 cursor-pointer flex items-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5" /> PDF Signed
          </span>
        </div>
      </div>

      {/* Floating Medical Badges Around Mockup */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-5 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl border border-slate-200 flex items-center gap-2.5 text-xs font-bold text-slate-800 z-20"
      >
        <div className="p-1.5 rounded-lg bg-sky-100 text-sky-600">
          <Dna className="w-4 h-4" />
        </div>
        <div>
          <span className="block text-slate-900">Explainable AI</span>
          <span className="text-[10px] font-normal text-slate-500">
            SHAP Feature Mapping
          </span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl border border-slate-200 flex items-center gap-2.5 text-xs font-bold text-slate-800 z-20"
      >
        <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="block text-slate-900">Sub-2.4s Inference</span>
          <span className="text-[10px] font-normal text-slate-500">
            FastAPI + PyTorch Pipeline
          </span>
        </div>
      </motion.div>
    </div>
  );
};
