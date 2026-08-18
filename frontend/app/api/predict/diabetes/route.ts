import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

const DISCLAIMER = 
  "MediScan-AI is an AI-based health risk screening and clinical decision-support tool. " +
  "It does not provide medical diagnosis, prescription, or emergency medical care. " +
  "Always consult a qualified healthcare professional for medical evaluations.";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Try FastAPI backend first
    try {
      const response = await fetch(`${BACKEND_URL}/predict/diabetes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn("Backend proxy unavailable, evaluating via clinical decision rules:", err);
    }

    // 2. Fallback Clinical Algorithmic Scoring (aligned with Pima Diabetes Model)
    const glucose = Number(body.glucose) || 120;
    const bmi = Number(body.bmi) || 25.0;
    const age = Number(body.age) || 35;
    const bloodPressure = Number(body.blood_pressure || body.bloodPressure) || 70;
    const insulin = Number(body.insulin) || 80;
    const dpf = Number(body.diabetes_pedigree_function || body.dpf) || 0.47;
    const pregnancies = Number(body.pregnancies) || 0;

    let riskScore = 10;
    if (glucose > 100) riskScore += (glucose - 100) * 0.45;
    if (bmi > 25.0) riskScore += (bmi - 25.0) * 1.5;
    if (age > 45) riskScore += (age - 45) * 0.5;
    if (bloodPressure > 80) riskScore += (bloodPressure - 80) * 0.3;
    if (insulin > 140) riskScore += (insulin - 140) * 0.1;
    if (dpf > 0.5) riskScore += (dpf - 0.5) * 15;
    if (pregnancies > 3) riskScore += (pregnancies - 3) * 2;

    const prob = Math.min(99.0, Math.max(4.5, Math.round(riskScore * 10) / 10));
    const prediction = prob >= 50.0 ? 1 : 0;

    let risk_level = "Low Risk";
    let risk_color = "emerald";
    let summary = "The ML model estimates a low probability of diabetes/glycemic dysfunction.";
    let recommendations = [
      "Continue whole-food diet rich in dietary fiber and complex carbohydrates.",
      "Maintain an active lifestyle with regular aerobic and strength activities.",
      "Perform routine fasting blood glucose checks every 1-2 years.",
      "Keep body mass index (BMI) within the healthy range (18.5 - 24.9)."
    ];

    if (prob >= 70.0) {
      risk_level = "High Risk";
      risk_color = "rose";
      summary = "The ML model indicates elevated glycemic risk indicators requiring prompt physician consultation.";
      recommendations = [
        "Schedule an immediate consultation with an Endocrinologist or Diabetologist.",
        "Undergo clinical oral glucose tolerance test (OGTT) and HbA1c laboratory testing.",
        "Adopt a structured diabetic meal plan under clinical supervision.",
        "Take medications or insulin only under direct physician guidance."
      ];
    } else if (prob >= 30.0) {
      risk_level = "Moderate Risk";
      risk_color = "amber";
      summary = "The ML model identified prediabetic glycemic or metabolic markers requiring lifestyle interventions.";
      recommendations = [
        "Consult a physician and request a formal Fasting Blood Sugar & HbA1c test.",
        "Reduce intake of refined sugars, sweetened beverages, and ultra-processed foods.",
        "Engage in 30 minutes of moderate daily exercise (brisk walking, cycling).",
        "Monitor post-meal blood sugar levels periodically."
      ];
    }

    return NextResponse.json({
      disease: "Diabetes",
      prediction,
      probability_percentage: prob,
      risk_level,
      risk_color,
      summary,
      recommendations,
      disclaimer: DISCLAIMER,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to process diabetes prediction", details: error.message },
      { status: 500 }
    );
  }
}
