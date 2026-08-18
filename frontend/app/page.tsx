"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import HeroStats from "@/components/stats/HeroStats";
import About from "@/components/about/About";
import HealthAssessmentSection from "@/components/sections/HealthAssessmentSection";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import ResponsibleAI from "@/components/sections/ResponsibleAI";
import Technology from "@/components/technology/Technology";
import FAQ from "@/components/faq/FAQ";
import Footer from "@/components/layout/Footer";
import PredictionModal, { DiseaseType, PredictionResult } from "@/components/assessment/PredictionModal";
import Chatbot from "@/components/chatbot/Chatbot";
import { AssessmentContext } from "@/app/api/chat/route";

export default function Home() {
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseType>("heart");
  const [assessmentContext, setAssessmentContext] = useState<AssessmentContext | undefined>(undefined);

  const openAssessment = (disease: DiseaseType = "heart") => {
    setSelectedDisease(disease);
    setAssessmentOpen(true);
  };

  const openChatbotWithContext = (ctx?: AssessmentContext) => {
    if (ctx) setAssessmentContext(ctx);
    setChatbotOpen(true);
  };

  return (
    <main className="min-h-screen bg-white selection:bg-teal-100 selection:text-teal-900">
      {/* Sticky Navigation Bar */}
      <Navbar
        onOpenAssessment={() => openAssessment("heart")}
        onOpenChatbot={() => setChatbotOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        onStartPrediction={(disease) => openAssessment(disease || "heart")}
        onExploreHowItWorks={() => {
          const el = document.getElementById("how-it-works");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Verified Hero Statistics */}
      <HeroStats />

      {/* About MediScan-AI */}
      <About />

      {/* Choose Your Health Assessment Section */}
      <HealthAssessmentSection
        onSelectAssessment={(disease) => openAssessment(disease)}
      />

      {/* How It Works (4-Step Flow) */}
      <HowItWorks
        onStartAssessment={() => openAssessment("heart")}
      />

      {/* Responsible AI Principles */}
      <ResponsibleAI />

      {/* Technology & Machine Learning Architecture */}
      <Technology />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* Footer */}
      <Footer
        onOpenAssessment={() => openAssessment("heart")}
        onOpenChatbot={() => setChatbotOpen(true)}
      />

      {/* Interactive Assessment Modal with Multi-Step Wizard, Real ML Inference & PDF Report */}
      <PredictionModal
        isOpen={assessmentOpen}
        onClose={() => setAssessmentOpen(false)}
        initialDisease={selectedDisease}
      />

      {/* Floating Context-Aware AI Health Assistant */}
      <Chatbot
        context={assessmentContext}
        isOpenExternal={chatbotOpen}
        onToggleExternal={(open) => setChatbotOpen(open)}
      />
    </main>
  );
}