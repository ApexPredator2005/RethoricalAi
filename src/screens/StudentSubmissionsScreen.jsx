import React, { useState } from 'react';

export default function StudentSubmissionsScreen({
  submissions = [],
  studentProfile,
  onNavigateToReport,
  onNavigateToSubmit,
  onOpenReceiptModal,
  onOpenQuiz,
  onOpenProfileModal
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'graded' | 'pending'
  const [search, setSearch] = useState('');

  // Filter submissions by current student
  const studentSubs = submissions.filter(s => {
    if (!studentProfile) return true;
    return s.studentId === studentProfile.id || 
      (s.studentName && s.studentName.toLowerCase().trim() === studentProfile.name.toLowerCase().trim());
  });

  const filteredSubs = studentSubs.filter(s => {
    if (filter === 'graded' && !s.approved && s.status !== 'Graded') return false;
    if (filter === 'pending' && (s.approved || s.status === 'Graded')) return false;
    if (search) {
      const q = search.toLowerCase();
      return (s.title && s.title.toLowerCase().includes(q)) ||
             (s.subject && s.subject.toLowerCase().includes(q)) ||
             (s.receiptCode && s.receiptCode.toLowerCase().includes(q));
    }
    return true;
  });

  const gradedCount = studentSubs.filter(s => s.approved || s.status === 'Graded').length;
  const pendingCount = studentSubs.length - gradedCount;
  const avgScore = studentSubs.length > 0 
    ? (studentSubs.reduce((acc, s) => acc + (s.overallScore || s.score || 88), 0) / studentSubs.length).toFixed(1)
    : null;

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* ──── STUDENT SCHOLAR HEADER & INSTITUTION BANNER ──── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-md border-b border-surface-container">
        <div className="space-y-space-xs max-w-2xl">
          <div className="flex flex-wrap items-center gap-space-sm">
            <span className="font-code-inline text-code-inline text-secondary font-bold tracking-wide uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">school</span>
              {studentProfile?.institution || 'Oakridge International Collegiate Academy'}
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Student Scholar Portal
            </span>
          </div>

          <div className="flex items-baseline gap-space-sm pt-1">
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-semibold">
              My Assignment Portfolio &amp; Turn-Ins
            </h1>
            <button
              onClick={onOpenProfileModal}
              className="p-1 rounded text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors"
              title="View or Switch Student Scholar"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant">
            Viewing records for <strong className="text-on-surface font-semibold">{studentProfile?.name || 'Aria Montgomery'}</strong> ({studentProfile?.rollNo || '11A-01'} • {studentProfile?.grade || 'Grade 11 - Section A'}). Once submitted, assignments are permanently locked for official grading.
          </p>
        </div>

        {/* Turn-in Action */}
        <div className="flex items-center gap-space-sm shrink-0">
          <button
            onClick={onNavigateToSubmit}
            className="px-space-md py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-dim font-label-md text-label-md font-semibold transition-all shadow-sm flex items-center gap-space-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span>Turn In An Assignment</span>
          </button>
        </div>
      </div>

      {/* ──── PORTFOLIO METRICS ROW ──── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
        {/* Total Submitted */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container space-y-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Assignments Turned In
            </span>
            <span className="material-symbols-outlined text-primary text-[22px]">assignment_turned_in</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface font-semibold">
            {studentSubs.length}
          </div>
          <span className="font-body-sm text-xs text-on-surface-variant block">
            Official collegiate submissions on file
          </span>
        </div>

        {/* Graded vs In Review */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container space-y-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Grading Status
            </span>
            <span className="material-symbols-outlined text-tertiary text-[22px]">rate_review</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface font-semibold">
            {gradedCount} <span className="font-body-sm text-sm font-normal text-on-surface-variant">/ {studentSubs.length}</span>
          </div>
          <span className="font-body-sm text-xs text-tertiary block font-medium">
            {pendingCount > 0 ? `${pendingCount} under instructor review` : 'All submissions evaluated'}
          </span>
        </div>

        {/* Average Score */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container space-y-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Cumulative Average
            </span>
            <span className="material-symbols-outlined text-secondary text-[22px]">auto_graph</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface font-semibold">
            {avgScore ? `${avgScore}%` : '—'}
          </div>
          <span className="font-body-sm text-xs text-on-surface-variant block">
            {avgScore ? 'High Honors range across enrolled rubrics' : 'Pending initial grade baseline'}
          </span>
        </div>

        {/* Policy Notice Card */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container space-y-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Turn-In Integrity Lock
            </span>
            <span className="material-symbols-outlined text-error text-[22px]">lock</span>
          </div>
          <div className="font-label-md text-sm font-bold text-on-surface flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            Permanent Lock Active
          </div>
          <span className="font-body-sm text-[11px] text-on-surface-variant block leading-tight">
            Resubmissions are blocked post-turn-in to preserve auditable academic standards.
          </span>
        </div>
      </div>

      {/* ──── SUBMISSIONS LIST & FILTER BAR ──── */}
      <div className="bg-surface-container-low border border-surface-container rounded-2xl overflow-hidden shadow-xs">
        {/* Filter & Search Header */}
        <div className="p-space-md border-b border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-low/70">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-surface-container text-on-surface border border-surface-container font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Submissions ({studentSubs.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                filter === 'pending'
                  ? 'bg-surface-container text-on-surface border border-surface-container font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              Awaiting Grade ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('graded')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                filter === 'graded'
                  ? 'bg-surface-container text-on-surface border border-surface-container font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Graded ({gradedCount})
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search title, subject, or receipt #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-surface-container border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-52 sm:w-64"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[15px] text-on-surface-variant">
              search
            </span>
          </div>
        </div>

        {/* Submissions Table / Cards */}
        {filteredSubs.length === 0 ? (
          <div className="p-space-xl text-center space-y-space-md">
            <div className="w-14 h-14 rounded-full bg-surface-container mx-auto flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[32px]">inventory_2</span>
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                {studentSubs.length === 0 ? 'No Past Submissions on File' : 'No Submissions Match Filters'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {studentSubs.length === 0 
                  ? 'You haven’t turned in any assignments yet. Select an assignment to draft, attach references, and submit to your instructor.'
                  : 'Try changing your search keywords or toggle the filter to view all assignments.'}
              </p>
            </div>
            {studentSubs.length === 0 && (
              <button
                type="button"
                onClick={onNavigateToSubmit}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-dim font-label-md text-xs font-semibold shadow-xs transition-all inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span>Open Assignment Submission Desk</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-surface-container">
            {filteredSubs.map((sub) => {
              const isGraded = sub.approved || sub.status === 'Graded';
              return (
                <div key={sub.id} className="p-space-lg hover:bg-surface-container/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                  {/* Left Column: Title & Subject Details */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-space-xs">
                      {/* Course badge */}
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-on-surface-variant border border-surface-container">
                        {sub.subject || 'AP English Literature & Rhetoric'}
                      </span>
                      {/* Lock badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-tertiary-fixed text-on-tertiary-container">
                        <span className="material-symbols-outlined text-[13px]">lock</span>
                        Locked for Grading
                      </span>
                      {/* Receipt Code */}
                      <span className="text-[11px] font-code-inline text-on-surface-variant">
                        Receipt: #{sub.receiptCode || sub.id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-base font-bold text-on-surface truncate">
                      “{sub.title || 'Assignment Submission'}”
                    </h3>

                    <div className="flex flex-wrap items-center gap-space-md text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-primary">person</span>
                        Instructor: <strong className="text-on-surface font-semibold">{sub.teacherName || 'Dr. Eleanor Vance'}</strong>
                      </span>
                      <span>•</span>
                      <span className="font-code-inline">
                        {sub.submittedAt || sub.timestamp || 'Today'}
                      </span>
                      <span>•</span>
                      <span className="font-code-inline">
                        {sub.wordCount || 0} words
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Score & Action Buttons */}
                  <div className="flex items-center gap-space-md shrink-0 justify-between md:justify-end">
                    {/* Score / Status Display */}
                    <div className="text-right">
                      {isGraded ? (
                        <div className="space-y-0.5">
                          <span className="font-display-lg text-lg font-bold text-secondary block font-code-inline">
                            {sub.overallScore || sub.score || 91}/100
                          </span>
                          <span className="text-[11px] font-semibold text-secondary">
                            Graded &amp; Certified
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="font-label-md text-xs font-semibold text-on-surface-variant block">
                            Status
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                            Under Review
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenReceiptModal && onOpenReceiptModal(sub)}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold transition-all border border-surface-container flex items-center gap-1"
                        title="View Official Digital Receipt"
                      >
                        <span className="material-symbols-outlined text-[15px]">receipt</span>
                        <span className="hidden sm:inline">Receipt</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigateToReport && onNavigateToReport(sub)}
                        className="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-dim font-label-md text-xs font-semibold shadow-xs transition-all flex items-center gap-1"
                        title="View Evaluation & Feedback Report"
                      >
                        <span>Feedback</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>

                      {onOpenQuiz && (
                        <button
                          type="button"
                          onClick={() => onOpenQuiz(sub)}
                          className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors border border-surface-container"
                          title="Practice Grammar & Vocabulary Quiz on this essay"
                        >
                          <span className="material-symbols-outlined text-[16px]">quiz</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
