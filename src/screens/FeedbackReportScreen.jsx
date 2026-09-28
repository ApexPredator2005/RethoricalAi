import React, { useState } from 'react';
import { ORIGINALITY_METRICS, DRAFT_COMPARISON, FEEDBACK_TONES } from '../data/mockData';

const SAMPLE_SOURCE_ALIGNMENTS = [
  {
    essay_claim: "Gatsby revalues every object in his estate solely through Daisy's gaze.",
    source_excerpt: "He hadn't once ceased looking at Daisy, and I think he revalued everything in his house according to the measure of response it drew from her well-loved eyes.",
    verdict: "supported"
  },
  {
    essay_claim: "The green light motif operates as an unattainable spectral beacon.",
    source_excerpt: "You always have a green light that burns all night at the end of your dock.",
    verdict: "supported"
  },
  {
    essay_claim: "Gatsby directly tells Nick that Daisy never loved Tom Buchanan.",
    source_excerpt: null,
    verdict: "unverified_against_source"
  }
];

const PRESET_QUICK_STAMPS = [
  { id: 'stamp-1', label: 'Strong Evidence', icon: 'star', color: 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary/30' },
  { id: 'stamp-2', label: 'Needs Citation', icon: 'warning', color: 'bg-primary-fixed text-primary border-primary/30' },
  { id: 'stamp-3', label: 'Explain Deeper', icon: 'search', color: 'bg-secondary-fixed text-on-secondary-fixed border-secondary/30' },
  { id: 'stamp-4', label: 'Great Transition', icon: 'swap_calls', color: 'bg-surface-container-high text-on-surface border-surface-container-highest' },
  { id: 'stamp-5', label: 'Core Thesis Point', icon: 'adjust', color: 'bg-tertiary-fixed-dim text-on-tertiary-container border-tertiary/40' }
];

export default function FeedbackReportScreen({ onOpenQuiz }) {
  const [activeNote, setActiveNote] = useState(null);
  const [pushedToLms, setPushedToLms] = useState(false);
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'draft_diff'
  const [feedbackTone, setFeedbackTone] = useState('standard');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(14); // seconds
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNotes, setVoiceNotes] = useState([
    { id: 'vn-1', duration: '0:34', recordedAt: 'Today, 2:15 PM', teacher: 'Ms. Holloway' }
  ]);
  const [userStamps, setUserStamps] = useState([
    { id: 'us-1', label: 'Strong Evidence', line: 14, icon: 'star', text: 'Seamless textual embedding!' }
  ]);

  const handlePushGrade = () => {
    setPushedToLms(true);
    setTimeout(() => setPushedToLms(false), 3500);
  };

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
  };

  const handleAddStamp = (stamp) => {
    const newStamp = {
      id: `us-${Date.now()}`,
      label: stamp.label,
      line: 28,
      icon: stamp.icon,
      text: `Teacher stamp: ${stamp.label} added to manuscript.`
    };
    setUserStamps([...userStamps, newStamp]);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoiceNotes([
        ...voiceNotes,
        { id: `vn-${Date.now()}`, duration: '0:28', recordedAt: 'Just now', teacher: 'Ms. Holloway (New Voice Clip)' }
      ]);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* Top Banner / Assessment Identity Header */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg pb-space-sm border-b border-surface-container">
        <div className="space-y-space-xs max-w-2xl">
          <div className="flex items-center gap-space-sm">
            <span className="font-code-inline text-code-inline text-secondary font-medium tracking-wide uppercase">
              Graded Submission • Period 3 AP Lit
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Archived 20m ago</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Assignment Feedback: Julian Vance — The Great Gatsby Analysis
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Evaluated against AP Literature Analytical Synthesis Rubric (100-Point Analytic Scale). Assessed on September 24, 2026.
          </p>

          {/* View Mode & Feedback Tone Controls */}
          <div className="pt-2 flex flex-wrap items-center gap-space-sm">
            {/* Draft Diff Mode Switcher */}
            <div className="inline-flex items-center bg-surface-container p-0.5 rounded-lg border border-surface-container-high">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`px-3 py-1 rounded text-xs font-label-md font-semibold transition-all ${
                  viewMode === 'single'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Single Draft View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('draft_diff')}
                className={`px-3 py-1 rounded text-xs font-label-md font-semibold transition-all flex items-center gap-1 ${
                  viewMode === 'draft_diff'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px] text-tertiary">difference</span>
                <span>Draft 1 vs. Draft 2 Diff (+9 pts)</span>
              </button>
            </div>

            {/* Tone Selector */}
            <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded-lg border border-surface-container text-xs font-label-sm">
              <span className="text-on-surface-variant font-medium">Feedback Tone:</span>
              <select
                value={feedbackTone}
                onChange={(e) => setFeedbackTone(e.target.value)}
                className="bg-transparent text-on-surface font-semibold focus:outline-none cursor-pointer"
              >
                {FEEDBACK_TONES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-lg shrink-0">
          {/* Grade Circle Badge */}
          <div className="relative flex items-center justify-center p-space-sm">
            <svg className="w-28 h-28 transform -rotate-12" viewBox="0 0 120 120">
              <circle
                className="text-primary-container opacity-85"
                cx="60"
                cy="60"
                fill="none"
                r="52"
                stroke="currentColor"
                strokeDasharray="14 4 10 3 12 5"
                strokeWidth="2.5"
              />
              <circle
                className="text-primary opacity-60"
                cx="60"
                cy="60"
                fill="none"
                r="48"
                stroke="currentColor"
                strokeDasharray="6 3 24 4"
                strokeWidth="1.5"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold leading-none">
                91
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                / 100 (A-)
              </span>
              <span className="font-annotation-note text-annotation-note text-primary font-medium tracking-tight mt-0.5">
                Top 20% of Class
              </span>
            </div>
          </div>

          {/* Actions Station */}
          <div className="flex flex-col gap-space-xs w-full sm:w-auto">
            <button
              onClick={handlePushGrade}
              className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:brightness-105 active:translate-y-0.5 transition-all font-semibold"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              {pushedToLms ? 'Grade Pushed Successfully! ✓' : 'Push Grade to Classroom'}
            </button>

            <div className="flex items-center gap-space-xs">
              <button
                onClick={onOpenQuiz}
                className="flex-1 inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded bg-tertiary-fixed text-on-tertiary-container hover:bg-tertiary-fixed-dim transition-colors font-label-md text-label-md font-semibold border border-tertiary/20"
                type="button"
                title="Launch practice questions based on Julian's flagged writing patterns"
              >
                <span className="material-symbols-outlined text-[17px]">quiz</span>
                Practice Writing Skills
              </button>
              <button
                onClick={() => alert('Annotated Submission PDF generated!')}
                className="p-space-xs rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors border border-surface-container"
                title="Export Annotated PDF"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              </button>
              <button
                onClick={() => window.print()}
                className="p-space-xs rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors border border-surface-container"
                title="Print Submission"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DRAFT 1 VS DRAFT 2 REVISION COMPARISON BANNER (Visible when diff mode active) */}
      {viewMode === 'draft_diff' && (
        <section className="p-space-lg rounded-xl bg-surface-container-lowest border-2 border-tertiary/40 shadow-sm space-y-space-md animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-container flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">trending_up</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Draft Progress Analysis: v1.0 $\to$ v2.0
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-xs font-bold">
                    {DRAFT_COMPARISON.currentDraft.scoreDelta} ({DRAFT_COMPARISON.previousDraft.score} $\to$ {DRAFT_COMPARISON.currentDraft.score}/100)
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {DRAFT_COMPARISON.currentDraft.resolvedCount} • Word Count: {DRAFT_COMPARISON.previousDraft.wordCount} $\to$ {DRAFT_COMPARISON.currentDraft.wordCount} words (+180 words of analytical synthesis).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-label-sm text-tertiary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                All Revision Targets Met
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
            {DRAFT_COMPARISON.currentDraft.resolvedImprovements.map((imp, idx) => (
              <div key={idx} className="p-space-sm rounded-lg bg-surface-container-low border border-surface-container flex items-start gap-2">
                <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">task_alt</span>
                <div>
                  <span className="font-label-sm text-xs font-semibold text-on-surface block">{imp.item}</span>
                  <span className="text-[11px] font-annotation-note text-tertiary font-bold">{imp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AUDIO VOICE FEEDBACK & QUICK-STAMPS ACTION BAR */}
      <section className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
        {/* Audio Player */}
        <div className="flex items-center gap-space-md w-full lg:w-auto">
          <button
            type="button"
            onClick={toggleAudio}
            className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md hover:bg-primary transition-all shrink-0 active:scale-95"
            title={audioPlaying ? 'Pause Voice Feedback' : 'Play Teacher Voice Note'}
          >
            <span className="material-symbols-outlined text-[24px]">
              {audioPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
          
          <div className="flex flex-col min-w-0 flex-1 sm:w-72">
            <div className="flex items-center justify-between font-label-sm text-xs">
              <span className="font-bold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">mic</span>
                Teacher Voice Memo (Ms. Holloway)
              </span>
              <span className="font-code-inline text-on-surface-variant">
                {audioPlaying ? `0:${String(audioTime).padStart(2, '0')}` : '0:34'}
              </span>
            </div>

            {/* Simulated Audio Waveform Bar */}
            <div className="flex items-center gap-1 py-1.5 cursor-pointer">
              {[40, 65, 30, 85, 95, 60, 45, 75, 90, 35, 70, 80, 50, 65, 40, 85, 90, 60, 30, 45].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all ${
                    i < 10 ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                  style={{ height: `${h * 0.22}px` }}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleRecord}
            className={`px-3 py-1.5 rounded-lg text-xs font-label-sm font-semibold flex items-center gap-1.5 transition-all ${
              isRecording
                ? 'bg-error text-on-error animate-pulse'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isRecording ? 'stop_circle' : 'mic'}
            </span>
            <span>{isRecording ? 'Recording (Click Stop)' : 'Record Voice Note'}</span>
          </button>
        </div>

        {/* Quick-Stamp Palette */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-surface-container">
          <span className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider mr-1">
            Quick Stamps:
          </span>
          {PRESET_QUICK_STAMPS.map(stamp => (
            <button
              key={stamp.id}
              type="button"
              onClick={() => handleAddStamp(stamp)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-label-sm font-semibold border shadow-xs transition-transform active:scale-95 ${stamp.color}`}
              title={`Click to stamp "${stamp.label}" onto student submission`}
            >
              <span className="material-symbols-outlined text-[14px]">{stamp.icon}</span>
              <span>{stamp.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Rubric Diagnostic Bands */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Criterion 1 */}
        <div className="flex flex-col justify-between p-space-md rounded-lg bg-surface-container-lowest shadow-[0_2px_8px_rgba(31,27,21,0.03)] gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Thesis &amp; Argument</span>
            <span className="font-code-inline text-code-inline text-tertiary font-bold">24 / 25</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full bg-tertiary-container rounded-full" style={{ width: '96%' }}></div>
          </div>
          <p className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Exemplary line of reasoning
          </p>
        </div>

        {/* Criterion 2 */}
        <div className="flex flex-col justify-between p-space-md rounded-lg bg-surface-container-lowest shadow-[0_2px_8px_rgba(31,27,21,0.03)] gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Textual Evidence &amp; Synthesis</span>
            <span className="font-code-inline text-code-inline text-secondary font-bold">32 / 35</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full bg-secondary-container rounded-full" style={{ width: '91%' }}></div>
          </div>
          <p className="font-label-sm text-label-sm text-secondary flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">auto_stories</span>
            Strong integration of quotes
          </p>
        </div>

        {/* Criterion 3 */}
        <div className="flex flex-col justify-between p-space-md rounded-lg bg-surface-container-lowest shadow-[0_2px_8px_rgba(31,27,21,0.03)] gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Organization &amp; Flow</span>
            <span className="font-code-inline text-code-inline text-secondary font-bold">17 / 20</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full bg-secondary-container rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 truncate" title="Solid topic sentences; paragraph 3 needs smoother pivot">
            <span className="material-symbols-outlined text-[14px]">swap_calls</span>
            Paragraph 3 needs pivot tuning
          </p>
        </div>

        {/* Criterion 4 */}
        <div className="flex flex-col justify-between p-space-md rounded-lg bg-surface-container-lowest shadow-[0_2px_8px_rgba(31,27,21,0.03)] gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Voice, Style &amp; Mechanics</span>
            <span className="font-code-inline text-code-inline text-tertiary font-bold">18 / 20</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full bg-tertiary-container rounded-full" style={{ width: '90%' }}></div>
          </div>
          <p className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            High academic register
          </p>
        </div>
      </section>

      {/* ORIGINALITY & SOURCE OVERLAP INTEGRITY SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
              Originality &amp; Authenticity Score
            </span>
            <span className="material-symbols-outlined text-[20px] text-tertiary">fingerprint</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display-lg text-display-lg font-bold text-tertiary">
              {ORIGINALITY_METRICS.originalityScore}%
            </span>
            <span className="font-label-sm text-xs text-on-surface-variant font-medium">Authentic Synthesis</span>
          </div>
          <div className="mt-2 text-xs font-label-sm text-tertiary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">verified_user</span>
            {ORIGINALITY_METRICS.citationHealth}
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container space-y-2">
          <span className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider block">
            Textual Composition Breakdown
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-1">
            {ORIGINALITY_METRICS.breakdown.map((item, idx) => (
              <div key={idx} className="p-2 rounded bg-surface-container-low border border-surface-container space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-on-surface">{item.percentage}%</span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                </div>
                <span className="font-label-sm text-[11px] font-semibold text-on-surface block leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Diagnostic Cards: Strengths vs Opportunities */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        {/* Strengths Card */}
        <div className="flex flex-col gap-space-sm p-space-lg rounded-xl bg-surface-container-low shadow-[0_2px_12px_rgba(31,27,21,0.04)] relative border border-surface-container">
          <div className="flex items-center gap-space-xs text-secondary">
            <span className="material-symbols-outlined text-[20px]">thumb_up</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Demonstrated Strengths</h2>
          </div>
          <div className="flex flex-col gap-space-xs pt-space-xs">
            <div className="p-space-sm rounded bg-surface-container-lowest flex items-start gap-space-sm border border-surface-container">
              <span className="w-2 h-2 rounded-full bg-secondary-container mt-2 shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Clear Analysis &amp; Point of View</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Julian formulates an articulate stance detailing how Gatsby treats social respectability as an engineered stage performance rather than simple social climbing.
                </p>
              </div>
            </div>
            <div className="p-space-sm rounded bg-surface-container-lowest flex items-start gap-space-sm border border-surface-container">
              <span className="w-2 h-2 rounded-full bg-secondary-container mt-2 shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Effective Use of Symbols</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Skillful textual analysis connecting the dock's green light to the siren-like quality of Daisy Buchanan's voice ("full of money").
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Areas to Improve Card */}
        <div className="flex flex-col gap-space-sm p-space-lg rounded-xl bg-surface-container-low shadow-[0_2px_12px_rgba(31,27,21,0.04)] relative border border-surface-container">
          <div className="flex items-center gap-space-xs text-primary">
            <span className="material-symbols-outlined text-[20px]">edit_attributes</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Target Areas for Revision</h2>
          </div>
          <div className="flex flex-col gap-space-xs pt-space-xs">
            <div className="p-space-sm rounded bg-surface-container-lowest flex items-start gap-space-sm border border-surface-container">
              <span className="w-2 h-2 rounded-full bg-primary-container mt-2 shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Unclear Pronoun References</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Clarify ambiguous pronoun references in paragraph 2 ("In doing this, it demonstrates..."). Replace empty fillers with the direct symbolic agent.
                </p>
              </div>
            </div>
            <div className="p-space-sm rounded bg-surface-container-lowest flex items-start gap-space-sm border border-surface-container">
              <span className="w-2 h-2 rounded-full bg-primary-container mt-2 shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Connective Rhetoric in Section Transitions</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Smooth the abrupt pivot between paragraph 2's socio-economic geography and paragraph 3's psychological time distortion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOURCE ALIGNMENT & TEXTUAL VERIFICATION SECTION */}
      <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container space-y-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs border-b border-surface-container">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[22px] text-secondary">fact_check</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Source Alignment &amp; Textual Verification
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-xs font-bold uppercase">
            Mode A: Direct Ingest Active
          </span>
        </div>

        {/* Source Alignment Note (Honest Uncertainty Framing) */}
        <div className="p-space-sm rounded-lg bg-surface-container-low border border-surface-container flex items-start gap-2 text-on-surface-variant font-annotation-note text-annotation-note">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">info</span>
          <span>
            Source alignment checks are based on <strong>full document</strong> and should be spot-checked by the teacher, especially any 'contradicted' verdicts before treating them as fact.
          </span>
        </div>

        {/* Alignment Claims List */}
        <div className="space-y-space-xs">
          {SAMPLE_SOURCE_ALIGNMENTS.map((item, idx) => {
            const isSupported = item.verdict === 'supported';
            const isContradicted = item.verdict === 'contradicted';

            return (
              <div
                key={idx}
                className="p-space-md rounded-xl bg-surface-container-low border border-surface-container space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase tracking-wider">
                    Student Claim #{idx + 1}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded font-label-sm text-xs font-bold uppercase ${
                      isSupported
                        ? 'bg-tertiary-fixed text-on-tertiary-container'
                        : isContradicted
                        ? 'bg-primary-fixed text-primary'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    {isSupported ? '✓ Supported by Source' : isContradicted ? '✗ Contradicted' : '? Unverified Against Source'}
                  </span>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface font-semibold">
                  “{item.essay_claim}”
                </p>

                {item.source_excerpt ? (
                  <div className="border-l-2 border-tertiary pl-3 py-1 bg-surface-container-lowest rounded-r">
                    <span className="font-label-sm text-[11px] font-bold text-tertiary block">
                      Exact Verbatim Source Excerpt:
                    </span>
                    <span className="font-annotation-note text-annotation-note text-on-surface-variant italic">
                      “{item.source_excerpt}”
                    </span>
                  </div>
                ) : (
                  <div className="border-l-2 border-outline-variant pl-3 py-1 bg-surface-container-lowest rounded-r">
                    <span className="font-annotation-note text-annotation-note text-on-surface-variant italic">
                      No matching direct quotation found in provided source text. Retained for teacher spot-check.
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Signature Visual: Annotated Manuscript on Ruled Notebook Canvas */}
      <section className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">history_edu</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              Annotated Submission (Draft 2)
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {3 + userStamps.length} teacher notes attached
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Word count: 1,420</span>
          </div>
        </div>

        {/* Ruled Paper Desk Container */}
        <div className="relative bg-[#FAEDCA] p-4 md:p-8 lg:p-12 rounded-2xl shadow-[0_8px_30px_rgba(31,27,21,0.08)] overflow-hidden border border-[#D9C49B]">
          {/* Background Ruled Desk Visual Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, #5b4139 0px, #5b4139 1px, transparent 1px, transparent 32px)' }}
          ></div>

          {/* Document Sheet (heavy cotton white paper with left margin guide) */}
          <div className="relative max-w-5xl mx-auto bg-surface-container-lowest rounded-sm shadow-[0_4px_24px_rgba(43,38,32,0.12)] p-6 md:p-12 lg:p-16 border border-[#EBE1D7]">
            {/* Red left margin guide line */}
            <div className="hidden md:block absolute left-20 top-0 bottom-0 w-[1.5px] bg-red-300 opacity-60 pointer-events-none"></div>

            {/* Essay Content & Margin Annotations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
              {/* Essay Body Column */}
              <div className="lg:col-span-8 flex flex-col gap-space-lg text-on-surface md:pl-8">
                <header className="flex flex-col pb-space-sm border-b border-surface-container">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Julian Vance • AP English Literature</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Teacher: Ms. Claire Holloway</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-space-sm font-bold">
                    The Gilded Mirage: Fabricated Identity and Commodification in Fitzgerald's West Egg
                  </h3>
                </header>

                <p className="font-body-lg text-body-lg text-on-surface leading-loose">
                  Throughout F. Scott Fitzgerald's 1925 masterpiece, the American Dream undergoes relentless deconstruction. Rather than portraying Gatsby as an authentic visionary, the novel posits that his fortune and personal history are commodified artifacts constructed to mimic hereditary privilege.
                </p>

                {/* Paragraph 2 with Sage Praise Highlight */}
                <p className="font-body-lg text-body-lg text-on-surface leading-loose">
                  The geography of Long Island serves as an external projection of class antagonism. While East Egg glistens with careless aristocratic indifference, West Egg acts as a loud carnival of imitation.{' '}
                  <mark
                    onClick={() => setActiveNote('note-1')}
                    className={`px-1 py-0.5 rounded cursor-pointer transition-colors relative inline ${
                      activeNote === 'note-1'
                        ? 'bg-tertiary text-on-tertiary font-medium shadow-sm'
                        : 'bg-tertiary-fixed text-on-surface hover:bg-tertiary-fixed-dim'
                    }`}
                  >
                    Fitzgerald establishes the green light not merely as an aspirational beacon, but as an indictment of Gatsby's tragic reduction of love to material conquest.
                  </mark>{' '}
                  Daisy is never simply a long-lost romance; she represents the physical embodiment of the unattainable past that Gatsby insists on purchasing through bootlegger profits.
                </p>

                {/* Paragraph 3 with Burnt Orange Syntax Revision Highlight */}
                <p className="font-body-lg text-body-lg text-on-surface leading-loose">
                  <mark
                    onClick={() => setActiveNote('note-2')}
                    className={`px-1 py-0.5 rounded cursor-pointer transition-colors relative inline ${
                      activeNote === 'note-2'
                        ? 'bg-primary text-on-primary font-medium shadow-sm'
                        : 'bg-primary-fixed text-on-surface hover:bg-primary-fixed-dim'
                    }`}
                  >
                    In doing this, it demonstrates how Gatsby was trapped in his own constructed mythology.
                  </mark>{' '}
                  His lavish weekend galas do not invite human connection; they are elaborate bait traps designed to catch Daisy's distant gaze across the bay.
                </p>

                {/* Paragraph 4 with Amber Diction Highlight */}
                <p className="font-body-lg text-body-lg text-on-surface leading-loose">
                  Crucially, the socio-economic topography between the two wealthy peninsulas reinforces this moral emptiness.{' '}
                  <mark
                    onClick={() => setActiveNote('note-3')}
                    className={`px-1 py-0.5 rounded cursor-pointer transition-colors relative inline ${
                      activeNote === 'note-3'
                        ? 'bg-secondary text-on-secondary font-medium shadow-sm'
                        : 'bg-secondary-fixed text-on-surface hover:bg-secondary-fixed-dim'
                    }`}
                  >
                    Between the dazzling bays, the valley of ashes functions as a moral wasteland,
                  </mark>{' '}
                  where George Wilson and the hollow eyes of Doctor T.J. Eckleburg bear silent witness to the industrial human detritus discarded by Tom Buchanan's social class.
                </p>

                <p className="font-body-lg text-body-lg text-on-surface-variant italic leading-loose pt-2">
                  [Section continues: Examination of Chapter 7 Plaza Hotel confrontation and the climactic pool scene...]
                </p>
              </div>

              {/* Sticky Annotations Margin Column */}
              <div className="lg:col-span-4 flex flex-col gap-space-lg lg:pt-16">
                {/* Custom User Quick Stamps Display */}
                {userStamps.map(stamp => (
                  <div
                    key={stamp.id}
                    className="p-space-sm rounded bg-surface-container-lowest border border-tertiary shadow-sm flex items-center gap-2 animate-fade-in"
                  >
                    <span className="material-symbols-outlined text-tertiary text-[18px]">{stamp.icon}</span>
                    <span className="font-label-sm text-xs font-bold text-on-surface">{stamp.label}</span>
                    <span className="font-annotation-note text-[10px] text-on-surface-variant ml-auto">Line {stamp.line}</span>
                  </div>
                ))}

                {/* Margin Note 1: Sage Praise */}
                <div
                  onClick={() => setActiveNote('note-1')}
                  className={`relative p-space-md rounded bg-[#FFFDF5] shadow-[0_4px_16px_rgba(43,38,32,0.08)] transition-all cursor-pointer border ${
                    activeNote === 'note-1'
                      ? 'border-tertiary ring-2 ring-tertiary/20 -translate-y-1'
                      : 'border-[#E8DFC8] hover:-translate-y-0.5'
                  }`}
                >
                  <div className="absolute -left-2 top-4 w-1.5 h-10 rounded-full bg-tertiary-container"></div>
                  <div className="flex items-center justify-between pb-space-xs">
                    <span className="font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">draw</span>
                      Ms. Holloway
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Line 14</span>
                  </div>
                  <p className="font-annotation-note text-annotation-note text-on-surface leading-snug">
                    Insightful phrasing here! You effectively elevate this beyond standard plot summary into authentic conceptual critique.
                  </p>
                  <div className="mt-space-xs flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] uppercase font-semibold">
                      Thematic Synthesis
                    </span>
                  </div>
                </div>

                {/* Margin Note 2: Burnt Orange Syntax revision */}
                <div
                  onClick={() => setActiveNote('note-2')}
                  className={`relative p-space-md rounded bg-[#FFFDF5] shadow-[0_4px_16px_rgba(43,38,32,0.08)] transition-all cursor-pointer border ${
                    activeNote === 'note-2'
                      ? 'border-primary ring-2 ring-primary/20 -translate-y-1'
                      : 'border-[#E8DFC8] hover:-translate-y-0.5'
                  }`}
                >
                  <div className="absolute -left-2 top-4 w-1.5 h-10 rounded-full bg-primary-container"></div>
                  <div className="flex items-center justify-between pb-space-xs">
                    <span className="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                      Ms. Holloway
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Line 28</span>
                  </div>
                  <p className="font-annotation-note text-annotation-note text-on-surface leading-snug">
                    Passive pronoun structure here weakens your authorial momentum. Try revising: <em>“By enacting this ritual, Gatsby traps himself...”</em>
                  </p>
                  <div className="mt-space-xs flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-[10px] uppercase font-semibold">
                      Syntax &amp; Precision
                    </span>
                  </div>
                </div>

                {/* Margin Note 3: Amber Diction Note */}
                <div
                  onClick={() => setActiveNote('note-3')}
                  className={`relative p-space-md rounded bg-[#FFFDF5] shadow-[0_4px_16px_rgba(43,38,32,0.08)] transition-all cursor-pointer border ${
                    activeNote === 'note-3'
                      ? 'border-secondary ring-2 ring-secondary/20 -translate-y-1'
                      : 'border-[#E8DFC8] hover:-translate-y-0.5'
                  }`}
                >
                  <div className="absolute -left-2 top-4 w-1.5 h-10 rounded-full bg-secondary-container"></div>
                  <div className="flex items-center justify-between pb-space-xs">
                    <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">auto_stories</span>
                      Ms. Holloway
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Line 41</span>
                  </div>
                  <p className="font-annotation-note text-annotation-note text-on-surface leading-snug">
                    Brilliant connection with Eckleburg's gaze. Consider developing this as a recurring motif of industrial secular judgment in Chapter 8.
                  </p>
                  <div className="mt-space-xs flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-[10px] uppercase font-semibold">
                      Motif Analysis
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
