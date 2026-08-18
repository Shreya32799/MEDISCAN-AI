import { NextResponse } from "next/server";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AssessmentContext {
  disease?: string;
  probability?: number;
  riskLevel?: string;
  summary?: string;
  parameters?: Record<string, any>;
  patientName?: string;
}

const MEDICAL_DISCLAIMER =
  "Please note: I am an AI health information assistant designed for educational screening support. I cannot provide a medical diagnosis or prescribe treatments. Always consult a licensed healthcare provider for personal medical advice.";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message: string = (body.message || "").trim();
    const context: AssessmentContext | undefined = body.context;
    const history: ChatMessage[] = body.history || [];

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const lower = message.toLowerCase();
    let reply = "";

    // 1. Result explanation with context
    if (
      lower.includes("result") ||
      lower.includes("my score") ||
      lower.includes("my risk") ||
      lower.includes("explain") ||
      lower.includes("what does") ||
      lower.includes("interpretation")
    ) {
      if (context && context.riskLevel) {
        reply = `Based on your **${context.disease || "Health"}** screening assessment, the model estimated a **${context.riskLevel}** tier (${context.probability}% estimated probability).\n\n` +
          `**What this means:** ${context.summary}\n\n` +
          `This score indicates that based on the physiological parameters entered, your profile aligns with risk patterns identified in the trained clinical dataset. It serves as an informative decision-support indicator to discuss preventive wellness or lifestyle steps with your physician.`;
      } else {
        reply = `You have not generated a screening result in this session yet. You can click **"Start Assessment"** to enter your health parameters, and I'll provide an instant, detailed breakdown of your risk score and contributing biomarkers right here!`;
      }
    }
    // 2. Why is risk moderate / high / low? Contributing factors
    else if (
      lower.includes("why") ||
      lower.includes("factor") ||
      lower.includes("cause") ||
      lower.includes("contribute") ||
      lower.includes("parameter")
    ) {
      if (context && context.parameters) {
        const p = context.parameters;
        const notableFactors: string[] = [];

        if (context.disease?.toLowerCase().includes("heart")) {
          if (p.trestbps && Number(p.trestbps) > 130) notableFactors.push(`Resting Blood Pressure of **${p.trestbps} mmHg** (elevated above standard 120 mmHg)`);
          if (p.chol && Number(p.chol) > 200) notableFactors.push(`Serum Cholesterol of **${p.chol} mg/dL** (desirable is below 200 mg/dL)`);
          if (p.thalch && Number(p.thalch) < 130) notableFactors.push(`Maximum Heart Rate achieved of **${p.thalch} bpm**`);
          if (p.oldpeak && Number(p.oldpeak) > 1.0) notableFactors.push(`ST Depression value of **${p.oldpeak}** during stress test`);
          if (p.exang === true || String(p.exang).toLowerCase() === 'yes') notableFactors.push(`Presence of exercise-induced chest discomfort`);
        } else {
          if (p.glucose && Number(p.glucose) > 120) notableFactors.push(`Fasting Plasma Glucose of **${p.glucose} mg/dL** (elevated above normal 70-99 range)`);
          if (p.bmi && Number(p.bmi) > 25.0) notableFactors.push(`Body Mass Index of **${p.bmi} kg/m²** (above normal 18.5-24.9 range)`);
          if (p.blood_pressure && Number(p.blood_pressure) > 80) notableFactors.push(`Diastolic Blood Pressure of **${p.blood_pressure} mmHg**`);
          if (p.insulin && Number(p.insulin) > 160) notableFactors.push(`2-Hour Serum Insulin of **${p.insulin} µU/mL**`);
        }

        if (notableFactors.length > 0) {
          reply = `For your **${context.disease}** assessment, the primary physiological factors contributing to the **${context.riskLevel}** estimate include:\n\n` +
            notableFactors.map(f => `• ${f}`).join("\n") +
            `\n\nThese biomarkers were identified by the Random Forest model as key features correlating with elevated risk.`;
        } else {
          reply = `All evaluated parameters in your **${context.disease}** assessment are within desirable clinical baselines, which is why your result was categorized as **${context.riskLevel}**.`;
        }
      } else {
        reply = `Risk categories are determined by evaluating key biomarkers against trained clinical benchmarks. In Heart Disease, blood pressure, cholesterol, ECG changes, and ST depression are primary factors; in Diabetes, fasting glucose, BMI, and insulin are the most critical.`;
      }
    }
    // 3. Biomarker explanations (BMI, BP, Cholesterol, Glucose, ST depression, ECG)
    else if (lower.includes("bmi") || lower.includes("body mass index")) {
      reply = `**Body Mass Index (BMI)** is a measure of body fat based on height and weight:\n\n` +
        `• **Underweight:** < 18.5\n` +
        `• **Normal weight:** 18.5 – 24.9\n` +
        `• **Overweight:** 25.0 – 29.9\n` +
        `• **Obesity:** 30.0 or greater\n\n` +
        `Elevated BMI can increase metabolic load and cardiovascular strain.`;
    }
    else if (lower.includes("blood pressure") || lower.includes("bp") || lower.includes("trestbps")) {
      reply = `**Blood Pressure** measures the force of circulating blood against artery walls:\n\n` +
        `• **Normal:** Less than 120/80 mmHg\n` +
        `• **Elevated:** Systolic 120-129 and Diastolic < 80\n` +
        `• **Hypertension Stage 1:** Systolic 130-139 or Diastolic 80-89\n` +
        `• **Hypertension Stage 2:** Systolic 140+ or Diastolic 90+\n\n` +
        `Maintaining optimal blood pressure reduces strain on cardiac muscle and renal vessels.`;
    }
    else if (lower.includes("cholesterol") || lower.includes("chol")) {
      reply = `**Serum Cholesterol** measures total blood lipid concentrations in mg/dL:\n\n` +
        `• **Desirable:** Below 200 mg/dL\n` +
        `• **Borderline High:** 200 – 239 mg/dL\n` +
        `• **High:** 240 mg/dL and above\n\n` +
        `Elevated cholesterol can contribute to plaque buildup (atherosclerosis) in arterial walls.`;
    }
    else if (lower.includes("glucose") || lower.includes("blood sugar")) {
      reply = `**Fasting Plasma Glucose** measures circulating blood sugar levels after fasting for at least 8 hours:\n\n` +
        `• **Normal:** 70 – 99 mg/dL\n` +
        `• **Prediabetes:** 100 – 125 mg/dL\n` +
        `• **Diabetes:** 126 mg/dL or higher on repeat clinical testing\n\n` +
        `Consistently elevated glucose indicates impaired insulin sensitivity.`;
    }
    else if (lower.includes("oldpeak") || lower.includes("st depression")) {
      reply = `**ST Depression (oldpeak)** is an electrocardiogram (ECG) finding measured during an exercise treadmill stress test:\n\n` +
        `It reflects how much the ST segment of your cardiac waveform shifts during exertion compared to rest. A value greater than 1.0–1.5 mm may indicate subendocardial ischemia (reduced oxygenated blood supply to heart tissue during physical stress).`;
    }
    // 4. How the model / prediction works
    else if (lower.includes("how does") || lower.includes("model") || lower.includes("random forest") || lower.includes("ai work")) {
      reply = `MediScan-AI utilizes **Random Forest Classifier** ensemble models trained with Scikit-Learn. When you submit your parameters:\n\n` +
        `1. Numerical inputs are scaled using calibrated \`StandardScaler\` transformers.\n` +
        `2. Multiple decision trees vote on the risk probability.\n` +
        `3. The output is categorized into **Low Risk (<35%)**, **Moderate Risk (35-65%)**, or **High Risk (>65%)** along with personalized decision-support insights.`;
    }
    // 5. Next steps
    else if (lower.includes("next step") || lower.includes("what should i do") || lower.includes("advice") || lower.includes("recommend")) {
      reply = `Here are helpful recommended next steps based on standard preventive health guidelines:\n\n` +
        `1. **Download your PDF Report:** Click the "Download Professional PDF" button on your result screen to save a copy.\n` +
        `2. **Schedule a Doctor's Review:** Share the report with your primary care physician during your routine check-up.\n` +
        `3. **Maintain Healthy Habits:** Prioritize balanced nutrition, regular aerobic exercise (150 min/week), and restorative sleep.\n` +
        `4. **Routine Monitoring:** Track blood pressure, fasting blood sugar, and lipid profiles periodically.`;
    }
    // Default fallback
    else {
      reply = `Thank you for your question. As an AI health screening assistant, I can explain how the MediScan-AI models calculate cardiovascular and diabetes risk, define biomarker terms (such as BMI, Blood Pressure, Cholesterol, Glucose, and ST Depression), or guide you through your screening report.\n\nFor specific medical diagnoses, treatments, or prescriptions, please consult a qualified healthcare professional.`;
    }

    return NextResponse.json({
      reply,
      disclaimer: MEDICAL_DISCLAIMER,
    });
  } catch (error: any) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: "Failed to generate assistant response." },
      { status: 500 }
    );
  }
}
