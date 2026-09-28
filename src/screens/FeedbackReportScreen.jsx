import React, { useState, useEffect } from 'react';
import { FEEDBACK_TONES } from '../data/mockData';
import { sounds } from '../utils/soundEffects';
import FlightControlModal from '../components/FlightControlModal';
import SnippetsLibraryModal from '../components/SnippetsLibraryModal';
import AccessibilityToolbar from '../components/AccessibilityToolbar';

const PRESET_QUICK_STAMPS = [
  { id: 'stamp-1', label: 'Strong Evidence', icon: 'star', color: 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary/30' },
  { id: 'stamp-2', label: 'Needs Citation', icon: 'warning', color: 'bg-primary-fixed text-primary border-primary/30' },
  { id: 'stamp-3', label: 'Explain Deeper', icon: 'search', color: 'bg-secondary-fixed text-on-secondary-fixed border-secondary/30' },
  { id: 'stamp-4', label: 'Great Transition', icon: 'swap_calls', color: 'bg-surface-container-high text-on-surface border-surface-container-highest' },
  { id: 'stamp-5', label: 'Core Thesis Point', icon: 'adjust', color: 'bg-tertiary-fixed-dim text-on-tertiary-container border-tertiary/40' }
];

export default function FeedbackReportScreen({ 
  submission, 
  submissions = [], 
  onSelectSubmission, 
  onNavigateToSubmit, 
  onOpenQuiz,
  onNavigateToDashboard 
}) {
  const [activeNote, setActiveNote] = useState(null);
  const [pushedToLms, setPushedToLms] = useState(false);
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'split_compare'
  const [feedbackTone, setFeedbackTone] = useState(submission?.tone || 'standard');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(14); // seconds
  const [isRecording, setIsRecording] = useState(false);

  // Modals state
  const [showFlightControl, setShowFlightControl] = useState(false);
  const [showSnippetsModal, setShowSnippetsModal] = useState(false);

  // Accessibility state
  const [isDyslexic, setIsDyslexic] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'normal' | 'large' | 'xlarge'
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const [voiceNotes, setVoiceNotes] = useState([]);
  const [userStamps, setUserStamps] = useState([]);
  const [extraNotes, setExtraNotes] = useState([]);

  const currentIndex = submissions.findIndex(s => s.id === submission?.id);
  const hasQueue = submissions.length > 1 && currentIndex !== -1;

  // Global Flight Control Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === '?') {
        e.preventDefault();
        setShowFlightControl(prev => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        sounds.playPaperRustle();
        setViewMode(prev => (prev === 'split_compare' ? 'single' : 'split_compare'));
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
      } else if (e.key === '[' && hasQueue) {
        e.preventDefault();
        if (currentIndex > 0 && onSelectSubmission) {
          sounds.playPaperRustle();
          onSelectSubmission(submissions[currentIndex - 1]);
        }
      } else if (e.key === ']' && hasQueue) {
        e.preventDefault();
        if (currentIndex < submissions.length - 1 && onSelectSubmission) {
          sounds.playPaperRustle();
          onSelectSubmission(submissions[currentIndex + 1]);
        }
      } else if (e.key === ' ' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handlePushGrade();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, hasQueue, submissions, onSelectSubmission]);

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
      icon: stamp.icon,
      text: `Teacher stamp: ${stamp.label} applied.`
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
        { id: `vn-${Date.now()}`, duration: '0:28', recordedAt: 'Just now', teacher: 'Teacher Voice Note' }
      ]);
    } else {
      setIsRecording(true);
    }
  };

  const handleToggleSound = () => {
    const nextState = sounds.toggleSound();
    setIsSoundEnabled(nextState);
  };

  // If no submission is present, show clean empty state
  if (!submission) {
    return (
      <div className="w-full px-gutter lg:px-margin-desktop py-24 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-space-md animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[36px]">assignment</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
          No Assignment Evaluated Yet
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Submit student writing or documents in the Submit Assignment screen to generate comprehensive evaluation, diagnostic breakdown, and margin annotations.
        </p>
        <button
          type="button"
          onClick={onNavigateToSubmit}
          className="mt-space-sm px-space-xl py-space-sm rounded-xl bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">edit_note</span>
          <span>Submit an Assignment</span>
        </button>
      </div>
    );
  }

  const studentName = submission.studentName || 'Student Submission';
  const assignmentTitle = submission.title || 'Assignment Analysis';
  const submissionText = submission.text || '';
  const paragraphs = submissionText.split(/\n+/).filter(Boolean);
  const wordCount = submission.wordCount || submissionText.trim().split(/\s+/).filter(Boolean).length;
  const rubricName = submission.rubric || 'Analytic Rubric';
  const refText = submission.refText || '';

  // Typography styles
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

      {/* Consecutive Cohort Speed-Grading Control Bar */}
      {hasQueue && (
        <div className="flex flex-wrap items-center justify-between gap-space-sm p-space-sm bg-surface-container-low rounded-xl border border-surface-container font-label-md text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectSubmission && onSelectSubmission(submissions[currentIndex - 1])}
              disabled={currentIndex <= 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold border border-surface-container text-on-surface"
              title="Previous Student Submission (Press [ )"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              <span>Previous [</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectSubmission && onSelectSubmission(submissions[currentIndex + 1])}
              disabled={currentIndex >= submissions.length - 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold border border-surface-container text-on-surface"
              title="Next Student Submission (Press ] )"
            >
              <span>Next ]</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-on-surface">
            <span className="font-semibold text-on-surface-variant">Cohort Grading Queue:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-bold font-code-inline text-xs">
              {currentIndex + 1} of {submissions.length}
            </span>
            <span className="text-on-surface font-bold hidden sm:inline">{studentName}</span>
          </div>

          {onNavigateToDashboard && (
            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs border border-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">arrow_back</span>
              <span>Back to Desk</span>
            </button>
          )}
        </div>
      )}

      {/* Top Banner / Assessment Identity Header */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg pb-space-sm border-b border-surface-container">
        <div className="space-y-space-xs max-w-2xl">
          <div className="flex items-center gap-space-sm">
            <span className="font-code-inline text-code-inline text-secondary font-medium tracking-wide uppercase">
              Evaluated Submission
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">{studentName}</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Assignment Feedback: {studentName} — {assignmentTitle}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Evaluated against {rubricName}. Total Word Count: {wordCount} words.
          </p>

          {/* View Mode & Feedback Tone Controls */}
          <div className="pt-2 flex flex-wrap items-center gap-space-sm">
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
                Manuscript Feedback View
              </button>
              {refText && (
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
              )}
            </div>

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
                {wordCount > 100 ? '91' : '82'}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                / 100
              </span>
              <span className="font-annotation-note text-annotation-note text-primary font-medium tracking-tight mt-0.5">
                Evaluation Complete
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
              >
                <span className="material-symbols-outlined text-[17px]">quiz</span>
                Practice Skills
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

      {/* SPLIT-SCREEN LIVE COMPARISON (Visible when split_compare mode active and ref text exists) */}
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
                  Reference Document
                </span>
                <span className="text-xs font-code-inline text-on-surface-variant">Source Material</span>
              </div>
              <div className="space-y-space-sm overflow-y-auto max-h-[460px] pr-2 text-on-surface text-sm leading-relaxed whitespace-pre-wrap">
                {refText || "No reference material uploaded for this submission."}
              </div>
            </div>

            {/* Right Pane: Student Draft Synthesis */}
            <div className="flex flex-col rounded-xl bg-[#FFFDF5] border border-[#E8DFC8] p-space-md shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8DFC8]">
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">edit_document</span>
                  Student Submission: {studentName}
                </span>
                <span className="text-xs font-code-inline text-tertiary font-bold">{wordCount} words</span>
              </div>
              <div className="space-y-space-sm overflow-y-auto max-h-[460px] pr-2 text-on-surface text-sm leading-relaxed whitespace-pre-wrap">
                {submissionText}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* AUDIO VOICE FEEDBACK & QUICK-STAMPS ACTION BAR */}
      <section className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md w-full lg:w-auto">
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
          {voiceNotes.length > 0 && (
            <span className="text-xs font-label-sm text-tertiary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              {voiceNotes.length} voice note(s) saved
            </span>
          )}
        </div>

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

      {/* Manuscript on Ruled Notebook Canvas */}
      <section className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">history_edu</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              Annotated Submission ({studentName})
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {userStamps.length + extraNotes.length} notes attached
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Word count: {wordCount}</span>
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
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{studentName}</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-space-sm font-bold">
                    {assignmentTitle}
                  </h3>
                </header>

                {paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className={`${typographyClass} ${fontSizeClass}`}>
                    {p}
                  </p>
                ))}

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
