from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
from typing import Dict, Any

from backend.schemas import HeartInput, DiabetesInput, PredictionResponse
from backend.services.model_loader import (
    diabetes_model,
    diabetes_scaler,
    heart_model,
    heart_scaler,
    heart_columns,
)

app = FastAPI(
    title="MediScan-AI Healthcare Risk API",
    description="AI/ML Risk Prediction Engine for Heart Disease and Diabetes Screening",
    version="1.0.0"
)

# Enable CORS for Next.js frontend (local & deployed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DISCLAIMER_TEXT = (
    "MediScan-AI is an AI-based health risk screening and clinical decision-support tool. "
    "It does not provide medical diagnosis, prescription, or emergency medical care. "
    "Always consult a qualified healthcare professional for medical evaluations."
)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "MediScan-AI Healthcare Risk Engine",
        "version": "1.0.0",
        "endpoints": {
            "heart_prediction": "/predict/heart",
            "diabetes_prediction": "/predict/diabetes",
            "health_check": "/health"
        },
        "disclaimer": DISCLAIMER_TEXT
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "models_loaded": {
            "heart_model": heart_model is not None,
            "diabetes_model": diabetes_model is not None
        }
    }

@app.post("/predict/heart", response_model=PredictionResponse)
def predict_heart_disease(data: HeartInput):
    try:
        # Standardize categorical inputs
        cp_val = str(data.cp).lower().strip()
        restecg_val = str(data.restecg).lower().strip()
        slope_val = str(data.slope).lower().strip()
        sex_val = "Male" if str(data.sex).lower().startswith("m") or data.sex == 1 else "Female"
        
        # Handle fbs bool / string
        if isinstance(data.fbs, str):
            fbs_val = True if data.fbs.lower() in ["yes", "true", "1"] else False
        else:
            fbs_val = bool(data.fbs)

        # Handle exang bool / string
        if isinstance(data.exang, str):
            exang_val = True if data.exang.lower() in ["yes", "true", "1"] else False
        else:
            exang_val = bool(data.exang)

        # Construct raw sample
        sample = pd.DataFrame([{
            "age": float(data.age),
            "sex": sex_val,
            "dataset": data.dataset,
            "cp": cp_val,
            "trestbps": float(data.trestbps),
            "chol": float(data.chol),
            "fbs": fbs_val,
            "restecg": restecg_val,
            "thalch": float(data.thalch),
            "exang": exang_val,
            "oldpeak": float(data.oldpeak),
            "slope": slope_val
        }])

        # Perform one-hot encoding & reindex to match training columns
        sample_encoded = pd.get_dummies(sample)
        sample_aligned = sample_encoded.reindex(columns=heart_columns, fill_value=0)

        # Scale features
        sample_scaled = heart_scaler.transform(sample_aligned)

        # Generate prediction and probability
        pred = int(heart_model.predict(sample_scaled)[0])
        prob = float(heart_model.predict_proba(sample_scaled)[0][1] * 100)
        prob = round(prob, 1)

        # Determine risk level
        if prob < 30.0:
            risk_level = "Low Risk"
            risk_color = "emerald"
            summary = "The ML model estimates a low cardiovascular disease risk profile based on current indicators."
            recommendations = [
                "Maintain regular physical exercise (at least 150 minutes/week).",
                "Continue balanced Mediterranean-style nutrition low in saturated fats.",
                "Schedule routine annual blood pressure and lipid profile screenings.",
                "Maintain optimal stress management and regular sleep cycles."
            ]
        elif prob < 70.0:
            risk_level = "Moderate Risk"
            risk_color = "amber"
            summary = "The ML model identified moderate cardiovascular risk markers that warrant proactive attention."
            recommendations = [
                "Schedule a cardiovascular checkup with your primary physician.",
                "Monitor blood pressure weekly and track resting heart rate trends.",
                "Evaluate dietary sodium and cholesterol intake with a nutritionist.",
                "Discuss stress testing (TMT) and lipid panel optimization with a doctor."
            ]
        else:
            risk_level = "High Risk"
            risk_color = "rose"
            summary = "The ML model indicates an elevated cardiovascular risk profile requiring prompt clinical evaluation."
            recommendations = [
                "Consult a certified Cardiologist or physician as soon as possible.",
                "Request a comprehensive 12-lead ECG and echocardiogram evaluation.",
                "Do not start vigorous strenuous workouts without prior medical clearance.",
                "Follow all physician-prescribed medication plans strictly."
            ]

        return PredictionResponse(
            disease="Heart Disease",
            prediction=pred,
            probability_percentage=prob,
            risk_level=risk_level,
            risk_color=risk_color,
            summary=summary,
            recommendations=recommendations,
            disclaimer=DISCLAIMER_TEXT
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Heart disease prediction error: {str(e)}")


@app.post("/predict/diabetes", response_model=PredictionResponse)
def predict_diabetes(data: DiabetesInput):
    try:
        # Create input dataframe matching feature order:
        # ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']
        sample = pd.DataFrame([{
            "Pregnancies": int(data.pregnancies),
            "Glucose": float(data.glucose),
            "BloodPressure": float(data.blood_pressure),
            "SkinThickness": float(data.skin_thickness),
            "Insulin": float(data.insulin),
            "BMI": float(data.bmi),
            "DiabetesPedigreeFunction": float(data.diabetes_pedigree_function),
            "Age": int(data.age)
        }])

        # Scale features
        sample_scaled = diabetes_scaler.transform(sample)

        # Generate prediction and probability
        pred = int(diabetes_model.predict(sample_scaled)[0])
        prob = float(diabetes_model.predict_proba(sample_scaled)[0][1] * 100)
        prob = round(prob, 1)

        # Determine risk level
        if prob < 30.0:
            risk_level = "Low Risk"
            risk_color = "emerald"
            summary = "The ML model estimates a low probability of diabetes/glycemic dysfunction."
            recommendations = [
                "Continue whole-food diet rich in dietary fiber and complex carbohydrates.",
                "Maintain an active lifestyle with regular aerobic and strength activities.",
                "Perform routine fasting blood glucose checks every 1-2 years.",
                "Keep body mass index (BMI) within the healthy range (18.5 - 24.9)."
            ]
        elif prob < 70.0:
            risk_level = "Moderate Risk"
            risk_color = "amber"
            summary = "The ML model identified prediabetic glycemic or metabolic markers requiring lifestyle interventions."
            recommendations = [
                "Consult a physician and request a formal Fasting Blood Sugar & HbA1c test.",
                "Reduce intake of refined sugars, sweetened beverages, and ultra-processed foods.",
                "Engage in 30 minutes of moderate daily exercise (brisk walking, cycling).",
                "Monitor post-meal blood sugar levels periodically."
            ]
        else:
            risk_level = "High Risk"
            risk_color = "rose"
            summary = "The ML model indicates elevated glycemic risk indicators requiring prompt physician consultation."
            recommendations = [
                "Schedule an immediate consultation with an Endocrinologist or Diabetologist.",
                "Undergo clinical oral glucose tolerance test (OGTT) and HbA1c laboratory testing.",
                "Adopt a structured diabetic meal plan under clinical supervision.",
                "Take medications or insulin only under direct physician guidance."
            ]

        return PredictionResponse(
            disease="Diabetes",
            prediction=pred,
            probability_percentage=prob,
            risk_level=risk_level,
            risk_color=risk_color,
            summary=summary,
            recommendations=recommendations,
            disclaimer=DISCLAIMER_TEXT
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diabetes prediction error: {str(e)}")