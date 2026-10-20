"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  LayoutDashboard,
  Heart,
  Flame,
  Calendar,
  Download,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
} from "lucide-react";
import { StoredAssessment } from "@/context/AuthContext";
import { PredictionResult } from "@/components/assessment/PredictionModal";
import Link from "next/link";

interface DashboardOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResult: PredictionResult | null;
  currentParameters: Record<string, any>;
  patientName?: string;
  onDownloadPDF: () => void;
  onNewAssessment: () => void;
  userHistory?: StoredAssessment[];
}

export default function DashboardOverlayModal({
  isOpen,
  onClose,
  currentResult,
  currentParameters,
  patientName,
  onDownloadPDF,
  onNewAssessment,
  userHistory = [],
}: DashboardOverlayModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle ESC key to close
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

  const isHeart = currentResult?.disease === "Heart Disease";
  const displayName = patientName || currentParameters?.patient_name || "Patient / Subject";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Screening Dashboard Overview"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col text-slate-900"
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">Health Screening Dashboard</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Active Assessment
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Patient: <span className="text-slate-200 font-semibold">{displayName}</span> • Generated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Dashboard"
            id="close-dashboard-overlay-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Main Active Screening Card */}
          {currentResult ? (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isHeart ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {isHeart ? <Heart className="w-6 h-6 fill-rose-500/20" /> : <Flame className="w-6 h-6 fill-amber-500/20" />}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Screening Module
                    </span>
                    <h4 className="text-xl font-bold text-slate-900">{currentResult.disease}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      AI Model Score
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      {currentResult.probability_percentage}%
                    </span>
                  </div>
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${
                      currentResult.risk_level === "Low Risk"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : currentResult.risk_level === "Moderate Risk"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                  >
                    {currentResult.risk_level}
                  </span>
                </div>
              </div>

              {/* Summary Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentResult.summary}
              </p>

              {/* Clinical Parameters Grid */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Entered Clinical Biomarkers
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {isHeart ? (
                    <>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Age & Sex</span>
                        <span className="font-bold text-slate-900">{currentParameters.age || "—"} Yrs • {currentParameters.sex || "—"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Resting Blood Pressure</span>
                        <span className="font-bold text-slate-900">{currentParameters.trestbps || "—"} mmHg</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Total Cholesterol</span>
                        <span className="font-bold text-slate-900">{currentParameters.chol || "—"} mg/dL</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Max Exercise Pulse</span>
                        <span className="font-bold text-slate-900">{currentParameters.thalch || "—"} bpm</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Chest Discomfort</span>
                        <span className="font-bold text-slate-900 capitalize">{currentParameters.cp || "—"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Fasting Sugar &gt; 120</span>
                        <span className="font-bold text-slate-900">{currentParameters.fbs ? "Yes (Elevated)" : "No (Normal)"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Resting ECG</span>
                        <span className="font-bold text-slate-900 capitalize">{currentParameters.restecg || "Normal"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Exercise ECG Shift</span>
                        <span className="font-bold text-slate-900">{currentParameters.oldpeak ?? 0.0} mm ({currentParameters.slope || "Upsloping"})</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Age</span>
                        <span className="font-bold text-slate-900">{currentParameters.age || "—"} Yrs</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Fasting Glucose</span>
                        <span className="font-bold text-slate-900">{currentParameters.glucose || "—"} mg/dL</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Diastolic Pressure</span>
                        <span className="font-bold text-slate-900">{currentParameters.blood_pressure || "—"} mmHg</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Body Mass Index (BMI)</span>
                        <span className="font-bold text-slate-900">{currentParameters.bmi || "—"} kg/m²</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Past Pregnancies</span>
                        <span className="font-bold text-slate-900">{currentParameters.pregnancies ?? 0}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Serum Insulin</span>
                        <span className="font-bold text-slate-900">{currentParameters.insulin || "—"} µU/mL</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Skinfold Thickness</span>
                        <span className="font-bold text-slate-900">{currentParameters.skin_thickness || "20"} mm</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Family History Score</span>
                        <span className="font-bold text-slate-900">{currentParameters.diabetes_pedigree_function || "—"} DPF</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200">
              <p className="text-sm text-slate-500">No active assessment results to display.</p>
            </div>
          )}

          {/* Past Assessment Records (if user has history) */}
          {userHistory.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Previous Screening History ({userHistory.length})
                </h5>
                <Link
                  href="/history"
                  onClick={onClose}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  <span>View All Records</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2">
                {userHistory.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          item.disease === "Heart Disease"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {item.disease === "Heart Disease" ? (
                          <Heart className="w-4 h-4 fill-rose-500/20" />
                        ) : (
                          <Flame className="w-4 h-4 fill-amber-500/20" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{item.disease}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.riskLevel === "Low Risk"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.riskLevel === "Moderate Risk"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {item.riskLevel} ({item.probability}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Clinical Decision-Support Note:</strong> Model probabilities estimate statistical risk from physiological inputs. Always share your PDF report with a qualified physician for clinical evaluation.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNewAssessment();
              }}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Assessment</span>
            </button>

            <Link
              href="/dashboard"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Full Workspace Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadPDF}
              className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Report</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
