from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)

from reportlab.lib import colors

from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle
)

from reportlab.lib.enums import TA_CENTER

from reportlab.lib.units import inch

from datetime import datetime

# =====================================================
# STYLES
# =====================================================

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "TitleStyle",
    parent=styles["Title"],
    alignment=TA_CENTER,
    textColor=colors.HexColor("#00B894"),
    fontName="Helvetica-Bold",
    fontSize=24,
    spaceAfter=12
)

heading_style = ParagraphStyle(
    "HeadingStyle",
    parent=styles["Heading2"],
    textColor=colors.HexColor("#0F172A"),
    fontName="Helvetica-Bold",
    spaceBefore=12,
    spaceAfter=8
)

body_style = ParagraphStyle(
    "BodyStyle",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=10,
    leading=18
)


def generate_pdf(
    filename,
    patient_id,
    patient_name,
    age,
    gender,
    report_type,
    probability,
    risk_level,
    ai_explanation,
    recommendation
):
    print("Patient Name received:", patient_name)
    patient_data = [
    ["Patient ID", patient_id],
    ["Patient Name", patient_name],
    ["Age", str(age)],
    ["Gender", gender]
    ]

    print(patient_data)


    doc = SimpleDocTemplate(filename)

    elements = []

    # =====================================================
    # HEADER
    # =====================================================

    elements.append(
    Paragraph(
        "🏥 MediScan-AI",
        title_style
    )
    )

    elements.append(
        Paragraph(
            "<b>AI Powered Healthcare Diagnostic Report</b>",
            body_style
        )
    )

    elements.append(
        Paragraph(
            "<font color='grey'>Generated using Artificial Intelligence & Machine Learning</font>",
            body_style
        )
    )

    elements.append(Spacer(1, 10))
    header_line = Table(
        [[""]],
        colWidths=[6.4 * inch]
    )

    header_line.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 2, colors.HexColor("#00B894"))
    ]))

    elements.append(header_line)

    elements.append(Spacer(1, 15))

    # =====================================================
    # REPORT INFORMATION
    # =====================================================

    elements.append(
        Paragraph("Report Information", heading_style)
    )

    report_id = datetime.now().strftime("MSAI-%Y%m%d-%H%M%S")

    report_data = [
        ["Report ID", report_id],
        ["Generated On", datetime.now().strftime("%d-%m-%Y %H:%M")],
        ["Prediction Type", report_type]
    ]

    report_table = Table(
        report_data,
        colWidths=[2.2 * inch, 4 * inch]
    )

    report_table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (0,-1), colors.HexColor("#E8F8F5")),
        ("TEXTCOLOR", (0,0), (0,-1), colors.HexColor("#0F172A")),
        ("GRID", (0,0), (-1,-1), 0.6, colors.HexColor("#D5DBDB")),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("TOPPADDING", (0,0), (-1,-1), 8),
        ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold"),
    ]))

    elements.append(report_table)

    elements.append(Spacer(1,15))

    # =====================================================
    # PREDICTION RESULT
    # =====================================================

    if "Low" in risk_level:
        result_color = "#27AE60"
        risk_icon = "🟢"

    elif "Moderate" in risk_level:
        result_color = "#F39C12"
        risk_icon = "🟡"

    else:
        result_color = "#E74C3C"
        risk_icon = "🔴"


    prediction_card = Table(
        [[
            Paragraph(
                f"""
                <para align="center">

                <font size="18">
                <b>{risk_icon} {risk_level}</b>
                </font>

                <br/><br/><br/>

                <font size="11" color="grey">
                Prediction Probability
                </font>

                <br/>

                <font size="22" color="{result_color}">
                <b>{probability:.2f}%</b>
                </font>

                </para>
                """,
                styles["BodyText"]
            )
        ]],
        colWidths=[6.3*inch],
        rowHeights=[1.55*inch]
    )

    prediction_card.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),colors.white),
        ("BOX",(0,0),(-1,-1),2,colors.HexColor(result_color)),
        ("ROUNDEDCORNERS",[10,10,10,10]),
        ("ALIGN",(0,0),(-1,-1),"CENTER"),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ]))

    elements.append(prediction_card)

    elements.append(Spacer(1,18))

    # =====================================================
    # PATIENT INFORMATION
    # =====================================================

    elements.append(
        Paragraph("👤 Patient Information", heading_style)
    )

    patient_data = [

        ["Patient ID", patient_id],

        ["Patient Name", patient_name],

        ["Age", f"{age} Years"],

        ["Gender", gender],

    ]

    patient_table = Table(
        patient_data,
        colWidths=[2.0 * inch, 4.3 * inch]
    )

    patient_table.setStyle(TableStyle([

        ("BACKGROUND", (0,0), (0,-1), colors.HexColor("#EDF7FF")),

        ("TEXTCOLOR", (0,0), (0,-1), colors.HexColor("#1E3A8A")),

        ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold"),

        ("BACKGROUND", (1,0), (1,-1), colors.white),

        ("GRID", (0,0), (-1,-1), 0.4, colors.HexColor("#D6DBDF")),

        ("BOTTOMPADDING", (0,0), (-1,-1), 9),

        ("TOPPADDING", (0,0), (-1,-1), 9),

        ("LEFTPADDING", (0,0), (-1,-1), 10),

        ("RIGHTPADDING", (0,0), (-1,-1), 10),

    ]))

    elements.append(patient_table)

    elements.append(Spacer(1,18))

    # ============================
    # Prediction Summary
    # ============================

    elements.append(
        Paragraph("Prediction Summary", heading_style)
    )

    prediction_data = [
        ["Prediction Probability", f"{probability:.2f}%"],
        ["Prediction Type", report_type],
        ["Risk Level", risk_level]
    ]

    prediction_table = Table(
        prediction_data,
        colWidths=[2.2 * inch, 4 * inch]
    )

    prediction_table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (0,-1), colors.HexColor("#FEF9E7")),
        ("TEXTCOLOR", (0,0), (0,-1), colors.HexColor("#0F172A")),
        ("GRID", (0,0), (-1,-1), 0.6, colors.HexColor("#D5DBDB")),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("TOPPADDING", (0,0), (-1,-1), 8),
        ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold"),
    ]))

    elements.append(prediction_table)

    elements.append(Spacer(1,15))

    # =====================================================
    # AI CLINICAL ANALYSIS
    # =====================================================

    elements.append(
        Paragraph("🧠 AI Clinical Analysis", heading_style)
    )

    analysis_box = Table(
        [[
            Paragraph(
                ai_explanation.replace("\n", "<br/>"),
                body_style
            )
        ]],
        colWidths=[6.3 * inch]
    )

    analysis_box.setStyle(TableStyle([

        ("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#F8FCFF")),

        ("BOX",(0,0),(-1,-1),1.2,colors.HexColor("#3498DB")),

        ("LEFTPADDING",(0,0),(-1,-1),12),

        ("RIGHTPADDING",(0,0),(-1,-1),12),

        ("TOPPADDING",(0,0),(-1,-1),10),

        ("BOTTOMPADDING",(0,0),(-1,-1),10),

    ]))

    elements.append(analysis_box)

    elements.append(Spacer(1,18))
    
    # =====================================================
    # AI RECOMMENDATION
    # =====================================================

    elements.append(
        Paragraph("💡 AI Recommendations", heading_style)
    )

    recommendation_box = Table(
        [[
            Paragraph(
                recommendation.replace("\n", "<br/>"),
                body_style
            )
        ]],
        colWidths=[6.3 * inch]
    )

    recommendation_box.setStyle(TableStyle([

        ("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#F8FFF8")),

        ("BOX",(0,0),(-1,-1),1.2,colors.HexColor("#27AE60")),

        ("LEFTPADDING",(0,0),(-1,-1),12),

        ("RIGHTPADDING",(0,0),(-1,-1),12),

        ("TOPPADDING",(0,0),(-1,-1),10),

        ("BOTTOMPADDING",(0,0),(-1,-1),10),

    ]))

    elements.append(recommendation_box)

    elements.append(Spacer(1,18))

    # =====================================================
    # =====================================================
    # MEDICAL DISCLAIMER
    # =====================================================

    elements.append(
        Paragraph("⚠ Medical Disclaimer", heading_style)
    )

    disclaimer_box = Table(
        [[
            Paragraph(
                """
                <b>This report has been generated using Artificial Intelligence and Machine Learning.</b>
                <br/><br/>

                The prediction provided by MediScan-AI is intended only for
                educational purposes and clinical decision support.

                <br/><br/>

                This report must <b>NOT</b> be considered a final medical diagnosis.

                <br/><br/>

                Always consult a qualified healthcare professional before making
                any medical decisions.
                """,
                body_style
            )
        ]],
        colWidths=[6.3 * inch]
    )

    disclaimer_box.setStyle(TableStyle([

        ("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#FFF8E6")),

        ("BOX",(0,0),(-1,-1),1.2,colors.HexColor("#F39C12")),

        ("LEFTPADDING",(0,0),(-1,-1),12),

        ("RIGHTPADDING",(0,0),(-1,-1),12),

        ("TOPPADDING",(0,0),(-1,-1),10),

        ("BOTTOMPADDING",(0,0),(-1,-1),10),

    ]))

    elements.append(disclaimer_box)

    elements.append(Spacer(1,18))

    # =====================================================
    # REPORT VERIFICATION
    # =====================================================

    elements.append(
        Paragraph("Report Verification", heading_style)
    )

    verification = Table(
        [[
            "Generated By",
            "MediScan-AI v1.0"
        ],
        [
            "Model Used",
            report_type
        ],
        [
            "Report Status",
            "AI Generated"
        ],
        [
            "Doctor Signature",
            "__________________________"
        ]],
        colWidths=[2.2 * inch, 4.1 * inch]
    )

    verification.setStyle(TableStyle([

        ("BACKGROUND",(0,0),(0,-1),colors.HexColor("#F4F6F7")),

        ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),

        ("GRID",(0,0),(-1,-1),0.5,colors.lightgrey),

        ("BOTTOMPADDING",(0,0),(-1,-1),8),

        ("TOPPADDING",(0,0),(-1,-1),8),

    ]))

    elements.append(verification)

    elements.append(Spacer(1,20))

    # =====================================================
    # FOOTER
    # =====================================================

    footer_style = ParagraphStyle(
        "FooterStyle",
        parent=styles["Italic"],
        alignment=TA_CENTER,
        textColor=colors.grey,
        fontSize=9
    )

    elements.append(
        Paragraph(
            "Generated by <b>MediScan-AI</b><br/>AI Powered Healthcare Platform",
            footer_style
        )
    )

    # =====================================================
    # BUILD PDF
    # =====================================================

    doc.build(elements)

    print("PDF Generated Successfully")