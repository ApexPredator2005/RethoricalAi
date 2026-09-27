# RethoricalAI — AI Essay Feedback & Grading Platform

> **Accurate, rubric-anchored automated essay grading, ensemble-scored feedback, concept-gap analytics, contextual grammar quizzes, and enterprise LMS synchronization.**

---

## 📌 Executive Overview

**RethoricalAI** is an advanced AI writing evaluation platform engineered specifically for educators and students. Built with an authentic **"Annotated Paper / Teacher's Desk"** aesthetic, RethoricalAI moves beyond generic SaaS cards to deliver actionable margin annotations, rubric-anchored score calibration, source-document alignment checks, and targeted grammar remediation while reducing teacher grading workloads by over 70%.

---

## 🏛️ System Architecture

```text
+-----------------------------------------------------------------------------------+
|                                 INPUT CHANNELS                                    |
|     [ Student Typed Text ]      |     [ OCR Scan / Photo / Multi-page PDF ]       |
+---------------------------------+-------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------------------+
|                        PREPROCESSING & SANITIZATION                               |
|   - Maximum payload bounds validation (100k char limit, null byte stripping)     |
|   - Unicode NFKC normalization & smart typographic symbol translation             |
|   - Sentence splitting & paragraph boundary detection (NLTK punkt / regex)        |
|   - Surface lexical metrics (word count, sentence count, avg sentence length)     |
+---------------------------------+-------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------------------+
|                             RUBRIC ENGINE & ANCHORS                               |
|   - Normalized scoring: [scale_min, scale_max] -> [0, 1] before weight scaling    |
|   - Interactive weight validation (ensures sum(weights) == 1.0)                   |
|   - Concrete score-band anchor snippets (Low: 2-3 | Mid: 5-6 | High: 8-9)          |
|   - Optional Model Answer / Reference Document Grounding                          |
+---------------------------------+-------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------------------+
|                   AI GRADING & EVALUATION ENGINE (Gemini)                         |
|   - Rubric-anchored prompt synthesis                                              |
|   - 3-Pass Ensemble Median Scoring (removes outlier variance)                     |
|   - Verbatim excerpt margin note grounding & hallucination protection             |
|   - Defensive JSON extraction with automatic retry on malformed responses         |
+---------------------+---------------------+---------------------------------------+
                      |                     |
                      v                     v
+-------------------------+ +-------------------------+ +---------------------------+
|  ACCURACY BENCHMARKING  | |    ANALYTICS ENGINE     | |    GRAMMAR QUIZ ENGINE    |
| - Quadratic Weighted    | | - Class concept gaps    | | - 4 targeted MCQs         |
|   Kappa (QWK)           | | - Weakest criterion     | | - Essay excerpt stems     |
| - Agreement within +/-1 | | - Mini-lesson generator | | - Personalized insights & |
| - Model confidence      | | - Student drill-down    | |   grammar rule breakdown  |
+-------------------------+ +-------------------------+ +---------------------------+
                      |                     |                         |
                      +---------------------+-------------------------+
                                            |
                                            v
+-----------------------------------------------------------------------------------+
|                            LMS INTEGRATION LAYER                                  |
|   - Google Classroom (Live OAuth2 sync for courses, coursework, and grades)       |
|   - Canvas, Moodle, Blackboard (Polymorphic ready-to-wire adapter stubs)          |
+-----------------------------------------------------------------------------------+
                                            |
                                            v
+-----------------------------------------------------------------------------------+
|                            USER INTERFACE PLATFORMS                               |
|   - React 19 + Vite Frontend (Stitch Design System, Day/Night grading modes)      |
|   - Multi-Page Streamlit App (backend/app.py for standalone rapid deployment)     |
+-----------------------------------------------------------------------------------+
```

---

## ✨ Comprehensive Feature Matrix

### 1. Rubric-Anchored Grading Engine
- **Customizable Rubrics**: Dynamic criteria with custom descriptions, scale ranges, and relative weight allocations.
- **Scale Normalization**: Automatically normalizes individual criterion ranges ($[\text{scale\_min}, \text{scale\_max}] \to [0, 1]$) prior to weight multiplication, preventing larger scale dimensions from silently dominating the composite grade.
- **Anchor Snippet Calibration**: Grounded by concrete low, mid, and high exemplar snippets to enforce consistent grading standards across passes.

### 2. Ensemble Scoring & Variance Transparency
- **3-Pass Sampling**: Samples independent model passes with controlled temperature variation.
- **Median Metric Aggregation**: Takes the median score per criterion across passes to eliminate single-pass hallucinations.
- **Cross-Pass Consensus**: Calculates and surfaces agreement metrics directly to teachers (e.g., *"3-Pass Agreement: High (94%)"*).

### 3. Reference-Document Grounded Evaluation
- **Dual-Mode Auto-Selection**:
  - **Mode A (Direct Inject $\le$ 3,000 words)**: Full reference text injected into prompt for close reading validation.
  - **Mode B (Chunked TF-IDF Retrieval $>$ 3,000 words)**: Overlapping chunk index with cosine similarity retrieval for long documents/books.
