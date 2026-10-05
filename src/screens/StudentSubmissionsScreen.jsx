import React, { useState } from 'react';

export const DEFAULT_CSBS_PENDING_ASSIGNMENTS = [
  {
    id: 'asg-cb330-1',
    title: 'SOLID Principles & Design Patterns in Enterprise Software',
    subject: '24CB330: Object Oriented Programming',
    courseCode: '24CB330',
    instructor: 'Dr. D S Vinod (DSV)',
    room: 'IS103 / IS101',
    credits: '4 Credits',
    dueDate: 'Friday, Oct 16, 2026',
    dueDays: 'Due in 4 days',
    points: 100,
    wordLimit: 2000,
    rubric: 'STEM & Scientific Lab Report Standard',
    templateId: 'stem_lab',
    category: 'Engineering & Computing',
    description: 'Provide an architectural analysis of creational, structural, and behavioral design patterns in high-concurrency systems with UML diagrams and complexity analysis.'
  },
  {
    id: 'asg-cb310-1',
    title: 'Chomsky Hierarchy: Context-Free Grammars & Pumping Lemma',
    subject: '24CB310: Formal Language & Automata Theory',
    courseCode: '24CB310',
    instructor: 'Ms. Sindhu G (SG)',
    room: 'IS103 / IS102',
    credits: '4 Credits',
    dueDate: 'Monday, Oct 19, 2026',
    dueDays: 'Due in 7 days',
    points: 100,
    wordLimit: 1800,
    rubric: 'STEM & Scientific Lab Report Standard',
    templateId: 'stem_lab',
    category: 'Theoretical Computer Science',
    description: 'Formal proofs demonstrating language non-regularity using the Pumping Lemma, PDA state transitions, and deterministic vs non-deterministic Turing machines.'
  },
  {
    id: 'asg-cb350-1',
    title: 'Software Requirements Specification (IEEE 830) & Architecture Brief',
    subject: '24CB350: Software Engineering',
    courseCode: '24CB350',
    instructor: 'Ms. Shruthi N (SN)',
    room: 'IS103 / IS101',
    credits: '4 Credits',
    dueDate: 'Wednesday, Oct 21, 2026',
    dueDays: 'Due in 9 days',
    points: 100,
    wordLimit: 1600,
    rubric: 'Business Case Study & Strategy Brief',
    templateId: 'business_case',
    category: 'Software Engineering',
    description: 'Author a complete SRS document encompassing functional requirements, boundary conditions, ER schemas, and risk mitigation protocols for a cloud ERP platform.'
  },
  {
    id: 'asg-cb360-1',
    title: 'Cost-Volume-Profit (CVP) Analysis & Marginal Costing Report',
    subject: '24CB360: Financial & Cost Accounting',
    courseCode: '24CB360',
    instructor: 'Prof. Kaveri D (KD)',
    room: 'IS102 / IS103',
    credits: '4 Credits',
    dueDate: 'Friday, Oct 23, 2026',
    dueDays: 'Due in 11 days',
    points: 100,
    wordLimit: 1500,
    rubric: 'Business Case Study & Strategy Brief',
    templateId: 'business_case',
    category: 'Business & Finance',
    description: 'Financial analysis and break-even computation for a multi-product manufacturing facility evaluating marginal costing, contribution margin, and margin of safety.'
  },
  {
    id: 'asg-cb320-1',
    title: 'Memory Hierarchy & Cache Coherence Protocol Evaluation',
    subject: '24CB320: Computer Organization & Architecture',
    courseCode: '24CB320',
    instructor: 'Ms. Malapriya S (MPS)',
    room: 'IS103 / IS102',
    credits: '4 Credits',
    dueDate: 'Tuesday, Oct 27, 2026',
    dueDays: 'Due in 15 days',
    points: 100,
    wordLimit: 1800,
    rubric: 'STEM & Scientific Lab Report Standard',
    templateId: 'stem_lab',
    category: 'Hardware & Architecture',
    description: 'Technical evaluation of MESI cache snooping protocols, multi-level TLB latency metrics, and pipelined superscalar execution hazards.'
  },
  {
    id: 'asg-hu311-1',
    title: 'Human Values in Societal Engineering & Professional Ethics',
    subject: '24HU311: Universal Human Values (UHV) - II',
    courseCode: '24HU311',
    instructor: 'Ms. Vyshali Rao K P (VRK)',
    room: 'IS103',
    credits: '2 Credits',
    dueDate: 'Thursday, Oct 29, 2026',
    dueDays: 'Due in 17 days',
    points: 100,
    wordLimit: 1400,
    rubric: 'AP Lit Analytical Synthesis Standard',
    templateId: 'ap_lit',
    category: 'Humanities & Ethics',
    description: 'Reflective and critical essay on harmony in existence, ethical human conduct in automated algorithmic decision-making, and professional stewardship.'
  }
];

