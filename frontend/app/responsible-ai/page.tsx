"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Eye, Lock, HeartHandshake, ShieldAlert, ArrowLeft, Brain, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResponsibleAIPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      <Navbar onOpenAssessment={() => router.push("/assessment")} onOpenChatbot={() => {}} />

      <div className="pt-28 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-8 text-slate-800">
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ethical AI Principles</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Responsible AI in Healthcare</h1>
            <p className="text-xs text-slate-400">Our commitments to transparency, privacy, and clinical safety</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Eye className="w-4 h-4 text-sky-600" />
                <span>1. Model Transparency</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We clearly disclose our machine learning architecture (Random Forest classifiers), dataset training benchmarks (~84% heart, ~80% diabetes test accuracy), and the physiological biomarkers utilized.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Lock className="w-4 h-4 text-teal-600" />
                <span>2. Privacy & Data Safety</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Health measurements are processed in-memory for model inference. User assessment history is isolated per account and never monetized or shared with third-party trackers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <HeartHandshake className="w-4 h-4 text-indigo-600" />
                <span>3. Human-Centered Design</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our interface converts statistical probabilities into understandable language and structured PDF reports to encourage informed conversations between patients and doctors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>4. Not a Medical Diagnosis</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI screening is strictly an educational risk estimation tool. It does not replace comprehensive medical evaluations, laboratory diagnostic tests, or doctor consultations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer onOpenAssessment={() => router.push("/assessment")} onOpenChatbot={() => {}} />
    </main>
  );
}
