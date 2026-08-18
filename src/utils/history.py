from pathlib import Path
import pandas as pd
from datetime import datetime
import uuid

BASE_DIR = Path(__file__).resolve().parents[2]

HISTORY_FILE = (
    BASE_DIR /
    "data" /
    "prediction_history" /
    "prediction_history.csv"
)


def save_prediction(
    patient_name,
    disease,
    probability,
    risk_level,
    prediction
):
    patient_id = str(uuid.uuid4())[:8].upper()

    record = pd.DataFrame([{
        "PatientID": patient_id,
        "PatientName": patient_name,
        "Disease": disease,
        "Probability": round(probability, 2),
        "RiskLevel": risk_level,
        "Prediction": prediction,
        "DateTime": datetime.now().strftime("%d-%m-%Y %H:%M")
    }])

    if HISTORY_FILE.exists():

        history = pd.read_csv(HISTORY_FILE)

        history = pd.concat(
            [history, record],
            ignore_index=True
        )

    else:

        history = record

    history.to_csv(
        HISTORY_FILE,
        index=False
    )

    return patient_id