"use client";

import { Activity, ShieldCheck, Bot, Sparkles, LayoutDashboard, Clock } from "lucide-react";
import Link from "next/link";

interface FooterProps {
  onOpenAssessment?: () => void;
  onOpenChatbot?: () => void;
}

export default function Footer({
  onOpenAssessment = () => {},
  onOpenChatbot = () => {},
}: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-600 flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                MediScan<span className="text-teal-400">-AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              AI-powered health risk screening platform delivering preliminary cardiovascular and metabolic risk estimates for educational awareness and physician decision support.
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Health Screening
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link
                  href="/assessment"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Start Health Assessment</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
                  <span>User Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Assessment History</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenChatbot}
                  className="hover:text-teal-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5 text-sky-400" />
                  <span>MediScan AI Assistant</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Information & Ethics
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/#about" className="hover:text-teal-400 transition-colors">
                  About MediScan-AI
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-teal-400 transition-colors">
                  How It Works (4 Steps)
                </Link>
              </li>
              <li>
                <Link href="/responsible-ai" className="hover:text-teal-400 transition-colors">
                  Responsible AI Principles
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-teal-400 transition-colors">
                  Platform Admin Analytics
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-teal-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Architecture */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Architecture & Safety
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-teal-400 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Privacy-Conscious Design</span>
              </div>
              <div className="flex items-center gap-2 text-sky-400 font-semibold">
                <Activity className="w-4 h-4 shrink-0" />
                <span>FastAPI + Next.js Machine Learning</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                In-memory inferencing without unauthorized third-party tracking.
              </p>
            </div>
          </div>

        </div>

        {/* Prominent Medical Disclaimer */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-200 font-bold block mb-1">
            ⚠️ Medical Screening & Educational Decision-Support Notice:
          </strong>
          MediScan-AI is an artificial intelligence screening and risk stratifying platform designed for educational awareness and clinical decision support. It does <strong>NOT</strong> provide medical diagnosis, prescription, or emergency medical treatment. Always consult a qualified physician or healthcare provider regarding any health symptoms or clinical decisions.
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MediScan-AI Platform. Built with Machine Learning & Next.js.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/responsible-ai" className="hover:text-slate-400 transition-colors">
              Responsible AI
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}