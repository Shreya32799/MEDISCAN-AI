"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  AlertCircle,
  Stethoscope,
  HeartPulse,
} from "lucide-react";

export default function About() {
  return (
    <section id="why-us" className="scroll-mt-24 py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            About MediScan-AI
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Smarter Health Screening with AI
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            MediScan-AI combines machine learning and an intuitive digital health interface to provide preliminary risk screening for cardiovascular disease and diabetes.
          </p>
        </div>

        {/* 3 Core Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Card 1: AI-Powered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI-Powered</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Machine learning models analyze provided health parameters using validated Random Forest decision trees calibrated on clinical datasets.
            </p>
          </motion.div>

          {/* Card 2: Easy to Use */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Easy to Use</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Simple guided assessments designed for non-technical users, complete with clear parameter explanations and instant sample data presets.
            </p>
          </motion.div>

          {/* Card 3: Informative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Informative</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Results include risk estimates, understandable factor explanations, and printable physician summaries to foster informed clinical conversations.
            </p>
          </motion.div>
        </div>

        {/* Responsible Screening Notice */}
        <div className="p-6 rounded-2xl bg-white border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Educational Risk Screening & Decision Support System
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                MediScan-AI is strictly an artificial intelligence screening and risk stratifying tool. It does <strong>NOT</strong> provide medical diagnoses, prescriptions, or clinical treatments. Always consult a qualified medical professional for personal health evaluations.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}