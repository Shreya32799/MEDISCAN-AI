import streamlit as st
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

def load_css():
    css_path = BASE_DIR / "assets" / "style.css"

    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(
            f"<style>{f.read()}</style>",
            unsafe_allow_html=True
        )
st.set_page_config(
    page_title="MediScan AI",
    page_icon="🩺",
    layout="wide"
)
load_css()
# ======================================================
# HERO SECTION
# ======================================================

st.markdown("""

<div class="hero-card">

    <div class="hero-left">

        <div class="hero-badge">
            🚀 AI Powered Healthcare Platform
        </div>

        <div class="hero-title">
            🩺 MediScan AI
        </div>

        <div class="hero-subtitle">
            Predict Diseases with Artificial Intelligence
        </div>

        <div class="hero-description">

            MediScan AI helps doctors, hospitals and patients
            predict <b>Heart Disease</b> and <b>Diabetes</b>
            within seconds using Machine Learning models trained
            on real clinical datasets.

        </div>

        <div class="hero-features">

            <div class="hero-feature">
                <div class="hero-check">✔</div>
                Accurate Disease Prediction
            </div>

            <div class="hero-feature">
                <div class="hero-check">✔</div>
                AI Powered Analysis
            </div>

            <div class="hero-feature">
                <div class="hero-check">✔</div>
                Professional PDF Reports
            </div>

            <div class="hero-feature">
                <div class="hero-check">✔</div>
                Personalized Recommendations
            </div>

        </div>

        <div class="hero-buttons">

            <a class="hero-primary">
            🚀 Get Started
            </a>
            <a class="hero-secondary">
                📖 Learn More
            </a>

        </div>

    </div>

    <div class="hero-right">

        <div class="hero-image">

            🩺

        </div>

        <div class="floating-card float-top">
            ❤️ 83.7% Heart Model
        </div>

        <div class="floating-card float-bottom">
            🩸 75.9% Diabetes Model
        </div>

    </div>

</div>

""", unsafe_allow_html=True)

st.markdown("""
<div class="section">

<div class="section-title">
Why Choose MediScan AI
</div>

<div class="section-subtitle">
Professional AI Healthcare Platform designed for fast, secure and intelligent disease prediction.
</div>

</div>
""", unsafe_allow_html=True)

feature_columns = st.columns(3) 

feature_cards = [

("⚡","Lightning Fast","Receive AI predictions within seconds."),

("🧠","AI Powered","Advanced Machine Learning models trained on clinical datasets."),

("📄","Professional Reports","Generate beautiful downloadable medical reports instantly.")

]

for col, card in zip(feature_columns, feature_cards):

    with col:

        st.markdown(f"""
<div class="feature-card">

<div class="feature-icon">
{card[0]}
</div>

<div class="feature-title">
{card[1]}
</div>

<div class="feature-description">
{card[2]}
</div>

</div>
""",
unsafe_allow_html=True)

st.markdown("""
<div class="section">

<div class="section-title">
Prediction Modules
</div>

<div class="section-subtitle">
Choose an AI-powered healthcare prediction service.
</div>

</div>
""", unsafe_allow_html=True)

m1, m2 = st.columns(2)

with m1:

    st.markdown("""
<div class="module-card">

<div class="module-icon">❤️</div>

<div class="module-title">
Heart Disease Prediction
</div>

<div class="module-text">
Analyze the risk of cardiovascular disease using our trained KNN Machine Learning model.
</div>

<span class="module-badge">KNN</span>

<span class="module-badge">83.7% Accuracy</span>

<span class="module-badge">PDF Report</span>

</div>
""", unsafe_allow_html=True)

    st.button(
        "❤️ Start Heart Prediction",
        key="heart_home",
        use_container_width=True
    )

with m2:

    st.markdown("""
<div class="module-card">

<div class="module-icon">🩸</div>

<div class="module-title">
Diabetes Prediction
</div>

<div class="module-text">
Predict diabetes risk using our Random Forest model trained on real clinical datasets.
</div>

<span class="module-badge">Random Forest</span>

<span class="module-badge">75.97% Accuracy</span>

<span class="module-badge">PDF Report</span>

</div>
""", unsafe_allow_html=True)

    st.button(
        "🩸 Start Diabetes Prediction",
        key="diabetes_home",
        use_container_width=True
    )

st.markdown("<br>", unsafe_allow_html=True)

st.markdown("""
<div class="section">

<div class="section-title">
Platform Statistics
</div>

<div class="section-subtitle">
Performance of our Machine Learning models.
</div>

</div>
""", unsafe_allow_html=True)
stats_columns = st.columns(4)

stats_cards = [

("83.7%","Heart Model"),

("75.9%","Diabetes Model"),

("2","AI Models"),

("100%","PDF Reports")

]

for col, card in zip(stats_columns, stats_cards):

    with col:

        st.markdown(f"""
<div class="stats-card">

<div class="stats-number">
{card[0]}
</div>

<div class="stats-title">
{card[1]}
</div>

</div>
""", unsafe_allow_html=True)

st.markdown("<br><br>", unsafe_allow_html=True)

st.markdown(
    """
    <div class="footer">
        © 2026 <b>MediScan AI</b> | AI-Powered Healthcare Platform <br>
        Developed by <b>Shreya Jagdish Patil</b>
    </div>
    """,
    unsafe_allow_html=True,
)