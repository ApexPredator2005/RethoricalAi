import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/soundEffects';
import FlightControlModal from '../components/FlightControlModal';

export default function TeacherDashboardScreen({
  classes = [],
  selectedClassId,
  onSelectClass,
  assignments = [],
  submissions = [],
  queue = [],
  setQueue,
  teacherProfile,
  onOpenProfileModal,
  onOpenNewAssignment,
  onNavigateToReport,
  onNavigateToLms,
  onNavigateToSubmit
}) {
  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0] || {
    id: 'cls-101',
    name: 'Grade 11 - Section A',
    subject: 'AP English Literature & Rhetoric',
    period: 'Period 2 (09:15 - 10:05 AM)',
    room: 'Hall 304',
    studentRoster: []
  };

  const [isGradingBatch, setIsGradingBatch] = useState(false);
  const [syncedNotification, setSyncedNotification] = useState(false);
  const [reminderToast, setReminderToast] = useState(null);
  const [activeTabSection, setActiveTabSection] = useState('roster_tracker'); // 'roster_tracker' | 'overview' | 'batch_queue'
  const [showFlightControl, setShowFlightControl] = useState(false);
  const [activeQueueIndex, setActiveQueueIndex] = useState(0);

  // Roster tracker search & filter state
  const [rosterFilter, setRosterFilter] = useState('all'); // 'all' | 'submitted' | 'missing'
  const [rosterSearch, setRosterSearch] = useState('');

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

  const handleSendReminder = (student) => {
    sounds.playPaperRustle();
    setReminderToast(`Direct reminder nudge dispatched to ${student.name} (${student.email || student.rollNo})`);
    setTimeout(() => setReminderToast(null), 3500);
  };

  const handleRemindAllMissing = (count) => {
    sounds.playPaperRustle();
    setReminderToast(`Official submission notices emailed to all ${count} unsubmitted scholars!`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  // Student Roster Tracking calculation: Who has submitted and who hasn't
  const roster = currentClass.studentRoster || [];
  
  const rosterWithStatus = roster.map(student => {
    const sub = submissions.find(s => 
      s.studentId === student.id || 
      (s.studentName && s.studentName.toLowerCase().trim() === student.name.toLowerCase().trim())
    );

    return {
      ...student,
      hasSubmitted: !!sub,
      submission: sub || null,
      status: sub ? 'Submitted' : 'Missing',
      submittedAt: sub?.timestamp || null,
      score: sub?.overallScore || sub?.score || null,
      title: sub?.title || null
    };
  });

  const submittedStudents = rosterWithStatus.filter(s => s.hasSubmitted);
  const missingStudents = rosterWithStatus.filter(s => !s.hasSubmitted);
  const completionPercentage = roster.length > 0 
    ? Math.round((submittedStudents.length / roster.length) * 100)
    : (submissions.length > 0 ? 100 : 0);

  const filteredRoster = rosterWithStatus.filter(s => {
    if (rosterFilter === 'submitted' && !s.hasSubmitted) return false;
    if (rosterFilter === 'missing' && s.hasSubmitted) return false;
    if (rosterSearch) {
      const q = rosterSearch.toLowerCase();
      return (s.name && s.name.toLowerCase().includes(q)) || 
             (s.rollNo && s.rollNo.toLowerCase().includes(q)) ||
             (s.email && s.email.toLowerCase().includes(q));
    }
    return true;
  });

  const totalSubs = submissions.length;
  const avgScore = totalSubs > 0
    ? (submissions.reduce((acc, s) => acc + (s.overallScore || s.score || 0), 0) / totalSubs).toFixed(1)
    : null;
  const approvedCount = queue.filter(q => q.approved).length;
  const pendingReviewCount = queue.filter(q => !q.approved).length;

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* ──── MEANINGFUL FACULTY & INSTITUTION IDENTITY HEADER ──── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-md border-b border-surface-container">
        <div className="space-y-space-xs max-w-3xl">
          <div className="flex flex-wrap items-center gap-space-sm">
            <span className="font-code-inline text-code-inline text-primary font-bold tracking-wide uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">account_balance</span>
              {teacherProfile?.institution || 'Oakridge International Collegiate Academy'}
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">
              {teacherProfile?.department || 'Department of Humanities & Rhetoric'}
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="font-label-sm text-xs text-on-surface-variant font-medium">
              {teacherProfile?.academicYear || '2026–2027 Academic Session'}
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-space-sm pt-1">
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-semibold">
              Welcome back, {teacherProfile?.name || 'Dr. Eleanor Vance'}
            </h1>
            <button
              onClick={onOpenProfileModal}
              className="p-1 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              title="Edit Teacher & Institution Profile"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="px-2 py-0.5 rounded bg-primary-fixed text-primary font-label-sm text-xs font-bold">
              Active Section: {currentClass.name}
            </span>
            <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-xs font-semibold">
              Subject: {currentClass.subject}
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant italic">
              {currentClass.period} • {currentClass.room}
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-space-sm">
          <button
            type="button"
            onClick={onOpenProfileModal}
            className="group flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-all border border-surface-container font-label-md text-xs font-semibold"
            title="Edit institution name, faculty department, and credentials"
          >
            <span className="material-symbols-outlined text-[17px] text-secondary">badge</span>
            <span>Institution Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFlightControl(true)}
            className="group flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-all border border-surface-container font-semibold text-xs font-label-md"
            title="Open Speed-Grading Keyboard Shortcuts (Press ?)"
          >
            <span className="material-symbols-outlined text-[17px] text-primary">keyboard</span>
            <span>Flight Control</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest text-[10px] font-bold">?</kbd>
          </button>

          <button 
            onClick={onNavigateToLms}
            className="group flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-all border border-surface-container font-label-md text-xs font-semibold" 
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] text-tertiary">cloud_sync</span>
            <span>Gradebook Sync</span>
          </button>
          
          <button 
            onClick={onOpenNewAssignment}
            className="group flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-all shadow-sm font-label-md text-xs font-semibold" 
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ New Assignment</span>
          </button>
        </div>
      </div>

      {/* Sync / Reminder Notification Toast */}
      {syncedNotification && (
        <div className="p-space-sm rounded-lg bg-tertiary-fixed text-on-tertiary-container font-label-md text-label-md flex items-center justify-between shadow-sm animate-fade-in">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            All {approvedCount} approved assignment marks and margin feedback successfully synced to Gradebook!
          </span>
          <span className="font-code-inline text-xs font-bold">Live Synchronized</span>
        </div>
      )}

      {reminderToast && (
        <div className="p-space-sm rounded-lg bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md flex items-center justify-between shadow-sm animate-fade-in">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">mail</span>
            {reminderToast}
          </span>
          <span className="font-code-inline text-xs font-bold">Notification Delivered</span>
        </div>
      )}

      {/* ──── MULTI-CLASS & MULTI-SUBJECT TEACHING SCHEDULE OVERVIEW ──── */}
      <div className="space-y-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">school</span>
            <h2 className="font-headline-sm text-sm uppercase tracking-wider font-bold text-on-surface">
              My Teaching Schedule &amp; Assigned Sections ({classes.length} Courses)
            </h2>
          </div>
          <span className="font-label-sm text-xs text-on-surface-variant">
            Click any section below to switch active grading desk &amp; roster
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {classes.map((cls) => {
            const isSelected = cls.id === selectedClassId;
            const clsRoster = cls.studentRoster || [];
            const clsSubmissions = submissions.filter(s => 
              s.classId === cls.id || 
              clsRoster.some(st => st.id === s.studentId || (s.studentName && s.studentName.toLowerCase().trim() === st.name.toLowerCase().trim()))
            );
            const rate = clsRoster.length > 0 ? Math.round((clsSubmissions.length / clsRoster.length) * 100) : 0;

            return (
              <div
                key={cls.id}
                onClick={() => onSelectClass && onSelectClass(cls.id)}
                className={`p-space-md rounded-xl transition-all cursor-pointer border flex flex-col justify-between gap-space-sm relative overflow-hidden ${
                  isSelected
                    ? 'bg-surface-container-lowest border-primary ring-2 ring-primary/20 shadow-md'
                    : 'bg-surface-container-low border-surface-container hover:bg-surface-container hover:border-outline-variant shadow-xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
                )}
                
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-md text-sm font-bold text-on-surface block">
                        {cls.name}
                      </span>
                      {isSelected && (
                        <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-primary text-[10px] font-bold uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="font-label-sm text-xs text-secondary font-semibold block mt-0.5">
                      {cls.subject}
                    </span>
                  </div>
                  <span className="text-[11px] font-code-inline text-on-surface-variant px-2 py-0.5 rounded bg-surface-container">
                    {cls.period.split(' ')[0]} {cls.period.split(' ')[1]}
                  </span>
                </div>

                <div className="pt-2 border-t border-surface-container/60 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">groups</span>
                    {clsRoster.length} Scholars Enrolled
                  </span>
                  <span className={`font-semibold px-2 py-0.5 rounded ${
                    rate >= 75 ? 'bg-tertiary-fixed text-on-tertiary-container' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {clsSubmissions.length}/{clsRoster.length} Submitted ({rate}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ──── QUICK METRICS: SUBMISSION RATE & COHORT PROGRESS ──── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {/* Card 1: Class Performance */}
        <div className="relative bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_3px_10px_rgba(31,27,21,0.04),0_1px_2px_rgba(31,27,21,0.06)] flex flex-col justify-between overflow-hidden border border-surface-container">
          <div className="absolute top-0 left-0 right-0 h-1 bg-tertiary-fixed-dim"></div>
          <div className="flex items-start justify-between">
            <div className="space-y-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Cohort Evaluation
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
                <span className="material-symbols-outlined text-[14px]">trending_up</span> Live Average
              </span>
            )}
          </div>
          <p className="mt-space-sm font-annotation-note text-annotation-note text-on-surface-variant">
            {totalSubs > 0 
              ? `Computed across ${totalSubs} evaluated student submissions.` 
              : 'Awaiting student submissions for baseline average.'}
          </p>
        </div>

        {/* Card 2: Submission Completion Rate (Who has submitted and who hasn't) */}
        <div className="relative bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_3px_10px_rgba(31,27,21,0.04),0_1px_2px_rgba(31,27,21,0.06)] flex flex-col justify-between overflow-hidden border border-surface-container">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container"></div>
          <div className="flex items-start justify-between">
            <div className="space-y-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                Turn-In Completion
              </span>
              <div className="font-headline-sm text-headline-sm text-on-surface font-bold">Submission Tracker</div>
            </div>
            <span className="p-space-xs rounded bg-primary-fixed text-on-primary-fixed-variant">
              <span className="material-symbols-outlined text-[20px]">checklist</span>
            </span>
          </div>
          <div className="mt-space-lg flex items-baseline justify-between">
            <div className="font-display-lg text-display-lg text-primary font-semibold tracking-tight">
              {submittedStudents.length} <span className="font-body-md text-body-md text-on-surface-variant font-normal">/ {roster.length} turned in</span>
            </div>
            <span className={`inline-flex items-center px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold tracking-wide ${
              missingStudents.length > 0 ? 'bg-primary-container text-on-primary' : 'bg-tertiary-fixed text-on-tertiary-container'
            }`}>
              {completionPercentage}% Complete
            </span>
          </div>
          <p className="mt-space-sm font-annotation-note text-annotation-note text-on-surface-variant">
            {missingStudents.length > 0 
              ? `${missingStudents.length} scholar${missingStudents.length === 1 ? '' : 's'} have not submitted their assignment yet.`
              : 'All registered scholars have submitted their assignment!'}
          </p>
        </div>

        {/* Card 3: Gradebook Sync */}
        <div className="relative bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_3px_10px_rgba(31,27,21,0.04),0_1px_2px_rgba(31,27,21,0.06)] flex flex-col justify-between overflow-hidden border border-surface-container">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>
          <div className="flex items-start justify-between">
            <div className="space-y-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                LMS Sync Readiness
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
              {pendingReviewCount > 0 ? `${pendingReviewCount} in Review` : 'All Approved'}
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

      {/* ──── DASHBOARD SECTION SWITCHER (Roster Tracker vs Assignments vs Batch Queue) ──── */}
      <div className="flex items-center justify-between border-b border-surface-container pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTabSection('roster_tracker')}
            className={`px-4 py-2 rounded-lg font-label-md text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTabSection === 'roster_tracker'
                ? 'bg-surface-container text-on-surface shadow-xs border border-surface-container'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
            <span>Submission Tracker &amp; Roster ({submittedStudents.length}/{roster.length})</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTabSection('overview')}
            className={`px-4 py-2 rounded-lg font-label-md text-sm font-semibold transition-all ${
              activeTabSection === 'overview'
                ? 'bg-surface-container text-on-surface shadow-xs border border-surface-container'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            📋 Course Assignments &amp; Guidelines ({assignments.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('batch_queue')}
            className={`px-4 py-2 rounded-lg font-label-md text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTabSection === 'batch_queue'
                ? 'bg-surface-container text-on-surface shadow-xs border border-surface-container'
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
              className="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-xs font-semibold hover:bg-primary shadow-xs flex items-center gap-1.5"
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
              className="px-space-md py-1.5 rounded-lg bg-tertiary-fixed text-on-tertiary-container font-label-md text-xs font-semibold hover:bg-tertiary-fixed-dim shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
              <span>Approve &amp; Sync ({approvedCount})</span>
            </button>
          </div>
        )}
      </div>

      {/* ──── SECTION 1: STUDENT SUBMISSION TRACKER & ROSTER MATRIX ("Who has submitted and who hasn't") ──── */}
      {activeTabSection === 'roster_tracker' && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container overflow-hidden space-y-space-md animate-fade-in">
          {/* Header Bar with Filters and Bulk Nudge */}
          <div className="px-space-lg py-space-md bg-surface-container-low flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-surface-container">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Class Submission Tracker: {currentClass.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-surface-container text-on-surface font-code-inline text-xs font-bold">
                  {currentClass.subject}
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Real-time tracking of which students have turned in their drafts and which are missing or pending.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-space-sm">
              {/* Filter Tabs: All, Submitted, Missing */}
              <div className="flex items-center bg-surface-container p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setRosterFilter('all')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    rosterFilter === 'all'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  All ({roster.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRosterFilter('submitted')}
                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                    rosterFilter === 'submitted'
                      ? 'bg-surface-container-lowest text-tertiary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  Submitted ({submittedStudents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRosterFilter('missing')}
                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                    rosterFilter === 'missing'
                      ? 'bg-surface-container-lowest text-error shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                  Missing ({missingStudents.length})
                </button>
              </div>

              {/* Roster Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Find student or ID..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  className="pl-8 pr-3 py-1 rounded-lg bg-surface-container-lowest border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-40 sm:w-48"
                />
                <span className="material-symbols-outlined absolute left-2 top-1.5 text-[15px] text-on-surface-variant">
                  search
                </span>
              </div>

              {/* Bulk Nudge Button */}
              {missingStudents.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemindAllMissing(missingStudents.length)}
                  className="px-3 py-1 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  title="Send submission notification email/portal reminder to all missing students"
                >
                  <span className="material-symbols-outlined text-[15px]">send</span>
                  <span>Remind All Missing ({missingStudents.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider bg-surface-container-low/40">
                  <th className="py-3 px-4">Scholar Name &amp; ID</th>
                  <th className="py-3 px-4">Submission Status</th>
                  <th className="py-3 px-4">Draft Title &amp; Word Count</th>
                  <th className="py-3 px-4 text-center">Score (/100)</th>
                  <th className="py-3 px-4 text-right">Instructor Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-sm">
                {filteredRoster.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <span className="material-symbols-outlined text-[32px] text-outline-variant">person_search</span>
                        <p className="font-semibold text-sm">No students match this filter.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRoster.map((student) => (
                    <tr key={student.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-space-sm">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            student.hasSubmitted ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container text-on-surface-variant'
                          }`}>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <span className="font-label-md text-sm font-bold text-on-surface block">
                              {student.name}
                            </span>
                            <span className="text-[11px] font-code-inline text-on-surface-variant">
                              {student.rollNo} • {student.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {student.hasSubmitted ? (
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-tertiary-fixed text-on-tertiary-container">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              Submitted
                            </span>
                            <span className="text-[10px] text-on-surface-variant font-code-inline">
                              {student.submittedAt || 'Today'}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-error-container text-on-error-container">
                            <span className="material-symbols-outlined text-[13px]">pending</span>
                            Missing / Not Submitted
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {student.hasSubmitted ? (
                          <div>
                            <span className="font-medium text-xs text-on-surface block truncate max-w-xs">
                              “{student.title || 'Assignment Submission'}”
                            </span>
                            <span className="text-[11px] font-code-inline text-on-surface-variant">
                              {student.submission?.wordCount || 0} words
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-on-surface-variant italic">
                            Awaiting initial draft upload
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {student.hasSubmitted ? (
                          <span className="font-code-inline text-sm font-bold text-on-surface">
                            {student.score !== null ? `${student.score}/100` : 'Grading...'}
                          </span>
                        ) : (
                          <span className="text-on-surface-variant font-code-inline text-xs">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {student.hasSubmitted ? (
                          <button
                            type="button"
                            onClick={() => onNavigateToReport(student.submission)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-xs font-semibold transition-all border border-surface-container"
                          >
                            <span>Inspect Report</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSendReminder(student)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-fixed hover:bg-primary-fixed-dim text-primary font-label-md text-xs font-semibold transition-all"
                              title={`Send email notification reminder to ${student.email}`}
                            >
                              <span className="material-symbols-outlined text-[14px]">mail</span>
                              <span>Send Reminder</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onNavigateToSubmit && onNavigateToSubmit(student.name)}
                              className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                              title="Submit draft on scholar's behalf"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──── SECTION 2: COURSE ASSIGNMENTS & GUIDELINES ──── */}
      {activeTabSection === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl items-start animate-fade-in">
          {/* Left Column: Active Assignments List (7 cols) */}
          <div className="xl:col-span-7 space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-sm">
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Curriculum Assignments ({assignments.length})
                </h2>
                <span className="px-space-xs py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant">
                  {currentClass.name}
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
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl border border-dashed border-surface-container flex flex-col items-center justify-center text-center space-y-space-sm py-12">
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
                  className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary shadow-xs transition-all mt-2"
                >
                  + Create Assignment
                </button>
              </div>
            ) : (
              assignments.map((asg) => (
                <div key={asg.id} className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-space-md border border-surface-container">
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
                      className="self-start shrink-0 px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md shadow-xs active:translate-y-0.5 transition-all font-semibold" 
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
                <span className="font-label-sm text-label-sm text-on-surface-variant">Live Submissions</span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">history_edu</span>
            </div>

            {/* Desk Ledger Paper Card */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-container">
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
                    className="px-space-md py-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold border border-surface-container mt-2"
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

      {/* ──── SECTION 3: BATCH GRADING QUEUE VIEW ──── */}
      {activeTabSection === 'batch_queue' && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container overflow-hidden space-y-space-md animate-fade-in">
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
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary transition-all mt-2"
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

      {/* Flight Control Cheatsheet Modal */}
      <FlightControlModal
        isOpen={showFlightControl}
        onClose={() => setShowFlightControl(false)}
      />
    </div>
  );
}
