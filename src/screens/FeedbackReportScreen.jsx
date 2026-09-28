import React, { useState, useEffect } from 'react';
import { ORIGINALITY_METRICS, DRAFT_COMPARISON, FEEDBACK_TONES, BATCH_SUBMISSIONS_QUEUE } from '../data/mockData';
import { sounds } from '../utils/soundEffects';
import FlightControlModal from '../components/FlightControlModal';
import SnippetsLibraryModal from '../components/SnippetsLibraryModal';
import AccessibilityToolbar from '../components/AccessibilityToolbar';

const SAMPLE_SOURCE_ALIGNMENTS = [
  {
    essay_claim: "Gatsby revalues every object in his estate solely through Daisy's gaze.",
    source_excerpt: "He hadn't once ceased looking at Daisy, and I think he revalued everything in his house according to the measure of response it drew from her well-loved eyes.",
    verdict: "supported",
    color: "bg-tertiary-fixed text-on-tertiary-fixed border-tertiary"
  },
  {
    essay_claim: "The green light motif operates as an unattainable spectral beacon across the bay.",
    source_excerpt: "You always have a green light that burns all night at the end of your dock.",
    verdict: "supported",
    color: "bg-secondary-fixed text-on-secondary-fixed border-secondary"
  },
  {
    essay_claim: "Gatsby directly tells Nick that Daisy never loved Tom Buchanan in this chapter.",
    source_excerpt: null,
    verdict: "unverified_against_source",
    color: "bg-primary-fixed text-primary border-primary"
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
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'draft_diff' | 'split_compare'
  const [feedbackTone, setFeedbackTone] = useState('standard');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(14); // seconds
  const [isRecording, setIsRecording] = useState(false);
  const [currentStudentIdx, setCurrentStudentIdx] = useState(0);

  // Modals state
  const [showFlightControl, setShowFlightControl] = useState(false);
  const [showSnippetsModal, setShowSnippetsModal] = useState(false);

  // Accessibility state
  const [isDyslexic, setIsDyslexic] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'normal' | 'large' | 'xlarge'
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const [voiceNotes, setVoiceNotes] = useState([
    { id: 'vn-1', duration: '0:34', recordedAt: 'Today, 2:15 PM', teacher: 'Ms. Holloway' }
  ]);
  const [userStamps, setUserStamps] = useState([
    { id: 'us-1', label: 'Strong Evidence', line: 14, icon: 'star', text: 'Seamless textual embedding!' }
  ]);
  const [extraNotes, setExtraNotes] = useState([]);

  const currentStudent = BATCH_SUBMISSIONS_QUEUE[currentStudentIdx] || BATCH_SUBMISSIONS_QUEUE[0];

  // Global Flight Control Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === '?') {
        e.preventDefault();
        setShowFlightControl(prev => !prev);
      } else if (e.key === '[' || e.key === '{') {
        e.preventDefault();
        sounds.playPaperRustle();
        setCurrentStudentIdx(prev => (prev > 0 ? prev - 1 : BATCH_SUBMISSIONS_QUEUE.length - 1));
      } else if (e.key === ']' || e.key === '}') {
        e.preventDefault();
        sounds.playPaperRustle();
        setCurrentStudentIdx(prev => (prev < BATCH_SUBMISSIONS_QUEUE.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        sounds.playPaperRustle();
        setViewMode(prev => (prev === 'split_compare' ? 'single' : 'split_compare'));
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        sounds.playPaperRustle();
        setViewMode(prev => (prev === 'draft_diff' ? 'single' : 'draft_diff'));
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setShowSnippetsModal(prev => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        const nextState = sounds.toggleSound();
        setIsSoundEnabled(nextState);
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const idx = parseInt(e.key) - 1;
        if (PRESET_QUICK_STAMPS[idx]) {
          handleAddStamp(PRESET_QUICK_STAMPS[idx]);
        }
      } else if (e.key === ' ' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handlePushGrade();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePushGrade = () => {
    sounds.playSuccessChime();
    setPushedToLms(true);
    setTimeout(() => setPushedToLms(false), 3500);
  };

  const toggleAudio = () => {
    sounds.playPenScratch();
    setAudioPlaying(!audioPlaying);
  };

  const handleAddStamp = (stamp) => {
    sounds.playStampThud();
    const newStamp = {
      id: `us-${Date.now()}`,
      label: stamp.label,
      line: 28,
      icon: stamp.icon,
      text: `Teacher stamp: ${stamp.label} applied to manuscript.`
    };
    setUserStamps(prev => [...prev, newStamp]);
  };

  const handleInsertSnippet = (snippet) => {
    sounds.playPenScratch();
    setExtraNotes(prev => [
      ...prev,
      {
        id: `snip-note-${Date.now()}`,
        tag: snippet.tag,
        text: snippet.text,
        timestamp: 'Just now'
      }
    ]);
    setShowSnippetsModal(false);
  };

  const handleToggleRecord = () => {
    sounds.playPenScratch();
    if (isRecording) {
      setIsRecording(false);
      sounds.playSuccessChime();
      setVoiceNotes(prev => [
        ...prev,
        { id: `vn-${Date.now()}`, duration: '0:28', recordedAt: 'Just now', teacher: 'Ms. Holloway (New Voice Clip)' }
      ]);
    } else {
      setIsRecording(true);
    }
  };

  const handleToggleSound = () => {
    const nextState = sounds.toggleSound();
    setIsSoundEnabled(nextState);
  };

  // Compute typography styles based on accessibility mode
  const typographyClass = isDyslexic
    ? 'font-sans tracking-wide leading-loose [word-spacing:0.16em]'
    : 'font-body-lg text-body-lg leading-loose';

  const contrastContainerClass = isHighContrast
    ? 'bg-white text-black border-2 border-black shadow-none'
    : 'bg-surface-container-lowest border border-surface-container shadow-sm';

  const fontSizeClass =
    fontSize === 'xlarge' ? 'text-xl' : fontSize === 'large' ? 'text-lg' : 'text-base';

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* Top Accessibility & Speed-Grading Toolbar */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm p-space-sm bg-surface-container-lowest rounded-xl border border-surface-container shadow-xs">
        <AccessibilityToolbar
          isDyslexic={isDyslexic}
          onToggleDyslexic={() => setIsDyslexic(!isDyslexic)}
          isHighContrast={isHighContrast}
          onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
          fontSize={fontSize}
          onChangeFontSize={setFontSize}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={handleToggleSound}
        />

        {/* Flight Control & Snippets Quick-Triggers */}
        <div className="flex items-center gap-space-xs shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setShowSnippetsModal(true)}
            className="px-space-sm py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1.5 border border-surface-container shadow-xs"
            title="Open Quick-Feedback Snippets Library (Press S)"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">bookmark_heart</span>
            <span>Snippets</span>
            <kbd className="px-1 py-0.5 rounded bg-surface-container-highest text-[10px] font-bold font-code-inline">S</kbd>
          </button>

          <button
            type="button"
            onClick={() => setShowFlightControl(true)}
            className="px-space-sm py-1.5 rounded-lg bg-primary-fixed hover:bg-primary-fixed-dim font-label-sm text-label-sm text-primary font-bold flex items-center gap-1.5 shadow-xs"
            title="Open Flight Control Speed-Grading Cheatsheet (Press ?)"
          >
            <span className="material-symbols-outlined text-[16px]">flight</span>
            <span>Flight Control</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-[10px] font-bold font-code-inline">?</kbd>
          </button>
        </div>
      </section>

      {/* Top Banner / Assessment Identity Header */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg pb-space-sm border-b border-surface-container">
        <div className="space-y-space-xs max-w-2xl">
          <div className="flex items-center gap-space-sm">
            <span className="font-code-inline text-code-inline text-secondary font-medium tracking-wide uppercase">
              Graded Submission • Period 3 AP Lit
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
              <span>Student {currentStudentIdx + 1} of {BATCH_SUBMISSIONS_QUEUE.length}:</span>
              <span className="font-bold text-on-surface">{currentStudent.studentName}</span>
              <span className="text-xs">
                (Press <kbd className="px-1 bg-surface-container rounded font-bold">[</kbd> or <kbd className="px-1 bg-surface-container rounded font-bold">]</kbd> to cycle)
              </span>
            </div>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Assignment Feedback: {currentStudent.studentName} — {currentStudent.title}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Evaluated against AP Literature Analytical Synthesis Rubric (100-Point Analytic Scale). Assessed on September 24, 2026.
          </p>

          {/* View Mode & Feedback Tone Controls */}
          <div className="pt-2 flex flex-wrap items-center gap-space-sm">
            {/* View Mode Switcher */}
            <div className="inline-flex items-center bg-surface-container p-0.5 rounded-lg border border-surface-container-high">
              <button
                type="button"
                onClick={() => {
                  sounds.playPaperRustle();
                  setViewMode('single');
                }}
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
                onClick={() => {
                  sounds.playPaperRustle();
                  setViewMode('draft_diff');
                }}
                className={`px-3 py-1 rounded text-xs font-label-md font-semibold transition-all flex items-center gap-1 ${
                  viewMode === 'draft_diff'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px] text-tertiary">difference</span>
                <span>Draft 1 vs. 2 Diff (+9 pts)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playPaperRustle();
                  setViewMode('split_compare');
                }}
                className={`px-3 py-1 rounded text-xs font-label-md font-semibold transition-all flex items-center gap-1 ${
                  viewMode === 'split_compare'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px] text-secondary">vertical_split</span>
                <span>Split-Screen Source Comparison</span>
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
                {currentStudent.score}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                / 100 ({currentStudent.score >= 90 ? 'A-' : 'B'})
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
              {pushedToLms ? 'Grade Pushed Successfully! ✓' : 'Push Grade to Classroom (Space)'}
            </button>

            <div className="flex items-center gap-space-xs">
              <button
                onClick={onOpenQuiz}
                className="flex-1 inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded bg-tertiary-fixed text-on-tertiary-container hover:bg-tertiary-fixed-dim transition-colors font-label-md text-label-md font-semibold border border-tertiary/20"
                type="button"
                title="Launch practice questions based on flagged writing patterns"
              >
                <span className="material-symbols-outlined text-[17px]">quiz</span>
                Practice Skills
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

      {/* SPLIT-SCREEN LIVE COMPARISON (Visible when split_compare mode active) */}
      {viewMode === 'split_compare' && (
        <section className="p-space-lg rounded-xl bg-surface-container-lowest border-2 border-secondary/40 shadow-sm space-y-space-md animate-fade-in">
          <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[24px]">vertical_split</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Synchronized Split-Screen Comparison
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-xs font-bold">
              Grounding Mode: Live Corroboration
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-stretch">
            {/* Left Pane: Primary Source Material */}
            <div className="flex flex-col rounded-xl bg-[#FFFDF5] border border-[#E8DFC8] p-space-md shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8DFC8]">
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">book</span>
                  Primary Reference Passage: Chapter 5
                </span>
                <span className="text-xs font-code-inline text-on-surface-variant">Source Excerpt</span>
              </div>
              <div className="space-y-space-sm overflow-y-auto max-h-[460px] pr-2 text-on-surface text-sm leading-relaxed">
                <p>
                  He hadn't once ceased looking at Daisy, and I think{' '}
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed px-1 py-0.5 rounded font-medium">
                    he revalued everything in his house according to the measure of response it drew from her well-loved eyes
                  </span>
                  . Sometimes, too, he stared around at his possessions in a dazed way, as though in her actual and astounding presence none of it was any longer real.
                </p>
                <p>
                  "If it wasn't for the mist we could see your home across the bay," said Gatsby.{' '}
                  <span className="bg-secondary-fixed text-on-secondary-fixed px-1 py-0.5 rounded font-medium">
                    "You always have a green light that burns all night at the end of your dock."
                  </span>
                </p>
                <p>
                  Daisy put her arm through his abruptly, but he seemed absorbed in what he had just said. Possibly it had occurred to him that the colossal significance of that light had now vanished forever. Compared to the great distance that had separated him from Daisy it had seemed very near to her, almost touching her.{' '}
                  <span className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-medium">
                    His count of enchanted objects had diminished by one.
                  </span>
                </p>
              </div>
            </div>

            {/* Right Pane: Student Draft Synthesis */}
            <div className="flex flex-col rounded-xl bg-[#FFFDF5] border border-[#E8DFC8] p-space-md shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8DFC8]">
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">edit_document</span>
                  Student Draft: {currentStudent.studentName}
                </span>
                <span className="text-xs font-code-inline text-tertiary font-bold">Matched Claims</span>
              </div>
              <div className="space-y-space-sm overflow-y-auto max-h-[460px] pr-2 text-on-surface text-sm leading-relaxed">
                <p>
                  F. Scott Fitzgerald constructs Jay Gatsby not merely as an embodiment of romantic disillusionment, but as an architect of self-erasure. When Fitzgerald writes that Gatsby{' '}
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed px-1 py-0.5 rounded font-medium border border-tertiary/40">
                    "revalued everything in his house according to the measure of response it drew from her well-loved eyes,"
                  </span>{' '}
                  <span className="inline-block text-[10px] font-bold text-tertiary uppercase ml-1">✓ Exact 100% Quote</span>{' '}
                  he explicitly subordinates material splendor to an unattainable spectral ideal.
                </p>
                <p>
                  Furthermore, the persistent chromatic motif of green—{' '}
                  <span className="bg-secondary-fixed text-on-secondary-fixed px-1 py-0.5 rounded font-medium border border-secondary/40">
                    epitomized by the dock light across the bay
                  </span>{' '}
                  <span className="inline-block text-[10px] font-bold text-secondary uppercase ml-1">✓ Grounded Motif</span>—
                  functions as both an compass for yearning and an indictment of the commodified American dream.
                </p>
                <p className="p-2 rounded bg-primary-fixed/20 border border-primary/20 text-xs">
                  <span className="font-bold text-primary block">Claim Spot-Check:</span>
                  Student assertion: "Gatsby directly tells Nick that Daisy never loved Tom Buchanan."
                  <span className="text-[11px] text-on-surface-variant block mt-0.5 italic">
                    ⚠️ Not corroborated in Chapter 5 excerpt text. Flagged for teacher review.
                  </span>
                </p>
              </div>
            </div>
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
            Quick Stamps (1-5):
          </span>
          {PRESET_QUICK_STAMPS.map(stamp => (
            <button
              key={stamp.id}
              type="button"
              onClick={() => handleAddStamp(stamp)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-label-sm font-semibold border shadow-xs transition-transform active:scale-90 ${stamp.color}`}
              title={`Click or press hotkey to stamp "${stamp.label}"`}
            >
              <span className="material-symbols-outlined text-[14px]">{stamp.icon}</span>
              <span>{stamp.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Rubric Diagnostic Bands */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <div className="flex flex-col justify-between p-space-md rounded-lg bg-surface-container-lowest shadow-sm gap-space-sm border border-surface-container">
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

        <div className="flex flex-col justify-between p-space-md rounded-lg bg-surface-container-lowest shadow-sm gap-space-sm border border-surface-container">
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

        <div className="flex flex-col justify-between p-space-md rounded-lg bg-surface-container-lowest shadow-sm gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Organization &amp; Flow</span>
            <span className="font-code-inline text-code-inline text-secondary font-bold">17 / 20</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full bg-secondary-container rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 truncate">
            <span className="material-symbols-outlined text-[14px]">swap_calls</span>
            Paragraph 3 needs pivot tuning
          </p>
        </div>

        <div className="flex flex-col justify-between p-space-md rounded-lg bg-surface-container-lowest shadow-sm gap-space-sm border border-surface-container">
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

      {/* Signature Visual: Annotated Manuscript on Ruled Notebook Canvas */}
      <section className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">history_edu</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              Annotated Submission ({currentStudent.studentName})
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {3 + userStamps.length + extraNotes.length} teacher notes attached
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Word count: {currentStudent.wordCount}</span>
          </div>
        </div>

        {/* Ruled Paper Desk Container */}
        <div className={`relative ${isHighContrast ? 'bg-white border-2 border-black' : 'bg-[#FAEDCA] border border-[#D9C49B]'} p-4 md:p-8 lg:p-12 rounded-2xl shadow-md overflow-hidden`}>
          {!isHighContrast && (
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg, #5b4139 0px, #5b4139 1px, transparent 1px, transparent 32px)' }}
            />
          )}

          {/* Document Sheet */}
          <div className={`relative max-w-5xl mx-auto rounded-sm p-6 md:p-12 lg:p-16 ${contrastContainerClass}`}>
            <div className="hidden md:block absolute left-20 top-0 bottom-0 w-[1.5px] bg-red-400 opacity-60 pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
              {/* Essay Body Column */}
              <div className="lg:col-span-8 flex flex-col gap-space-lg text-on-surface md:pl-8">
                <header className="flex flex-col pb-space-sm border-b border-surface-container">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{currentStudent.studentName} • AP English Literature</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Teacher: Ms. Claire Holloway</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-space-sm font-bold">
                    {currentStudent.title}
                  </h3>
                </header>

                <p className={`${typographyClass} ${fontSizeClass}`}>
                  Throughout F. Scott Fitzgerald's 1925 masterpiece, the American Dream undergoes relentless deconstruction. Rather than portraying Gatsby as an authentic visionary, the novel posits that his fortune and personal history are commodified artifacts constructed to mimic hereditary privilege.
                </p>

                {/* Paragraph 2 with Sage Praise Highlight */}
                <p className={`${typographyClass} ${fontSizeClass}`}>
                  The geography of Long Island serves as an external projection of class antagonism. While East Egg glistens with careless aristocratic indifference, West Egg acts as a loud carnival of imitation.{' '}
                  <mark
                    onClick={() => {
                      sounds.playPenScratch();
                      setActiveNote('note-1');
                    }}
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
                <p className={`${typographyClass} ${fontSizeClass}`}>
                  <mark
                    onClick={() => {
                      sounds.playPenScratch();
                      setActiveNote('note-2');
                    }}
                    className={`px-1 py-0.5 rounded cursor-pointer transition-colors relative inline ${
                      activeNote === 'note-2'
                        ? 'bg-primary text-on-primary font-medium shadow-sm'
                        : 'bg-primary-fixed text-on-surface hover:bg-primary-fixed-dim'
                    }`}
                  >
                    Gatsby mistranslates moral elevation into geographic proximity, he presumes West Egg lucre can bridge dynastic complacency.
                  </mark>{' '}
                  Yet Daisy's voice, famously described as "full of money," remains an auditory reminder that the aristocracy will never absorb him.
                </p>

                {/* Dynamic User Stamped Badges on Paper */}
                {userStamps.length > 0 && (
                  <div className="pt-space-md flex flex-wrap gap-2 border-t border-surface-container/60">
                    {userStamps.map(st => (
                      <span
                        key={st.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary/40 font-label-sm text-xs font-bold shadow-xs animate-bounce"
                      >
                        <span className="material-symbols-outlined text-[15px]">{st.icon}</span>
                        <span>{st.label}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Margin Call-Outs & Teacher Notes Column */}
              <div className="lg:col-span-4 flex flex-col gap-space-md sticky top-24">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold border-b border-surface-container pb-1">
                  Teacher Notes &amp; Quick Stamps
                </span>

                {/* Note 1 (Green/Sage) */}
                <div
                  onClick={() => setActiveNote('note-1')}
                  className={`p-space-md rounded-xl transition-all cursor-pointer border ${
                    activeNote === 'note-1'
                      ? 'bg-surface-container-lowest ring-2 ring-tertiary shadow-md'
                      : 'bg-surface-container-lowest/80 border-surface-container hover:bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-label-sm text-xs font-bold text-tertiary uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      Exemplary Synthesis
                    </span>
                    <span className="font-code-inline text-[11px] text-on-surface-variant">¶ 2</span>
                  </div>
                  <p className="font-annotation-note text-annotation-note text-on-surface leading-snug">
                    Terrific close-reading of the green light! Tying the spectral motif to economic reduction is graduate-level prose.
                  </p>
                </div>

                {/* Note 2 (Red-Pen Revision) */}
                <div
                  onClick={() => setActiveNote('note-2')}
                  className={`p-space-md rounded-xl transition-all cursor-pointer border ${
                    activeNote === 'note-2'
                      ? 'bg-surface-container-lowest ring-2 ring-primary shadow-md'
                      : 'bg-surface-container-lowest/80 border-surface-container hover:bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-label-sm text-xs font-bold text-primary uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      Syntax Revision Needed
                    </span>
                    <span className="font-code-inline text-[11px] text-on-surface-variant">¶ 3</span>
                  </div>
                  <p className="font-annotation-note text-annotation-note text-on-surface leading-snug">
                    Comma splice connecting two independent clauses. Replace the comma after "proximity" with a semicolon.
                  </p>
                </div>

                {/* Extra Inserted Snippets Notes */}
                {extraNotes.map(n => (
                  <div key={n.id} className="p-space-md rounded-xl bg-surface-container-low border border-surface-container animate-fade-in space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-xs font-bold text-secondary">{n.tag}</span>
                      <span className="text-[10px] text-on-surface-variant">{n.timestamp}</span>
                    </div>
                    <p className="font-annotation-note text-xs text-on-surface leading-snug">"{n.text}"</p>
                  </div>
                ))}

                {/* Trigger Snippet Library Button */}
                <button
                  type="button"
                  onClick={() => setShowSnippetsModal(true)}
                  className="w-full py-2 rounded-lg border-2 border-dashed border-surface-container hover:border-primary text-xs font-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                  <span>+ Insert Snippet from Library (S)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODALS */}
      <FlightControlModal
        isOpen={showFlightControl}
        onClose={() => setShowFlightControl(false)}
      />

      <SnippetsLibraryModal
        isOpen={showSnippetsModal}
        onClose={() => setShowSnippetsModal(false)}
        onSelectSnippet={handleInsertSnippet}
      />
    </div>
  );
}
