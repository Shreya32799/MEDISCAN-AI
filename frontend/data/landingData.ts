import {
  Feature,
  PredictionType,
  HowItWorksStep,
  TechItem,
  Testimonial,
  FAQItem,
  StatItem,
} from '@/types';

export const TECH_STACK: TechItem[] = [
  {
    name: 'Machine Learning',
    category: 'Random Forest & Logistic Regression',
    icon: 'Brain',
    description: 'Trained ensemble models delivering ~84% test accuracy for cardiovascular screening.',
  },
  {
    name: 'FastAPI',
    category: 'Async Backend Engine',
    icon: 'Zap',
    description: 'Sub-50ms REST API inferencing with automatic Pydantic schema validation.',
  },
  {
    name: 'Next.js 16',
    category: 'App Router Framework',
    icon: 'Layers',
    description: 'Server component streaming and optimized asset delivery for ultra-fast load.',
  },
  {
    name: 'React 19',
    category: 'UI Engine',
    icon: 'Code',
    description: 'Concurrent rendering and responsive state synchronization across devices.',
  },
  {
    name: 'Python 3.13',
    category: 'Clinical ML Pipeline',
    icon: 'Terminal',
    description: 'Scikit-learn, Pandas normalization, and robust probability calibration.',
  },
  {
    name: 'Privacy & Security',
    category: 'Safe Data Handling',
    icon: 'ShieldCheck',
    description: 'Designed with privacy and security considerations for client-side screening data.',
  },
];

export const FEATURES: Feature[] = [
  {
    id: 'heart-disease',
    title: 'Heart Disease Risk Scoring',
    description:
      'Analyzes 12 key cardiovascular indicators including resting blood pressure, cholesterol, ST slope, and maximum heart rate using Random Forest.',
    iconName: 'HeartPulse',
    badge: 'Clinical Screening',
    category: 'clinical',
  },
  {
    id: 'diabetes-prediction',
    title: 'Diabetes & Metabolic Risk',
    description:
      'Evaluates glycemic biomarkers (fasting glucose, insulin), BMI, and metabolic factors to screen early diabetes risk.',
    iconName: 'Activity',
    badge: 'Early Screening',
    category: 'clinical',
  },
  {
    id: 'ai-insights',
    title: 'Explainable Health Insights',
    description:
      'Provides transparent factor breakdowns explaining why a specific risk tier was estimated for clinical decision support.',
    iconName: 'Sparkles',
    badge: 'Transparent ML',
    category: 'ai',
  },
  {
    id: 'pdf-reports',
    title: 'Printable Clinical Summaries',
    description:
      'Generates clean, structured summaries with color-coded risk gauges, lab biomarker breakdowns, and actionable lifestyle steps.',
    iconName: 'FileText',
    badge: 'Report Export',
    category: 'clinical',
  },
  {
    id: 'patient-history',
    title: 'Secure Assessment Records',
    description:
      'Structured assessment session storage allowing users to review their screening parameters and risk progress over time.',
    iconName: 'ShieldLock',
    badge: 'Privacy Focused',
    category: 'security',
  },
  {
    id: 'doctor-dashboard',
    title: 'Physician Decision Support',
    description:
      'Clear, accessible view designed to help physicians and patients quickly evaluate primary cardiovascular and metabolic risk markers.',
    iconName: 'Stethoscope',
    badge: 'Clinical Support',
    category: 'clinical',
  },
];

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    stepNumber: 1,
    title: 'Enter Clinical Parameters',
    description:
      'Input standard patient vitals and lab biomarkers like BP, cholesterol, glucose, BMI, and clinical history.',
    icon: 'ClipboardList',
    details: 'Supports quick manual input or pre-filled sample clinical profiles for demonstration.',
  },
  {
    stepNumber: 2,
    title: 'ML Model Inference',
    description:
      'MediScan-AI executes scikit-learn Random Forest models trained on validated UCI and Pima clinical benchmark datasets.',
    icon: 'Cpu',
    details: 'Fast inference completes in < 100ms with probability scores and calibrated risk bands.',
  },
  {
    stepNumber: 3,
    title: 'Prediction & Risk Stratification',
    description:
      'Receive multi-factor risk categorization (Low, Moderate, High) accompanied by clear feature contribution analysis.',
    icon: 'BarChart3',
    details: 'Clear graphical breakdown highlighting key lifestyle and clinical drivers.',
  },
  {
    stepNumber: 4,
    title: 'Download & Consult Summary',
    description:
      'Export or print a structured risk summary formatted to facilitate meaningful consultations with a licensed physician.',
    icon: 'DownloadCloud',
    details: 'Includes transparent disclaimer and tailored medical discussion prompts.',
  },
];

export const PREDICTIONS: PredictionType[] = [
  {
    id: 'heart',
    title: 'Heart Disease Assessment',
    shortDescription: 'Multi-factor cardiovascular risk screening for coronary artery disease.',
    fullDescription:
      'Estimates cardiovascular disease risk by analyzing resting ECG patterns, serum cholesterol, blood pressure, exercise tolerance, and ST depression.',
    accuracy: '84% Test Acc',
    parametersCount: 12,
    timeToResult: '< 0.5s',
    badge: 'Random Forest',
    icon: 'Heart',
    gradient: 'from-rose-500/10 via-sky-500/5 to-transparent',
    sampleFactors: [
      'Resting Blood Pressure',
      'Serum Cholesterol',
      'ST Depression (Exercise vs Rest)',
      'Max Heart Rate Achieved',
      'Chest Pain Type Classification',
    ],
  },
  {
    id: 'diabetes',
    title: 'Diabetes Risk Assessment',
    shortDescription: 'Early metabolic syndrome and Type-2 Diabetes risk screening.',
    fullDescription:
      'Identifies elevated glycemic risk indicators using plasma glucose levels, insulin levels, adiposity indices (BMI), and pedigree history.',
    accuracy: '80% Test Acc',
    parametersCount: 8,
    timeToResult: '< 0.5s',
    badge: 'Random Forest',
    icon: 'Flame',
    gradient: 'from-amber-500/10 via-purple-500/5 to-transparent',
    sampleFactors: [
      'Fasting Plasma Glucose (mg/dL)',
      'Body Mass Index (BMI)',
      'Diastolic Blood Pressure',
      'Serum Insulin (µU/mL)',
      'Diabetes Pedigree Function',
    ],
  },
];

