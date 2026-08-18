import sys
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    print("[PASS] Root endpoint test passed!")

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["models_loaded"]["heart_model"] is True
    assert data["models_loaded"]["diabetes_model"] is True
    print("[PASS] Health check test passed!")

def test_heart_prediction_healthy():
    payload = {
        "patient_name": "John Doe",
        "age": 45,
        "sex": "Male",
        "dataset": 0,
        "cp": "typical angina",
        "trestbps": 120,
        "chol": 190,
        "fbs": False,
        "restecg": "normal",
        "thalch": 160,
        "exang": False,
        "oldpeak": 0.0,
        "slope": "upsloping"
    }
    response = client.post("/predict/heart", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease"] == "Heart Disease"
    assert "probability_percentage" in data
    assert "risk_level" in data
    assert len(data["recommendations"]) > 0
    print(f"[PASS] Heart prediction (healthy sample) passed! Result: {data['risk_level']} ({data['probability_percentage']}%)")

def test_heart_prediction_high_risk():
    payload = {
        "patient_name": "Jane Smith",
        "age": 68,
        "sex": "Male",
        "dataset": 0,
        "cp": "asymptomatic",
        "trestbps": 170,
        "chol": 310,
        "fbs": True,
        "restecg": "st-t abnormality",
        "thalch": 105,
        "exang": True,
        "oldpeak": 3.5,
        "slope": "flat"
    }
    response = client.post("/predict/heart", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease"] == "Heart Disease"
    print(f"[PASS] Heart prediction (high risk sample) passed! Result: {data['risk_level']} ({data['probability_percentage']}%)")

def test_diabetes_prediction_healthy():
    payload = {
        "patient_name": "Healthy User",
        "pregnancies": 1,
        "glucose": 95,
        "blood_pressure": 70,
        "skin_thickness": 18,
        "insulin": 75,
        "bmi": 22.4,
        "diabetes_pedigree_function": 0.25,
        "age": 28
    }
    response = client.post("/predict/diabetes", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease"] == "Diabetes"
    assert "probability_percentage" in data
    assert "risk_level" in data
    print(f"[PASS] Diabetes prediction (healthy sample) passed! Result: {data['risk_level']} ({data['probability_percentage']}%)")

def test_diabetes_prediction_high_risk():
    payload = {
        "patient_name": "High Risk Patient",
        "pregnancies": 5,
        "glucose": 180,
        "blood_pressure": 90,
        "skin_thickness": 35,
        "insulin": 220,
        "bmi": 38.5,
        "diabetes_pedigree_function": 1.25,
        "age": 56
    }
    response = client.post("/predict/diabetes", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease"] == "Diabetes"
    print(f"[PASS] Diabetes prediction (high risk sample) passed! Result: {data['risk_level']} ({data['probability_percentage']}%)")

if __name__ == "__main__":
    test_root()
    test_health()
    test_heart_prediction_healthy()
    test_heart_prediction_high_risk()
    test_diabetes_prediction_healthy()
    test_diabetes_prediction_high_risk()
    print("\n[SUCCESS] ALL BACKEND API & ML MODEL TESTS PASSED SUCCESSFULLY!")
