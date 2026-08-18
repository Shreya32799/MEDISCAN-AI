"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import { useAuth, StoredAssessment } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Heart,
  Flame,
  Clock,
  Download,
  Eye,
  Sparkles,
  ArrowLeft,
  Trash2,
  Filter,
  CheckCircle2,
  Calendar,
  X,
  FileText,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { exportHealthReportPDF, PDFReportData } from "@/lib/pdfGenerator";
import { AssessmentContext } from "@/app/api/chat/route";
import { motion, AnimatePresence } from "framer-motion";

export default function HistoryPage() {
  const { user, getAssessments, deleteAssessment, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [filterTab, setFilterTab] = useState<"all" | "heart" | "diabetes">("all");
  const [selectedAssessmentModal, setSelectedAssessmentModal] = useState<StoredAssessment | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatbotContext, setChatbotContext] = useState<AssessmentContext | undefined>(undefined);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const allAssessments = getAssessments("all");
  const displayedAssessments = filterTab === "all"
    ? allAssessments
    : allAssessments.filter((a) => a.disease.toLowerCase().includes(filterTab));

  const handleDownloadPDF = (a: StoredAssessment) => {
    const isHeart = a.disease === "Heart Disease";
    const p = a.parameters || {};

    let parameterList: { label: string; value: string | number; unit?: string; reference: string }[] = [];

    if (isHeart) {
      parameterList = [
        { label: "Resting Blood Pressure", value: p.trestbps || "—", unit: "mmHg", reference: "Normal: 90 - 120 mmHg" },
        { label: "Serum Cholesterol", value: p.chol || "—", unit: "mg/dL", reference: "Desirable: < 200 mg/dL" },
        { label: "Chest Pain Type", value: p.cp || "—", unit: "Type", reference: "Typical, Atypical, Non-Anginal, Asymptomatic" },
        { label: "Resting ECG", value: p.restecg || "—", unit: "Pattern", reference: "Normal / ST-T Abnormality / LVH" },
        { label: "Max Heart Rate (thalch)", value: p.thalch || "—", unit: "bpm", reference: "Age-predicted maximum" },
        { label: "ST Depression (oldpeak)", value: p.oldpeak || "0", unit: "mm", reference: "Normal exercise shift: < 1.0" },
        { label: "Age at Assessment", value: p.age || "—", unit: "Yrs", reference: "Cardiovascular baseline" },
      ];
    } else {
      parameterList = [
        { label: "Fasting Plasma Glucose", value: p.glucose || "—", unit: "mg/dL", reference: "Normal Fasting: 70 - 99 mg/dL" },
        { label: "Body Mass Index (BMI)", value: p.bmi || "—", unit: "kg/m²", reference: "Normal: 18.5 - 24.9 kg/m²" },
        { label: "Diastolic Blood Pressure", value: p.blood_pressure || "—", unit: "mmHg", reference: "Normal: 60 - 80 mmHg" },
        { label: "2-Hour Serum Insulin", value: p.insulin || "—", unit: "µU/mL", reference: "Normal Fasting: 16 - 166 µU/mL" },
        { label: "Diabetes Pedigree (DPF)", value: p.diabetes_pedigree_function || "—", unit: "DPF", reference: "Genetic risk score" },
      ];
    }

    const reportData: PDFReportData = {
      reportId: a.id,
      patientName: a.patientName || user?.name || "Patient",
      age: p.age || user?.age || 40,
      sex: p.sex || user?.sex || undefined,
      disease: a.disease,
      probability: a.probability,
      riskLevel: a.riskLevel,
      riskColor: a.riskColor,
      summary: a.summary,
      recommendations: a.recommendations,
      parameters: parameterList,
      date: new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    };

    exportHealthReportPDF(reportData);
  };

  const handleAskAssistant = (a: StoredAssessment) => {
    const ctx: AssessmentContext = {
      disease: a.disease,
      probability: a.probability,
      riskLevel: a.riskLevel,
      summary: a.summary,
      parameters: a.parameters,
      patientName: a.patientName,
    };
    setChatbotContext(ctx);
    setChatbotOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      <Navbar
        onOpenAssessment={() => router.push("/assessment")}
        onOpenChatbot={() => setChatbotOpen(true)}
      />

      <div className="pt-28 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6 flex-1">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-700 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Assessment History & Records
            </h1>
            <p className="text-xs text-slate-500">
              Review and export your past machine learning risk screening records
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex p-1.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold shadow-2xs self-start sm:self-auto">
            <button
              onClick={() => setFilterTab("all")}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                filterTab === "all"
                  ? "bg-slate-900 text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Records ({allAssessments.length})
            </button>

            <button
              onClick={() => setFilterTab("heart")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                filterTab === "heart"
                  ? "bg-rose-600 text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-rose-600"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Heart</span>
            </button>

            <button
              onClick={() => setFilterTab("diabetes")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                filterTab === "diabetes"
                  ? "bg-amber-600 text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-amber-600"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Diabetes</span>
            </button>
          </div>
        </div>

        {/* Assessment Records Grid / Table */}
        {displayedAssessments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">No matching assessment records</h3>
              <p className="text-xs text-slate-500">
                You have not completed any {filterTab !== "all" ? filterTab : ""} screening evaluations yet.
              </p>
            </div>
            <Link
              href="/assessment"
              className="inline-block px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              Start New Health Assessment
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedAssessments.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      a.disease === "Heart Disease"
                        ? "bg-rose-100 text-rose-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {a.disease === "Heart Disease" ? (
                      <Heart className="w-6 h-6 fill-rose-500/20" />
                    ) : (
                      <Flame className="w-6 h-6 fill-amber-500/20" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="font-extrabold text-sm text-slate-900">{a.disease}</h4>
                      <span className="font-mono text-[11px] text-slate-400">ID: {a.id}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          a.riskLevel.includes("High")
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : a.riskLevel.includes("Mod")
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {a.riskLevel} • {a.probability}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug line-clamp-1">
                      {a.summary}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Date: {new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      <span>•</span>
                      <span>Patient: {a.patientName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => handleAskAssistant(a)}
                    className="p-2 rounded-xl text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Ask AI Assistant about this assessment"
                  >
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span className="hidden sm:inline">Ask AI</span>
                  </button>

                  <button
                    onClick={() => setSelectedAssessmentModal(a)}
                    className="px-3.5 py-2 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPDF(a)}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Details View Modal */}
      <AnimatePresence>
        {selectedAssessmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-sky-600">Historical Screening Record</span>
                  <h3 className="text-xl font-bold text-slate-900">{selectedAssessmentModal.disease} Report</h3>
                </div>
                <button
                  onClick={() => setSelectedAssessmentModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Gauge & Summary Box */}
              <div
                className={`p-6 rounded-2xl border text-slate-900 flex items-center justify-between gap-4 ${
                  selectedAssessmentModal.riskColor === "rose"
                    ? "bg-rose-50/70 border-rose-200"
                    : selectedAssessmentModal.riskColor === "amber"
                    ? "bg-amber-50/70 border-amber-200"
                    : "bg-emerald-50/70 border-emerald-200"
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">Estimated Category</span>
                  <h4 className="text-2xl font-extrabold">{selectedAssessmentModal.riskLevel}</h4>
                  <p className="text-xs text-slate-700 mt-1 max-w-md">{selectedAssessmentModal.summary}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-3xl font-black">{selectedAssessmentModal.probability}%</span>
                  <span className="text-[10px] block font-bold text-slate-500 uppercase">Risk Score</span>
                </div>
              </div>

              {/* Parameters List */}
              <div>
                <h5 className="text-xs font-bold uppercase text-slate-400 mb-2">Recorded Parameters</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Object.entries(selectedAssessmentModal.parameters || {}).map(([key, val]) => (
                    <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block truncate">{key}</span>
                      <span className="font-bold text-slate-900">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 block">Recommended Actions:</span>
                {selectedAssessmentModal.recommendations?.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    handleAskAssistant(selectedAssessmentModal);
                    setSelectedAssessmentModal(null);
                  }}
                  className="px-4 py-2 rounded-xl text-sky-700 bg-sky-50 border border-sky-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Assistant About This Result</span>
                </button>

                <button
                  onClick={() => handleDownloadPDF(selectedAssessmentModal)}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer onOpenChatbot={() => setChatbotOpen(true)} />
      <Chatbot context={chatbotContext} isOpenExternal={chatbotOpen} onToggleExternal={setChatbotOpen} />
    </main>
  );
}
