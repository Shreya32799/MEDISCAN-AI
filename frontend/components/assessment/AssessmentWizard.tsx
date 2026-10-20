"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Flame,
  Activity,
  User,
  ActivitySquare,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Printer,
  Download,
  MessageSquare,
  Sparkles,
  Info,
  ShieldCheck,
  Check,
  Edit2,
  AlertOctagon,
  LayoutDashboard,
  HelpCircle,
} from "lucide-react";
import { DiseaseType, PredictionResult } from "./PredictionModal";
import { exportHealthReportPDF, generateReportId, PDFReportData } from "@/lib/pdfGenerator";
import { AssessmentContext } from "@/app/api/chat/route";
import { useAuth } from "@/context/AuthContext";
import DashboardOverlayModal from "@/components/dashboard/DashboardOverlayModal";
import Link from "next/link";

interface AssessmentWizardProps {
  initialDisease?: DiseaseType;
  onOpenChatbotWithContext?: (ctx: AssessmentContext) => void;
  onCompletePrediction?: (result: PredictionResult, context: AssessmentContext) => void;
}

const HEART_DEFAULTS = {
  patient_name: "Alex Morgan",
  age: 45,
  sex: "Male",
  dataset: 0, // Cleveland Clinic standard calibration (kept silently for model requirement)
  cp: "typical angina",
  trestbps: 120,
  chol: 200,
  fbs: false,
  restecg: "normal",
  thalch: 150,
  exang: false,
  oldpeak: 1.0,
  slope: "flat",
};

const DIABETES_DEFAULTS = {
  patient_name: "Emma Watson",
  pregnancies: 1,
  glucose: 110,
  blood_pressure: 72,
  skin_thickness: 20,
  insulin: 85,
  bmi: 24.5,
  diabetes_pedigree_function: 0.45,
  age: 36,
};

const PRESETS = {
  heart: {
    lowRisk: {
      patient_name: "Alex Morgan (Low Risk Demo)",
      age: 38,
      sex: "Male",
      dataset: 0,
      cp: "typical angina",
      trestbps: 118,
      chol: 175,
      fbs: false,
      restecg: "normal",
      thalch: 168,
      exang: false,
      oldpeak: 0.0,
      slope: "upsloping",
    },
    highRisk: {
      patient_name: "Robert Taylor (High Risk Demo)",
      age: 64,
      sex: "Male",
      dataset: 0,
      cp: "asymptomatic",
      trestbps: 165,
      chol: 295,
      fbs: true,
      restecg: "st-t abnormality",
      thalch: 110,
      exang: true,
      oldpeak: 3.2,
      slope: "flat",
    },
  },
  diabetes: {
    lowRisk: {
      patient_name: "Emma Watson (Low Risk Demo)",
      pregnancies: 1,
      glucose: 92,
      blood_pressure: 68,
      skin_thickness: 19,
      insulin: 70,
      bmi: 21.8,
      diabetes_pedigree_function: 0.28,
      age: 26,
    },
    highRisk: {
      patient_name: "David Miller (High Risk Demo)",
      pregnancies: 0,
      glucose: 185,
      blood_pressure: 88,
      skin_thickness: 38,
      insulin: 240,
      bmi: 36.4,
      diabetes_pedigree_function: 1.15,
      age: 54,
    },
  },
};

const STEPS = [
  { id: 1, name: "Demographics", icon: User },
  { id: 2, name: "Vitals & Labs", icon: ActivitySquare },
  { id: 3, name: "Specialized Tests", icon: Stethoscope },
  { id: 4, name: "Review", icon: CheckCircle2 },
  { id: 5, name: "Screening Result", icon: Sparkles },
];

/**
 * Accessible Info Tooltip / Helper Dialog Trigger
 */
