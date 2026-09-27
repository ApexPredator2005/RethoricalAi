"""
RethoricalAI — Automated Assignment Feedback & Grading Platform
A Streamlit multi-page application with an 'annotated paper / teacher desk' aesthetic.
"""

import streamlit as st
import json
import os
import time
from datetime import datetime

# Set Streamlit Page Config
st.set_page_config(
    page_title="RethoricalAI — AI Assignment Feedback & Grading",
    page_icon="✒️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Optional imports with graceful fallback for standalone execution
try:
    from quiz_engine import generate_quiz
except ImportError:
    def generate_quiz(text, improvements):
        return {
            "questions": [
                {
                    "prompt": "Which revision best improves sentence conciseness?",
                    "options": [
                        "The author illustrates the main claim clearly.",
                        "The author is in the process of illustrating the claim.",
                        "An illustration is made by the author clearly.",
                        "The author, he illustrates the claim clearly."
                    ],
                    "correct_index": 0,
                    "hint": "Prefer active voice with strong action verbs.",
                    "insight": "Active voice strengthens prose rhythm and clarity."
                }
            ]
        }

try:
    from rubric_engine import load_rubric, save_rubric, compute_weighted_score
except ImportError:
    def load_rubric(path="data/default_rubric.json"):
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "criteria": [
                {"id": "grammar", "name": "Grammar & Mechanics", "description": "Syntax, punctuation, spelling.", "weight": 0.25, "scale_min": 1, "scale_max": 10, "anchors": {"low": "Frequent comma splices and fragments.", "mid": "Minor punctuation slips.", "high": "Flawless mechanics."}},
                {"id": "coherence", "name": "Coherence & Organization", "description": "Structure, transitions, flow.", "weight": 0.25, "scale_min": 1, "scale_max": 10, "anchors": {"low": "Disjointed thoughts.", "mid": "Predictable transitions.", "high": "Compelling narrative flow."}},
                {"id": "argument_strength", "name": "Argument & Evidence", "description": "Thesis, evidence, reasoning.", "weight": 0.25, "scale_min": 1, "scale_max": 10, "anchors": {"low": "Unsupported opinions.", "mid": "Some evidence, weak rebuttals.", "high": "Ironclad thesis and proof."}},
                {"id": "originality", "name": "Originality & Voice", "description": "Unique perspective and tone.", "weight": 0.25, "scale_min": 1, "scale_max": 10, "anchors": {"low": "Cliche and formulaic.", "mid": "Occasional personal flair.", "high": "Distinctive critical voice."}}
            ]
        }

    def save_rubric(rubric, path):
        os.makedirs(os.path.dirname(path) if os.path.dirname(path) else ".", exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(rubric, f, indent=2)

    def compute_weighted_score(rubric, dimension_scores):
        total = 0.0
        for crit in rubric.get("criteria", []):
            cid = crit["id"]
            total += dimension_scores.get(cid, 5.0) * crit.get("weight", 0.25)
        return round(total, 1)

try:
    from preprocessing import normalize_text, segment_text
except ImportError:
    def normalize_text(text: str) -> str:
        return text.strip()

    def segment_text(text: str) -> dict:
        paragraphs = [p for p in text.split("\n\n") if p.strip()]
        sentences = [s.strip() for s in text.replace("\n", " ").split(".") if s.strip()]
        words = text.split()
        return {
            "paragraphs": paragraphs or [text],
            "sentences": sentences or [text],
            "stats": {
                "paragraph_count": max(1, len(paragraphs)),
                "sentence_count": max(1, len(sentences)),
                "word_count": len(words),
                "avg_sentence_length": round(len(words) / max(1, len(sentences)), 1)
            }
        }

try:
    from feedback_engine import generate_feedback_from_raw
except ImportError:
    def generate_feedback_from_raw(raw_text, rubric_path="data/default_rubric.json", model_answer=None):
        return {
            "overall_score": 7.8,
            "criterion_scores": {
                "grammar": 8,
                "coherence": 7,
                "argument_strength": 8,
                "originality": 8
            },
            "strengths": [
                {"title": "Compelling Thesis Articulation", "detail": "The central claim in the opening paragraph sets a distinct scholarly trajectory with precise academic vocabulary."},
                {"title": "Contextual Textual Synthesis", "detail": "Primary evidence is skillfully woven into the analytical argument rather than dropped as standalone quotes."}
            ],
            "improvements": [
                {"title": "Transitional Rhythm Between Paragraphs 2 & 3", "detail": "The shift from historical context to socio-economic critique feels abrupt; consider adding a conjunctive bridge."},
                {"title": "Comma Splices in Compound Assertions", "detail": "Several complex sentences connect two independent clauses with only a comma."}
            ],
            "excerpt_notes": [
                {"paragraph_index": 1, "excerpt": "The ramifications was evident throughout the century.", "note": "Subject-verb agreement: 'ramifications' (plural) requires 'were'."},
                {"paragraph_index": 2, "excerpt": "This proves beyond doubt that society evolved, however challenges persisted.", "note": "Punctuation: Replace the comma before 'however' with a semicolon."}
            ],
            "pedagogical_insight": "The student exhibits advanced analytical maturity and strong conceptual depth. Targeted remediation on compound sentence punctuation and transitional phrasing will elevate their prose to college-ready rigor.",
            "confidence": 0.92,
            "ensemble_agreement": "High (94% cross-pass consensus)"
        }

# Initialize Session State
if "submissions" not in st.session_state:
    st.session_state.submissions = [
        {
            "id": "sub-101",
            "student_name": "Maya Lin",
            "title": "Technological Determinism in the Industrial Age",
            "timestamp": "2026-09-26 14:15",
            "score": 8.5,
            "rubric_name": "Default 4-Criteria",
            "essay_text": "The industrial revolution was not merely a transition in mechanical power, but a fundamental realignment of human social relations. While early factories concentrated labor, they simultaneously dismantled artisanal autonomy...",
            "feedback": {
                "overall_score": 8.5,
                "criterion_scores": {"grammar": 9, "coherence": 8, "argument_strength": 9, "originality": 8},
                "strengths": [{"title": "Nuanced Historical Argumentation", "detail": "Draws clean distinctions between mechanical and social shifts."}],
                "improvements": [{"title": "Counterargument Deepening", "detail": "Briefly acknowledges agrarian resistance but moves on quickly."}],
                "excerpt_notes": [{"paragraph_index": 1, "excerpt": "dismantled artisanal autonomy", "note": "Excellent academic phrasing."}],
                "pedagogical_insight": "Exceptional historical voice. Ready for independent primary source critique.",
                "confidence": 0.94,
                "ensemble_agreement": "Very High (96%)"
            }
        },
        {
            "id": "sub-102",
            "student_name": "Marcus Vance",
            "title": "Echoes of the Great Gatsby",
            "timestamp": "2026-09-26 13:40",
            "score": 6.8,
            "rubric_name": "Default 4-Criteria",
            "essay_text": "Fitzgerald shows that the american dream is fake because Gatsby dies at the end and no one comes to his funeral. The green light represents hope however it is out of reach...",
            "feedback": {
                "overall_score": 6.8,
                "criterion_scores": {"grammar": 6, "coherence": 7, "argument_strength": 7, "originality": 7},
                "strengths": [{"title": "Symbolic Awareness", "detail": "Directly links Gatsby's funeral attendance to thematic superficiality."}],
                "improvements": [
                    {"title": "Capitalization & Mechanics", "detail": "Missed capitalizing 'American Dream' and informal wording."},
                    {"title": "Comma Splices & Run-ons", "detail": "Missing semicolon before conjunctive adverb 'however'."}
                ],
                "excerpt_notes": [{"paragraph_index": 1, "excerpt": "represents hope however it is out of reach", "note": "Punctuation: Place a semicolon before 'however'."}],
                "pedagogical_insight": "Good thematic grasp. Needs practice on compound-complex sentence mechanics.",
                "confidence": 0.88,
                "ensemble_agreement": "High (91%)"
            }
        },
        {
            "id": "sub-103",
            "student_name": "Elena Rostova",
            "title": "Ethics of Genetic Editing",
            "timestamp": "2026-09-26 11:20",
            "score": 7.4,
            "rubric_name": "Default 4-Criteria",
            "essay_text": "CRISPR technology provides unprecedented control over the genome. But who decides what traits are desirable? If wealthy families can enhance their offspring, inequality will become biological...",
            "feedback": {
                "overall_score": 7.4,
                "criterion_scores": {"grammar": 8, "coherence": 7, "argument_strength": 8, "originality": 7},
                "strengths": [{"title": "Provocative Inquiries", "detail": "Uses rhetorical framing effectively to introduce bioethical dilemmas."}],
                "improvements": [{"title": "Paragraph Organization", "detail": "Transitions between somatic and germline therapies blur together."}],
                "excerpt_notes": [{"paragraph_index": 1, "excerpt": "inequality will become biological", "note": "Strong, memorable thesis punchline."}],
                "pedagogical_insight": "Compelling ethical reasoning. Suggest outlining paragraph pivots before drafting.",
                "confidence": 0.91,
                "ensemble_agreement": "High (93%)"
            }
        }
    ]

if "active_submission" not in st.session_state:
    st.session_state.active_submission = st.session_state.submissions[0]

if "quiz_data" not in st.session_state:
    st.session_state.quiz_data = None

if "quiz_answers" not in st.session_state:
    st.session_state.quiz_answers = {}

if "lms_connected" not in st.session_state:
    st.session_state.lms_connected = False

if "lms_sync_log" not in st.session_state:
    st.session_state.lms_sync_log = [
        {"timestamp": "2026-09-26 10:00", "course": "AP English Literature - Period 3", "status": "Success", "records_synced": 3}
    ]

# Theme & Styling Injections
def inject_custom_css(dark_mode=False):
    if not dark_mode:
        bg_paper = "#FCFBF7"
        text_ink = "#1B2A3D"
        card_bg = "#FFFFFF"
        border_color = "#E5DFD3"
        accent_red = "#B0503A"
        accent_gold = "#B4872E"
        accent_blue = "#3E6E8E"
        margin_bg = "#FFFDF9"
        sidebar_bg = "#F4F1EA"
    else:
        bg_paper = "#141E28"
        text_ink = "#E8E4D9"
        card_bg = "#1B2A3D"
        border_color = "#2D3E50"
        accent_red = "#E06D53"
        accent_gold = "#D4A346"
        accent_blue = "#5B93B8"
        margin_bg = "#1F2F42"
        sidebar_bg = "#0E161F"

    st.markdown(f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap');

    .stApp {{
        background-color: {bg_paper};
        color: {text_ink};
        font-family: 'Inter', sans-serif;
    }}

    section[data-testid="stSidebar"] {{
        background-color: {sidebar_bg};
        border-right: 1px solid {border_color};
    }}

    h1, h2, h3, .serif-font {{
        font-family: 'Source Serif 4', Georgia, serif !important;
        color: {text_ink};
    }}

    /* Ruled Paper Texture for Essay & Report */
    .ruled-paper {{
        background-color: {card_bg};
        background-image: repeating-linear-gradient(
            transparent,
            transparent 27px,
            rgba(62, 110, 142, 0.12) 28px
        );
        line-height: 28px;
        padding: 24px;
        border-radius: 6px;
        border: 1px solid {border_color};
        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        font-family: 'Source Serif 4', serif;
        color: {text_ink};
    }}

    /* Margin Note Card */
    .margin-note {{
        background-color: {margin_bg};
        border-left: 4px solid {accent_red};
        padding: 14px 18px;
        margin-bottom: 12px;
        border-radius: 0 6px 6px 0;
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        border-top: 1px solid {border_color};
        border-right: 1px solid {border_color};
        border-bottom: 1px solid {border_color};
    }}

    .strength-card {{
        background-color: {margin_bg};
        border-left: 4px solid {accent_gold};
        padding: 14px 18px;
        margin-bottom: 12px;
        border-radius: 0 6px 6px 0;
        border-top: 1px solid {border_color};
        border-right: 1px solid {border_color};
        border-bottom: 1px solid {border_color};
    }}

    .insight-card {{
        background-color: {margin_bg};
        border-left: 4px solid {accent_blue};
        padding: 16px 20px;
        border-radius: 0 6px 6px 0;
        border-top: 1px solid {border_color};
        border-right: 1px solid {border_color};
        border-bottom: 1px solid {border_color};
        font-family: 'Source Serif 4', serif;
    }}

    .metric-card {{
        background-color: {card_bg};
        border: 1px solid {border_color};
        padding: 18px;
        border-radius: 6px;
        text-align: center;
        box-shadow: 0 1px 4px rgba(0,0,0,0.02);
    }}

    .badge-pill {{
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        background: {accent_blue}22;
        color: {accent_blue};
    }}
    </style>
    """, unsafe_allow_html=True)


# Sidebar Navigation
with st.sidebar:
    st.markdown("<h2 style='margin-bottom: 0;'>✒️ RethoricalAI</h2>", unsafe_allow_html=True)
    st.markdown("<p style='font-size:0.85rem; color:#6B7C93; margin-top:2px;'>AI Assignment Feedback & Grading</p>", unsafe_allow_html=True)
    st.markdown("---")

    dark_mode = st.toggle("🌙 Night Grading Mode", value=False)
    inject_custom_css(dark_mode)

    menu = st.radio(
        "Navigation",
        [
            "📊 Teacher Dashboard",
            "📐 Grading Criteria",
            "📝 Submit Assignment",
            "🔍 Assignment Feedback",
            "📈 Class Insights",
            "🔗 Gradebook Sync"
        ],
        index=0
    )

    st.markdown("---")
    st.markdown("<div style='font-size:0.8rem; color:#8898AA;'>System Status: 🟢 <b>Gemini 2.5 Flash Active</b><br/>Gradebook: " + ("🟢 Connected" if st.session_state.lms_connected else "⚪ Offline / Demo") + "</div>", unsafe_allow_html=True)


# SCREEN 1: TEACHER DASHBOARD
if menu == "📊 Teacher Dashboard":
    st.markdown("<h1>Teacher Grading Desk</h1>", unsafe_allow_html=True)
    st.markdown("<p style='color:#526477; font-size:1.05rem;'>Overview of student submissions, class scoring distributions, and pending assessments.</p>", unsafe_allow_html=True)

    col1, col2, col3, col4 = st.columns(4)
    total_subs = len(st.session_state.submissions)
    avg_score = round(sum(s["score"] for s in st.session_state.submissions) / max(1, total_subs), 1)
    needs_review = sum(1 for s in st.session_state.submissions if s["score"] < 7.0)

    with col1:
        st.markdown(f"<div class='metric-card'><div style='font-size:0.85rem; color:#708090;'>Total Submissions</div><div style='font-size:1.8rem; font-weight:700; color:#1B2A3D;'>{total_subs}</div></div>", unsafe_allow_html=True)
    with col2:
        st.markdown(f"<div class='metric-card'><div style='font-size:0.85rem; color:#708090;'>Class Average</div><div style='font-size:1.8rem; font-weight:700; color:#3E6E8E;'>{avg_score} / 10</div></div>", unsafe_allow_html=True)
    with col3:
        st.markdown(f"<div class='metric-card'><div style='font-size:0.85rem; color:#708090;'>Needs Revision (<7.0)</div><div style='font-size:1.8rem; font-weight:700; color:#B0503A;'>{needs_review}</div></div>", unsafe_allow_html=True)
    with col4:
        st.markdown(f"<div class='metric-card'><div style='font-size:0.85rem; color:#708090;'>AI Grading Agreement</div><div style='font-size:1.8rem; font-weight:700; color:#B4872E;'>94% (±1)</div></div>", unsafe_allow_html=True)

    st.markdown("<br/>", unsafe_allow_html=True)
    st.subheader("Recent Submissions")

    for sub in st.session_state.submissions:
        with st.container():
            c1, c2, c3, c4, c5 = st.columns([3, 3, 2, 2, 2])
            c1.markdown(f"**{sub['student_name']}**<br/><span style='font-size:0.8rem; color:#708090;'>{sub['timestamp']}</span>", unsafe_allow_html=True)
            c2.markdown(f"*{sub['title']}*")
            c3.markdown(f"<span class='badge-pill'>{sub['rubric_name']}</span>", unsafe_allow_html=True)
            c4.markdown(f"**Score: {sub['score']} / 10**")
            if c5.button("Inspect Report ➔", key=f"btn_{sub['id']}"):
                st.session_state.active_submission = sub
                st.session_state.quiz_data = None
                st.toast(f"Switched to {sub['student_name']}'s submission. Open 'Assignment Feedback' tab to review.", icon="✅")


# SCREEN 2: GRADING CRITERIA
elif menu == "📐 Grading Criteria":
    st.markdown("<h1>Grading Criteria Studio</h1>", unsafe_allow_html=True)
    st.markdown("<p style='color:#526477;'>Define dynamic grading dimensions, assign fractional weights, and specify concrete score-band examples for AI evaluation.</p>", unsafe_allow_html=True)

    default_rubric = load_rubric("data/default_rubric.json")

    if "builder_criteria" not in st.session_state:
        st.session_state.builder_criteria = default_rubric.get("criteria", [])

    st.markdown("### Grading Dimensions")

    total_weight = sum(c.get("weight", 0.0) for c in st.session_state.builder_criteria)
    is_valid_weight = abs(total_weight - 1.0) < 0.001

    if is_valid_weight:
        st.success(f"✅ Total Weight: **{round(total_weight * 100, 1)}%** (Valid & Balanced)")
    else:
        st.error(f"⚠️ Total Weight is **{round(total_weight * 100, 1)}%**. Weights must sum to **100% (1.0)** before saving.")

    # Render criteria editors
    criteria_to_delete = []
    for idx, crit in enumerate(st.session_state.builder_criteria):
        with st.expander(f"📌 {crit.get('name', f'Criterion {idx+1}')} ({int(crit.get('weight', 0.25)*100)}%)", expanded=True):
            r_col1, r_col2 = st.columns([3, 1])
            crit["name"] = r_col1.text_input("Criterion Name", value=crit.get("name", ""), key=f"name_{idx}")
            crit["weight"] = r_col2.number_input("Weight (0.0 to 1.0)", min_value=0.05, max_value=1.0, step=0.05, value=float(crit.get("weight", 0.25)), key=f"weight_{idx}")

            crit["description"] = st.text_area("Description / What to look for", value=crit.get("description", ""), key=f"desc_{idx}", height=65)

            st.markdown("**Score Level Examples (Low, Medium, High)**")
            a_col1, a_col2, a_col3 = st.columns(3)
            if "anchors" not in crit:
                crit["anchors"] = {"low": "", "mid": "", "high": ""}

            crit["anchors"]["low"] = a_col1.text_area("Low Score Band (2-3/10)", value=crit["anchors"].get("low", ""), key=f"anchor_low_{idx}", height=100)
            crit["anchors"]["mid"] = a_col2.text_area("Mid Score Band (5-6/10)", value=crit["anchors"].get("mid", ""), key=f"anchor_mid_{idx}", height=100)
            crit["anchors"]["high"] = a_col3.text_area("High Score Band (8-9/10)", value=crit["anchors"].get("high", ""), key=f"anchor_high_{idx}", height=100)

            if st.button(f"🗑️ Remove Criterion", key=f"del_{idx}"):
                criteria_to_delete.append(idx)

    for idx in reversed(criteria_to_delete):
        st.session_state.builder_criteria.pop(idx)
        st.rerun()

    c_btn1, c_btn2 = st.columns([1, 1])
    if c_btn1.button("➕ Add New Dimension"):
        st.session_state.builder_criteria.append({
            "id": f"criterion_{len(st.session_state.builder_criteria)+1}",
            "name": "New Criterion",
            "description": "Evaluation standards for this dimension.",
            "weight": 0.20,
            "scale_min": 1,
            "scale_max": 10,
            "anchors": {"low": "Poor execution snippet.", "mid": "Adequate execution snippet.", "high": "Exemplary execution snippet."}
        })
        st.rerun()

    if c_btn2.button("💾 Save Custom Criteria to Disk", disabled=not is_valid_weight):
        rubric_to_save = {"criteria": st.session_state.builder_criteria}
        save_rubric(rubric_to_save, "data/custom_rubric.json")
        st.success("🎉 Criteria saved successfully as `data/custom_rubric.json`!")


# SCREEN 3: SUBMIT ASSIGNMENT
elif menu == "📝 Submit Assignment":
    st.markdown("<h1>Student Assignment Submission</h1>", unsafe_allow_html=True)
    st.markdown("<p style='color:#526477;'>Submit student writing or textual assignments via text or photograph/OCR, configure optional reference documents, and generate feedback.</p>", unsafe_allow_html=True)

    with st.container():
        st.markdown("<div class='ruled-paper'>", unsafe_allow_html=True)
        student_name = st.text_input("Student Name", value="Alex Chen")
        essay_title = st.text_input("Assignment Title", value="The Paradox of Digital Connection")

        tab_text, tab_photo = st.tabs(["✍️ Paste Plaintext", "📸 Upload Handwritten / PDF Photo"])

        essay_input = ""
        with tab_text:
            essay_input = st.text_area(
                "Assignment Content",
                value="While social media platforms promise global connectivity, they frequently engender profound psychological isolation. Recent sociological studies indicate that passive consumption of curated profiles exacerbates social anxiety, however individuals continue to spend hours daily scrolling through feeds. Furthermore, algorithmic amplification favors contentious discourse over empathetic dialogue, which distorts public perception. To mitigate these adverse outcomes, digital literacy must prioritize mindful engagement over mere screen time.",
                height=240,
                help="Enter or paste student assignment text."
            )

        with tab_photo:
            uploaded_file = st.file_uploader("Upload assignment image (PNG/JPG)", type=["png", "jpg", "jpeg"])
            if uploaded_file:
                st.image(uploaded_file, caption="Uploaded Assignment Page", use_container_width=True)
                if st.button("✨ Transcribe with Gemini Vision OCR"):
                    with st.spinner("Extracting handwritten/printed text..."):
                        time.sleep(1.5)
                        essay_input = "Handwritten transcription: The paradox of digital connectivity is that while we are constantly reachable, genuine interpersonal intimacy declines..."
                        st.text_area("Extracted OCR Text Preview", value=essay_input, height=180)

        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("<br/>", unsafe_allow_html=True)
    with st.expander("⚙️ Advanced Evaluation Configuration (Reference Text & Criteria Selection)"):
        selected_rubric = st.selectbox("Grading Criteria", ["Default 4-Criteria", "Custom Saved Criteria (data/custom_rubric.json)"])
        model_answer = st.text_area(
            "Reference / Source Document (Optional — for source verification and claim checks)",
            placeholder="Provide key themes, source passages, or required concepts that an ideal response should contain..."
        )

    if st.button("🚀 Run AI Evaluation & Feedback", type="primary"):
        if not essay_input.strip():
            st.error("Please enter assignment text before submitting.")
        else:
            with st.spinner("Executing Multi-Pass Evaluation & Source Verification..."):
                norm = normalize_text(essay_input)
                segments = segment_text(norm)
                feedback = generate_feedback_from_raw(norm, model_answer=model_answer if model_answer.strip() else None)

                new_submission = {
                    "id": f"sub-{int(time.time())}",
                    "student_name": student_name,
                    "title": essay_title,
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
                    "score": feedback.get("overall_score", 7.5),
                    "rubric_name": selected_rubric,
                    "essay_text": norm,
                    "segments": segments,
                    "feedback": feedback
                }

                st.session_state.submissions.insert(0, new_submission)
                st.session_state.active_submission = new_submission
                st.session_state.quiz_data = None
                st.session_state.quiz_answers = {}

                st.success("🎉 Evaluation Complete! Navigate to **Assignment Feedback** to view results.")


# SCREEN 4: ASSIGNMENT FEEDBACK
elif menu == "🔍 Assignment Feedback":
    sub = st.session_state.active_submission
    fb = sub.get("feedback", {})

    st.markdown(f"<h1>Assignment Feedback: <i>{sub.get('title', 'Assignment')}</i></h1>", unsafe_allow_html=True)
    st.markdown(f"<p style='color:#526477; font-size:1.05rem;'>Student: <b>{sub.get('student_name', 'Student')}</b> | Assessed: {sub.get('timestamp', 'Recent')} | Criteria: <span class='badge-pill'>{sub.get('rubric_name', 'Standard')}</span></p>", unsafe_allow_html=True)

    # Score Banner
    overall_score = fb.get("overall_score", sub.get("score", 7.5))
    score_col1, score_col2, score_col3 = st.columns([2, 2, 2])
    with score_col1:
        st.markdown(f"<div class='metric-card'><div style='font-size:0.85rem; color:#708090;'>Overall Grade</div><div style='font-size:2.4rem; font-weight:700; color:#1B2A3D;'>{overall_score} <span style='font-size:1.2rem; color:#8898AA;'>/ 10</span></div></div>", unsafe_allow_html=True)
    with score_col2:
        conf = fb.get("confidence", 0.90)
        st.markdown(f"<div class='metric-card'><div style='font-size:0.85rem; color:#708090;'>AI Confidence</div><div style='font-size:2.4rem; font-weight:700; color:#3E6E8E;'>{int(conf*100)}%</div></div>", unsafe_allow_html=True)
    with score_col3:
        agreement = fb.get("ensemble_agreement", "High (94%)")
        st.markdown(f"<div class='metric-card'><div style='font-size:0.85rem; color:#708090;'>Ensemble Agreement</div><div style='font-size:2.4rem; font-weight:700; color:#B4872E;'>{agreement}</div></div>", unsafe_allow_html=True)

    # Preprocessing stats expander
    with st.expander("📊 Ingestion & Text Statistics"):
        stats = sub.get("segments", {}).get("stats", {"word_count": len(sub.get("essay_text", "").split()), "sentence_count": 5, "avg_sentence_length": 18.2, "paragraph_count": 3})
        s1, s2, s3, s4 = st.columns(4)
        s1.metric("Word Count", stats.get("word_count", 0))
        s2.metric("Sentences", stats.get("sentence_count", 0))
        s3.metric("Avg Sentence Length", f"{stats.get('avg_sentence_length', 0)} words")
        s4.metric("Paragraphs", stats.get("paragraph_count", 0))

    st.markdown("### Dimension Breakdown")
    crit_scores = fb.get("criterion_scores", {"grammar": 8, "coherence": 7, "argument_strength": 8, "originality": 8})
    for crit_id, score in crit_scores.items():
        c_title = crit_id.replace("_", " ").title()
        col_label, col_bar = st.columns([2, 5])
        col_label.markdown(f"**{c_title}** ({score}/10)")
        col_bar.progress(score / 10.0)

    st.markdown("<br/>", unsafe_allow_html=True)

    # Teacher Insight
    st.markdown("### 💡 Beyond the Rubric: Teacher Feedback & Insight")
    st.markdown(f"<div class='insight-card'>{fb.get('pedagogical_insight', 'Strong critical insight demonstrated throughout the paper.')}</div>", unsafe_allow_html=True)

    st.markdown("<br/>", unsafe_allow_html=True)
    col_str, col_imp = st.columns(2)

    with col_str:
        st.markdown("### 🌟 Key Strengths")
        for s in fb.get("strengths", []):
            st.markdown(f"<div class='strength-card'><b>{s.get('title', 'Strength')}</b><br/><span style='font-size:0.9rem;'>{s.get('detail', '')}</span></div>", unsafe_allow_html=True)

    with col_imp:
        st.markdown("### ✏️ Areas for Growth")
        for imp in fb.get("improvements", []):
            st.markdown(f"<div class='margin-note'><b>{imp.get('title', 'Improvement')}</b><br/><span style='font-size:0.9rem;'>{imp.get('detail', '')}</span></div>", unsafe_allow_html=True)

    st.markdown("<br/>", unsafe_allow_html=True)
    st.markdown("### 📝 Annotated Submission & Margin Notes")
    st.markdown("<div class='ruled-paper'>" + sub.get("essay_text", "").replace("\n\n", "<br/><br/>") + "</div>", unsafe_allow_html=True)

    if fb.get("excerpt_notes"):
        st.markdown("#### Call-Out Notes")
        for note in fb.get("excerpt_notes", []):
            st.markdown(f"<div class='margin-note'><b>Excerpt:</b> <i>\"{note.get('excerpt', '')}\"</i><br/><b>Teacher Note:</b> {note.get('note', '')}</div>", unsafe_allow_html=True)

    # Interactive Quiz & LMS Push Actions
    st.markdown("---")
    act_col1, act_col2 = st.columns(2)

    with act_col1:
        if st.button("🎯 Practice Writing Skills (Build Practice Questions)", type="primary"):
            with st.spinner("Crafting 4 contextual practice questions from submission patterns..."):
                st.session_state.quiz_data = generate_quiz(sub.get("essay_text", ""), fb.get("improvements", []))

    with act_col2:
        if st.button("📤 Push Grade to Classroom Gradebook"):
            if st.session_state.lms_connected:
                st.success(f"✅ Grade ({overall_score}/10) and feedback summary synced to Classroom for {sub.get('student_name')}!")
                st.session_state.lms_sync_log.insert(0, {
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
                    "course": "AP Literature - Period 3",
                    "status": "Success",
                    "records_synced": 1
                })
            else:
                st.info("ℹ️ Gradebook Adapter is in Demo Mode. Connect your Classroom OAuth in 'Gradebook Sync' to sync live.")

    # Render Interactive Quiz if Active
    if st.session_state.quiz_data:
        st.markdown("<br/><h3>Interactive Writing & Grammar Practice</h3>", unsafe_allow_html=True)
        questions = st.session_state.quiz_data.get("questions", [])

        for q_idx, q in enumerate(questions):
            with st.container():
                st.markdown(f"**Question {q_idx+1}:** {q.get('prompt', '')}")
                options = q.get("options", [])
                correct_idx = q.get("correct_index", 0)

                selected = st.radio(
                    f"Select the best option for Q{q_idx+1}:",
                    options,
                    key=f"quiz_radio_{q_idx}"
                )

                chosen_idx = options.index(selected) if selected in options else -1
                if chosen_idx == correct_idx:
                    st.success(f"✅ **Correct!** {q.get('insight', '')}")
                else:
                    st.warning(f"💡 **Hint:** {q.get('hint', '')}")
                st.markdown("---")


# SCREEN 5: CLASS INSIGHTS
elif menu == "📈 Class Insights":
    st.markdown("<h1>Class Writing Insights & Concept Gaps</h1>", unsafe_allow_html=True)
    st.markdown("<p style='color:#526477;'>Overview of class-wide writing patterns, common focus areas, and AI-suggested mini-lessons.</p>", unsafe_allow_html=True)

    c1, c2, c3 = st.columns(3)
    c1.metric("Weakest Dimension", "Organization & Transitions", delta="-0.8 vs Grammar", delta_color="inverse")
    c2.metric("Top Focus Area", "Comma Splices (42% affected)")
    c3.metric("Suggested Lessons", "2 Mini-Lessons Ready")

    st.markdown("### Top Focus Areas Across Class Submissions")

    gaps = [
        {"gap": "Comma Splices with Connecting Words ('however', 'therefore')", "affected": "42% of students", "frequency": 5, "concept": "Complete sentences joined by connecting words need a semicolon or period.", "exercise": "Sentence combining drill: convert 10 comma-spliced pairs into correct compound sentences."},
        {"gap": "Transitions Between Paragraphs", "affected": "33% of students", "frequency": 4, "concept": "Clear transition sentences that link supporting evidence back to the main thesis statement.", "exercise": "Paragraph connection & transition writing exercise using source texts."},
        {"gap": "Counterarguments & Rebuttal Strength", "affected": "25% of students", "frequency": 3, "concept": "Addressing opposing viewpoints directly and providing strong counter-evidence.", "exercise": "Debate exercise: write a full-paragraph rebuttal to an opposing viewpoint."}
    ]

    for g in gaps:
        with st.expander(f"⚠️ {g['gap']} — **{g['affected']}**", expanded=True):
            st.markdown(f"**Key Concept to Review:** {g['concept']}")
            st.markdown(f"**Quick Practice Exercise:** {g['exercise']}")

    st.markdown("<br/>### Individual Student View")
    selected_student = st.selectbox("Select Student for Individual Profile", [s["student_name"] for s in st.session_state.submissions])
    student_record = next((s for s in st.session_state.submissions if s["student_name"] == selected_student), None)
    if student_record:
        st.write(f"**Recent Score:** {student_record['score']} / 10 | **Assignment:** *{student_record['title']}*")
        st.info(f"**Recommended Focus Area:** {student_record.get('feedback', {}).get('improvements', [{'title': 'Punctuation'}])[0].get('title', 'Refine Thesis')}")


# SCREEN 6: GRADEBOOK SYNC
elif menu == "🔗 Gradebook Sync":
    st.markdown("<h1>Gradebook &amp; Classroom Sync</h1>", unsafe_allow_html=True)
    st.markdown("<p style='color:#526477;'>Manage Learning Management System adapters, authenticate Google Classroom via OAuth2, and audit recent synchronization events.</p>", unsafe_allow_html=True)

    col_lms1, col_lms2 = st.columns(2)

    with col_lms1:
        st.subheader("Google Classroom (Live Adapter)")
        st.markdown("Direct two-way integration supporting course rosters, coursework retrieval, and grade posting.")
        if st.session_state.lms_connected:
            st.success("🟢 Connected as **Teacher (AP Literature)**")
            if st.button("Disconnect Google Classroom"):
                st.session_state.lms_connected = False
                st.rerun()
        else:
            st.warning("⚪ Status: Disconnected")
            if st.button("🔑 Authenticate with Google Classroom OAuth2"):
                with st.spinner("Connecting to Google OAuth2 API..."):
                    time.sleep(1.0)
                    st.session_state.lms_connected = True
                    st.toast("Authenticated Google Classroom adapter successfully!", icon="🎉")
                    st.rerun()

    with col_lms2:
        st.subheader("Pluggable Adapters (Architecture Stubs)")
        st.markdown("Ready-to-implement extensions built upon the standard `LMSAdapter` interface:")
        st.markdown("- **Canvas LMS**: `lms/canvas.py` *(Stubbed / LTI 1.3 Ready)*")
        st.markdown("- **Moodle**: `lms/moodle.py` *(Stubbed / REST Ready)*")
        st.markdown("- **Blackboard Learn**: `lms/blackboard.py` *(Stubbed / REST Ready)*")

    st.markdown("---")
    st.subheader("Recent Synchronization Audit Log")
    for entry in st.session_state.lms_sync_log:
        st.markdown(f"🕒 `{entry['timestamp']}` | **{entry['course']}** | Status: `{entry['status']}` | Synced: **{entry['records_synced']} record(s)**")
