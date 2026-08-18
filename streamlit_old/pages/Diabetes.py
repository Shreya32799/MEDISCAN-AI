import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from src.utils.history import save_prediction

from utils.pdf_generator import generate_pdf

import streamlit as st
import pandas as pd
import joblib

# Load trained model
BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "diabetes_model.pkl"

from pathlib import Path
import joblib

BASE_DIR = Path(__file__).resolve().parents[2]

model = joblib.load(BASE_DIR / "models" / "diabetes_model.pkl")
scaler = joblib.load(BASE_DIR / "models" / "diabetes_scaler.pkl")

st.set_page_config(page_title="MediScan AI")

st.title("🩸 MediScan AI")
st.subheader("Diabetes Prediction")
st.caption("AI-powered prediction using a trained Random Forest model.")

st.markdown("---")

st.write("Fill in the patient's details below.")

st.markdown("---")
st.subheader("👤 Patient Information")

patient_name = st.text_input(
    "Patient Name",
    placeholder="Enter patient's full name"
)

gender = st.selectbox(
    "Gender",
    ["Male", "Female", "Other"]
)

col1, col2 = st.columns(2)

with col1:

    # ---------------- Pregnancies ----------------
    if gender == "Male":

        pregnancies = 0

        st.number_input(
            "Pregnancies",
            value=0,
            disabled=True,
            help="Pregnancy is not applicable for male patients."
        )

    else:

        pregnancies = st.number_input(
            "Pregnancies",
            min_value=0,
            max_value=20,
            value=0,
            help="""
Number of pregnancies.

If you don't know it,
leave it as 0.
"""
        )

    # ---------------- Glucose ----------------

    glucose = st.number_input(
        "Blood Glucose (mg/dL)",
        min_value=40,
        max_value=350,
        value=120,
        step=1,
        help="""
📄 Found in:
Blood Sugar Report

Normal:
70–99 mg/dL
"""
    )

    # ---------------- Blood Pressure ----------------

    blood_pressure = st.number_input(
        "Blood Pressure (mmHg)",
        min_value=40,
        max_value=200,
        value=70,
        step=1,
        help="""
Enter the LOWER value (Diastolic).

Example:

120 / 80

Enter:

80

Normal:
60–80 mmHg
"""
    )

    # ---------------- Skin Thickness ----------------

    skin_thickness = st.number_input(
        "Skin Thickness (mm)",
        min_value=0,
        max_value=100,
        value=20,
        help="""
Usually NOT present in medical reports.

If unknown,
leave the default value.
"""
    )

with col2:

    # ---------------- Insulin ----------------

    insulin = st.number_input(
        "Insulin (µU/mL)",
        min_value=0,
        max_value=900,
        value=80,
        step=1,
        help="""
📄 Found in:

Serum Insulin Test

Normal:
16–166 µU/mL
"""
    )

    # ---------------- BMI ----------------

    bmi = st.number_input(
        "Body Mass Index (kg/m²)",
        min_value=10.0,
        max_value=70.0,
        value=25.0,
        step=0.1,
        help="""
BMI = Weight ÷ Height²

Normal:
18.5–24.9

If unknown,
calculate it online.
"""
    )

    # ---------------- Diabetes Pedigree ----------------

    dpf = st.number_input(
        "Diabetes Pedigree Function",
        min_value=0.0,
        max_value=3.0,
        value=0.50,
        step=0.01,
        help="""
Represents family history of diabetes.

Not available in most reports.

If unknown,
keep the default value (0.50).
"""
    )

    # ---------------- Age ----------------

    age = st.number_input(
        "Age (Years)",
        min_value=1,
        max_value=120,
        value=30
    )
st.markdown("---")

predict = st.button(
    "🔍 Predict Diabetes",
    use_container_width=True
)