function FieldHelper({
  title,
  description,
  range,
  tip,
}: {
  title: string;
  description: string;
  range?: string;
  tip?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block ml-1.5 align-middle">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="p-0.5 rounded-full text-slate-400 hover:text-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
        aria-label={`Info about ${title}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-64 p-3 bg-slate-900 text-white rounded-xl shadow-xl text-left border border-slate-700 animate-in fade-in duration-150">
          <p className="font-bold text-xs text-sky-300 mb-1">{title}</p>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-1.5">{description}</p>
          {range && (
            <p className="text-[10px] text-emerald-300 font-semibold mb-1">
              Healthy Target: <span className="text-white">{range}</span>
            </p>
          )}
          {tip && (
            <p className="text-[10px] text-slate-400 italic border-t border-slate-800 pt-1">
              Note: {tip}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AssessmentWizard({
  initialDisease = "heart",
  onOpenChatbotWithContext,
  onCompletePrediction,
}: AssessmentWizardProps) {
  const { user, saveAssessment, getAssessments } = useAuth();

  const [disease, setDisease] = useState<DiseaseType>(initialDisease);
  const [currentStep, setCurrentStep] = useState(1);
  const [heartData, setHeartData] = useState({
    ...HEART_DEFAULTS,
    patient_name: user?.name || HEART_DEFAULTS.patient_name,
  });
  const [diabetesData, setDiabetesData] = useState({
    ...DIABETES_DEFAULTS,
    patient_name: user?.name || DIABETES_DEFAULTS.patient_name,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [currentReportId, setCurrentReportId] = useState<string>(generateReportId());
  const [errorText, setErrorText] = useState<string | null>(null);
  const [savedStatus, setSavedStatus] = useState<boolean>(false);
  const [showDashboardOverlay, setShowDashboardOverlay] = useState<boolean>(false);

  const userHistory = getAssessments("all");

  const loadPreset = (type: "lowRisk" | "highRisk") => {
    setErrorText(null);
    if (disease === "heart") {
      setHeartData({ ...PRESETS.heart[type] });
    } else {
      setDiabetesData({ ...PRESETS.diabetes[type] });
    }
  };

  const handleDiseaseChange = (newDisease: DiseaseType) => {
    setDisease(newDisease);
    setCurrentStep(1);
    setPredictionResult(null);
    setErrorText(null);
    setSavedStatus(false);
  };

  const handleRunPrediction = async () => {
    setIsLoading(true);
    setErrorText(null);

    const payload = disease === "heart" ? heartData : diabetesData;
    const endpoint = disease === "heart" ? "/api/predict/heart" : "/api/predict/diabetes";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Prediction API encountered an issue. Please try again.");
      }

      const data: PredictionResult = await res.json();
      const reportId = generateReportId();
      setCurrentReportId(reportId);
      setPredictionResult(data);
      setCurrentStep(5);

      // Auto-save assessment to user's history
      saveAssessment(data, payload, payload.patient_name);
      setSavedStatus(true);

      if (onCompletePrediction) {
        const ctx: AssessmentContext = {
          disease: data.disease,
          probability: data.probability_percentage,
          riskLevel: data.risk_level,
          summary: data.summary,
          parameters: payload,
          patientName: payload.patient_name,
        };
        onCompletePrediction(data, ctx);
      }
    } catch (err: any) {
      setErrorText(err.message || "Failed to process prediction. Please verify inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!predictionResult) return;

    const isHeart = disease === "heart";
    const currentParams = isHeart ? heartData : diabetesData;

    let parameterList: { label: string; value: string | number; unit?: string; reference: string }[] = [];

    if (isHeart) {
      parameterList = [
        { label: "Resting Blood Pressure", value: heartData.trestbps, unit: "mmHg", reference: "Normal: 90 - 120 mmHg" },
        { label: "Total Serum Cholesterol", value: heartData.chol, unit: "mg/dL", reference: "Desirable: < 200 mg/dL" },
        { label: "Chest Discomfort Type", value: heartData.cp, unit: "Type", reference: "Typical, Atypical, Non-Anginal, Asymptomatic" },
        { label: "Fasting Blood Sugar > 120", value: heartData.fbs ? "Yes (Elevated)" : "No (Normal)", unit: "Indicator", reference: "Fasting normal: ≤ 120 mg/dL" },
        { label: "Resting ECG Result", value: heartData.restecg, unit: "Pattern", reference: "Normal / ST-T Abnormality / LVH" },
        { label: "Maximum Exercise Heart Rate", value: heartData.thalch, unit: "bpm", reference: "Treadmill stress test peak" },
        { label: "Exercise-Induced Discomfort", value: heartData.exang ? "Yes" : "No", unit: "Symptom", reference: "Exertional chest discomfort" },
        { label: "Exercise ECG Shift (ST Dep.)", value: heartData.oldpeak, unit: "mm", reference: "Normal stress shift: < 1.0 mm" },
        { label: "Exercise ECG Slope", value: heartData.slope, unit: "Slope", reference: "Upsloping / Flat / Downsloping" },
        { label: "Age at Assessment", value: heartData.age, unit: "Yrs", reference: "Cardiovascular baseline" },
      ];
    } else {
      parameterList = [
        { label: "Fasting Plasma Glucose", value: diabetesData.glucose, unit: "mg/dL", reference: "Normal Fasting: 70 - 99 mg/dL" },
        { label: "Diastolic Blood Pressure", value: diabetesData.blood_pressure, unit: "mmHg", reference: "Normal: 60 - 80 mmHg" },
        { label: "Body Mass Index (BMI)", value: diabetesData.bmi, unit: "kg/m²", reference: "Healthy: 18.5 - 24.9 kg/m²" },
        { label: "Serum Insulin (2-Hour Test)", value: diabetesData.insulin, unit: "µU/mL", reference: "Fasting normal: 16 - 166 µU/mL" },
        { label: "Skinfold Thickness", value: diabetesData.skin_thickness, unit: "mm", reference: "Subcutaneous fat proxy" },
        { label: "Family Diabetes History Score", value: diabetesData.diabetes_pedigree_function, unit: "DPF", reference: "Genetic risk score" },
        { label: "Number of Past Pregnancies", value: diabetesData.pregnancies, unit: "Count", reference: "Gestational history" },
        { label: "Age at Assessment", value: diabetesData.age, unit: "Yrs", reference: "Metabolic risk trajectory" },
      ];
    }

    const reportData: PDFReportData = {
      reportId: currentReportId,
      patientName: currentParams.patient_name,
      age: currentParams.age,
      sex: isHeart ? heartData.sex : undefined,
      disease: predictionResult.disease,
      probability: predictionResult.probability_percentage,
      riskLevel: predictionResult.risk_level,
      riskColor: predictionResult.risk_color,
      summary: predictionResult.summary,
      recommendations: predictionResult.recommendations,
      parameters: parameterList,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    };

    exportHealthReportPDF(reportData);
  };

  const handleAskAssistant = () => {
    if (!predictionResult) return;
    const ctx: AssessmentContext = {
      disease: predictionResult.disease,
      probability: predictionResult.probability_percentage,
      riskLevel: predictionResult.risk_level,
      summary: predictionResult.summary,
      parameters: disease === "heart" ? heartData : diabetesData,
      patientName: (disease === "heart" ? heartData : diabetesData).patient_name,
    };
    if (onOpenChatbotWithContext) {
      onOpenChatbotWithContext(ctx);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden text-slate-900" id="assessment-wizard">
      
      {/* Emergency Notice Subtle Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 text-xs text-amber-900 flex items-center gap-2">
        <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-medium leading-tight">
          <strong>Medical Safety Notice:</strong> This tool is intended for screening and educational decision support. If you are experiencing chest pain, severe shortness of breath, or emergency symptoms, seek immediate professional medical attention.
        </span>
      </div>

      {/* Top Header & Disease Selector */}
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Machine Learning Health Screening
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {disease === "heart" ? "Cardiovascular Risk Assessment" : "Diabetes & Metabolic Screening"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Trained Random Forest classifier calibrated on clinical benchmark datasets.
            </p>
          </div>

          {/* Model Switch Tabs */}
          <div className="flex bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => handleDiseaseChange("heart")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                disease === "heart"
                  ? "bg-rose-600 text-white shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
              id="wizard-tab-heart"
            >
              <Heart className="w-4 h-4 fill-white/20" />
              <span>Heart Disease</span>
            </button>
            <button
              onClick={() => handleDiseaseChange("diabetes")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                disease === "diabetes"
                  ? "bg-amber-600 text-white shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
              id="wizard-tab-diabetes"
            >
              <Flame className="w-4 h-4 fill-white/20" />
              <span>Diabetes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Demo Fill & Progress Bar */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.id;
            const isCurrent = currentStep === s.id;
            const StepIcon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => {
                  if (s.id < currentStep || (s.id === 5 && predictionResult)) {
                    setCurrentStep(s.id);
                  }
                }}
                disabled={s.id > currentStep && !(s.id === 5 && predictionResult)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent
                    ? "bg-sky-600 text-white shadow-sm"
                    : isCompleted
                    ? "bg-slate-200/80 text-slate-700 hover:bg-slate-300"
                    : "text-slate-400 opacity-60 cursor-not-allowed"
                }`}
              >
                <StepIcon className="w-3.5 h-3.5" />
                <span>{s.name}</span>
                {isCompleted && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Quick Sample Presets */}
        {currentStep < 5 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 hidden md:inline">
              Sample Data:
            </span>
            <button
              type="button"
              onClick={() => loadPreset("lowRisk")}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Low-Risk Sample</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset("highRisk")}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>High-Risk Sample</span>
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorText && (
        <div className="m-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorText}</span>
        </div>
      )}

      {/* Main Step Content */}
      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: Demographic Information */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Step 1: Patient & Demographic Information</h3>
                <p className="text-xs text-slate-500">Provide basic demographic parameters used as baseline factors in screening models.</p>
              </div>

              {disease === "heart" ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Patient / Subject Name
                      <FieldHelper
                        title="Patient / Subject Name"
                        description="Used for personalizing your digital screening report and PDF export."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">For report labeling.</p>
                    <input
                      type="text"
                      value={heartData.patient_name}
                      onChange={(e) => setHeartData({ ...heartData, patient_name: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                      placeholder="e.g. Alex Morgan"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Age (18 - 100 Years)
                      <FieldHelper
                        title="Age"
                        description="Your current age. Age is an important biological baseline for cardiovascular risk estimation."
                        range="18 - 100 Years"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Cardiovascular risk scales with age.</p>
                    <input
                      type="number"
                      min="18"
                      max="100"
                      value={heartData.age}
                      onChange={(e) => setHeartData({ ...heartData, age: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Biological Sex
                      <FieldHelper
                        title="Biological Sex"
                        description="Biological sex at birth, used for baseline physiological and hormonal calibration in clinical models."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Baseline hormonal and clinical profile.</p>
                    <select
                      value={heartData.sex}
                      onChange={(e) => setHeartData({ ...heartData, sex: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Patient / Subject Name
                      <FieldHelper
                        title="Patient / Subject Name"
                        description="Used for personalizing your digital screening report and PDF export."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">For report labeling.</p>
                    <input
                      type="text"
                      value={diabetesData.patient_name}
                      onChange={(e) => setDiabetesData({ ...diabetesData, patient_name: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                      placeholder="e.g. Emma Watson"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Age (1 - 120 Years)
                      <FieldHelper
                        title="Age"
                        description="Your current age in years."
                        range="18 - 80 Typical"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Metabolic baseline.</p>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={diabetesData.age}
                      onChange={(e) => setDiabetesData({ ...diabetesData, age: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Number of Past Pregnancies
                      <FieldHelper
                        title="Pregnancies"
                        description="Pregnancy hormones can influence lifetime metabolic and insulin sensitivity. Enter 0 for male subjects or individuals who have never been pregnant."
                        range="0 if male or none"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Gestational metabolic history (0 if male/none).</p>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={diabetesData.pregnancies}
                      onChange={(e) => setDiabetesData({ ...diabetesData, pregnancies: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Vitals & Primary Laboratory Biomarkers */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Step 2: Vitals & Primary Laboratory Biomarkers</h3>
                <p className="text-xs text-slate-500">Standard clinical readings obtained from routine medical checkups or home monitors.</p>
              </div>

              {disease === "heart" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resting Blood Pressure (Systolic)
                      <FieldHelper
                        title="Resting Blood Pressure (Systolic)"
                        description="Your blood pressure while resting, usually measured during a routine checkup. This is the top (higher) number on a blood pressure reading."
                        range="90 - 120 mmHg"
                        tip="If you don't know your exact number, 120 mmHg is standard normal."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Measured in mmHg (Normal: 90 - 120 mmHg).</p>
                    <input
                      type="number"
                      min="80"
                      max="250"
                      value={heartData.trestbps}
                      onChange={(e) => setHeartData({ ...heartData, trestbps: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                      placeholder="120"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Total Blood Cholesterol
                      <FieldHelper
                        title="Total Blood Cholesterol"
                        description="The total amount of cholesterol measured in your blood test (lipid panel)."
                        range="< 200 mg/dL"
                        tip="Below 200 mg/dL is desirable; 200-239 is borderline; 240+ is elevated."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Measured in mg/dL (Desirable: &lt; 200 mg/dL).</p>
                    <input
                      type="number"
                      min="100"
                      max="700"
                      value={heartData.chol}
                      onChange={(e) => setHeartData({ ...heartData, chol: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                      placeholder="200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chest Discomfort Type
                      <FieldHelper
                        title="Chest Discomfort Type"
                        description="Asks about the type of chest sensation or discomfort experienced, if any. Angina refers to chest tightness caused by reduced blood flow to heart muscle."
                        tip="Choose 'No Chest Discomfort' if you do not experience chest symptoms."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Primary symptomatic presentation.</p>
                    <select
                      value={heartData.cp}
                      onChange={(e) => setHeartData({ ...heartData, cp: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                    >
                      <option value="asymptomatic">No Chest Discomfort (Asymptomatic)</option>
                      <option value="typical angina">Exertional Discomfort (Tightness during physical activity)</option>
                      <option value="atypical angina">Atypical Discomfort (Short twinges not linked to exertion)</option>
                      <option value="non-anginal">Non-Cardiac Discomfort (e.g. muscle strain or reflux)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Fasting Blood Sugar &gt; 120 mg/dL?
                      <FieldHelper
                        title="Fasting Blood Sugar"
                        description="Refers to a blood glucose measurement taken after fasting (8+ hours without food)."
                        range="≤ 120 mg/dL Normal"
                        tip="If you have not been diagnosed with diabetes or high blood sugar, select 'No'."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Elevated fasting blood sugar indicator.</p>
                    <select
                      value={heartData.fbs ? "true" : "false"}
                      onChange={(e) => setHeartData({ ...heartData, fbs: e.target.value === "true" })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                    >
                      <option value="false">No (120 mg/dL or below — Normal)</option>
                      <option value="true">Yes (above 120 mg/dL — Elevated / Diabetes)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Fasting Blood Glucose
                      <FieldHelper
                        title="Fasting Blood Glucose"
                        description="Your blood sugar level measured after an overnight fast (8+ hours)."
                        range="70 - 99 mg/dL"
                        tip="100 - 125 mg/dL is pre-diabetic; 126+ indicates diabetes."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Measured in mg/dL (Normal: 70 - 99 mg/dL).</p>
                    <input
                      type="number"
                      min="40"
                      max="350"
                      value={diabetesData.glucose}
                      onChange={(e) => setDiabetesData({ ...diabetesData, glucose: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Diastolic Blood Pressure (Resting)
                      <FieldHelper
                        title="Diastolic Blood Pressure"
                        description="The bottom (lower) number from a blood pressure reading."
                        range="60 - 80 mmHg"
                        tip="For example, in '120/80 mmHg', 80 is your diastolic pressure."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Lower BP reading in mmHg (Normal: 60 - 80).</p>
                    <input
                      type="number"
                      min="40"
                      max="200"
                      value={diabetesData.blood_pressure}
                      onChange={(e) => setDiabetesData({ ...diabetesData, blood_pressure: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                      placeholder="72"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Body Mass Index (BMI)
                      <FieldHelper
                        title="Body Mass Index (BMI)"
                        description="A standard ratio measuring body weight relative to height (kg/m²)."
                        range="18.5 - 24.9 kg/m²"
                        tip="Underweight: < 18.5 | Normal: 18.5-24.9 | Overweight: 25-29.9 | Obese: 30+"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Weight (kg) / Height (m)² (Normal: 18.5 - 24.9).</p>
                    <input
                      type="number"
                      step="0.1"
                      min="10"
                      max="70"
                      value={diabetesData.bmi}
                      onChange={(e) => setDiabetesData({ ...diabetesData, bmi: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                      placeholder="24.5"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3: Diagnostic & Specialized Indicators */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Step 3: Diagnostic & Specialized Indicators</h3>
                <p className="text-xs text-slate-500">Parameters obtained from ECG stress test reports or specialized metabolic blood tests.</p>
              </div>

              {disease === "heart" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Maximum Heart Rate During Exercise
                      <FieldHelper
                        title="Max Heart Rate During Exercise"
                        description="The highest pulse recorded during an exercise or treadmill stress test."
                        range="140 - 180 bpm"
                        tip="Estimated peak is roughly 220 minus age. If you haven't taken a treadmill test, 150 bpm is standard average."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Peak rate reached during stress test (bpm).</p>
                    <input
                      type="number"
                      min="50"
                      max="250"
                      value={heartData.thalch}
                      onChange={(e) => setHeartData({ ...heartData, thalch: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                      placeholder="150"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chest Discomfort During Physical Exertion?
                      <FieldHelper
                        title="Exercise-Induced Chest Discomfort"
                        description="Asks whether chest tightness, pain, or discomfort occurs when walking briskly, running, or climbing stairs."
                        tip="If you can engage in physical activity without chest pain, choose 'No'."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Exertional chest symptom indicator.</p>
                    <select
                      value={heartData.exang ? "true" : "false"}
                      onChange={(e) => setHeartData({ ...heartData, exang: e.target.value === "true" })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                    >
                      <option value="false">No (Physical activity does not cause discomfort)</option>
                      <option value="true">Yes (Chest tightness occurs during exertion)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Exercise ECG Shift (ST Depression in mm)
                      <FieldHelper
                        title="Exercise ST Depression"
                        description="A measurement from an exercise ECG test that must be obtained from a medical report. Do not guess."
                        range="0.0 - 1.0 mm Normal"
                        tip="Measures oxygenation recovery. If you have not had an abnormal stress test, enter 0.0."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">ECG shift induced by exercise (Normal: 0.0 - 1.0 mm).</p>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={heartData.oldpeak}
                      onChange={(e) => setHeartData({ ...heartData, oldpeak: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Exercise ECG Waveform (ST Slope)
                      <FieldHelper
                        title="Exercise ECG Pattern (Slope)"
                        description="A finding interpreted from an exercise ECG report describing the electrical wave angle after peak exercise."
                        range="Upsloping is Typical Normal"
                        tip="Upsloping is the normal healthy heart response to exercise."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Stress test ST waveform angle.</p>
                    <select
                      value={heartData.slope}
                      onChange={(e) => setHeartData({ ...heartData, slope: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                    >
                      <option value="upsloping">Upsloping Wave (Normal healthy heart response)</option>
                      <option value="flat">Flat Wave (Moderate strain indicator)</option>
                      <option value="downsloping">Downsloping Wave (Elevated cardiac strain)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resting ECG Result
                      <FieldHelper
                        title="Resting ECG Result"
                        description="The interpretation of an electrocardiogram (ECG / EKG) performed at rest while lying down."
                        range="Normal Baseline"
                        tip="If you have never had an abnormal ECG result, select 'Normal Resting ECG'."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">12-lead baseline findings at rest.</p>
                    <select
                      value={heartData.restecg}
                      onChange={(e) => setHeartData({ ...heartData, restecg: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                    >
                      <option value="normal">Normal Resting ECG (No abnormalities found)</option>
                      <option value="st-t abnormality">ST-T Wave Changes (Minor electrical recovery variation)</option>
                      <option value="lv hypertrophy">Left Ventricular Hypertrophy (Thickened heart wall)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Skinfold Thickness (Body Fat Proxy)
                      <FieldHelper
                        title="Skinfold Thickness"
                        description="A clinical caliper measurement of subcutaneous arm fat (mm)."
                        range="15 - 25 mm Typical"
                        tip="If this was not measured during a checkup, keep the standard clinical average of 20 mm."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Triceps caliper fat proxy (Default: 20 mm if unknown).</p>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={diabetesData.skin_thickness}
                      onChange={(e) => setDiabetesData({ ...diabetesData, skin_thickness: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                      placeholder="20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Serum Insulin (2-Hour Test)
                      <FieldHelper
                        title="Serum Insulin"
                        description="Insulin measured in blood 2 hours after a standardized glucose test."
                        range="16 - 166 µU/mL"
                        tip="If you have not taken a formal oral glucose test, keep the standard average of 85 µU/mL."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Measured in µU/mL (Normal fasting: 16 - 166).</p>
                    <input
                      type="number"
                      min="0"
                      max="900"
                      value={diabetesData.insulin}
                      onChange={(e) => setDiabetesData({ ...diabetesData, insulin: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                      placeholder="85"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Family Diabetes History Score
                      <FieldHelper
                        title="Family Diabetes History Score (DPF)"
                        description="A clinical genetic lineage score estimating family history: 0.1-0.3 = No known family diabetes | 0.3-0.6 = One parent or grandparent | 0.6-1.2+ = Multiple close family members."
                        range="0.1 - 1.2 Score"
                        tip="Population average baseline is ~0.45."
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mb-1.5">Family lineage score (Baseline average: ~0.45).</p>
                    <input
                      type="number"
                      step="0.01"
                      min="0.0"
                      max="3.0"
                      value={diabetesData.diabetes_pedigree_function}
                      onChange={(e) => setDiabetesData({ ...diabetesData, diabetes_pedigree_function: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-medium"
                      placeholder="0.45"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: Review Information */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 4: Review Clinical Parameters</h3>
                  <p className="text-xs text-slate-500">Confirm your entered values before passing to the Random Forest model.</p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-sky-700 hover:bg-sky-50 flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Parameters</span>
                </button>
              </div>

              {/* Review summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {disease === "heart" ? (
                  <>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Age & Sex</span>
                      <span className="text-sm font-bold text-slate-900">{heartData.age} Yrs • {heartData.sex}</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Pressure</span>
                      <span className="text-sm font-bold text-slate-900">{heartData.trestbps} mmHg</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Cholesterol</span>
                      <span className="text-sm font-bold text-slate-900">{heartData.chol} mg/dL</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Chest Discomfort</span>
                      <span className="text-sm font-bold text-slate-900 capitalize truncate block">{heartData.cp}</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Exercise Rate</span>
                      <span className="text-sm font-bold text-slate-900">{heartData.thalch} bpm</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">ST Shift (ECG)</span>
                      <span className="text-sm font-bold text-slate-900">{heartData.oldpeak} mm</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">ECG Wave Slope</span>
                      <span className="text-sm font-bold text-slate-900 capitalize">{heartData.slope}</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Exertion Angina</span>
                      <span className="text-sm font-bold text-slate-900">{heartData.exang ? "Yes" : "No"}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Age</span>
                      <span className="text-sm font-bold text-slate-900">{diabetesData.age} Yrs</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Fasting Glucose</span>
                      <span className="text-sm font-bold text-slate-900">{diabetesData.glucose} mg/dL</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Diastolic Pressure</span>
                      <span className="text-sm font-bold text-slate-900">{diabetesData.blood_pressure} mmHg</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Body Mass Index</span>
                      <span className="text-sm font-bold text-slate-900">{diabetesData.bmi} kg/m²</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Serum Insulin</span>
                      <span className="text-sm font-bold text-slate-900">{diabetesData.insulin} µU/mL</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Skinfold Thickness</span>
                      <span className="text-sm font-bold text-slate-900">{diabetesData.skin_thickness} mm</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Family History (DPF)</span>
                      <span className="text-sm font-bold text-slate-900">{diabetesData.diabetes_pedigree_function}</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Pregnancies</span>
                      <span className="text-sm font-bold text-slate-900">{diabetesData.pregnancies}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center gap-3 text-xs text-sky-900">
                <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
                <span>All parameters validated. Clicking below passes your vitals to the calibrated Scikit-Learn Random Forest pipeline.</span>
              </div>
            </motion.div>
          )}

          {/* STEP 5: AI Screening Result (Digital Health Report) */}
          {currentStep === 5 && predictionResult && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
              id="printable-health-report"
            >
              {/* Report Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
                <div>
                  <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block">
                    MediScan-AI Screening Summary
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {predictionResult.disease} Risk Assessment Report
                  </h3>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span className="font-bold text-slate-800 block">Report ID: {currentReportId}</span>
                  <span>Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                  {savedStatus && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold block mt-0.5">
                      <Check className="w-3 h-3" /> Recorded in Session Dashboard
                    </span>
                  )}
                </div>
              </div>

              {/* Digital Health Gauge Hero Box */}
              <div
                className={`p-6 sm:p-8 rounded-3xl border text-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs ${
                  predictionResult.risk_color === "rose"
                    ? "bg-rose-50/70 border-rose-200"
                    : predictionResult.risk_color === "amber"
                    ? "bg-amber-50/70 border-amber-200"
                    : "bg-emerald-50/70 border-emerald-200"
                }`}
              >
                <div className="space-y-3 flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold shadow-2xs">
                    <Activity className="w-3.5 h-3.5 text-sky-600" />
                    <span>Estimated Screening Risk Category</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    {predictionResult.risk_level}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {predictionResult.summary}
                  </p>

                  <p className="text-[11px] text-slate-500 italic">
                    * This percentage reflects the machine learning model's output confidence score calibrated against clinical benchmark datasets, not a clinical diagnostic certainty.
                  </p>
                </div>

                {/* Donut Gauge Visualizer */}
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-slate-200/80 fill-none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeDasharray={`${predictionResult.probability_percentage * 2.51} 251.2`}
                      strokeLinecap="round"
                      className={`fill-none transition-all duration-1000 ${
                        predictionResult.risk_color === "rose"
                          ? "text-rose-600"
                          : predictionResult.risk_color === "amber"
                          ? "text-amber-500"
                          : "text-emerald-500"
                      }`}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-slate-900">
                      {predictionResult.probability_percentage}%
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Model Score</span>
                  </div>
                </div>
              </div>

              {/* Health Insights Section (Contextualized parameters) */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-600" />
                  <span>Key Screening Health Insights</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {disease === "heart" ? (
                    <>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Resting Blood Pressure</span>
                        <div className="text-lg font-bold text-slate-900">{heartData.trestbps} mmHg</div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {heartData.trestbps > 130 ? "Elevated — discuss with your physician." : "Within normal clinical range (90-120)."}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Total Blood Cholesterol</span>
                        <div className="text-lg font-bold text-slate-900">{heartData.chol} mg/dL</div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {heartData.chol > 200 ? "Borderline/elevated total lipids." : "Desirable lipid levels (< 200 mg/dL)."}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Max Exercise Pulse</span>
                        <div className="text-lg font-bold text-slate-900">{heartData.thalch} bpm</div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          Peak rate recorded during exertion.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Fasting Glucose</span>
                        <div className="text-lg font-bold text-slate-900">{diabetesData.glucose} mg/dL</div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {diabetesData.glucose > 100 ? "Above fasting baseline (70-99 mg/dL)." : "Within normal baseline range."}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Body Mass Index</span>
                        <div className="text-lg font-bold text-slate-900">{diabetesData.bmi} kg/m²</div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {diabetesData.bmi > 25 ? "Above normal weight category (18.5-24.9)." : "Within standard BMI range."}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Diastolic Pressure</span>
                        <div className="text-lg font-bold text-slate-900">{diabetesData.blood_pressure} mmHg</div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          Diastolic resting measurement (60-80 target).
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Recommended General Lifestyle & Decision-Support Next Steps</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {predictionResult.recommendations.map((rec, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-slate-100 text-[11px] text-slate-600 leading-relaxed border border-slate-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-800 block mb-0.5">Important Screening Disclaimer:</strong>
                  MediScan-AI is an AI-based health risk screening and educational decision-support tool. It does not provide a definitive medical diagnosis or replace a qualified healthcare professional.
                </div>
              </div>

              {/* Report Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setPredictionResult(null);
                    }}
                    className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    id="new-assessment-btn"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>New Assessment</span>
                  </button>

                  <button
                    onClick={handleAskAssistant}
                    className="px-4 py-2.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    id="ask-assistant-from-result-btn"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                    <span>Ask AI Assistant</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Fixed View in Dashboard button: Opens in-place Dashboard Overlay */}
                  <button
                    onClick={() => setShowDashboardOverlay(true)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    id="view-in-dashboard-overlay-btn"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-sky-600" />
                    <span>View in Dashboard</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    id="print-report-btn"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    id="download-pdf-report-btn"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Professional PDF</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Wizard Navigation Buttons (Steps 1 to 4) */}
        {currentStep < 5 && (
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                id={`wizard-next-step-${currentStep}`}
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleRunPrediction}
                disabled={isLoading}
                className={`px-7 py-3 rounded-xl text-white text-xs font-extrabold shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 ${
                  disease === "heart"
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-600/25"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/25"
                }`}
                id="wizard-submit-prediction-btn"
              >
                {isLoading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Executing ML Prediction...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Run AI Screening Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Interactive In-Place Dashboard Modal Overlay */}
      <DashboardOverlayModal
        isOpen={showDashboardOverlay}
        onClose={() => setShowDashboardOverlay(false)}
        currentResult={predictionResult}
        currentParameters={disease === "heart" ? heartData : diabetesData}
        patientName={(disease === "heart" ? heartData : diabetesData).patient_name}
        onDownloadPDF={handleDownloadPDF}
        onNewAssessment={() => {
          setCurrentStep(1);
          setPredictionResult(null);
          setShowDashboardOverlay(false);
        }}
        userHistory={userHistory}
      />
    </div>
  );
}
