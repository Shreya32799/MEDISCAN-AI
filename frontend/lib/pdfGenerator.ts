import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface PDFReportData {
  reportId: string;
  patientName: string;
  age: number;
  sex?: string;
  disease: string;
  probability: number;
  riskLevel: string;
  riskColor: string;
  summary: string;
  recommendations: string[];
  parameters: {
    label: string;
    value: string | number;
    unit?: string;
    reference: string;
  }[];
  date: string;
}

export function generateReportId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MSAI-${new Date().getFullYear()}-${suffix}`;
}

export function exportHealthReportPDF(data: PDFReportData): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // 1. Top Brand Banner
  doc.setFillColor(2, 132, 199); // Sky-600
  doc.rect(0, 0, pageWidth, 5, "F");

  // 2. Header Area
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Navy-900
  doc.text("MediScan-AI", margin, 18);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105); // Slate-600
  doc.text("AI Health Risk Screening Report", margin, 24);

  // Top Right Info Box (Report ID & Timestamp)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`REPORT ID: ${data.reportId}`, pageWidth - margin, 18, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Assessment Date: ${data.date}`, pageWidth - margin, 24, { align: "right" });

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, 28, pageWidth - margin, 28);

  // 3. Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(2, 132, 199); // Sky-600
  doc.text(`${data.disease.toUpperCase()} RISK SCREENING SUMMARY`, margin, 36);

  // 4. Patient Information Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, 40, pageWidth - 2 * margin, 20, 2.5, 2.5, "FD");

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT NAME:", margin + 5, 47);
  doc.text("AGE & SEX:", margin + 65, 47);
  doc.text("ASSESSMENT TYPE:", margin + 120, 47);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(data.patientName || "Anonymous Patient", margin + 5, 54);
  doc.text(`${data.age} Yrs • ${data.sex || "Standard Cohort"}`, margin + 65, 54);
  doc.text(data.disease, margin + 120, 54);

  // 5. Screening Risk Summary Card
  let riskFillColor = [240, 253, 244]; // Emerald-50
  let riskBorderColor = [187, 247, 208];
  let riskTextColor = [21, 128, 61]; // Emerald-700

  if (data.riskLevel.toLowerCase().includes("high")) {
    riskFillColor = [255, 241, 242]; // Rose-50
    riskBorderColor = [254, 205, 211];
    riskTextColor = [190, 18, 60]; // Rose-700
  } else if (data.riskLevel.toLowerCase().includes("mod")) {
    riskFillColor = [254, 252, 232]; // Amber-50
    riskBorderColor = [254, 240, 138];
    riskTextColor = [180, 83, 9]; // Amber-700
  }

  doc.setFillColor(riskFillColor[0], riskFillColor[1], riskFillColor[2]);
  doc.setDrawColor(riskBorderColor[0], riskBorderColor[1], riskBorderColor[2]);
  doc.roundedRect(margin, 64, pageWidth - 2 * margin, 25, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(riskTextColor[0], riskTextColor[1], riskTextColor[2]);
  doc.text(`RISK CATEGORY: ${data.riskLevel.toUpperCase()}`, margin + 5, 72);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Risk Estimate: ${data.probability}%`, pageWidth - margin - 5, 72, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(data.summary, pageWidth - 2 * margin - 10);
  doc.text(summaryLines, margin + 5, 80);

  // 6. Clinical Parameters Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("Clinical Screening Parameters", margin, 96);

  const tableBody = data.parameters.map((p) => [
    p.label,
    String(p.value),
    p.unit || "—",
    p.reference,
  ]);

  autoTable(doc, {
    startY: 99,
    head: [["Parameter", "Entered Value", "Unit", "Reference / Context"]],
    body: tableBody,
    theme: "striped",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      cellPadding: 2.2,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 1.8,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 32 },
      2: { cellWidth: 22 },
      3: { cellWidth: "auto" },
    },
    margin: { left: margin, right: margin },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 180;
  let currentY = finalY + 7;

  if (currentY > pageHeight - 65) {
    doc.addPage();
    currentY = 20;
  }

  // 7. Key Screening Insights
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Key Screening Insights & Health Observations", margin, currentY);
  currentY += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const insightText =
    "Model scores reflect risk stratification derived from statistical patterns in clinical training data. " +
    "Biomarkers outside target reference ranges should be evaluated with your physician during routine follow-ups.";
  const insightLines = doc.splitTextToSize(insightText, pageWidth - 2 * margin);
  doc.text(insightLines, margin, currentY);
  currentY += 8;

  // 8. Recommended Next Steps
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Recommended Next Steps", margin, currentY);
  currentY += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  data.recommendations.forEach((rec) => {
    if (currentY > pageHeight - 35) {
      doc.addPage();
      currentY = 20;
    }
    doc.text(`•  ${rec}`, margin + 2, currentY);
    currentY += 4.2;
  });

  currentY += 3;

  // 9. Disclaimer Box
  if (currentY > pageHeight - 28) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 18, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text("IMPORTANT DISCLAIMER:", margin + 3, currentY + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  const disclaimer =
    "This report provides an AI-based risk screening estimate for informational and decision-support purposes only. " +
    "It is not a medical diagnosis and should not replace professional medical advice, diagnosis, or treatment. " +
    "Always consult a licensed physician or healthcare provider regarding any health symptoms or clinical decisions.";
  const discLines = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin - 6);
  doc.text(discLines, margin + 3, currentY + 8.5);

  // 10. Footer on every page
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);

    // Left
    doc.text("MediScan-AI Healthcare Platform", margin, pageHeight - 6);
    // Center
    doc.text(`Report ID: ${data.reportId}`, pageWidth / 2, pageHeight - 6, { align: "center" });
    // Right
    doc.text(`Page ${i} of ${totalPages} • Confidential`, pageWidth - margin, pageHeight - 6, {
      align: "right",
    });
  }

  const sanitizedName = (data.patientName || "Report").replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`${data.disease.replace(/\s+/g, "_")}_Screening_Report_${sanitizedName}_${data.reportId}.pdf`);
}
