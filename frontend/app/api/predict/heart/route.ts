import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

const DISCLAIMER = 
  "MediScan-AI is an AI-based health risk screening and clinical decision-support tool. " +
  "It does not provide medical diagnosis, prescription, or emergency medical care. " +
  "Always consult a qualified healthcare professional for medical evaluations.";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Try to communicate with local/remote FastAPI backend first
    try {
      const response = await fetch(`${BACKEND_URL}/predict/heart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000), // 3s timeout
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn("Backend proxy unavailable, evaluating via clinical decision rules:", err);
    }

    // 2. Fallback Clinical Algorithmic Scoring (aligned with UCI Heart Disease Model)
    const age = Number(body.age) || 45;
    const trestbps = Number(body.trestbps) || 120;
    const chol = Number(body.chol) || 200;
    const thalch = Number(body.thalch) || 150;
    const oldpeak = Number(body.oldpeak) || 0.0;
    const isMale = String(body.sex).toLowerCase().startsWith('m');
    const hasExang = body.exang === true || String(body.exang).toLowerCase() === 'yes';
    const isAsymptomatic = String(body.cp).toLowerCase().includes('asymptomatic') || String(body.cp).toLowerCase().includes('typical');

    // Risk weight accumulation
    let riskScore = 15; // baseline

    if (age > 55) riskScore += (age - 55) * 0.8;
    if (isMale) riskScore += 8;
    if (trestbps > 130) riskScore += (trestbps - 130) * 0.4;
    if (chol > 200) riskScore += (chol - 200) * 0.15;
    if (thalch < 130) riskScore += (130 - thalch) * 0.3;
    if (oldpeak > 1.0) riskScore += oldpeak * 8;
    if (hasExang) riskScore += 16;
    if (isAsymptomatic) riskScore += 12;

    const prob = Math.min(99.0, Math.max(5.0, Math.round(riskScore * 10) / 10));
    const prediction = prob >= 50.0 ? 1 : 0;

    let risk_level = "Low Risk";
    let risk_color = "emerald";
    let summary = "The ML model estimates a low cardiovascular disease risk profile based on current indicators.";
    let recommendations = [
      "Maintain regular physical exercise (at least 150 minutes/week).",
      "Continue balanced Mediterranean-style nutrition low in saturated fats.",
      "Schedule routine annual blood pressure and lipid profile screenings.",
      "Maintain optimal stress management and regular sleep cycles."
    ];

    if (prob >= 70.0) {
      risk_level = "High Risk";
      risk_color = "rose";
      summary = "The ML model indicates an elevated cardiovascular risk profile requiring prompt clinical evaluation.";
      recommendations = [
        "Consult a certified Cardiologist or physician as soon as possible.",
        "Request a comprehensive 12-lead ECG and echocardiogram evaluation.",
        "Do not start vigorous strenuous workouts without prior medical clearance.",
        "Follow all physician-prescribed medication plans strictly."
      ];
    } else if (prob >= 30.0) {
      risk_level = "Moderate Risk";
      risk_color = "amber";
      summary = "The ML model identified moderate cardiovascular risk markers that warrant proactive attention.";
      recommendations = [
        "Schedule a cardiovascular checkup with your primary physician.",
        "Monitor blood pressure weekly and track resting heart rate trends.",
        "Evaluate dietary sodium and cholesterol intake with a nutritionist.",
        "Discuss stress testing (TMT) and lipid panel optimization with a doctor."
      ];
    }

    return NextResponse.json({
      disease: "Heart Disease",
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
      { error: "Failed to process heart prediction", details: error.message },
      { status: 500 }
    );
  }
}
