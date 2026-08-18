"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Data Protection & Privacy</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-400">Last updated: January 2026 • MediScan-AI Platform</p>
          </div>

          <section className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              MediScan-AI is designed with a privacy-conscious architecture. We only collect information strictly necessary to perform risk screening calculations and maintain your personal assessment history:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Demographic inputs: age and biological sex.</li>
              <li>Clinical measurements entered during assessments (such as blood pressure, glucose, cholesterol, and BMI).</li>
              <li>Basic account details (name and email) for authentication and dashboard session management.</li>
            </ul>
          </section>

          <section className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">2. How Information is Processed</h2>
            <p>
              Clinical parameters are evaluated in-memory using our machine learning models to calculate screening probabilities. We do not sell, rent, or distribute personal health information to third parties, advertisers, or insurers.
            </p>
          </section>

          <section className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">3. Data Security & Storage</h2>
            <p>
              Assessment history is isolated per authenticated user account. Passwords are never stored in plain text and are safeguarded with cryptographic hashing.
            </p>
          </section>

          <section className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900">4. Medical Non-Disclosure</h2>
            <p>
              MediScan-AI is a risk screening and educational decision-support tool. It does not replace medical records managed by licensed healthcare providers.
            </p>
          </section>
        </div>
      </div>

      <Footer onOpenAssessment={() => router.push("/assessment")} onOpenChatbot={() => {}} />
    </main>
  );
}
