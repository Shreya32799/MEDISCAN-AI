"use client";

import { motion } from "framer-motion";
import { PREDICTIONS } from "@/data/landingData";
import {
  Heart,
  Flame,
  ArrowRight,
  ShieldAlert,
  Clock,
  Target,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface PredictionCardsProps {
  onSelectPrediction: (type: 'heart' | 'diabetes') => void;
}

export default function PredictionCards({
  onSelectPrediction,
}: PredictionCardsProps) {
  return (
    <section id="predictions" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background radial ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Specialized ML Models
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select Your AI Health Risk Assessment
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal">
            Choose a dedicated predictive model to assess your personalized cardiovascular or glycemic risk profile in real-time.
          </p>
        </div>

        {/* Prediction Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {PREDICTIONS.map((pred) => {
            const isHeart = pred.id === 'heart';
            return (
              <motion.div
                key={pred.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
                  isHeart
                    ? 'bg-gradient-to-b from-slate-800 to-slate-900/90 border-rose-500/30 hover:border-rose-500/60 hover:shadow-2xl hover:shadow-rose-500/10'
                    : 'bg-gradient-to-b from-slate-800 to-slate-900/90 border-amber-500/30 hover:border-amber-500/60 hover:shadow-2xl hover:shadow-amber-500/10'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`p-3.5 rounded-2xl flex items-center justify-center ${
                        isHeart
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {isHeart ? (
                        <Heart className="w-7 h-7 fill-rose-500/40 animate-pulse" />
                      ) : (
                        <Flame className="w-7 h-7 fill-amber-500/40" />
                      )}
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        isHeart
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {pred.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    {pred.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
                    {pred.fullDescription}
                  </p>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 mb-6 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                        Accuracy
                      </span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {pred.accuracy}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                        Parameters
                      </span>
                      <span className="font-extrabold text-sky-400 text-sm">
                        {pred.parametersCount} Vitals
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                        Speed
                      </span>
                      <span className="font-extrabold text-purple-400 text-sm">
                        {pred.timeToResult}
                      </span>
                    </div>
                  </div>

                  {/* Sample Biomarkers list */}
                  <div className="space-y-2 mb-8">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Key Required Biomarkers:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {pred.sampleFactors.map((factor, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isHeart ? 'text-rose-400' : 'text-amber-400'
                            }`}
                          />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Button */}
                <button
                  onClick={() =>
                    onSelectPrediction(isHeart ? 'heart' : 'diabetes')
                  }
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg group-hover:scale-[1.01] active:scale-95 ${
                    isHeart
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-600/20'
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/20'
                  }`}
                  id={`prediction-card-btn-${pred.id}`}
                >
                  <span>Start {pred.title}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
