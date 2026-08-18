from pydantic import BaseModel, Field
from typing import Optional, Union, List


class HeartInput(BaseModel):
    patient_name: Optional[str] = "Anonymous Patient"
    age: float = Field(..., ge=18, le=100, description="Age in years (18-100)")
    sex: str = Field("Male", description="Gender: 'Male' or 'Female'")
    dataset: Union[str, int] = Field(0, description="Hospital dataset (0, 1, 2, 3 or name)")
    cp: str = Field("typical angina", description="Chest pain type: 'typical angina', 'atypical angina', 'non-anginal', 'asymptomatic'")
    trestbps: float = Field(120, ge=80, le=250, description="Resting Blood Pressure in mmHg")
    chol: float = Field(200, ge=100, le=700, description="Serum Cholesterol in mg/dL")
    fbs: Union[bool, str] = Field(False, description="Fasting Blood Sugar > 120 mg/dL (True/False)")
    restecg: str = Field("normal", description="Resting ECG ('normal', 'st-t abnormality', 'lv hypertrophy')")
    thalch: float = Field(150, ge=50, le=250, description="Maximum Heart Rate Achieved")
    exang: Union[bool, str] = Field(False, description="Exercise-induced angina (True/False)")
    oldpeak: float = Field(1.0, ge=0.0, le=10.0, description="ST depression induced by exercise")
    slope: str = Field("flat", description="Slope of the peak exercise ST segment ('upsloping', 'flat', 'downsloping')")


class DiabetesInput(BaseModel):
    patient_name: Optional[str] = "Anonymous Patient"
    pregnancies: int = Field(0, ge=0, le=20, description="Number of pregnancies")
    glucose: float = Field(120, ge=40, le=350, description="Plasma glucose concentration (mg/dL)")
    blood_pressure: float = Field(70, ge=40, le=200, description="Diastolic blood pressure (mmHg)")
    skin_thickness: float = Field(20, ge=0, le=100, description="Triceps skin fold thickness (mm)")
    insulin: float = Field(80, ge=0, le=900, description="2-Hour serum insulin (mu U/ml)")
    bmi: float = Field(25.0, ge=10.0, le=70.0, description="Body mass index (weight in kg/(height in m)^2)")
    diabetes_pedigree_function: float = Field(0.47, ge=0.0, le=3.0, description="Diabetes pedigree function score")
    age: int = Field(35, ge=1, le=120, description="Age in years")


class PredictionResponse(BaseModel):
    disease: str
    prediction: int
    probability_percentage: float
    risk_level: str
    risk_color: str
    summary: str
    recommendations: List[str]
    disclaimer: str