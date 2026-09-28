import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';

export default function RoleSelectionGateway({ onSelectRole, teacherProfile, institutionName = '' }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [hoveredRole, setHoveredRole] = useState(null);

  const handleConfirmRole = (role) => {
    sounds.playStampThud();
    setSelectedRole(role);
    setTimeout(() => {
      onSelectRole(role);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between p-4 sm:p-8 animate-fade-in relative overflow-hidden">
      {/* Decorative Collegiate Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Top Header Branding */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-surface-container relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[24px]">ink_pen</span>
          </div>
          <div>
            <span className="font-headline-sm text-lg font-bold text-primary tracking-tight block">
              RethoricalAI
            </span>
            <span className="text-[11px] font-code-inline text-on-surface-variant block uppercase tracking-wider">
              Collegiate Assessment Engine
            </span>
          </div>
        </div>

        {institutionName ? (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold border border-surface-container">
            <span className="material-symbols-outlined text-[15px] text-primary">school</span>
            <span>{institutionName}</span>
          </div>
        ) : null}
      </header>

      {/* Main Selection Area */}
      <main className="max-w-4xl mx-auto w-full my-auto py-10 space-y-8 relative z-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">lock_clock</span>
            <span>One-Time Session Identification</span>
          </div>

          <h1 className="font-display-lg text-2xl sm:text-4xl font-bold text-on-surface tracking-tight">
            Select Your Academic Role
          </h1>

          <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Please choose whether you are accessing RethoricalAI as a <strong>Faculty Instructor</strong> or as a <strong>Student Scholar</strong>. Once selected, your role is permanently locked for this session to ensure examination integrity.
          </p>
        </div>

        {/* Dual Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* 1. TEACHER / FACULTY CARD */}
          <div
            onMouseEnter={() => setHoveredRole('teacher')}
            onMouseLeave={() => setHoveredRole(null)}
            onClick={() => handleConfirmRole('teacher')}
            className={`p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border-2 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
              selectedRole === 'teacher'
                ? 'border-primary shadow-xl scale-[1.02] ring-2 ring-primary/20'
                : 'border-surface-container hover:border-primary/50 hover:shadow-lg hover:scale-[1.01]'
            }`}
          >
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary opacity-80"></div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[32px]">school</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold">
                  Faculty Access
                </span>
              </div>

              <div className="space-y-1.5">
                <h2 className="font-headline-md text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                  Instructor &amp; Faculty
                </h2>
                <p className="text-xs font-semibold text-primary">
                  {teacherProfile?.title || 'Faculty Lead & Rhetoric Chair'}
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed pt-1">
                  Manage teaching schedules, monitor real-time class submission rosters, speed-grade drafts with AI assistance, and sync gradebooks.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2 pt-2 border-t border-surface-container text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-primary">groups</span>
                  <span>Class Submission Tracker &amp; Roster Matrix</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-primary">speed</span>
                  <span>Flight Control Speed-Grading &amp; Shortcuts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-primary">tune</span>
                  <span>Customizable Rubrics &amp; Class Insights</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-label-md text-sm font-bold shadow-sm group-hover:bg-primary-dim transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Enter as Faculty Instructor</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* 2. STUDENT / SCHOLAR CARD */}
          <div
            onMouseEnter={() => setHoveredRole('student')}
            onMouseLeave={() => setHoveredRole(null)}
            onClick={() => handleConfirmRole('student')}
            className={`p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border-2 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
              selectedRole === 'student'
                ? 'border-secondary shadow-xl scale-[1.02] ring-2 ring-secondary/20'
                : 'border-surface-container hover:border-secondary/50 hover:shadow-lg hover:scale-[1.01]'
            }`}
          >
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary opacity-80"></div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[32px]">person</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold">
                  Scholar Portal
                </span>
              </div>

              <div className="space-y-1.5">
                <h2 className="font-headline-md text-xl font-bold text-on-surface group-hover:text-secondary transition-colors">
                  Student Scholar
                </h2>
                <p className="text-xs font-semibold text-secondary">
                  Enrolled Coursework &amp; Turn-In Desk
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed pt-1">
                  Turn in assignments to assigned instructors, certify academic honor pledges, receive permanent locked submission receipts, and review feedback.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2 pt-2 border-t border-surface-container text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
                  <span>Turn-In Lock &amp; Academic Integrity Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary">receipt_long</span>
                  <span>Official Verifiable Digital Submission Receipts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary">quiz</span>
                  <span>Submission Portfolio &amp; Interactive Quizzes</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl bg-secondary text-on-secondary font-label-md text-sm font-bold shadow-sm group-hover:bg-secondary-dim transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Enter as Student Scholar</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lock Assurance Notice */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container text-center text-xs text-on-surface-variant flex items-center justify-center gap-2 max-w-xl mx-auto">
          <span className="material-symbols-outlined text-[16px] text-error">lock</span>
          <span>
            <strong>Institutional Lock Policy:</strong> Changing between Student and Teacher after entry is disabled to maintain examination compliance.
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full py-3 text-center text-xs text-on-surface-variant border-t border-surface-container relative z-10">
        <span>{institutionName} • Department of Humanities &amp; Rhetoric • 2026–2027 Academic Session</span>
      </footer>
    </div>
  );
}