export const STATISTICS: StatItem[] = [
  {
    id: 'accuracy',
    label: 'Heart Disease Model',
    value: '84%',
    subtext: 'Random Forest test accuracy on UCI clinical benchmark',
    icon: 'Target',
  },
  {
    id: 'diabetes-acc',
    label: 'Diabetes Model',
    value: '80%',
    subtext: 'Random Forest test accuracy on clinical metabolic dataset',
    icon: 'FileCheck2',
  },
  {
    id: 'diseases',
    label: 'Biomarkers Analyzed',
    value: '20+',
    subtext: 'Including cardiac, metabolic, and hemodynamic parameters',
    icon: 'Dna',
  },
  {
    id: 'speed',
    label: 'Inference Speed',
    value: '< 50ms',
    subtext: 'Instant screening powered by Scikit-Learn and FastAPI',
    icon: 'Clock',
  },
];

export const WHY_CHOOSE_US = [
  {
    title: 'Machine Learning Precision',
    description: 'Trained Random Forest models built on verified UCI cardiovascular and Pima metabolic datasets.',
    icon: 'BrainCircuit',
  },
  {
    title: 'Instant Real-Time Results',
    description: 'Receive full screening risk summaries and probability percentages in milliseconds.',
    icon: 'Zap',
  },
  {
    title: 'Privacy & Security Conscious',
    description: 'Designed with privacy and security considerations for client-side screening data.',
    icon: 'Lock',
  },
  {
    title: 'Transparent Metrics',
    description: 'Realistic, measured benchmarks based on actual test dataset validation.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Explainable Decision Support',
    description: 'Clear breakdown of contributing physiological markers to support clinical conversations.',
    icon: 'Sparkles',
  },
  {
    title: 'Modern & Accessible',
    description: 'Intuitive interface designed for seamless use by both patients and clinicians.',
    icon: 'LayoutGrid',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote:
      'MediScan-AI provides a remarkably clear risk breakdown. The feature visibility allows users and doctors to walk through individual clinical drivers with ease.',
    author: 'Dr. A. Sharma, MD',
    role: 'Preventive Health Consultant',
    institution: 'Cardiovascular Care Network',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
    rating: 5,
    badge: 'Clinical Support',
  },
  {
    id: '2',
    quote:
      'Using the diabetes risk screening tool during my routine review helped flag elevated glucose and BMI levels early, encouraging timely lifestyle adjustments.',
    author: 'S. Patel',
    role: 'Preventive Care User',
    institution: 'Health Awareness Cohort',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    rating: 5,
    badge: 'User Story',
  },
  {
    id: '3',
    quote:
      'The ability to quickly calculate and print structured screening summaries makes MediScan-AI a practical educational and pre-intake tool.',
    author: 'Dr. M. Verma',
    role: 'Internal Medicine Specialist',
    institution: 'Metropolitan Healthcare',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80',
    rating: 5,
    badge: 'Medical Reviewer',
  },
];

export const FAQS: FAQItem[] = [
  {
    id: 'accuracy',
    question: 'How accurate are the MediScan-AI prediction models?',
    answer:
      'MediScan-AI utilizes trained Random Forest classifiers achieving approximately 84% test accuracy for heart disease screening on the UCI dataset and approximately 80% for diabetes risk assessment. The models are designed for risk screening and decision support, not diagnosis.',
    category: 'General',
  },
  {
    id: 'privacy',
    question: 'How is health screening data handled?',
    answer:
      'MediScan-AI is designed with privacy and security considerations. Parameters entered for risk assessment are processed in-memory for inference and are not sold or transmitted to unauthorized third parties.',
    category: 'Security',
  },
  {
    id: 'medical-disclaimer',
    question: 'Is MediScan-AI a substitute for a doctor’s diagnosis?',
    answer:
      'No. MediScan-AI is strictly an AI-based health risk screening and educational decision-support tool. It does not provide medical diagnosis, prescription, or emergency medical care. All medical decisions must be made in consultation with a qualified healthcare professional.',
    category: 'Medical',
  },
  {
    id: 'reports',
    question: 'What is included in the risk assessment summary?',
    answer:
      'The assessment summary provides an estimated risk tier (Low, Moderate, High), risk probability percentage, summary of contributing clinical factors, personalized lifestyle recommendations, and a formal healthcare disclaimer.',
    category: 'Reports',
  },
  {
    id: 'parameters',
    question: 'What information do I need to run a prediction?',
    answer:
      'For Heart Disease: age, sex, chest pain type, resting blood pressure, cholesterol, resting ECG, max heart rate, exercise angina, ST depression, and ST slope. For Diabetes: pregnancies, glucose, blood pressure, skin thickness, insulin, BMI, diabetes pedigree function, and age. Convenient sample buttons are provided for instant demonstration.',
    category: 'Usage',
  },
];
