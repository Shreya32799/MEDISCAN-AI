"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PredictionModal, { DiseaseType } from "@/components/assessment/PredictionModal";
import Chatbot from "@/components/chatbot/Chatbot";
import { useAuth, StoredAssessment } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Heart,
  Flame,
  Activity,
  ArrowRight,
  PlusCircle,
  FileText,
  Clock,
  ShieldCheck,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Layers,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { exportHealthReportPDF, PDFReportData } from "@/lib/pdfGenerator";
import { AssessmentContext } from "@/app/api/chat/route";

export default function DashboardPage() {
  const { user, getAssessments, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseType>("heart");
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [selectedAssessmentForModal, setSelectedAssessmentForModal] = useState<StoredAssessment | null>(null);
  const [chatbotContext, setChatbotContext] = useState<AssessmentContext | undefined>(undefined);

  // Authentication Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const assessments = getAssessments("all");

  const heartAssessments = assessments.filter((a) => a.disease === "Heart Disease");
  const diabetesAssessments = assessments.filter((a) => a.disease === "Diabetes");

  const latestHeart = heartAssessments[0] || null;
  const latestDiabetes = diabetesAssessments[0] || null;
  const latestOverall = assessments[0] || null;

  const openAssessment = (disease: DiseaseType) => {
    setSelectedDisease(disease);
    setAssessmentModalOpen(true);
  };

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

  const handleAskAssistantAbout = (a: StoredAssessment) => {
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

  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Activity className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading your health dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      <Navbar
        onOpenAssessment={() => openAssessment("heart")}
        onOpenChatbot={() => setChatbotOpen(true)}
      />

      <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 flex-1">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{user.role === "physician" ? "Clinical Provider Portal" : "Patient Portal"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Your health screening dashboard • Real-time AI risk stratification & report tracking
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link
              href="/history"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>All History</span>
            </Link>

            <button
              onClick={() => openAssessment("heart")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-teal-600 to-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              id="dashboard-start-assessment-btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start Health Screening</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Screenings</span>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{assessments.length}</div>
            <p className="text-[11px] text-slate-500">Historical records saved</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Heart Screenings</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{heartAssessments.length}</div>
            <p className="text-[11px] text-slate-500">
              {latestHeart ? `Latest: ${latestHeart.riskLevel}` : "No heart checks yet"}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Diabetes Screenings</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{diabetesAssessments.length}</div>
            <p className="text-[11px] text-slate-500">
              {latestDiabetes ? `Latest: ${latestDiabetes.riskLevel}` : "No diabetes checks yet"}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">PDF Reports</span>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{assessments.length}</div>
            <p className="text-[11px] text-slate-500">Vector PDF documents ready</p>
          </div>
        </div>

        {/* Two Main Assessment Launch Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Heart Disease Screening */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Heart className="w-6 h-6 fill-rose-500/20" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Heart Disease Risk Screening
                    </h3>
                    <p className="text-xs text-slate-500">12 Clinical Parameters • Random Forest ML</p>
                  </div>
                </div>

                {latestHeart && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      latestHeart.riskLevel.includes("High")
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : latestHeart.riskLevel.includes("Mod")
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    Last: {latestHeart.riskLevel} ({latestHeart.probability}%)
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates cardiovascular disease risk trajectory from resting blood pressure, cholesterol, resting ECG patterns, and treadmill exercise test metrics.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => openAssessment("heart")}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                id="dashboard-start-heart-btn"
              >
                <span>Start Heart Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {latestHeart && (
                <button
                  onClick={() => handleDownloadPDF(latestHeart)}
                  className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Download last Heart Report"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Diabetes Screening */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Flame className="w-6 h-6 fill-amber-500/20" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Diabetes & Glycemic Screening
                    </h3>
                    <p className="text-xs text-slate-500">8 Metabolic Indicators • Random Forest ML</p>
                  </div>
                </div>

                {latestDiabetes && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      latestDiabetes.riskLevel.includes("High")
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : latestDiabetes.riskLevel.includes("Mod")
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    Last: {latestDiabetes.riskLevel} ({latestDiabetes.probability}%)
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Estimates glycemic and metabolic vulnerability from fasting plasma glucose, BMI, diastolic blood pressure, insulin, and pedigree genetics.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => openAssessment("diabetes")}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                id="dashboard-start-diabetes-btn"
              >
                <span>Start Diabetes Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {latestDiabetes && (
                <button
                  onClick={() => handleDownloadPDF(latestDiabetes)}
                  className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Download last Diabetes Report"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Recent Assessments Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Screening Records</h3>
              <p className="text-xs text-slate-500">Your recent AI predictions and downloadable clinical reports</p>
            </div>

            <Link
              href="/history"
              className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {assessments.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-slate-900">No assessments yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Start your first health screening to see your results, risk breakdown, and downloadable PDF reports here.
                </p>
              </div>
              <button
                onClick={() => openAssessment("heart")}
                className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Start First Health Screening
              </button>
            </div>
          ) : (
            /* Assessment Table / Cards */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Report ID / Date</th>
                    <th className="py-3 px-4">Assessment Type</th>
                    <th className="py-3 px-4">Risk Category</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assessments.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{item.id}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          {item.disease === "Heart Disease" ? (
                            <Heart className="w-4 h-4 text-rose-500" />
                          ) : (
                            <Flame className="w-4 h-4 text-amber-500" />
                          )}
                          <span>{item.disease}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            item.riskLevel.includes("High")
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : item.riskLevel.includes("Mod")
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.riskLevel.includes("High")
                                ? "bg-rose-500"
                                : item.riskLevel.includes("Mod")
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          />
                          {item.riskLevel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {item.probability}%
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAskAssistantAbout(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-sky-50 border border-slate-200 transition-colors cursor-pointer"
                            title="Ask AI Assistant about this result"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDownloadPDF(item)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      <Footer onOpenChatbot={() => setChatbotOpen(true)} />

      {/* Assessment Modal */}
      <PredictionModal
        isOpen={assessmentModalOpen}
        onClose={() => setAssessmentModalOpen(false)}
        initialDisease={selectedDisease}
      />

      {/* Floating AI Health Assistant */}
      <Chatbot
        context={chatbotContext}
        isOpenExternal={chatbotOpen}
        onToggleExternal={setChatbotOpen}
      />
    </main>
  );
}