- **Source Alignment Verification**: Generates explicit claim verification tables tagged as `supported`, `contradicted`, or `unverified_against_source` with verbatim source excerpts.

### 4. Diagnostic Class Analytics
- **Cohort Misconception Clustering**: Aggregates recurring weaknesses across student submissions (e.g., *"42% of students struggle with thesis specificity"*).
- **Targeted Reteaching Recommendations**: Generates 15-minute mini-lesson plans and focused skill-building drills.
- **Individual Student Drilldown**: Comparative student trajectory against class benchmark averages.

### 5. Interactive Contextual Grammar Quizzes
- **Contextual MCQ Generation**: Generates 4 multiple-choice questions pulling real sentence stems directly from the student's essay.
- **Actionable Remediation**: Instant feedback accompanied by grammar rule explanations and personalized writing habit notes.

### 6. Enterprise LMS Integration
- **Google Classroom Adapter (Live)**: OAuth2 authentication supporting course roster retrieval, assignment discovery, and direct gradebook submission with feedback notes.
- **Polymorphic Stubs**: Standardized `LMSAdapter` implementations for **Canvas**, **Moodle**, and **Blackboard Learn**.

### 7. Dual Frontend Implementations
- **React + Vite App (`src/`)**: High-performance client matching the Stitch design system with Day/Night grading ambience modes.
- **Streamlit App (`backend/app.py`)**: Multi-page interactive application for standalone hackathon demonstrations.

---

## 🛠️ Frameworks, Libraries & Technologies

### Frontend
- **React 19** & **React DOM 19**: Modern component architecture with hooks.
- **Vite 8**: Next-generation lightning-fast frontend tooling and bundling.
- **Tailwind CSS**: Utility-first styling with custom design tokens (`#FCFBF7` paper, `#1B2A3D` ink, `#FE5D26` red-pen accent, `#F2C078` gold highlight, `#C1DBB3` sage).
- **Google Fonts**: *Source Serif 4* (editorial typography), *Plus Jakarta Sans* / *Inter* (UI chrome), *JetBrains Mono* (code/metrics).
- **Canvas Confetti**: Visual celebration on quiz completion.
- **Oxlint**: High-speed JavaScript/JSX linter.

### Backend & AI
- **Python 3.10+**: Core backend runtime.
- **Google Generative AI SDK (`google-generativeai`)**: Powered by **Gemini 2.5 Flash / Gemini 1.5 Flash** models.
- **Scikit-Learn**: For TF-IDF vectorization and Quadratic Weighted Kappa (QWK) computation *(with pure-Python fallback)*.
- **NLTK / Regex**: Sentence tokenization and text segmentation.
- **Google OAuth2 & API Client**: `google-auth-oauthlib`, `google-api-python-client` for Google Classroom.
- **Streamlit**: Python web application framework for rapid interactive deployment.
- **Python-dotenv**: Environment configuration manager.

---

## 🔒 Security, Privacy & Input Sanitization

- **Zero Hardcoded Secrets**: All API keys and OAuth tokens are strictly read from environment variables (`.env`).
- **Git Security**: Sensitive patterns (`.env`, `token.json`, `credentials.json`, `*.pem`, `*.key`) are ignored in `.gitignore`.
- **Input Sanitization**:
  - Maximum payload bounds (100,000 characters for essays, 500,000 for reference documents).
  - Null bytes (`\x00`) and dangerous non-printable control characters are stripped.
  - Unicode NFKC normalization prevents homoglyph attacks.
- **FERPA / GDPR Compliance**: Stateless LLM calls with zero external data retention; synthetic datasets used for validation benchmarks.

---

## 🚀 Setup & Installation Guide

### Prerequisites
- Python 3.10 or higher
- Node.js 18+ and npm
- Google Gemini API Key

### 1. Repository Setup

```bash
# Clone the repository
git clone https://github.com/Asu2407/TCS-hck.git
cd TCS-hck

# Install frontend dependencies
npm install
```

### 2. Backend Environment Configuration

```bash
# Navigate to backend
cd backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
```

Edit `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GOOGLE_CLASSROOM_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLASSROOM_CLIENT_SECRET=your_client_secret
```

---

## 💻 Running the Applications

### Launch React Frontend:
```bash
# In project root
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Launch Streamlit Backend App:
```bash
# In backend directory
streamlit run app.py
```
Open [http://localhost:8501](http://localhost:8501) in your browser.

---

## 🧪 Testing & Accuracy Benchmarking

### Run Automated Unit Test Suite (85 Tests):
```bash
cd backend
python3 -m unittest discover -s . -p "test_*.py"
```

### Run QWK Accuracy Evaluation Benchmark:
```bash
cd backend
python3 accuracy_eval.py
```

### Run Frontend Linter & Production Build:
```bash
npm run lint
npm run build
```

---

## 📄 License & Attribution

Designed and developed for the TCS Hackathon under the MIT License.
