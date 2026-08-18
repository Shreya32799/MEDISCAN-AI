# 🩺 MediScan-AI — Healthcare Risk Prediction Platform

> **AI/ML-Powered Cardiovascular & Metabolic Risk Screening Platform**  
> Built with Next.js 16 (App Router), FastAPI, Scikit-Learn, and Firebase Authentication.

---

## 🌟 Key Features

* **🫀 Heart Disease Risk Screening**: Random Forest Classifier (~84% test accuracy) evaluating 12 clinical biomarkers.
* **🩸 Diabetes Risk Screening**: Random Forest Classifier (~80% test accuracy) evaluating 8 metabolic parameters.
* **🔒 Firebase Google Authentication**: Real Google OAuth popup sign-in, session persistence, and user profile sync.
* **📊 Patient & Physician Dashboard**: Screenings overview, personalized statistics, and historical records.
* **📄 Vector PDF Medical Reports**: Automated clinical report generation with structured parameter tables and reference ranges.
* **🤖 Context-Aware AI Health Assistant**: Real-time interactive AI chat with active biomarker analysis.

---

## 🚀 Quick Local Start

### 1. Clone & Setup Python Backend
```bash
# Activate Python environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Launch FastAPI inference server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Launch Next.js Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend is live at http://localhost:3000
```

---

## 🌐 Production Deployment Options

### Option 1: Vercel (Frontend) + Render / Railway (Backend) — *Recommended*

#### Deploy Backend (FastAPI):
1. Push repository to **GitHub**.
2. Open **[Render](https://render.com/)** or **[Railway](https://railway.app/)**.
3. Create a **New Web Service** pointing to your repository.
4. Set:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5. Copy your live backend URL (e.g. `https://mediscan-backend.onrender.com`).

#### Deploy Frontend (Next.js):
1. Open **[Vercel](https://vercel.com/)** -> **Add New Project**.
2. Select your repository and set **Root Directory** to `frontend`.
3. Add Environment Variables:
   - `NEXT_PUBLIC_BACKEND_URL`: `https://mediscan-backend.onrender.com`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: *(Your Firebase API Key)*
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: `mediscan-ai-c2020.firebaseapp.com`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `mediscan-ai-c2020`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: `mediscan-ai-c2020.firebasestorage.app`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: *(Your Sender ID)*
   - `NEXT_PUBLIC_FIREBASE_APP_ID`: *(Your App ID)*
4. Click **Deploy**.

---

### Option 2: 1-Click Render Blueprint

The repository contains a preconfigured **`render.yaml`**. In Render:
1. Go to **Blueprints** -> **New Blueprint Instance**.
2. Select your GitHub repository.
3. Render will automatically spin up both the **FastAPI Backend** and the **Next.js Frontend**.

---

### Option 3: Docker / Self-Hosted

Run the entire full-stack application with a single command:
```bash
docker compose up --build -d
```
- Frontend: `http://localhost:3000`
- Backend Swagger API: `http://localhost:8000/docs`

---

## 🛡️ Responsible AI & Clinical Notice

MediScan-AI is an artificial intelligence screening and educational risk stratification tool. It is **not** a diagnostic device and should never replace consultation with a licensed physician or emergency medical services.