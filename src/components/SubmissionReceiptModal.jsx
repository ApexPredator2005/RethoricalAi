import React from 'react';

export default function SubmissionReceiptModal({ submission, onClose, onNavigateToReport, onNavigateToHistory }) {
  if (!submission) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Receipt Header Banner */}
        <div className="bg-primary px-space-lg py-space-md text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[32px] text-on-primary">verified</span>
            <div>
              <span className="font-label-sm text-[11px] uppercase tracking-wider font-semibold opacity-90 block">
                Official Digital Receipt
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-primary">
                Assignment Turn-In Verified
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-primary/80 hover:text-on-primary hover:bg-on-primary/10 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Receipt Slip Body */}
        <div className="p-space-lg space-y-space-md bg-surface-container-lowest overflow-y-auto max-h-[70vh]">
          {/* Institution Header Stamp */}
          <div className="text-center pb-space-sm border-b border-dashed border-surface-container">
            <span className="font-code-inline text-xs font-bold text-primary uppercase tracking-widest block">
              {submission.institution || 'Oakridge International Collegiate Academy'}
            </span>
            <span className="text-[11px] text-on-surface-variant">
              Faculty of Rhetoric &amp; Comparative Literature • Academic Records Division
            </span>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-container font-code-inline text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>LOCKED FOR GRADING • {submission.receiptCode || `OAK-${Math.floor(100000 + Math.random() * 900000)}`}</span>
            </div>
          </div>

          {/* Key Receipt Fields */}
          <div className="grid grid-cols-2 gap-space-sm text-xs bg-surface-container-low p-space-md rounded-xl border border-surface-container">
            <div>
              <span className="text-on-surface-variant block font-medium">Enrolled Scholar</span>
              <span className="font-bold text-on-surface text-sm">{submission.studentName}</span>
              <span className="text-[11px] font-code-inline text-on-surface-variant block">
                ID: {submission.rollNo || '11A-01'}
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant block font-medium">Recipient Instructor</span>
              <span className="font-bold text-on-surface text-sm">{submission.teacherName || 'Dr. Eleanor Vance'}</span>
              <span className="text-[11px] text-on-surface-variant block">
                Senior Faculty Chair
              </span>
            </div>
            <div className="col-span-2 pt-1 border-t border-surface-container">
              <span className="text-on-surface-variant block font-medium">Course &amp; Subject</span>
              <span className="font-bold text-on-surface text-sm">{submission.subject || 'AP English Literature & Rhetoric'}</span>
              <span className="text-[11px] text-on-surface-variant block">
                Class Section: {submission.className || 'Grade 11 - Section A'}
              </span>
            </div>
          </div>

          {/* Submission Details */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-surface-container">
              <span className="text-on-surface-variant">Draft Title:</span>
              <span className="font-semibold text-on-surface truncate max-w-[240px]">
                “{submission.title || 'Assignment Submission'}”
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-container">
              <span className="text-on-surface-variant">Submitted Timestamp:</span>
              <span className="font-code-inline text-on-surface font-medium">
                {submission.submittedAt || submission.timestamp || 'Just now'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-container">
              <span className="text-on-surface-variant">Word Count:</span>
              <span className="font-code-inline text-on-surface font-medium">
                {submission.wordCount || 0} words
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-container">
              <span className="text-on-surface-variant">Grading Rubric:</span>
              <span className="text-on-surface font-medium">
                {submission.rubric || 'Standard Analytical Rubric'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-container">
              <span className="text-on-surface-variant">Academic Integrity:</span>
              <span className="inline-flex items-center gap-1 text-tertiary font-bold">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                Honor Pledge Certified
              </span>
            </div>
          </div>

          {/* Lock Enforcement Notice */}
          <div className="p-space-sm rounded-lg bg-error-container/30 border border-error-container text-error text-[11px] flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">lock_clock</span>
            <div>
              <strong className="font-semibold block">Resubmission Policy Enforced:</strong>
              Once turned in, student submissions are permanently locked against editing or replacement. This preserves an auditable academic record for fair faculty evaluation.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-surface-container-low px-space-lg py-space-sm flex items-center justify-between border-t border-surface-container gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-xs font-semibold flex items-center gap-1.5 border border-surface-container transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Receipt</span>
          </button>

          <div className="flex items-center gap-2">
            {onNavigateToHistory && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToHistory();
                }}
                className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-xs font-semibold transition-all border border-surface-container"
              >
                My Submissions
              </button>
            )}
            {onNavigateToReport && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToReport(submission);
                }}
                className="px-4 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-dim font-label-md text-xs font-semibold shadow-xs transition-all flex items-center gap-1"
              >
                <span>View Feedback</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
