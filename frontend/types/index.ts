export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  category: 'clinical' | 'ai' | 'security';
}

export interface PredictionType {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  accuracy: string;
  parametersCount: number;
  timeToResult: string;
  badge: string;
  icon: string;
  gradient: string;
  sampleFactors: string[];
}

export interface HowItWorksStep {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
  details: string;
}

export interface TechItem {
  name: string;
  category: string;
  icon: string;
  description: string;
  version?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  institution: string;
  avatar: string;
  rating: number;
  badge?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  subtext: string;
  icon: string;
}

export interface HealthAssessmentInput {
  age: number;
  gender: 'male' | 'female' | 'other';
  systolicBP: number;
  diastolicBP: number;
  cholesterol: number;
  fastingGlucose: number;
  hba1c: number;
  bmi: number;
  maxHeartRate: number;
  chestPainType: 'none' | 'atypical' | 'non_anginal' | 'typical';
  familyHistory: boolean;
  smokingStatus: 'never' | 'former' | 'active';
  physicalActivityDays: number;
}

export interface HealthAssessmentResult {
  heartDiseaseRisk: {
    score: number; // 0-100
    category: 'Low' | 'Moderate' | 'Elevated' | 'High';
    color: string;
    keyFactors: { factor: string; impact: 'High' | 'Moderate' | 'Low'; direction: 'increases' | 'lowers' }[];
  };
  diabetesRisk: {
    score: number; // 0-100
    category: 'Low' | 'Moderate' | 'Elevated' | 'High';
    color: string;
    keyFactors: { factor: string; impact: 'High' | 'Moderate' | 'Low'; direction: 'increases' | 'lowers' }[];
  };
  overallHealthScore: number;
  recommendedActions: string[];
  reportId: string;
  generatedAt: string;
}
