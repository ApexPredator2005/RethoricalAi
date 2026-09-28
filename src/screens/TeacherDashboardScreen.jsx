import React, { useState, useEffect } from 'react';
import { BATCH_SUBMISSIONS_QUEUE } from '../data/mockData';
import { sounds } from '../utils/soundEffects';
import FlightControlModal from '../components/FlightControlModal';

export default function TeacherDashboardScreen({
  classes,
  selectedClassId,
  onOpenNewAssignment,
  onNavigateToReport,
  onNavigateToLms
}) {
  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const [queue, setQueue] = useState(BATCH_SUBMISSIONS_QUEUE);
  const [isGradingBatch, setIsGradingBatch] = useState(false);
  const [syncedNotification, setSyncedNotification] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState('overview'); // 'overview' | 'batch_queue'
  const [showFlightControl, setShowFlightControl] = useState(false);
  const [activeQueueIndex, setActiveQueueIndex] = useState(0);

  // Keyboard navigation when in batch queue
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === '?') {
        e.preventDefault();
        setShowFlightControl(prev => !prev);
      } else if (activeTabSection === 'batch_queue') {
        if (e.key === '[' || e.key === '{') {
          e.preventDefault();
          sounds.playPaperRustle();
          setActiveQueueIndex(prev => (prev > 0 ? prev - 1 : queue.length - 1));
        } else if (e.key === ']' || e.key === '}') {
          e.preventDefault();
          sounds.playPaperRustle();
          setActiveQueueIndex(prev => (prev < queue.length - 1 ? prev + 1 : 0));
        } else if (e.key === ' ' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          const target = queue[activeQueueIndex];
          if (target) {
            handleApproveToggle(target.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabSection, queue, activeQueueIndex]);

  const handleApproveToggle = (id) => {
    sounds.playStampThud();
    setQueue(queue.map(item => item.id === id ? { ...item, approved: !item.approved } : item));
  };

  const handleScoreChange = (id, newScore) => {
    setQueue(queue.map(item => item.id === id ? { ...item, score: Number(newScore) || 0 } : item));
  };

  const handleGradeBatch = () => {
    sounds.playPenScratch();
    setIsGradingBatch(true);
    setTimeout(() => {
      setIsGradingBatch(false);
      sounds.playSuccessChime();
      setQueue(queue.map(item => ({ ...item, status: 'Graded', approved: true })));
    }, 1400);
  };

  const handleSyncAllApproved = () => {
    sounds.playSuccessChime();
    setSyncedNotification(true);
    setTimeout(() => setSyncedNotification(false), 3500);
  };

  const approvedCount = queue.filter(q => q.approved).length;

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* Action Bar / Editorial Desk Greeting */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-lg">
        <div className="space-y-space-xs max-w-2xl">
          <div className="flex items-center gap-space-sm">
            <span className="font-code-inline text-code-inline text-secondary font-medium tracking-wide uppercase">
              Desk / Term 1 Autumn Review
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Week 8 of 16</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-semibold">
            Welcome back, Ms. Holloway
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            {currentClass.name} — 49 registered scholars.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-space-sm">
          <button
            type="button"
            onClick={() => setShowFlightControl(true)}
            className="group flex items-center gap-space-xs px-space-md py-space-sm rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-all shadow-[0_2px_0_rgba(31,27,21,0.06)] active:translate-y-0.5 font-semibold text-xs font-label-md"
            title="Open Speed-Grading Keyboard Shortcuts (Press ?)"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">keyboard</span>
            <span>Flight Control</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest text-[10px] font-bold">?</kbd>
          </button>

          <button 
            onClick={onNavigateToLms}
            className="group flex items-center gap-space-xs px-space-md py-space-sm rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-all shadow-[0_2px_0_rgba(31,27,21,0.06)] active:translate-y-0.5" 
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">cloud_sync</span>
            <span className="font-label-md text-label-md">Import from Classroom</span>
          </button>
          
          <button 
            onClick={onOpenNewAssignment}
            className="group flex items-center gap-space-xs px-space-md py-space-sm rounded bg-primary-container text-on-primary hover:bg-primary transition-all shadow-[0_3px_0_rgba(86,20,0,0.3)] active:translate-y-0.5" 
            type="button"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">add</span>
            <span className="font-label-md text-label-md tracking-wide font-medium">+ New Assignment</span>
          </button>
        </div>
      </div>

      {/* Sync Notification Toast */}
      {syncedNotification && (
        <div className="p-space-sm rounded bg-tertiary-fixed text-on-tertiary-container font-label-md text-label-md flex items-center justify-between shadow-sm animate-fade-in">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            All {approvedCount} approved assignment grades and margin feedback successfully synced to Classroom!
          </span>
          <span className="font-code-inline text-xs font-bold">Live Synchronized</span>
        </div>
      )}

      {/* Quick Stats Tactile Papers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {/* Card 1: Class Average */}
        <div className="relative bg-surface-container-lowest p-space-lg rounded shadow-[0_3px_10px_rgba(31,27,21,0.04),0_1px_2px_rgba(31,27,21,0.06)] flex flex-col justify-between overflow-hidden border border-surface-container">
          <div className="absolute top-0 left-0 right-0 h-1 bg-tertiary-fixed-dim"></div>
          <div className="flex items-start justify-between">
            <div className="space-y-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Class Performance
              </span>
              <div className="font-headline-sm text-headline-sm text-on-surface font-bold">Class Average</div>
            </div>
            <span className="p-space-xs rounded bg-tertiary-fixed text-on-tertiary-container">
              <span className="material-symbols-outlined text-[20px]">analytics</span>
            </span>
          </div>
          <div className="mt-space-lg flex items-baseline justify-between">
            <div className="font-display-lg text-display-lg text-on-surface font-semibold tracking-tight">
              88.4<span className="font-body-sm text-body-sm font-normal text-on-surface-variant">%</span>
            </div>
            <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +2.4% vs last cycle
            </span>
          </div>
          <p className="mt-space-sm font-annotation-note text-annotation-note text-on-surface-variant">
            Based on 142 graded assignments across both periods.
          </p>
        </div>

        {/* Card 2: Submissions Needing Review */}
        <div className="relative bg-surface-container-lowest p-space-lg rounded shadow-[0_3px_10px_rgba(31,27,21,0.04),0_1px_2px_rgba(31,27,21,0.06)] flex flex-col justify-between overflow-hidden border border-surface-container">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container"></div>
          <div className="flex items-start justify-between">
            <div className="space-y-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                Needs Attention
              </span>
              <div className="font-headline-sm text-headline-sm text-on-surface font-bold">Submissions to Review</div>
            </div>
            <span className="p-space-xs rounded bg-primary-fixed text-on-primary-fixed-variant">
              <span className="material-symbols-outlined text-[20px]">draw</span>
            </span>
          </div>
          <div className="mt-space-lg flex items-baseline justify-between">
            <div className="font-display-lg text-display-lg text-primary font-semibold tracking-tight">
              {queue.filter(q => q.status === 'Needs Review').length || 1} <span className="font-body-md text-body-md text-on-surface-variant font-normal">submissions</span>
            </div>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold tracking-wide">
              Action needed
            </span>
          </div>
          <p className="mt-space-sm font-annotation-note text-annotation-note text-on-surface-variant">
            Pending teacher sign-off before gradebook publishing.
          </p>
        </div>

        {/* Card 3: Gradebook Sync */}
        <div className="relative bg-surface-container-lowest p-space-lg rounded shadow-[0_3px_10px_rgba(31,27,21,0.04),0_1px_2px_rgba(31,27,21,0.06)] flex flex-col justify-between overflow-hidden border border-surface-container">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>
          <div className="flex items-start justify-between">
            <div className="space-y-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                Gradebook Sync
              </span>
              <div className="font-headline-sm text-headline-sm text-on-surface font-bold">Synced to Gradebook</div>
            </div>
            <span className="p-space-xs rounded bg-secondary-fixed text-on-secondary-container">
              <span className="material-symbols-outlined text-[20px]">sync_saved_locally</span>
            </span>
          </div>
          <div className="mt-space-lg flex items-baseline justify-between">
            <div className="font-display-lg text-display-lg text-on-surface font-semibold tracking-tight">
              {approvedCount} <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">/ {queue.length}</span>
            </div>
            <div className="flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
              Auto-sync active
            </div>
          </div>
          <div className="mt-space-md w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div className="bg-tertiary h-full rounded-full transition-all" style={{ width: `${(approvedCount / queue.length) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* DASHBOARD SECTION SWITCHER (Overview vs Batch Queue) */}
      <div className="flex items-center justify-between border-b border-surface-container pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTabSection('overview')}
            className={`px-4 py-2 rounded-lg font-label-md text-sm font-semibold transition-all ${
              activeTabSection === 'overview'
                ? 'bg-surface-container text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            📋 Course Assignments &amp; Ledger
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSection('batch_queue')}
            className={`px-4 py-2 rounded-lg font-label-md text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTabSection === 'batch_queue'
                ? 'bg-surface-container text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-primary">dynamic_feed</span>
            <span>Batch Grading Queue ({queue.length})</span>
          </button>
        </div>

        {activeTabSection === 'batch_queue' && (
          <div className="flex items-center gap-space-sm">
            <button
              type="button"
              onClick={handleGradeBatch}
              disabled={isGradingBatch}
              className="px-space-md py-1.5 rounded bg-primary-container text-on-primary font-label-md text-xs font-semibold hover:bg-primary shadow-xs flex items-center gap-1.5"
            >
              {isGradingBatch ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  <span>Scoring All 6 Submissions...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Grade Entire Batch</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleSyncAllApproved}
              className="px-space-md py-1.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-md text-xs font-semibold hover:bg-tertiary-fixed-dim shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
              <span>Approve &amp; Sync to Gradebook ({approvedCount})</span>
            </button>
          </div>
        )}
      </div>

      {/* BATCH GRADING QUEUE VIEW */}
      {activeTabSection === 'batch_queue' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container overflow-hidden space-y-space-md animate-fade-in">
          <div className="px-space-lg py-space-md bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Batch Assignment Assessment Queue
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Review multi-student submissions simultaneously, adjust scores inline, and approve in bulk.
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-surface-container-lowest border border-surface-container font-code-inline text-xs font-bold text-on-surface">
              {approvedCount} of {queue.length} Approved for Sync
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider bg-surface-container-low/50">
                  <th className="py-3 px-4">Approve</th>
                  <th className="py-3 px-4">Student &amp; Title</th>
                  <th className="py-3 px-4">Word Count</th>
                  <th className="py-3 px-4">Diagnostic Flag</th>
                  <th className="py-3 px-4 text-right">Score (/100)</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {queue.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={item.approved}
                        onChange={() => handleApproveToggle(item.id)}
                        className="w-4 h-4 text-primary rounded cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-label-md text-sm font-bold text-on-surface block">{item.studentName}</span>
                      <span className="font-annotation-note text-xs text-on-surface-variant truncate block max-w-sm">
                        {item.title}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-code-inline text-xs text-on-surface-variant">
                      {item.wordCount} words
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-label-sm font-semibold ${
                        item.status === 'Needs Review'
                          ? 'bg-primary-fixed text-primary'
                          : 'bg-tertiary-fixed text-on-tertiary-container'
                      }`}>
                        {item.flag}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.score}
                        onChange={(e) => handleScoreChange(item.id, e.target.value)}
                        className="w-16 text-right px-2 py-1 rounded bg-surface-container border border-surface-container font-code-inline text-sm font-bold text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={onNavigateToReport}
                        className="p-1 rounded text-primary hover:bg-surface-container font-label-sm text-xs font-semibold"
                        title="View Detailed Student Report"
                      >
                        Inspect ➔
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OVERVIEW SECTION: Active Assignments & Course Work Sections */}
      {activeTabSection === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl items-start animate-fade-in">
          {/* Left Column: Active Assignments List (7 cols) */}
          <div className="xl:col-span-7 space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-sm">
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Active Assignments</h2>
                <span className="px-space-xs py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant">
                  3 Active
                </span>
              </div>
              <button 
                onClick={onOpenNewAssignment}
                className="font-label-sm text-label-sm text-primary hover:text-on-primary-container flex items-center gap-1 transition-colors font-semibold" 
                type="button"
              >
                + Create Assignment <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Card: The Great Gatsby */}
            <div className="bg-surface-container-lowest p-space-lg rounded shadow-[0_2px_8px_rgba(31,27,21,0.04)] hover:shadow-[0_6px_16px_rgba(31,27,21,0.06)] transition-all flex flex-col gap-space-md border border-surface-container">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-space-sm">
                    <span className="px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-container font-label-sm text-label-sm font-semibold">
                      Literature Analysis
                    </span>
                    <span className="font-annotation-note text-annotation-note text-error flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Due Yesterday, 11:59 PM
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    The Great Gatsby: Character Moral Ambiguity
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Synthesize textual evidence examining whether Fitzgerald constructs Jay Gatsby as a sympathetic romantic idealist or a cynical racketeer.
                  </p>
                </div>
                <button 
                  onClick={onNavigateToReport}
                  className="self-start shrink-0 px-space-md py-space-xs rounded bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md shadow-[0_2px_0_rgba(86,20,0,0.2)] active:translate-y-0.5 transition-all font-semibold" 
                  type="button"
                >
                  Grade Submissions (5)
                </button>
              </div>
              <div className="pt-space-sm flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low p-space-sm rounded">
                <div className="flex items-center gap-space-md">
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                    <span><strong>28</strong> submitted</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-primary">
                    <span className="material-symbols-outlined text-[16px]">pending</span>
                    <span><strong>5</strong> to grade</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-secondary">grade</span>
                    <span>Avg: <strong>88%</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs">
                  <button className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container" type="button">
                    <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card: King Lear */}
            <div className="bg-surface-container-lowest p-space-lg rounded shadow-[0_2px_8px_rgba(31,27,21,0.04)] hover:shadow-[0_6px_16px_rgba(31,27,21,0.06)] transition-all flex flex-col gap-space-md border border-surface-container">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-space-sm">
                    <span className="px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-label-sm font-semibold">
                      Scientific / DBQ
                    </span>
                    <span className="font-annotation-note text-annotation-note text-on-surface-variant">
                      Due Oct 24 • Period 3
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    King Lear: Madness vs. Wisdom
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Analyze Shakespeare's linguistic inversion of the Fool and Lear regarding the epistemology of courtly insight and blind pride.
                  </p>
                </div>
                <button 
                  onClick={onNavigateToReport}
                  className="self-start shrink-0 px-space-md py-space-xs rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-all shadow-[0_1px_2px_rgba(31,27,21,0.06)] font-semibold" 
                  type="button"
                >
                  Continue Grading (2)
                </button>
              </div>
              <div className="pt-space-sm flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low p-space-sm rounded">
                <div className="flex items-center gap-space-md">
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                    <span><strong>24</strong> submitted</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-primary">
                    <span className="material-symbols-outlined text-[16px]">pending</span>
                    <span><strong>2</strong> to grade</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-secondary">grade</span>
                    <span>Avg: <strong>82%</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs">
                  <button className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container" type="button">
                    <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Submissions & Editorial Stream (5 cols) */}
          <div className="xl:col-span-5 space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-sm">
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Grading Ledger</h2>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Recent Live Submissions</span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">history_edu</span>
            </div>

            {/* Desk Ledger Paper Card */}
            <div className="bg-surface-container-lowest rounded shadow-[0_2px_12px_rgba(31,27,21,0.05)] overflow-hidden border border-surface-container">
              {/* Column Headings */}
              <div className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-bold">
                <span>Student &amp; Passage Note</span>
                <span>Score • Assessment</span>
              </div>

              {/* Submission Rows */}
              <div className="divide-y-0 flex flex-col">
                {queue.slice(0, 4).map((sub, sIdx) => (
                  <React.Fragment key={sub.id}>
                    <div 
                      onClick={onNavigateToReport}
                      className="p-space-md hover:bg-surface-container-low transition-colors group flex items-start justify-between gap-space-sm cursor-pointer"
                    >
                      <div className="flex items-start gap-space-sm min-w-0">
                        <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-md text-label-md shrink-0 font-bold">
                          {sub.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-space-xs">
                            <span className="font-label-md text-label-md text-on-surface font-semibold truncate">{sub.studentName}</span>
                            <span className="font-annotation-note text-annotation-note text-on-surface-variant">• {20 * (sIdx + 1)}m ago</span>
                          </div>
                          <div className="font-annotation-note text-annotation-note text-on-surface-variant italic truncate max-w-[200px] sm:max-w-xs">
                            “{sub.title}”
                          </div>
                          <div className="pt-0.5">
                            <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-label-sm font-semibold">
                              <span className="material-symbols-outlined text-[13px]">verified</span> {sub.flag}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0 gap-1">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                          {sub.score}<span className="font-label-sm text-label-sm text-on-surface-variant font-normal">/100</span>
                        </span>
                        <span className="font-label-sm text-label-sm text-primary group-hover:underline flex items-center gap-0.5">
                          Report <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </span>
                      </div>
                    </div>
                    {sIdx < 3 && <div className="h-px bg-surface-container mx-space-md"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flight Control Cheatsheet Modal */}
      <FlightControlModal
        isOpen={showFlightControl}
        onClose={() => setShowFlightControl(false)}
      />
    </div>
  );
}
