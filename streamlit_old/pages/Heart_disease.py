import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import streamlit as st
import pandas as pd
import joblib

from src.utils.history import save_prediction
from utils.pdf_generator import generate_pdf

# =====================================================
# PAGE CONFIG
# =====================================================

st.set_page_config(
    page_title="MediScan AI",
    page_icon="❤️",
    layout="centered"
)

# =====================================================
# LOAD MODEL
# =====================================================

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "heart_model.pkl"
SCALER_PATH = BASE_DIR / "models" / "heart_scaler.pkl"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
# =====================================================
# PAGE HEADER
# =====================================================

st.title("❤️ MediScan AI")

st.subheader("Heart Disease Prediction")

st.caption(
    "AI-powered Heart Disease Risk Prediction using Machine Learning."
)

st.divider()

st.write(
    "Fill in the patient's clinical details below."
)

st.divider()

st.subheader("👤 Patient Information")

# =====================================================
# PATIENT DETAILS
# =====================================================

patient_name = st.text_input(
    "Patient Name",
    placeholder="Enter patient's full name"
)

gender = st.selectbox(
    "Gender",
    ["Male", "Female", "Other"]
)

st.divider()

col1, col2 = st.columns(2)

# =====================================================
# LEFT COLUMN
# =====================================================

with col1:

    age = st.number_input(
        "Age (Years)",
        min_value=18,
        max_value=100,
        value=45
    )

    trestbps = st.number_input(
        "Resting Blood Pressure (mmHg)",
        min_value=80,
        max_value=250,
        value=120,
        help="Normal resting blood pressure is around 120/80 mmHg."
    )

    chol = st.number_input(
        "Serum Cholesterol (mg/dL)",
        min_value=100,
        max_value=700,
        value=200
    )

    thalch = st.number_input(
        "Maximum Heart Rate Achieved",
        min_value=50,
        max_value=250,
        value=150
    )

    oldpeak = st.number_input(
        "ST Depression",
        min_value=0.0,
        max_value=10.0,
        value=1.0,
        step=0.1,
        help="""
Difference between ECG readings during exercise.

Usually measured during a TMT (Stress Test).

Normal people usually have values close to 0.
"""
    )

# =====================================================
# RIGHT COLUMN
# =====================================================

with col2:

    dataset = st.selectbox(
        "Hospital Dataset",
        [0, 1, 2, 3]
    )

    cp_choice = st.selectbox(
        "Chest Pain Type",
        [
            "Typical Angina",
            "Atypical Angina",
            "Non-anginal Pain",
            "No Chest Pain"
        ],
        help="Select the type mentioned in the patient's medical report."
    )

    fbs = st.selectbox(
        "Fasting Blood Sugar > 120 mg/dL?",
        [
            "Yes",
            "No"
        ]
    )

    restecg = st.selectbox(
        "Resting ECG Result",
        [
            "Normal",
            "ST-T Wave Abnormality",
            "Left Ventricular Hypertrophy"
        ],
        help="""
Available in ECG report.

• Normal

• ST-T Wave Abnormality

• Left Ventricular Hypertrophy
"""
    )

    exercise_pain = st.radio(
        "Exercise-Induced Chest Pain",
        [
            "Yes",
            "No"
        ]
    )

    slope_choice = st.selectbox(
        "Slope of Peak Exercise ST Segment",
        [
            "Upsloping",
            "Flat",
            "Downsloping"
        ],
        help="""
Result from a Treadmill Test (TMT).

Usually available in ECG reports.
"""
    )

st.divider()

predict = st.button(
    "🔍 Predict Heart Disease",
    use_container_width=True,
    type="primary"
)

# =====================================================
# PREDICTION
# =====================================================