if predict:
    # ===========================
    # Input Validation
    # ===========================

    errors = []

    if age < 18 or age > 120:
        errors.append("Age should be between 18 and 120 years.")

    if glucose < 40 or glucose > 350:
        errors.append("Glucose value looks invalid.")

    if blood_pressure < 40 or blood_pressure > 200:
        errors.append("Blood Pressure looks invalid.")

    if bmi < 10 or bmi > 70:
        errors.append("BMI value looks invalid.")

    if insulin < 0 or insulin > 900:
        errors.append("Insulin value looks invalid.")

    if skin_thickness < 0 or skin_thickness > 100:
        errors.append("Skin Thickness looks invalid.")

    if dpf < 0 or dpf > 3:
        errors.append("Diabetes Pedigree Function looks invalid.")

    if errors:
        for error in errors:
            st.error(error)

        st.stop()

    sample = pd.DataFrame([{

        "Pregnancies": pregnancies,
        "Glucose": glucose,
        "BloodPressure": blood_pressure,
        "SkinThickness": skin_thickness,
        "Insulin": insulin,
        "BMI": bmi,
        "DiabetesPedigreeFunction": dpf,
        "Age": age
    }])
    sample_scaled = scaler.transform(sample)

    prediction = model.predict(sample_scaled)[0]

    probability = float(
        model.predict_proba(sample_scaled)[0][1] * 100
    )
    
        # ---------------- Risk ----------------
    prediction = model.predict(sample)[0]
    probability = model.predict_proba(sample)[0][1] * 100
    
    if probability < 30:
        risk_level = "🟢 Low Risk"
    elif probability < 70:
        risk_level = "🟡 Moderate Risk"
    else:
        risk_level = "🔴 High Risk"
    
    # ------------------------------------
    # AI Recommendation
    # ------------------------------------


    recommendation = []

    # ------------------------------------
    # High Risk
    # ------------------------------------

    if probability >= 70:

        recommendation.append("👨‍⚕️ Consult an Endocrinologist or Physician as soon as possible.")

        recommendation.append("🩸 Perform HbA1c and Fasting Blood Sugar tests for further evaluation.")

        recommendation.append("💊 Take medicines only as prescribed by your healthcare provider.")

        recommendation.append("🥗 Follow a diabetic-friendly diet with controlled carbohydrate intake.")

        recommendation.append("🚶 Perform regular physical activity only after medical advice.")

        recommendation.append("⚖️ Aim for gradual weight reduction if overweight.")

        recommendation.append("📅 Monitor blood sugar regularly and schedule follow-up visits.")

    # ------------------------------------
    # Moderate Risk
    # ------------------------------------

    elif probability >= 30:

        recommendation.append("👨‍⚕️ Schedule a routine medical consultation.")

        recommendation.append("🥗 Reduce sugar, sweets, and processed carbohydrates.")

        recommendation.append("🏃 Exercise at least 30 minutes on most days.")

        recommendation.append("⚖️ Maintain a healthy body weight.")

        recommendation.append("💧 Stay hydrated.")

        recommendation.append("🩺 Monitor blood glucose periodically.")

    # ------------------------------------
    # Low Risk
    # ------------------------------------

    else:

        recommendation.append("✅ Continue maintaining a healthy lifestyle.")

        recommendation.append("🥗 Eat a balanced diet rich in vegetables and fiber.")

        recommendation.append("🏃 Continue regular physical activity.")

        recommendation.append("😴 Maintain good sleep habits.")

        recommendation.append("💧 Stay hydrated.")

        recommendation.append("🩺 Undergo routine health check-ups.")

    recommendation_text = "\n\n".join(recommendation)


    st.metric("Risk Level", risk_level)
    st.metric("Diabetes Probability", f"{probability:.2f}%")

    st.progress(int(probability))
    
    if prediction == 1:
        st.error("⚠️ High Risk of Diabetes")
    else:
        st.success("✅ Low Risk of Diabetes")

    st.markdown("---")

    # ------------------------------------
    # Diabetes Health Score
    # ------------------------------------

    health_score = max(0, round(100 - probability))

    st.subheader("🩸 Diabetes Health Score")

    st.progress(health_score)

    if health_score >= 80:

        st.success(f"{health_score}/100 — Excellent Metabolic Health")

    elif health_score >= 60:

        st.info(f"{health_score}/100 — Good Metabolic Health")

    elif health_score >= 40:

        st.warning(f"{health_score}/100 — Moderate Metabolic Health")

    else:

        st.error(f"{health_score}/100 — Poor Metabolic Health")

