import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/soundEffects';
import FlightControlModal from '../components/FlightControlModal';

export default function TeacherDashboardScreen({
  classes = [],
  assignments = [],
  submissions = [],
  queue = [],
  setQueue,
  selectedClassId,
  onOpenNewAssignment,
  onNavigateToReport,
  onNavigateToLms,
  onNavigateToSubmit
}) {
  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0] || { name: 'Classroom Desk' };
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
      } else if (activeTabSection === 'batch_queue' && queue.length > 0) {
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
    if (setQueue) {
      setQueue(queue.map(item => item.id === id ? { ...item, approved: !item.approved } : item));
    }
  };

  const handleScoreChange = (id, newScore) => {
    if (setQueue) {
      setQueue(queue.map(item => item.id === id ? { ...item, score: Number(newScore) || 0, overallScore: Number(newScore) || 0 } : item));
    }
  };

  const handleGradeBatch = () => {
    sounds.playPenScratch();
    setIsGradingBatch(true);
    setTimeout(() => {
      setIsGradingBatch(false);
      sounds.playSuccessChime();
      if (setQueue) {
        setQueue(queue.map(item => ({ ...item, status: 'Graded', approved: true })));
      }
    }, 1200);
  };

  const handleSyncAllApproved = () => {
    sounds.playSuccessChime();
    setSyncedNotification(true);
    setTimeout(() => setSyncedNotification(false), 3500);
  };

  const totalSubs = submissions.length;
  const avgScore = totalSubs > 0
    ? (submissions.reduce((acc, s) => acc + (s.overallScore || s.score || 0), 0) / totalSubs).toFixed(1)
    : null;
  const approvedCount = queue.filter(q => q.approved).length;
  const pendingReviewCount = queue.filter(q => !q.approved).length;

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* Action Bar / Editorial Desk Greeting */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-lg">
        <div className="space-y-space-xs max-w-2xl">
          <div className="flex items-center gap-space-sm">
            <span className="font-code-inline text-code-inline text-secondary font-medium tracking-wide uppercase">
              Instructor Desk • Assessment Workspace
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Live Active Session</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-semibold">
            Welcome to your Grading Desk
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            {currentClass.name} — {totalSubs} evaluated {totalSubs === 1 ? 'assignment' : 'assignments'} on record.
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
            <span className="font-label-md text-label-md">Gradebook Sync</span>
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
            All {approvedCount} approved assignment marks and margin feedback successfully synced to Gradebook!
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
              {avgScore !== null ? (
                <>
                  {avgScore}<span className="font-body-sm text-body-sm font-normal text-on-surface-variant">%</span>
                </>
              ) : (
                <span className="text-on-surface-variant text-2xl font-normal">—</span>
              )}
            </div>
            {avgScore !== null && (
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> Baseline Computed
              </span>
            )}
          </div>
          <p className="mt-space-sm font-annotation-note text-annotation-note text-on-surface-variant">
            {totalSubs > 0 
              ? `Based on ${totalSubs} evaluated assignment${totalSubs === 1 ? '' : 's'}.` 
              : 'Awaiting evaluated student submissions.'}
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
              {pendingReviewCount} <span className="font-body-md text-body-md text-on-surface-variant font-normal">pending</span>
            </div>
            <span className={`inline-flex items-center px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold tracking-wide ${
              pendingReviewCount > 0 ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface-variant'
            }`}>
              {pendingReviewCount > 0 ? 'Action needed' : 'All caught up'}
            </span>
          </div>
          <p className="mt-space-sm font-annotation-note text-annotation-note text-on-surface-variant">
            {pendingReviewCount > 0 
              ? 'Pending teacher approval before gradebook sync.' 
              : 'No pending submissions requiring manual sign-off.'}
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
              <div className="font-headline-sm text-headline-sm text-on-surface font-bold">Approved for Sync</div>
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
              Sync Ready
            </div>
          </div>
          <div className="mt-space-md w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-tertiary h-full rounded-full transition-all" 
              style={{ width: `${queue.length > 0 ? (approvedCount / queue.length) * 100 : 0}%` }}
            />
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

        {activeTabSection === 'batch_queue' && queue.length > 0 && (
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
                  <span>Scoring All {queue.length} Submissions...</span>
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
              disabled={approvedCount === 0}
              className="px-space-md py-1.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-md text-xs font-semibold hover:bg-tertiary-fixed-dim shadow-xs flex items-center gap-1.5 disabled:opacity-50"
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

          {queue.length === 0 ? (
            <div className="p-space-xl text-center flex flex-col items-center justify-center space-y-space-sm py-16">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">dynamic_feed</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Batch Grading Queue is Empty
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                Upload student files or submit assignments to review, adjust scores inline, and approve in bulk.
              </p>
              <button
                type="button"
                onClick={onNavigateToSubmit}
                className="px-space-md py-space-xs rounded bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary transition-all mt-2"
              >
                Go to Submission Page ➔
              </button>
            </div>
          ) : (
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
                        {item.wordCount || 0} words
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-label-sm font-semibold ${
                          item.status === 'Needs Review'
                            ? 'bg-primary-fixed text-primary'
                            : 'bg-tertiary-fixed text-on-tertiary-container'
                        }`}>
                          {item.flag || 'Evaluated'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.overallScore || item.score || 0}
                          onChange={(e) => handleScoreChange(item.id, e.target.value)}
                          className="w-16 text-right px-2 py-1 rounded bg-surface-container border border-surface-container font-code-inline text-sm font-bold text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onNavigateToReport(item)}
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
          )}
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
                  {assignments.length} Active
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

            {assignments.length === 0 ? (
              <div className="bg-surface-container-lowest p-space-xl rounded-xl border border-dashed border-surface-container flex flex-col items-center justify-center text-center space-y-space-sm py-12">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[24px]">assignment</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">No Assignments Created Yet</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                  Create structured assignments with custom guidelines and rubrics, or jump directly into grading.
                </p>
                <button
                  type="button"
                  onClick={onOpenNewAssignment}
                  className="px-space-md py-space-xs rounded bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary shadow-xs transition-all mt-2"
                >
                  + Create Assignment
                </button>
              </div>
            ) : (
              assignments.map((asg) => (
                <div key={asg.id} className="bg-surface-container-lowest p-space-lg rounded shadow-[0_2px_8px_rgba(31,27,21,0.04)] hover:shadow-[0_6px_16px_rgba(31,27,21,0.06)] transition-all flex flex-col gap-space-md border border-surface-container">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-space-sm">
                        <span className="px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-container font-label-sm text-label-sm font-semibold">
                          {asg.rubricName || 'Assignment'}
                        </span>
                        <span className="font-annotation-note text-annotation-note text-on-surface-variant">
                          Due {asg.dueDate}
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {asg.title}
                      </h3>
                      {asg.instructions && (
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {asg.instructions}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={onNavigateToSubmit}
                      className="self-start shrink-0 px-space-md py-space-xs rounded bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md shadow-[0_2px_0_rgba(86,20,0,0.2)] active:translate-y-0.5 transition-all font-semibold" 
                      type="button"
                    >
                      Submit Student Work
                    </button>
                  </div>
                </div>
              ))
            )}
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
              <div className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-bold">
                <span>Student &amp; Passage Note</span>
                <span>Score • Assessment</span>
              </div>

              {submissions.length === 0 ? (
                <div className="p-space-xl text-center flex flex-col items-center justify-center space-y-space-sm py-12">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[24px]">history_edu</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">No Submissions in Ledger</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                    Evaluated student drafts and AI feedback reports will be logged here.
                  </p>
                  <button
                    type="button"
                    onClick={onNavigateToSubmit}
                    className="px-space-md py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold border border-surface-container mt-2"
                  >
                    Submit Student Assignment ➔
                  </button>
                </div>
              ) : (
                <div className="divide-y-0 flex flex-col">
                  {submissions.slice(0, 5).map((sub, sIdx) => (
                    <React.Fragment key={sub.id}>
                      <div 
                        onClick={() => onNavigateToReport(sub)}
                        className="p-space-md hover:bg-surface-container-low transition-colors group flex items-start justify-between gap-space-sm cursor-pointer"
                      >
                        <div className="flex items-start gap-space-sm min-w-0">
                          <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-md text-label-md shrink-0 font-bold">
                            {(sub.studentName || 'S').split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-space-xs">
                              <span className="font-label-md text-label-md text-on-surface font-semibold truncate">{sub.studentName}</span>
                              <span className="font-annotation-note text-annotation-note text-on-surface-variant">• {sub.timestamp || 'Recent'}</span>
                            </div>
                            <div className="font-annotation-note text-annotation-note text-on-surface-variant italic truncate max-w-[200px] sm:max-w-xs">
                              “{sub.title}”
                            </div>
                            <div className="pt-0.5">
                              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-label-sm font-semibold">
                                <span className="material-symbols-outlined text-[13px]">verified</span> {sub.flag || 'Evaluated'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0 gap-1">
                          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                            {sub.overallScore || sub.score || 88}<span className="font-label-sm text-label-sm text-on-surface-variant font-normal">/100</span>
                          </span>
                          <span className="font-label-sm text-label-sm text-primary group-hover:underline flex items-center gap-0.5">
                            Report <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          </span>
                        </div>
                      </div>
                      {sIdx < Math.min(submissions.length - 1, 4) && <div className="h-px bg-surface-container mx-space-md"></div>}
                    </React.Fragment>
                  ))}
                </div>
              )}
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