if predict:

    # -------------------------------
    # Patient Name Validation
    # -------------------------------

    if patient_name.strip() == "":
        st.error("Please enter Patient Name.")
        st.stop()

    # -------------------------------
    # Input Validation
    # -------------------------------

    errors = []

    if age < 18 or age > 100:
        errors.append("Age should be between 18 and 100 years.")

    if trestbps < 80 or trestbps > 250:
        errors.append("Resting Blood Pressure looks invalid.")

    if chol < 100 or chol > 700:
        errors.append("Cholesterol value looks invalid.")

    if thalch < 50 or thalch > 250:
        errors.append("Maximum Heart Rate looks invalid.")

    if oldpeak < 0 or oldpeak > 10:
        errors.append("Old Peak value looks invalid.")

    if errors:
        for err in errors:
            st.error(err)
        st.stop()


    # -------------------------------
    # Create Sample
    # -------------------------------

    sample = pd.DataFrame([{

    "age": age,
    "sex": gender,
    "dataset": dataset,
    "cp": cp_choice,
    "trestbps": trestbps,
    "chol": chol,
    "fbs": True if fbs == "Yes" else False,
    "restecg": restecg,
    "thalch": thalch,
    "exang": True if exercise_pain == "Yes" else False,
    "oldpeak": oldpeak,
    "slope": slope_choice

}])

    sample = pd.get_dummies(sample)

    COLUMNS_PATH = BASE_DIR / "models" / "heart_columns.pkl"

    model_columns = joblib.load(COLUMNS_PATH)    
    sample = sample.reindex(columns=model_columns, fill_value=0)

    sample_scaled = scaler.transform(sample)

    prediction = model.predict(sample_scaled)[0]

    probability = float(
        model.predict_proba(sample_scaled)[0][1] * 100
    )

    # -------------------------------
    # Risk Level
    # -------------------------------

    if probability < 30:
        risk_level = "🟢 Low Risk"

    elif probability < 70:
        risk_level = "🟡 Moderate Risk"

    else:
        risk_level = "🔴 High Risk"

    # -------------------------------
    # Display Result
    # -------------------------------

    st.success("Prediction Completed Successfully")

    col1, col2 = st.columns(2)

    with col1:
        st.metric(
            "Risk Level",
            risk_level
        )

    with col2:
        st.metric(
            "Probability",
            f"{probability:.2f}%"
        )

        st.metric(
            "Prediction",
            "Positive" if prediction == 1 else "Negative"
        )

    st.progress(int(probability))

    # ------------------------------------
    # Heart Health Score
    # ------------------------------------

    health_score = max(0, round(100 - probability))

    st.divider()

    st.subheader("❤️ Heart Health Score")

    st.progress(health_score)

    if health_score >= 80:

        st.success(f"{health_score}/100 — Excellent Heart Health")

    elif health_score >= 60:

        st.info(f"{health_score}/100 — Good Heart Health")

    elif health_score >= 40:

        st.warning(f"{health_score}/100 — Moderate Heart Health")

    else:

        st.error(f"{health_score}/100 — Poor Heart Health")

        if prediction == 1:
            st.error("⚠️ High Risk of Heart Disease")
        else:
            st.success("✅ Low Risk of Heart Disease")


    # =====================================================
    # PATIENT SUMMARY
    # =====================================================

    st.subheader("📋 Patient Summary")

    st.markdown(f"**Patient:** {patient_name}")
    st.markdown(f"**Gender:** {gender}")
    st.markdown(f"**Age:** {age} Years")
    st.markdown(f"**Blood Pressure:** {trestbps} mmHg")
    st.markdown(f"**Cholesterol:** {chol} mg/dL")
    st.markdown(f"**Maximum Heart Rate:** {thalch} bpm")

    st.divider()

    # =====================================================
    # AI EXPLANATION
    # =====================================================

    st.subheader("🧠 AI Clinical Analysis")

    major_risks = []
    moderate_risks = []
    healthy_points = []

    # Cholesterol
    if chol >= 240:
        major_risks.append(
            f"🔴 Cholesterol is {chol} mg/dL, which is considered High and increases the risk of coronary artery disease."
        )
    elif chol >= 200:
        moderate_risks.append(
            f"🟡 Cholesterol is {chol} mg/dL (Borderline High). Lifestyle changes are recommended."
        )
    else:
        healthy_points.append(
            f"🟢 Cholesterol ({chol} mg/dL) is within a healthy range."
        )

    # Blood Pressure
    if trestbps >= 140:
        major_risks.append(
            f"🔴 Resting Blood Pressure is {trestbps} mmHg, indicating Hypertension."
        )
    elif trestbps >= 120:
        moderate_risks.append(
            f"🟡 Resting Blood Pressure is slightly elevated ({trestbps} mmHg)."
        )
    else:
        healthy_points.append(
            f"🟢 Blood Pressure ({trestbps} mmHg) is normal."
        )

    # Exercise Angina
    if exercise_pain == "Yes":
        major_risks.append(
            "🔴 Exercise-induced chest pain was reported, suggesting reduced blood supply to the heart during activity."
        )
    else:
        healthy_points.append(
            "🟢 No exercise-induced chest pain reported."
        )

    # Old Peak
    if oldpeak >= 2:
        major_risks.append(
            f"🔴 Old Peak value ({oldpeak}) indicates significant ST depression during exercise."
        )
    elif oldpeak >= 1:
        moderate_risks.append(
            f"🟡 Mild ST depression detected (Old Peak = {oldpeak})."
        )
    else:
        healthy_points.append(
            "🟢 No significant ST depression detected."
        )

    # Age
    if age >= 60:
        moderate_risks.append(
            f"🟡 Age ({age} years) is a non-modifiable cardiovascular risk factor."
        )
    elif age < 40:
        healthy_points.append(
            "🟢 Younger age reduces overall cardiovascular risk."
        )

    # Heart Rate
    if thalch >= 150:
        healthy_points.append(
            f"🟢 Maximum Heart Rate ({thalch} bpm) is within an acceptable range."
        )

    # Display Analysis

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
    # =====================================================
    # AI RECOMMENDATION
    # =====================================================

    st.subheader("💡 AI Recommendation")

    recommendation = []

    # -----------------------------
    # High Risk
    # -----------------------------
    if probability >= 70:

        recommendation.append("🏥 Consult a Cardiologist as soon as possible for a detailed clinical evaluation.")

        recommendation.append("🩺 Consider diagnostic tests such as ECG, 2D Echo, TMT, or other investigations as advised by your doctor.")

        recommendation.append("💊 Take only prescribed medications and never self-medicate.")

        recommendation.append("🥗 Follow a heart-healthy diet rich in vegetables, fruits, whole grains, and lean protein.")

        recommendation.append("🚭 Stop smoking completely and avoid alcohol consumption.")

        recommendation.append("🚶 Engage only in light physical activity until medically cleared.")

        recommendation.append("📅 Schedule regular follow-up visits and monitor blood pressure and cholesterol levels.")

    # -----------------------------
    # Moderate Risk
    # -----------------------------
    elif probability >= 30:

        recommendation.append("👨‍⚕️ Schedule a routine medical consultation for further assessment.")

        recommendation.append("🥗 Reduce foods high in saturated fat, salt, and cholesterol.")

        recommendation.append("🏃 Aim for at least 30 minutes of moderate exercise on most days.")

        recommendation.append("⚖️ Maintain a healthy body weight.")

        recommendation.append("🩸 Monitor your blood pressure and cholesterol periodically.")

        recommendation.append("😴 Ensure adequate sleep and manage stress effectively.")

    # -----------------------------
    # Low Risk
    # -----------------------------
    else:

        recommendation.append("✅ Continue maintaining a healthy lifestyle.")

        recommendation.append("🥗 Eat a balanced diet rich in fruits, vegetables, and whole grains.")

        recommendation.append("🏃 Exercise regularly (at least 150 minutes per week).")

        recommendation.append("💧 Stay hydrated and avoid excessive processed foods.")

        recommendation.append("🩺 Have regular health check-ups as part of preventive care.")

        recommendation.append("😊 Continue avoiding smoking and excessive alcohol consumption.")

    recommendation_text = "\n\n".join(recommendation)

    if probability < 30:
        st.success("### 🟢 Preventive Recommendations")
        st.write(recommendation_text)

    elif probability < 70:
        st.warning("### 🟡 Lifestyle Recommendations")
        st.write(recommendation_text)

    else:
        st.error("### 🔴 Immediate Medical Recommendations")
        st.write(recommendation_text)

    st.divider()

    # =====================================================
    # SAVE HISTORY
    # =====================================================

    clean_risk_level = (
        risk_level
        .replace("🟢 ", "")
        .replace("🟡 ", "")
        .replace("🔴 ", "")
    )

    st.write("Patient Name before save:", patient_name)

    patient_id = save_prediction(
        patient_name,
        "Heart Disease",
        probability,
        clean_risk_level,
        "Heart Disease" if prediction == 1 else "Healthy"
    )

    # =====================================================
    # GENERATE PDF
    # =====================================================
    
    generate_pdf(
    "medical_report.pdf",
    patient_id,
    patient_name,
    age,
    gender,
    "Heart Disease",
    probability,
    clean_risk_level,
    ai_explanation,
    recommendation_text
    )

    with open("medical_report.pdf", "rb") as pdf:

        st.download_button(
            "📄 Download Medical Report",
            pdf,
            file_name="Heart_Disease_Report.pdf",
            mime="application/pdf",
            key="heart_pdf_download"
        )

    st.divider()

    # =====================================================
    # ABOUT MODEL
    # =====================================================

    with st.expander("ℹ️ About This AI Model"):

        st.write("""
**Model:** Random Forest Classifier

**Accuracy:** 83.7%

**Dataset:** UCI Heart Disease Dataset

**Purpose:** Educational and Clinical Decision Support

This prediction should not replace professional medical diagnosis.
""")
    