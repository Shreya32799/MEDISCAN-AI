"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AssessmentWizard from "@/components/assessment/AssessmentWizard";
import Chatbot from "@/components/chatbot/Chatbot";
import { Sparkles, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AssessmentContext } from "@/app/api/chat/route";

export default function AssessmentPage() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [assessmentContext, setAssessmentContext] = useState<AssessmentContext | undefined>(undefined);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      {/* Sticky Navigation Bar */}
      <Navbar
        onOpenAssessment={() => {}}
        onOpenChatbot={() => setChatbotOpen(true)}
      />

      <div className="pt-28 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center">
        
        {/* Top Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-sky-700 hover:border-sky-300 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Machine Learning Risk Screening</span>
          </div>
        </div>

        {/* 5-Step Interactive Assessment Wizard */}
        <AssessmentWizard
          onOpenChatbotWithContext={(ctx) => {
            setAssessmentContext(ctx);
            setChatbotOpen(true);
          }}
          onCompletePrediction={(res, ctx) => {
            setAssessmentContext(ctx);
          }}
        />
      </div>

      {/* Footer */}
      <Footer
        onOpenAssessment={() => {}}
        onOpenChatbot={() => setChatbotOpen(true)}
      />

      {/* Floating AI Health Assistant */}
      <Chatbot
        context={assessmentContext}
        isOpenExternal={chatbotOpen}
        onToggleExternal={(open) => setChatbotOpen(open)}
      />
    </main>
  );
}