// Helper to export an assignment to standard RFC 5545 iCalendar (.ics) format
export function exportAssignmentToICS(asg) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const formatICSDate = (d) => {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  };
  
  // Calculate approximate due date from dueDays
  const dueDate = new Date();
  let daysToAdd = 4;
  if (asg.dueDays) {
    const match = asg.dueDays.match(/\d+/);
    if (match) daysToAdd = parseInt(match[0], 10);
  }
  dueDate.setDate(dueDate.getDate() + daysToAdd);
  dueDate.setHours(23, 59, 0, 0);

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//JSS STU//CSBS Coursework Desk//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${asg.id || 'asg'}-${Date.now()}@jssstuniv.in`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${formatICSDate(dueDate)}`,
    `DTEND:${formatICSDate(dueDate)}`,
    `SUMMARY:Assignment Due: ${asg.title || 'Coursework'} (${asg.courseCode || 'CSBS'})`,
    `DESCRIPTION:Course: ${asg.subject}\\nInstructor: ${asg.instructor}\\nWord Limit: ${asg.wordLimit || 1800} words\\nRubric: ${asg.rubric}\\nRoom: ${asg.room || 'IS103'}\\n\\nDetails: ${asg.description || ''}`,
    `LOCATION:Room ${asg.room || 'IS103'}, Dept of ISE, JSS STU`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${asg.title} is due in 24 hours!`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${asg.courseCode || 'assignment'}_deadline.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function exportAllAssignmentsToICS(assignments) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const formatICSDate = (d) => {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  };

  const events = assignments.map(asg => {
    const dueDate = new Date();
    let daysToAdd = 4;
    if (asg.dueDays) {
      const match = asg.dueDays.match(/\d+/);
      if (match) daysToAdd = parseInt(match[0], 10);
    }
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    dueDate.setHours(23, 59, 0, 0);

    return [
      'BEGIN:VEVENT',
      `UID:${asg.id || 'asg'}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}@jssstuniv.in`,
      `DTSTAMP:${formatICSDate(now)}`,
      `DTSTART:${formatICSDate(dueDate)}`,
      `DTEND:${formatICSDate(dueDate)}`,
      `SUMMARY:Assignment Due: ${asg.title} (${asg.courseCode || 'CSBS'})`,
      `DESCRIPTION:Course: ${asg.subject}\\nInstructor: ${asg.instructor}\\nRubric: ${asg.rubric}`,
      `LOCATION:Room ${asg.room || 'IS103'}, Dept of ISE, JSS STU`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${asg.title} is due tomorrow!`,
      'END:VALARM',
      'END:VEVENT'
    ].join('\r\n');
  }).join('\r\n');

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//JSS STU//CSBS Semester Coursework Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    events,
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `CSBS_III_Sem_All_Deadlines.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export default function StudentSubmissionsScreen({
  submissions = [],
  assignments = [],
  studentProfile,
  onNavigateToReport,
  onNavigateToSubmit,
  onOpenReceiptModal,
  onOpenQuiz,
  onOpenProfileModal
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'graded' | 'pending'
  const [search, setSearch] = useState('');
  const [calendarToast, setCalendarToast] = useState(null);

  // Use provided assignments or fallback to authentic CSBS III Sem roster
  const allAssignments = assignments && assignments.length > 0 ? assignments : DEFAULT_CSBS_PENDING_ASSIGNMENTS;

  const handleExportSingle = (e, asg) => {
    e.stopPropagation();
    exportAssignmentToICS(asg);
    setCalendarToast(`Calendar reminder exported for ${asg.courseCode || asg.title}!`);
    setTimeout(() => setCalendarToast(null), 3500);
  };

  const handleExportAll = () => {
    exportAllAssignmentsToICS(pendingAssignmentsList);
    setCalendarToast(`Exported all ${pendingAssignmentsList.length} assignment deadlines (.ics)!`);
    setTimeout(() => setCalendarToast(null), 3500);
  };

  // Filter submissions by current student
  const studentSubs = submissions.filter(s => {
    if (!studentProfile) return true;
    return s.studentId === studentProfile.id || 
      (s.studentName && s.studentName.toLowerCase().trim() === (studentProfile.name || 'Pratyush Raj').toLowerCase().trim());
  });

  // Calculate unsubmitted pending assignments
  const pendingAssignmentsList = allAssignments.filter(asg => {
    const isSubmitted = studentSubs.some(s => 
      (s.assignmentId && s.assignmentId === asg.id) ||
      (s.subject && s.subject.toLowerCase().includes((asg.courseCode || asg.subject).toLowerCase()))
    );
    return !isSubmitted;
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
  const inReviewCount = studentSubs.length - gradedCount;
  const avgScore = studentSubs.length > 0 
    ? (studentSubs.reduce((acc, s) => acc + (s.overallScore || s.score || 88), 0) / studentSubs.length).toFixed(1)
    : null;

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* ──── STUDENT SCHOLAR HEADER & INSTITUTION BANNER ──── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-md border-b border-surface-container">
        <div className="space-y-space-xs max-w-3xl">
          <div className="flex flex-wrap items-center gap-space-sm">
            <span className="font-code-inline text-code-inline text-secondary font-bold tracking-wide uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">school</span>
              {studentProfile?.institution || 'JSS Science and Technology University'}
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              {studentProfile?.department || 'Department of Information Science & Engineering'}
            </span>
          </div>

          <div className="flex items-baseline gap-space-sm pt-1">
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-semibold">
              Pending Assignments &amp; Coursework Desk
            </h1>
            <button
              onClick={onOpenProfileModal}
              className="p-1 rounded text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors"
              title="View or Edit Student Scholar Credentials"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1.5 text-xs font-label-sm">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container border border-surface-container">
              <span className="font-bold text-primary uppercase tracking-wider text-[10px]">NAME:</span>
              <span className="font-semibold text-on-surface">{studentProfile?.name || 'Pratyush Raj'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container border border-surface-container">
              <span className="font-bold text-secondary uppercase tracking-wider text-[10px]">USN:</span>
              <span className="font-mono font-semibold text-on-surface">{studentProfile?.usn || '01JST25UCBO65'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container border border-surface-container">
              <span className="font-bold text-tertiary uppercase tracking-wider text-[10px]">ROLL NO:</span>
              <span className="font-mono font-semibold text-on-surface">{studentProfile?.rollNo || '33'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container border border-surface-container">
              <span className="font-bold text-primary uppercase tracking-wider text-[10px]">COURSE:</span>
              <span className="font-semibold text-on-surface">{studentProfile?.grade || "III Sem CSBS 'A'"}</span>
            </div>
          </div>
        </div>

        {/* Turn-in Action Group */}
        <div className="flex flex-wrap items-center gap-space-sm shrink-0">
          <button
            onClick={() => onNavigateToSubmit && onNavigateToSubmit({ mode: 'self_improvement' })}
            className="px-space-md py-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-all border border-surface-container flex items-center gap-space-xs"
            type="button"
            title="Submit personal draft with customizable grading criteria for AI self-improvement"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">psychology</span>
            <span>Self-Improvement Review</span>
          </button>
          <button
            onClick={() => onNavigateToSubmit && onNavigateToSubmit()}
            className="px-space-md py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-dim font-label-md text-label-md font-semibold transition-all shadow-sm flex items-center gap-space-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span>Turn In Assignment</span>
          </button>
        </div>
      </div>

      {/* ──── PORTFOLIO METRICS ROW ──── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md">
        {/* Pending Assignments */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container space-y-space-xs hover-lift transition-all">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Pending Tasks
            </span>
            <span className="material-symbols-outlined text-primary text-[22px] animate-float">pending_actions</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface font-semibold">
            {pendingAssignmentsList.length}
          </div>
          <span className="font-body-sm text-xs text-primary block font-medium">
            {pendingAssignmentsList.length > 0 ? `${pendingAssignmentsList.length} active course assignments due` : 'All tasks completed!'}
          </span>
        </div>

        {/* Total Submitted */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container space-y-space-xs hover-lift transition-all">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Turned In
            </span>
            <span className="material-symbols-outlined text-secondary text-[22px]">assignment_turned_in</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface font-semibold">
            {studentSubs.length}
          </div>
          <span className="font-body-sm text-xs text-on-surface-variant block">
            Locked &amp; certified submissions
          </span>
        </div>

        {/* Graded vs In Review */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container space-y-space-xs hover-lift transition-all">
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
            {inReviewCount > 0 ? `${inReviewCount} under faculty review` : 'All submissions evaluated'}
          </span>
        </div>

        {/* Average Score */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container space-y-space-xs hover-lift transition-all">
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
            {avgScore ? 'Honors standing across completed coursework' : 'Pending initial grade baseline'}
          </span>
        </div>
      </div>

      {/* ──── TOAST NOTIFICATION FOR CALENDAR EXPORT ──── */}
      {calendarToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-on-surface text-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-surface-container animate-fade-in-up">
          <span className="material-symbols-outlined text-secondary text-[22px]">event_available</span>
          <span className="text-xs font-label-md font-semibold">{calendarToast}</span>
        </div>
      )}

      {/* ──── SECTION 1: PENDING ASSIGNMENTS (FIRST PRIORITY DISPLAY) ──── */}
      <div className="space-y-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              <h2 className="font-headline-md text-xl font-bold text-on-surface">
                Pending Coursework &amp; Assignments Due
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant">
              Coursework assigned by Department of Information Science &amp; Engineering faculty for III Sem CSBS &apos;A&apos;.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pendingAssignmentsList.length > 0 && (
              <button
                type="button"
                onClick={handleExportAll}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold border border-surface-container flex items-center gap-1.5 transition-all hover-lift shadow-xs active:scale-95"
                title="Export all course deadlines to Apple/Google/Outlook Calendar (.ics)"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">calendar_month</span>
                <span>Export All (.ics)</span>
              </button>
            )}
            <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold font-code-inline shadow-xs">
              {pendingAssignmentsList.length} Active
            </span>
          </div>
        </div>

        {pendingAssignmentsList.length === 0 ? (
          <div className="p-space-lg rounded-2xl bg-surface-container-low border border-surface-container text-center space-y-2 animate-fade-in">
            <span className="material-symbols-outlined text-[32px] text-secondary">verified</span>
            <h3 className="font-bold text-sm text-on-surface">No Pending Assignments!</h3>
            <p className="text-xs text-on-surface-variant">You are all caught up with your III Sem CSBS &apos;A&apos; coursework.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {pendingAssignmentsList.map((asg) => {
              // Parse urgency
              let days = 4;
              if (asg.dueDays) {
                const match = asg.dueDays.match(/\d+/);
                if (match) days = parseInt(match[0], 10);
              }
              const isUrgent = days <= 4;
              const isUpcoming = days > 4 && days <= 7;

              return (
                <div 
                  key={asg.id}
                  className={`p-space-lg rounded-2xl bg-surface-container-lowest border-2 transition-all flex flex-col justify-between space-y-space-md group hover-lift ${
                    isUrgent 
                      ? 'border-error/30 hover:border-error/70 hover:shadow-lg' 
                      : isUpcoming
                      ? 'border-secondary/30 hover:border-secondary/70 hover:shadow-lg'
                      : 'border-surface-container hover:border-primary/40 hover:shadow-lg'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Badge Row */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary-fixed text-primary font-code-inline">
                        {asg.courseCode || '24CB330'}
                      </span>
                      
                      {/* Urgency Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                        isUrgent
                          ? 'bg-error-container text-on-error-container animate-pulse'
                          : isUpcoming
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        <span className="material-symbols-outlined text-[13px]">
                          {isUrgent ? 'alarm_on' : 'schedule'}
                        </span>
                        {isUrgent ? `🔴 ${asg.dueDays || 'Due in 4 days'}` : isUpcoming ? `🟡 ${asg.dueDays || 'Due in 7 days'}` : `🟢 ${asg.dueDays || 'Scheduled'}`}
                      </span>
                    </div>

                    {/* Course & Title */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-on-surface-variant block truncate">
                        {asg.subject}
                      </span>
                      <h3 className="font-headline-sm text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                        {asg.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {asg.description}
                    </p>

                    {/* Metadata Row */}
                    <div className="pt-2 border-t border-surface-container space-y-1 text-[11px] text-on-surface-variant">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-primary">person</span>
                          Faculty: <strong className="text-on-surface">{asg.instructor}</strong>
                        </span>
                        <span>Room {asg.room || 'IS103'}</span>
                      </div>
                      <div className="flex items-center justify-between text-secondary font-medium">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">lock</span>
                          <span>Rubric: {asg.rubric?.split(' ')[0] || 'Standard'}</span>
                        </span>
                        <span>Max {asg.wordLimit || 1800} words</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Group */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleExportSingle(e, asg)}
                      className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-secondary border border-surface-container transition-colors"
                      title="Add deadline to Calendar (.ics)"
                    >
                      <span className="material-symbols-outlined text-[18px]">event</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateToSubmit && onNavigateToSubmit(asg)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-primary text-on-primary hover:bg-primary-dim font-label-md text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 group-hover:scale-[1.01]"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit_document</span>
                      <span>Start &amp; Turn In</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ──── SECTION 2: TURNED-IN ASSIGNMENTS PORTFOLIO ──── */}
      <div className="bg-surface-container-low border border-surface-container rounded-2xl overflow-hidden shadow-xs space-y-0">
        {/* Filter & Search Header */}
        <div className="p-space-md border-b border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-low/80">
          <div className="flex items-center gap-2">
            <h2 className="font-headline-sm text-sm font-bold text-on-surface pr-2">
              Turned-In Portfolio ({studentSubs.length})
            </h2>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-surface-container text-on-surface border border-surface-container font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All ({studentSubs.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                filter === 'pending'
                  ? 'bg-surface-container text-on-surface border border-surface-container font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              In Review ({inReviewCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('graded')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
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
              placeholder="Search title, course, or receipt #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-surface-container border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-52 sm:w-64"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[15px] text-on-surface-variant">
              search
            </span>
          </div>
        </div>

        {/* Submissions List */}
        {filteredSubs.length === 0 ? (
          <div className="p-space-xl text-center space-y-space-md">
            <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[28px]">inventory_2</span>
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                {studentSubs.length === 0 ? 'No Past Submissions on File' : 'No Submissions Match Filters'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {studentSubs.length === 0 
                  ? 'Your turned-in coursework and certified submission receipts will appear here once submitted.'
                  : 'Try changing your search keywords or reset filter to view all.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-surface-container">
            {filteredSubs.map((sub) => {
              const isGraded = sub.approved || sub.status === 'Graded';
              return (
                <div key={sub.id} className="p-space-lg hover:bg-surface-container/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                  {/* Left: Title & Metadata */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-space-xs">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-on-surface-variant border border-surface-container font-code-inline">
                        {sub.subject || '24CB330: Object Oriented Programming'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-tertiary-fixed text-on-tertiary-container">
                        <span className="material-symbols-outlined text-[13px]">lock</span>
                        Locked for Grading
                      </span>
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
                        Instructor: <strong className="text-on-surface font-semibold">{sub.teacherName || 'Dr. D S Vinod'}</strong>
                      </span>
                      <span>•</span>
                      <span className="font-code-inline">{sub.submittedAt || sub.timestamp || 'Today'}</span>
                      <span>•</span>
                      <span className="font-code-inline">{sub.wordCount || 0} words</span>
                    </div>
                  </div>

                  {/* Right: Score & Actions */}
                  <div className="flex items-center gap-space-md shrink-0 justify-between md:justify-end">
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
                          title="Interactive Practice Quiz"
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
