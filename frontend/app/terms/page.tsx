"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TermsPage() {
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

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-6 text-slate-800">
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold">
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Platform Terms</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Terms of Use</h1>
            <p className="text-xs text-slate-400">Last updated: January 2026 • MediScan-AI Platform</p>
          </div>

          <section className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using MediScan-AI, you acknowledge and agree that this software application is provided for informational, screening, and educational decision-support purposes only.
            </p>
          </section>

          <section className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">2. Non-Diagnostic Disclaimer</h2>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
              <strong className="block font-bold">⚠️ Critical Medical Notice:</strong>
              MediScan-AI is NOT a licensed medical diagnostic service. Machine learning probability scores are statistical estimates and do not constitute clinical diagnoses, prescriptions, medical treatments, or emergency care.
            </div>
          </section>

          <section className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">3. Emergency Situations</h2>
            <p>
              If you or someone you know is experiencing chest pain, acute shortness of breath, sudden weakness, or any life-threatening symptoms, immediately call your local emergency services (e.g. 911, 112, 999) or visit the nearest emergency room.
            </p>
          </section>

          <section className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">4. User Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account login credentials and for all activities that occur under your account.
            </p>
          </section>
        </div>
      </div>

      <Footer onOpenAssessment={() => router.push("/assessment")} onOpenChatbot={() => {}} />
    </main>
  );
}
