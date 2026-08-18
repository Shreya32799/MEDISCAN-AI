# MediScan-AI — Healthcare AI/ML Risk Screening Platform

> **Clinical Decision-Support & Risk Screening System** powered by Scikit-Learn Machine Learning models, Next.js 16, and FastAPI.

---

## 🩺 Overview

MediScan-AI is a healthcare risk screening platform designed to assist users and healthcare professionals in identifying potential cardiovascular and metabolic risks from clinical biomarkers.

- **Heart Disease Screening**: Trained Random Forest model (~84% test accuracy on UCI clinical dataset).
- **Diabetes Screening**: Trained Random Forest model (~80% test accuracy on clinical metabolic dataset).
- **Interactive 5-Step Wizard**: Step 1 Basic Info ➔ Step 2 Vitals ➔ Step 3 Diagnostics ➔ Step 4 Review ➔ Step 5 Digital Health Report.
- **Explainable Health Insights**: Transparent probability score and risk category (Low, Moderate, High) with lifestyle and medical decision-support recommendations.
- **Professional Vector PDF Report**: Generates formatted clinical reports with unique Report IDs (`MSAI-2026-XXXXXX`), parameter tables, reference ranges, and physician discussion prompts.
- **Context-Aware AI Assistant**: Floating health chatbot that interprets current screening results, explains biomarkers (BMI, BP, ST Depression, Cholesterol), and provides general wellness guidance.

> **⚠️ Medical Disclaimer**: MediScan-AI is an AI-based health risk screening and educational decision-support tool. It does not provide medical diagnosis, prescription, or emergency medical care. Always consult a qualified healthcare professional for medical decisions.

---

## 🚀 Quick Start (Running Locally)

### 1. Start the FastAPI Backend
```bash
# From repository root
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation available at: `http://127.0.0.1:8000/docs`

### 2. Start the Next.js Frontend
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Tests

```bash
# Run Backend API & Model Tests
python tests/test_backend.py

# Run End-to-End Frontend & API Verification
python tests/test_e2e_frontend.py
```

---

## 🌐 Deployment Guide

### Deploying Frontend to Vercel (1-Click)
1. Push this repository to GitHub.
2. Import the `frontend` directory into [Vercel](https://vercel.com).
3. Set Root Directory to `frontend`.
4. Deploy! The built-in Next.js API route handlers (`/api/predict/heart`, `/api/predict/diabetes`, `/api/chat`) will immediately handle predictions and chatbot conversations in the cloud.

### Deploying FastAPI Backend (Optional Dedicated Python Host)
- **Render / Railway / Hugging Face Spaces / AWS / GCP**:
  - Build command: `pip install -r requirements.txt`
  - Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
  - In Vercel, set `NEXT_PUBLIC_BACKEND_URL` to your deployed backend URL.

---

## 📁 Project Architecture

```
MEDISCAN-AI/
├── backend/                  # FastAPI Application
│   ├── main.py               # REST API endpoints & CORS
│   ├── schemas.py            # Pydantic input/output schemas
│   └── services/
│       └── model_loader.py   # Joblib model loaders
├── models/                   # Verified Scikit-Learn Trained Models
│   ├── heart_model.pkl       # Random Forest (~84% accuracy)
│   ├── heart_scaler.pkl      # StandardScaler
│   ├── heart_columns.pkl     # Feature columns list
│   ├── diabetes_model.pkl    # Random Forest (~80% accuracy)
│   └── diabetes_scaler.pkl   # StandardScaler
├── frontend/                 # Next.js 16 Web Application
│   ├── app/
│   │   ├── page.tsx          # Homepage with all healthcare sections
│   │   ├── assessment/       # Dedicated standalone assessment page
│   │   └── api/
│   │       ├── predict/      # Prediction API routes
│   │       └── chat/         # Context-aware AI Chatbot route
│   ├── components/
│   │   ├── assessment/       # AssessmentWizard & PredictionModal
│   │   ├── chatbot/          # Floating AI Assistant Component
│   │   ├── home/             # HeroSection with live screening cards
│   │   ├── stats/            # Verified project statistics
│   │   ├── about/            # Smarter Health Screening with AI
│   │   ├── sections/         # HealthAssessmentSection, ResponsibleAI
│   │   ├── how-it-works/     # 4-Step Process
│   │   ├── technology/       # Architecture & Tech Stack
│   │   ├── faq/              # FAQ Accordion
│   │   └── layout/           # Navbar, Footer
│   ├── lib/
│   │   └── pdfGenerator.ts   # Vector PDF report engine (jspdf + autotable)
│   └── data/                 # landingData.ts
└── tests/                    # Automated Test Suites
    ├── test_backend.py       # FastAPI & ML Model Unit Tests
    └── test_e2e_frontend.py  # End-to-End API, ML & Chatbot Tests
```