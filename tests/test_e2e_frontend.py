import urllib.request
import json

def test_full_platform():
    print("==================================================")
    print("Testing MediScan-AI Platform End-to-End...")
    print("==================================================")

    # 1. Test Heart Disease Prediction Route
    heart_payload = {
        "patient_name": "Demo Cardiac Subject",
        "age": 58,
        "sex": "Male",
        "dataset": 0,
        "cp": "typical angina",
        "trestbps": 145,
        "chol": 260,
        "fbs": False,
        "restecg": "normal",
        "thalch": 135,
        "exang": True,
        "oldpeak": 1.8,
        "slope": "flat"
    }

    req_heart = urllib.request.Request(
        "http://localhost:3000/api/predict/heart",
        data=json.dumps(heart_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_heart) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        assert data["disease"] == "Heart Disease"
        assert "probability_percentage" in data
        assert "risk_level" in data
        print(f"[PASS] 1. Heart Disease Model Inference -> Risk: {data['risk_level']} ({data['probability_percentage']}%)")

    # 2. Test Diabetes Prediction Route
    diabetes_payload = {
        "patient_name": "Demo Metabolic Subject",
        "pregnancies": 2,
        "glucose": 140,
        "blood_pressure": 78,
        "skin_thickness": 28,
        "insulin": 120,
        "bmi": 29.2,
        "diabetes_pedigree_function": 0.55,
        "age": 42
    }

    req_diab = urllib.request.Request(
        "http://localhost:3000/api/predict/diabetes",
        data=json.dumps(diabetes_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_diab) as resp:
        assert resp.status == 200
        data_d = json.loads(resp.read().decode('utf-8'))
        assert data_d["disease"] == "Diabetes"
        assert "probability_percentage" in data_d
        assert "risk_level" in data_d
        print(f"[PASS] 2. Diabetes Model Inference -> Risk: {data_d['risk_level']} ({data_d['probability_percentage']}%)")

    # 3. Test AI Health Chatbot (General Question)
    chat_general = {
        "message": "What is BMI and how does it affect health risk?",
    }
    req_chat_g = urllib.request.Request(
        "http://localhost:3000/api/chat",
        data=json.dumps(chat_general).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_chat_g) as resp:
        assert resp.status == 200
        chat_data = json.loads(resp.read().decode('utf-8'))
        assert len(chat_data["reply"]) > 20
        assert "disclaimer" in chat_data
        print(f"[PASS] 3. AI Chatbot General Medical Q&A -> Responded ({len(chat_data['reply'])} chars)")

    # 4. Test AI Health Chatbot with Prediction Context
    chat_with_ctx = {
        "message": "What does my screening result mean?",
        "context": {
            "disease": "Heart Disease",
            "probability": data["probability_percentage"],
            "riskLevel": data["risk_level"],
            "summary": data["summary"],
            "parameters": heart_payload,
            "patientName": "Demo Cardiac Subject"
        }
    }
    req_chat_ctx = urllib.request.Request(
        "http://localhost:3000/api/chat",
        data=json.dumps(chat_with_ctx).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_chat_ctx) as resp:
        assert resp.status == 200
        chat_ctx_data = json.loads(resp.read().decode('utf-8'))
        assert data["risk_level"] in chat_ctx_data["reply"] or "Heart" in chat_ctx_data["reply"]
        print(f"[PASS] 4. AI Chatbot Context-Aware Explanation -> Correctly interpreted {data['risk_level']} result")

    # 5. Test All App Routes
    routes_to_test = [
        ("/", "Homepage"),
        ("/assessment", "Assessment Wizard"),
        ("/dashboard", "User Dashboard"),
        ("/history", "Assessment History"),
        ("/profile", "User Profile"),
        ("/admin", "Admin Analytics"),
        ("/login", "Sign In Page"),
        ("/signup", "Sign Up Page"),
        ("/forgot-password", "Forgot Password"),
        ("/privacy", "Privacy Policy"),
        ("/terms", "Terms of Use"),
        ("/responsible-ai", "Responsible AI"),
    ]

    for path, name in routes_to_test:
        with urllib.request.urlopen(f"http://localhost:3000{path}") as resp:
            assert resp.status == 200
            print(f"[PASS] Route '{path}' ({name}) -> HTTP 200 OK")

    print("==================================================")
    print("ALL TESTS PASSED! FULL HEALTHCARE PLATFORM ONLINE.")
    print("==================================================")

if __name__ == "__main__":
    test_full_platform()
