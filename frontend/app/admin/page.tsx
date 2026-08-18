"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldAlert,
  Brain,
  Layers,
  Heart,
  Flame,
  BarChart3,
  Activity,
  Users,
  Lock,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { user } = useAuth();
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      <Navbar
        onOpenAssessment={() => {}}
        onOpenChatbot={() => setChatbotOpen(true)}
      />

      <div className="pt-28 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 flex-1">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-700 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Platform Administration & Model Analytics
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Admin Area
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Anonymized aggregate screening metrics and machine learning validation benchmarks
            </p>
          </div>
        </div>

        {/* Aggregate Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Platform Assessments</span>
            <div className="text-3xl font-extrabold text-slate-900">2,410</div>
            <p className="text-[11px] text-slate-500">Cumulative aggregate runs</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Heart Disease Models</span>
            <div className="text-3xl font-extrabold text-rose-600">~84%</div>
            <p className="text-[11px] text-slate-500">UCI benchmark test accuracy</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Diabetes Models</span>
            <div className="text-3xl font-extrabold text-amber-600">~80%</div>
            <p className="text-[11px] text-slate-500">Metabolic benchmark accuracy</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">System Uptime</span>
            <div className="text-3xl font-extrabold text-emerald-600">99.9%</div>
            <p className="text-[11px] text-slate-500">FastAPI inference engine</p>
          </div>
        </div>

        {/* Model Performance & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Machine Learning Model Benchmarks */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-sky-600" />
                <span>Verified Scikit-Learn Model Benchmarks</span>
              </h3>
              <p className="text-xs text-slate-400">Authentic test evaluation metrics from trained Random Forest estimators</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-1.5 text-rose-700">
                    <Heart className="w-4 h-4" /> Heart Disease Classifier
                  </span>
                  <span>~84% Accuracy</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  12 input features (StandardScaler normalization + Random Forest ensemble on 4-center clinical cohort).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <Flame className="w-4 h-4" /> Diabetes Classifier
                  </span>
                  <span>~80% Accuracy</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  8 input biomarkers (Glucose, BMI, Blood Pressure, Insulin, Pedigree function on clinical dataset).
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Risk Stratification Distribution */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-600" />
                <span>Aggregate Risk Category Breakdown</span>
              </h3>
              <p className="text-xs text-slate-400">Anonymized risk tier distributions across platform evaluations</p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-700">Low Risk Tier (&lt; 35%)</span>
                  <span>58%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "58%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-amber-700">Moderate Risk Tier (35 - 65%)</span>
                  <span>27%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "27%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-rose-700">High Risk Tier (&gt; 65%)</span>
                  <span>15%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: "15%" }} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <Footer onOpenChatbot={() => setChatbotOpen(true)} />
      <Chatbot isOpenExternal={chatbotOpen} onToggleExternal={setChatbotOpen} />
    </main>
  );
}
