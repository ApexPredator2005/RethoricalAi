import React from 'react';
import { X, Download, Copy, Check } from 'lucide-react';

const SPEC_TEXT = `
# RethoricalAI — Design Specification v1.0
## Exported for Code-Generation Handoff
---

## Color Palette

| Token | Day Mode Value | Night Mode Value | Usage |
|---|---|---|---|
| --bg-app | #F5F3EC | #0F151F | App shell background |
| --bg-paper | #FCFBF7 | #16202D | Main content surface |
| --text-primary | #1B2A3D | #E8ECF1 | Body text, headings |
| --text-secondary | #4A5B6E | #9DAEBF | Labels, helper text |
| --accent-red | #B0503A | #E6735C | Corrections, error annotations, CTAs |
| --accent-gold | #B4872E | #E5BB5A | Praise, strengths, scores |
| --accent-blue | #3E6E8E | #649EC4 | Insights, analytics, info |

## Typography

| Usage | Font | Weight |
|---|---|---|
| Headings, essay body, feedback prose | Source Serif 4 | 400, 600, 700 |
| UI chrome, buttons, labels, nav | Inter | 300, 400, 500, 600, 700 |
| Handwritten margin annotations | Caveat | 600, 700 |

## Screen Inventory (6 Screens)

### 1. Teacher Dashboard
- Quick stats: Avg score, Essays needing review, Top gap concept, LMS sync status
- Active assignments grid with grading progress bars
- Submissions table: student name, title, word count, key pattern flag, score, action

### 2. Rubric Builder
- Repeatable criterion rows (name, description, weight%, max points)
- Row actions: reorder up/down, duplicate, delete
- Preset template loader (AP Lit, Argumentative, DBQ)
- Live interactive preview panel with draggable score sliders

### 3. Essay Submission (Student-facing)
- Mode: Paste text OR Upload+OCR photo/PDF
- Ruled notebook paper textarea with red margin line (CSS background-image)
- Live word/paragraph/reading-time stats
- Submit → triggers AI evaluation

### 4. Feedback Report (Core Screen)
- Overall score badge + Letter Grade with "teacher stamp" rotate(-3deg) decoration
- Per-criterion score bars (color-coded: gold ≥90%, blue ≥80%, red <80%)
- Essay body on ruled notebook paper with red margin line at left
- Inline text highlights: red=correction, gold=praise, blue=insight
- Interactive margin notes column (click note ↔ highlights text)
- "Beyond the Rubric" pedagogical insight box (blue accent box)
- Grammar patterns quiz entry banner (gold accent box)

### 5. Analytics Dashboard
- 4 overview KPI cards
- Aggregated concept gap bars (color by severity)
- Ranked re-teach topics with mini-lesson plan display
- Per-student roster table with scores, struggles, trend

### 6. LMS Sync Panel
- Connected LMS card (Google Classroom): status, auto-sync toggle, manual sync button
- Coming Soon stubs for Canvas, Moodle, Blackboard, Schoology (opacity 0.7, dashed border)
- Sync activity log table with timestamps and status

## Visual Signature (Ruled Notebook Lines)

Applied ONLY to:
- Essay Submission textarea
- Feedback Report essay body

CSS Implementation:
\`\`\`css
.ruled-notebook-paper {
  background-color: var(--bg-paper);
  background-image: linear-gradient(var(--ruled-line-color) 1px, transparent 1px);
  background-size: 100% 32px;
}
.paper-left-margin {
  position: absolute;
  left: 64px;
  top: 0; bottom: 0;
  width: 2px;
  background-color: var(--margin-red-line);
}
\`\`\`

## Component Architecture

src/
  components/
    Header.jsx           — Class selector, role toggle, night mode, export specs
    Sidebar.jsx          — Left nav with active state & badges
    GrammarQuizModal.jsx — Multi-question grammar quiz modal
    NewAssignmentModal.jsx — Create assignment form modal
  screens/
    TeacherDashboardScreen.jsx
    RubricBuilderScreen.jsx
    EssaySubmissionScreen.jsx
    FeedbackReportScreen.jsx
    AnalyticsDashboardScreen.jsx
    LmsSyncScreen.jsx
  data/
    mockData.js          — All mock data: classes, rubric, essay, analytics, LMS

## Dark Mode

Toggle via data-theme="night" on <html> or root element.
Full palette inversion — same hue family, luminance flipped.
Night mode inverts the ink/paper relationship (dark ink bg, cream text).
`;

export default function DesignSpecsModal({ onClose }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SPEC_TEXT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([SPEC_TEXT], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marginalia-design-specs.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      backdropFilter: 'blur(4px)'
    }}>
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: 'var(--bg-paper)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '85vh',
          margin: '16px',
          boxShadow: 'var(--shadow-floating)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-strong)',
            borderRadius: '6px', width: '30px', height: '30px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <X size={16} color="var(--text-secondary)" />
        </button>

        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>Design Specification — Code Generation Handoff</h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Full design spec in Markdown format. Copy or download to hand off to a code generation tool.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button onClick={handleCopy} className="btn-secondary" style={{ fontSize: '0.84rem' }}>
            {copied ? <Check size={15} color="var(--accent-gold)" /> : <Copy size={15} />}
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>
          <button onClick={handleDownload} className="btn-accent-red" style={{ fontSize: '0.84rem' }}>
            <Download size={15} />
            <span>Download .md</span>
          </button>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-paper)',
          borderRadius: 'var(--radius-md)',
          padding: '20px'
        }}>
          <pre style={{
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            color: 'var(--text-primary)',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
            margin: 0
          }}>
            {SPEC_TEXT}
          </pre>
        </div>
      </div>
    </div>
  );
}