# =====================================================
# PATIENT SUMMARY
# =====================================================

    st.subheader("📋 Patient Summary")

    # Age
    st.markdown(f"**Age:** {age} Years")

    # Glucose
    if glucose < 70:
        glucose_status = "🟡 Low"
    elif glucose <= 99:
        glucose_status = "🟢 Normal"
    elif glucose <= 125:
        glucose_status = "🟡 Prediabetes"
    else:
        glucose_status = "🔴 High"

    st.markdown(f"""
    ### 🩸 Blood Glucose

    **Value:** {glucose} mg/dL

    **Status:** {glucose_status}

    Normal Range: **70–99 mg/dL**
    """)

    # BMI
    if bmi < 18.5:
        bmi_status = "🟡 Underweight"
    elif bmi < 25:
        bmi_status = "🟢 Normal"
    elif bmi < 30:
        bmi_status = "🟡 Overweight"
    else:
        bmi_status = "🔴 Obese"

    st.markdown(f"""
    ### ⚖ Body Mass Index

    **Value:** {bmi:.1f}

    **Status:** {bmi_status}

    Normal Range: **18.5–24.9**
    """)

    # Blood Pressure
    if blood_pressure < 60:
        bp_status = "🟡 Low"
    elif blood_pressure <= 80:
        bp_status = "🟢 Normal"
    else:
        bp_status = "🔴 High"

    st.markdown(f"""
    ### ❤️ Blood Pressure

    **Value:** {blood_pressure} mmHg

    **Status:** {bp_status}

    Normal Range: **60–80 mmHg**
    """)
    st.markdown("---")
    
    # =====================================================
    # AI CLINICAL ANALYSIS
    # =====================================================

    st.subheader("🧠 AI Clinical Analysis")

    major_risks = []
    moderate_risks = []
    healthy_points = []

    # -----------------------------
    # Glucose
    # -----------------------------
    if glucose >= 200:
        major_risks.append(
            f"🔴 Blood Glucose is {glucose} mg/dL, which is extremely high and strongly indicates poor blood sugar control."
        )
    elif glucose >= 140:
        major_risks.append(
            f"🔴 Blood Glucose is {glucose} mg/dL, which is above the normal range."
        )
    elif glucose >= 100:
        moderate_risks.append(
            f"🟡 Blood Glucose is slightly elevated ({glucose} mg/dL)."
        )
    else:
        healthy_points.append(
            f"🟢 Blood Glucose ({glucose} mg/dL) is within a healthy range."
        )

    # -----------------------------
    # BMI
    # -----------------------------
    if bmi >= 35:
        major_risks.append(
            f"🔴 BMI is {bmi:.1f}, indicating obesity, a major diabetes risk factor."
        )
    elif bmi >= 25:
        moderate_risks.append(
            f"🟡 BMI is {bmi:.1f}, indicating overweight."
        )
    else:
        healthy_points.append(
            f"🟢 BMI ({bmi:.1f}) is within a healthy range."
        )

    # -----------------------------
    # Insulin
    # -----------------------------
    if insulin >= 180:
        major_risks.append(
            f"🔴 Insulin level ({insulin}) is significantly elevated."
        )
    elif insulin >= 120:
        moderate_risks.append(
            f"🟡 Insulin level ({insulin}) is moderately elevated."
        )
    else:
        healthy_points.append(
            "🟢 Insulin level appears acceptable."
        )

    # -----------------------------
    # Blood Pressure
    # -----------------------------
    if blood_pressure >= 140:
        major_risks.append(
            f"🔴 Blood Pressure ({blood_pressure} mmHg) is high."
        )
    elif blood_pressure >= 120:
        moderate_risks.append(
            f"🟡 Blood Pressure ({blood_pressure} mmHg) is slightly elevated."
        )
    else:
        healthy_points.append(
            f"🟢 Blood Pressure ({blood_pressure} mmHg) is normal."
        )

    # -----------------------------
    # Age
    # -----------------------------
    if age >= 45:
        moderate_risks.append(
            f"🟡 Age ({age} years) increases the likelihood of Type 2 Diabetes."
        )
    else:
        healthy_points.append(
            "🟢 Younger age lowers diabetes risk."
        )

    # -----------------------------
    # Pregnancies
    # -----------------------------
    if pregnancies >= 4:
        moderate_risks.append(
            f"🟡 History of {pregnancies} pregnancies may increase diabetes risk."
        )

    # -----------------------------
    # Diabetes Pedigree Function
    # -----------------------------
    if dpf >= 0.8:
        major_risks.append(
            "🔴 Family history strongly increases diabetes susceptibility."
        )
    elif dpf >= 0.5:
        moderate_risks.append(
            "🟡 Family history moderately increases diabetes risk."
        )
    else:
        healthy_points.append(
            "🟢 No strong hereditary diabetes risk detected."
        )

    # -----------------------------
    # Display Analysis
    # -----------------------------

    if major_risks:
        st.error("### 🔴 Major Risk Factors")
        for item in major_risks:
            st.write(item)

    if moderate_risks:
        st.warning("### 🟡 Moderate Risk Factors")
        for item in moderate_risks:
            st.write(item)

    if healthy_points:
        st.success("### 🟢 Healthy Indicators")
        for item in healthy_points:
            st.write(item)

    ai_explanation = "\n".join(
        major_risks + moderate_risks + healthy_points
    )

    
    st.markdown("---")

    st.subheader("💡 AI Recommendation")

    if probability < 30:

        st.success("### 🟢 Preventive Recommendations")
        st.write(recommendation_text)

    elif probability < 70:

        st.warning("### 🟡 Lifestyle Recommendations")
        st.write(recommendation_text)

    else:

        st.error("### 🔴 Immediate Medical Recommendations")
        st.write(recommendation_text)
    
    # -------------------------------------
    # Generate PDF
    # -------------------------------------

    clean_risk_level = (
            risk_level
            .replace("🟢 ", "")
            .replace("🟡 ", "")
            .replace("🔴 ", "")
        )

    patient_id = save_prediction(
        patient_name,
        "Diabetes",
        probability,
        clean_risk_level,
        "Diabetes" if prediction == 1 else "Healthy"
        )

    generate_pdf (
        "medical_report.pdf",
        patient_id,
        patient_name,
        age,
        gender,
        "Diabetes",
        probability,
        clean_risk_level,
        ai_explanation,
        recommendation_text
        )

    with open("medical_report.pdf", "rb") as pdf:

            st.download_button(
                "📄 Download Medical Report",
                pdf,
                file_name="Diabetes_Report.pdf",
                mime="application/pdf",
                key="diabetes_pdf_download"
            )   