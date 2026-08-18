import joblib
from pathlib import Path
import os

# Find project root robustly
CURRENT_FILE = Path(__file__).resolve()
BASE_DIR = CURRENT_FILE.parents[2] if len(CURRENT_FILE.parents) >= 3 else Path(os.getcwd())

MODEL_DIR = BASE_DIR / "models"
if not MODEL_DIR.exists():
    # Fallback search
    candidates = [
        Path("C:/MEDISCAN-AI/models"),
        Path("D:/MediScan-AI/models"),
        Path(os.getcwd()) / "models",
    ]
    for c in candidates:
        if c.exists():
            MODEL_DIR = c
            break

# Load Diabetes Models
diabetes_model = joblib.load(MODEL_DIR / "diabetes_model.pkl")
diabetes_scaler = joblib.load(MODEL_DIR / "diabetes_scaler.pkl")

# Load Heart Disease Models & Columns
heart_model = joblib.load(MODEL_DIR / "heart_model.pkl")
heart_scaler = joblib.load(MODEL_DIR / "heart_scaler.pkl")
heart_columns = joblib.load(MODEL_DIR / "heart_columns.pkl")

print(f"[INFO] All AI models loaded successfully from {MODEL_DIR}")