"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import AssessmentWizard from "./AssessmentWizard";
import { AssessmentContext } from "@/app/api/chat/route";

export type DiseaseType = "heart" | "diabetes";

export interface PredictionResult {
  disease: string;
  prediction: number;
  probability_percentage: number;
  risk_level: string;
  risk_color: string;
  summary: string;
  recommendations: string[];
  disclaimer: string;
}

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDisease?: DiseaseType;
  onOpenChatbotWithContext?: (ctx: AssessmentContext) => void;
}

export default function PredictionModal({
  isOpen,
  onClose,
  initialDisease = "heart",
  onOpenChatbotWithContext,
}: PredictionModalProps) {
  // Lock background body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Health Assessment Modal"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl my-auto"
      >
        {/* Close Button Floating on Modal */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-50 p-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl border border-slate-700 transition-transform hover:scale-110 cursor-pointer"
          aria-label="Close Assessment Modal"
          id="close-assessment-modal-btn"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Multi-Step Assessment Wizard */}
        <AssessmentWizard
          initialDisease={initialDisease}
          onOpenChatbotWithContext={(ctx) => {
            onClose();
            if (onOpenChatbotWithContext) {
              onOpenChatbotWithContext(ctx);
            }
          }}
        />
      </motion.div>
    </div>
  );
}
