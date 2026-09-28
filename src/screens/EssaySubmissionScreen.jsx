import React, { useState } from 'react';
import { ASSIGNMENT_TEMPLATES, FEEDBACK_TONES } from '../data/mockData';
import { sounds } from '../utils/soundEffects';

export default function EssaySubmissionScreen({ 
  onSubmitted, 
  initialStudentName = '',
  classes = [],
  selectedClassId,
  onSelectClass,
  teacherProfile,
  studentProfile,
  role = 'student',
  submissions = [],
  onNavigateToReport,
  onNavigateToHistory,
  onOpenReceiptModal
}) {
  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0] || {
    id: 'cls-101',
    name: 'Grade 11 - Section A',
    subject: 'AP English Literature & Rhetoric',
    period: 'Period 2 (09:15 - 10:05 AM)',
    room: 'Hall 304'
  };

  const [inputMode, setInputMode] = useState('type'); // 'type' | 'upload' | 'batch'
  const [selectedTemplate, setSelectedTemplate] = useState('ap_lit');
  const [selectedTone, setSelectedTone] = useState('standard');
  const [studentName, setStudentName] = useState(initialStudentName || (role === 'student' ? (studentProfile?.name || '') : ''));
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [essayText, setEssayText] = useState('');
  const [fileName, setFileName] = useState(null);
  const [batchFiles, setBatchFiles] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRubric, setSelectedRubric] = useState('AP Lit Analytical Synthesis (Default)');
  const [honorPledge, setHonorPledge] = useState(false);

  // Check if current student has already submitted for this class/subject/template
  const activeScholarName = studentProfile?.name || studentName;
  const activeScholarId = studentProfile?.id;
  const existingSubmission = role === 'student' && submissions.find(s => 
    ((activeScholarId && s.studentId === activeScholarId) ||
     (s.studentName && activeScholarName && s.studentName.toLowerCase().trim() === activeScholarName.toLowerCase().trim())) &&
    (s.classId === selectedClassId || s.templateId === selectedTemplate)
  );

  // Reference Document State
  const [refText, setRefText] = useState('');
  const [refFileName, setRefFileName] = useState(null);

  const currentTemplate = ASSIGNMENT_TEMPLATES.find(t => t.id === selectedTemplate) || ASSIGNMENT_TEMPLATES[0];

  const words = essayText.trim() ? essayText.trim().split(/\s+/).filter(Boolean).length : 0;
  const chars = essayText.length;
  const paragraphs = essayText.trim() ? essayText.split(/\n+/).filter(Boolean).length : 0;
  const readTime = words > 0 ? (words / 220).toFixed(1) : '0.0';

  const refWords = refText.trim() ? refText.trim().split(/\s+/).filter(Boolean).length : 0;
  const refMode = refWords <= 3000 ? 'direct' : 'chunked';

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    const tmpl = ASSIGNMENT_TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      setSelectedRubric(`${tmpl.name} Standard`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingSubmission && role === 'student') {
      setErrorMessage('This assignment has already been turned in and permanently locked. Resubmission is disabled.');
      return;
    }
    if (!essayText.trim() && batchFiles.length === 0) {
      setErrorMessage('Please enter assignment text or upload a document to proceed.');
      return;
    }
    if (role === 'student' && !honorPledge) {
      setErrorMessage('Please check the Academic Honor Pledge to certify your draft and finalize your permanent submission.');
      return;
    }
    setErrorMessage('');
    sounds.playStampThud();
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      sounds.playSuccessChime();
      const receiptCode = `OAK-${Math.floor(100000 + Math.random() * 900000)}`;
      const submissionData = {
        studentId: role === 'student' ? (studentProfile?.id || 'stu-101') : 'sub-usr',
        studentName: (studentName.trim() || (role === 'student' ? (studentProfile?.name || 'Aria Montgomery') : 'Student Submission')),
        rollNo: role === 'student' ? (studentProfile?.rollNo || '11A-01') : '11A-00',
        classId: selectedClassId,
        className: currentClass.name,
        subject: currentClass.subject,
        teacherName: teacherProfile?.name || 'Dr. Eleanor Vance',
        institution: teacherProfile?.institution || 'Oakridge International Collegiate Academy',
        templateId: selectedTemplate,
        receiptCode: receiptCode,
        isLocked: true,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        title: assignmentTitle.trim() || `${currentTemplate.name} Submission`,
        text: essayText,
        template: currentTemplate,
        rubric: selectedRubric,
        tone: selectedTone,
        refText: refText,
        wordCount: words,
        overallScore: Math.floor(86 + Math.random() * 11) // High honors initial draft score
      };

      if (onSubmitted) {
        onSubmitted(submissionData);
      }
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setInputMode('type');
      // Read text if plain text file
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setEssayText(event.target.result || '');
        };
        reader.readAsText(file);
      }
    }
  };

  const handleBatchUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const formatted = files.map(f => ({
        name: f.name,
        size: `${Math.round(f.size / 1024)} KB`,
        status: 'Ready to Process'
      }));
      setBatchFiles(prev => [...prev, ...formatted]);
    }
  };

  const handleRefUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setRefFileName(file.name);
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setRefText(event.target.result || '');
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* ──── IF ASSIGNMENT ALREADY SUBMITTED & LOCKED (STUDENT POLICY LOCK) ──── */}
      {existingSubmission && role === 'student' ? (
        <div className="space-y-space-lg">
          {/* Lock Notification Hero */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border-2 border-primary/20 shadow-md space-y-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container">
              <div className="flex items-center gap-space-sm">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">lock</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-error-container text-on-error-container">
                      Turn-In Locked
                    </span>
                    <span className="text-xs font-code-inline text-on-surface-variant">
                      Receipt #{existingSubmission.receiptCode || existingSubmission.id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="font-headline-md text-xl font-bold text-on-surface pt-1">
                    Assignment Submitted &amp; Permanently Locked
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenReceiptModal && onOpenReceiptModal(existingSubmission)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold flex items-center gap-1.5 border border-surface-container transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt</span>
                  <span>Digital Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToReport && onNavigateToReport(existingSubmission)}
                  className="px-4 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-dim font-label-md text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Inspect Feedback</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Academic Policy Banner */}
            <div className="p-space-sm rounded-xl bg-surface-container-low border border-surface-container flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">policy</span>
              <div className="text-xs space-y-1">
                <span className="font-bold text-on-surface block">
                  Collegiate Examination &amp; Submission Policy:
                </span>
                <p className="text-on-surface-variant">
                  Once an assignment has been officially turned in to <strong className="text-on-surface font-semibold">{existingSubmission.teacherName || teacherProfile?.name || 'Dr. Eleanor Vance'}</strong>, it is permanently locked against alterations or resubmissions. This safeguards grading impartiality and institutional records.
                </p>
              </div>
            </div>

            {/* Submitted Metadata Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md p-space-md rounded-xl bg-surface-container-low border border-surface-container text-xs">
              <div>
                <span className="text-on-surface-variant block font-medium">Submitted Title</span>
                <span className="font-bold text-on-surface text-sm truncate block">
                  “{existingSubmission.title || 'Assignment Draft'}”
                </span>
                <span className="text-[11px] font-code-inline text-on-surface-variant">
                  {existingSubmission.wordCount || 0} words • {existingSubmission.rubric || 'Analytical Rubric'}
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant block font-medium">Target Instructor &amp; Course</span>
                <span className="font-bold text-on-surface text-sm block">
                  {existingSubmission.teacherName || 'Dr. Eleanor Vance'}
                </span>
                <span className="text-[11px] text-on-surface-variant block truncate">
                  {existingSubmission.subject || currentClass.subject} ({existingSubmission.className || currentClass.name})
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant block font-medium">Turn-In Timestamp</span>
                <span className="font-bold text-on-surface text-sm block font-code-inline">
                  {existingSubmission.submittedAt || existingSubmission.timestamp || 'Today'}
                </span>
                <span className="inline-flex items-center gap-1 text-tertiary font-bold pt-0.5">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  SHA-256 Verified Receipt
                </span>
              </div>
            </div>

            {/* Switch Enrolled Subject or Go To Portfolio */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs text-xs text-on-surface-variant border-t border-surface-container">
              <div className="flex items-center gap-2">
                <span>Want to turn in work for another course?</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => onSelectClass && onSelectClass(e.target.value)}
                  className="px-2 py-1 rounded bg-surface-container text-on-surface border border-surface-container text-xs font-semibold cursor-pointer"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} • {c.subject}
                    </option>
                  ))}
                </select>
              </div>

              {onNavigateToHistory && (
                <button
                  type="button"
                  onClick={onNavigateToHistory}
                  className="text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <span>View All Past Submissions in Portfolio</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ──── RECIPIENT INSTRUCTOR & ENROLLED COURSE IDENTIFIER ──── */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-space-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-sm border-b border-surface-container">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-primary-fixed text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">account_balance</span>
                    {teacherProfile?.institution || 'Oakridge International Collegiate Academy'}
                  </span>
                  <span className="text-on-surface-variant">•</span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {teacherProfile?.department || 'Department of Humanities & Rhetoric'}
                  </span>
                </div>

                <h1 className="font-headline-md text-xl font-bold text-on-surface tracking-tight">
                  Turn In Assignment to: <span className="text-primary">{teacherProfile?.name || 'Dr. Eleanor Vance'}</span>
                </h1>
                
                <p className="font-body-sm text-xs text-on-surface-variant">
                  {role === 'student' ? (
                    <>
                      Submitting as <strong className="text-on-surface font-semibold">{studentProfile?.name || 'Aria Montgomery'}</strong> ({studentProfile?.rollNo || '11A-01'} • {studentProfile?.grade || currentClass.name}).
                    </>
                  ) : (
                    'Faculty evaluation intake desk.'
                  )} Your submission will be evaluated against standardized collegiate rubrics.
                </p>
              </div>

              {/* Multi-Course Selector for Students */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-surface-container-low p-2 rounded-xl border border-surface-container shrink-0">
                <div className="flex items-center gap-1.5 px-1 text-xs font-semibold text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-secondary">menu_book</span>
                  <span>Target Course:</span>
                </div>
                <select
                  value={selectedClassId}
                  onChange={(e) => onSelectClass && onSelectClass(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-bold border border-surface-container focus:outline-none cursor-pointer max-w-[240px] truncate"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} • {cls.subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Course Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm text-xs text-on-surface-variant pt-0.5">
              <div className="flex flex-wrap items-center gap-space-md">
                <span className="flex items-center gap-1 text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-[15px] text-secondary">class</span>
                  {currentClass.subject || 'AP English Literature & Rhetoric'}
                </span>
                <span>•</span>
                <span className="font-code-inline">
                  {currentClass.period || 'Period 2'} • {currentClass.room || 'Hall 304'}
                </span>
                <span>•</span>
                <span className="text-tertiary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">event_available</span>
                  Due: Friday 11:59 PM (Open)
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-code-inline text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-[13px] text-primary">verified_user</span>
                Permanent Lock Enforced Upon Submit
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-surface-container">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Word Limit</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                {words} <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">/ {currentTemplate.defaultWordLimit}</span>
              </span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-surface-container">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Discipline</span>
              <span className="font-headline-sm text-headline-sm text-tertiary font-bold truncate max-w-[120px]">{currentTemplate.category.split(' ')[0]}</span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-surface-container">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Status</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                {words > 0 ? 'Drafting' : 'Awaiting Input'}
              </span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-surface-container">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Read Time</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                ~{readTime} <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">min</span>
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-space-sm rounded-lg bg-error-container text-on-error-container font-label-md text-label-md flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Student Name & Title Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md p-space-md bg-surface-container-lowest rounded-xl border border-surface-container shadow-sm">
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                Submitting Scholar Name
              </label>
              <input
                type="text"
                placeholder="e.g. Aria Montgomery"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-surface-container p-2.5 rounded-lg font-label-md text-label-md text-on-surface border border-surface-container focus:outline-none focus:bg-surface-container-high"
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                Assignment Title / Topic
              </label>
              <input
                type="text"
                placeholder="e.g. Rhetorical Strategies in The Great Gatsby"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                className="w-full bg-surface-container p-2.5 rounded-lg font-label-md text-label-md text-on-surface border border-surface-container focus:outline-none focus:bg-surface-container-high"
              />
            </div>
          </div>

      {/* Preset Discipline & Tone Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md p-space-md bg-surface-container-lowest rounded-xl border border-surface-container shadow-sm">
        <div className="space-y-1">
          <label className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">category</span>
            Assignment Discipline Template
          </label>
          <select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            className="w-full bg-surface-container p-2.5 rounded-lg font-label-md text-label-md text-on-surface border border-surface-container focus:outline-none focus:bg-surface-container-high cursor-pointer"
          >
            {ASSIGNMENT_TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id}>
                {tmpl.name} ({tmpl.category})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
            Feedback Tone &amp; Level
          </label>
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="w-full bg-surface-container p-2.5 rounded-lg font-label-md text-label-md text-on-surface border border-surface-container focus:outline-none focus:bg-surface-container-high cursor-pointer"
          >
            {FEEDBACK_TONES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.desc.slice(0, 45)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Segmented Input Mode Tabs */}
      <div className="flex items-center justify-between bg-surface-container p-1 rounded-xl shadow-inner border border-surface-container-high">
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setInputMode('type')}
            type="button"
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-space-md py-2.5 rounded-lg font-label-md text-label-md transition-all duration-200 shrink-0 ${
              inputMode === 'type'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-primary">edit_note</span>
            <span>Paste or Type Text</span>
          </button>
          <button
            onClick={() => setInputMode('upload')}
            type="button"
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-space-md py-2.5 rounded-lg font-label-md text-label-md transition-all duration-200 shrink-0 ${
              inputMode === 'upload'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">photo_camera</span>
            <span>Document / Photo Scan</span>
          </button>
          <button
            onClick={() => setInputMode('batch')}
            type="button"
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-space-md py-2.5 rounded-lg font-label-md text-label-md transition-all duration-200 shrink-0 ${
              inputMode === 'batch'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">folder_zip</span>
            <span>Batch Upload ({batchFiles.length})</span>
          </button>
        </div>
      </div>

      {/* Upload Zone (Visible if single upload mode chosen) */}
      {inputMode === 'upload' && (
        <div className="p-space-xl border-2 border-dashed border-primary/40 rounded-xl bg-surface-container-lowest flex flex-col items-center justify-center gap-space-sm text-center animate-fade-in shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-primary">cloud_upload</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Upload Assignment, PDF, or Photo Scan</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
            Our multi-modal vision OCR digitizes handwritten pages, typed assignments, and documents into clear text.
          </p>
          <label className="mt-space-sm px-space-md py-space-xs rounded bg-primary-container text-on-primary font-label-md text-label-md cursor-pointer hover:bg-primary shadow-sm">
            Choose File from Device
            <input type="file" className="hidden" accept="image/*,.pdf,.docx,.txt" onChange={handleFileUpload} />
          </label>
        </div>
      )}

      {/* Batch Upload Zone (Visible if batch mode chosen) */}
      {inputMode === 'batch' && (
        <div className="p-space-lg bg-surface-container-lowest rounded-xl border border-surface-container shadow-sm space-y-space-md animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">dynamic_feed</span>
                Batch Multi-Student Ingestion
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Upload multiple student submissions (.pdf, .docx, .txt, or .zip) to evaluate simultaneously.
              </p>
            </div>
            <label className="px-space-md py-2 rounded-lg bg-primary text-white font-label-md text-label-md cursor-pointer hover:bg-primary/90 shadow-sm flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Upload Files / ZIP</span>
              <input type="file" multiple className="hidden" accept=".pdf,.docx,.txt,.zip" onChange={handleBatchUpload} />
            </label>
          </div>

          {batchFiles.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-surface-container-highest rounded-lg text-on-surface-variant font-body-sm">
              No files uploaded yet. Click <strong>Upload Files / ZIP</strong> above to add student submissions.
            </div>
          ) : (
            <div className="divide-y divide-surface-container border border-surface-container rounded-lg overflow-hidden">
              {batchFiles.map((file, idx) => (
                <div key={idx} className="p-space-sm flex items-center justify-between bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[20px]">description</span>
                    <div>
                      <div className="font-label-md text-label-md font-semibold text-on-surface">{file.name}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">{file.size}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-label-sm font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                      {file.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBatchFiles(batchFiles.filter((_, i) => i !== idx))}
                      className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-surface-container-high"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* OCR Scan Notification Banner (Rendered ONLY if a file is actually uploaded) */}
      {fileName && (
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-surface-container animate-fade-in">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[28px]">document_scanner</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                {fileName}
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Document loaded. You may review and refine the text below before submitting.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            <label className="px-space-sm py-1.5 rounded-lg bg-surface-container font-label-sm text-label-sm text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer">
              Replace File
              <input type="file" className="hidden" accept="image/*,.pdf,.txt" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      )}

      {/* Ruled Notebook Editor Sheet */}
      <div className="relative bg-[#FFFDF5] rounded-xl shadow-md overflow-hidden flex flex-col border border-[#E8DFC8]">
        {/* Sheet Header Bar / Controls */}
        <div className="bg-[#FBF3DC] px-space-lg py-space-sm flex items-center justify-between border-b border-[#E8DFC8]">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-error/70 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-secondary-container inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-tertiary-container inline-block"></span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase font-semibold">
              Assignment Sheet • {currentTemplate.name}
            </span>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Live Word Count: {words}
            </span>
          </div>
        </div>

        {/* Ruled Paper Body */}
        <div 
          className="relative w-full p-space-lg sm:pl-20 sm:pr-space-xl overflow-hidden min-h-[460px]"
          style={{
            background: 'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(228, 217, 192, 0.45) 27px, rgba(228, 217, 192, 0.45) 28px)',
            backgroundColor: '#FFFDF5'
          }}
        >
          {/* Red vertical margin guide line */}
          <div className="hidden sm:block absolute left-14 top-0 bottom-0 w-[1.5px] bg-[#FE5D26]/30 pointer-events-none"></div>

          {/* Lined Paper Text Area */}
          <textarea
            className="w-full bg-transparent resize-y outline-none font-body-md text-body-md text-on-surface leading-[28px] focus:outline-none min-h-[420px] pt-1"
            value={essayText}
            onChange={(e) => {
              setEssayText(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Enter or paste student assignment text here..."
            spellCheck="false"
          />
        </div>

        {/* Bottom Status Bar inside Editor */}
        <div className="bg-surface-container-low px-space-lg py-2.5 flex flex-wrap items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-[#E8DFC8]">
          <div className="flex items-center gap-space-md">
            <span className="font-semibold text-on-surface">{words} words</span>
            <span>•</span>
            <span>{chars} characters</span>
            <span>•</span>
            <span>{paragraphs} paragraphs</span>
          </div>
          <div className="flex items-center gap-space-sm font-label-sm">
            <span>Est. Reading: {readTime} min</span>
          </div>
        </div>
      </div>

      {/* Reference Material / Source Document (Optional Grounding) */}
      <details className="group bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container">
        <summary className="flex items-center justify-between cursor-pointer list-none select-none text-on-surface font-label-md text-label-md font-bold">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary transition-transform group-open:rotate-90">
              arrow_right
            </span>
            <span className="material-symbols-outlined text-[20px] text-secondary">
              library_books
            </span>
            <span>Reference Material / Source Document (Optional Source Grounding)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded font-label-sm text-xs font-bold uppercase ${
              refMode === 'direct' 
                ? 'bg-tertiary-fixed text-on-tertiary-container' 
                : 'bg-secondary-fixed text-on-secondary-fixed'
            }`}>
              {refWords > 0 ? (refMode === 'direct' ? 'Mode A: Direct Check' : 'Mode B: Chunk Retrieval') : 'Optional'}
            </span>
            <span className="font-annotation-note text-on-surface-variant">
              ({refWords} words)
            </span>
          </div>
        </summary>

        <div className="pt-space-md space-y-space-md">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Upload the primary text, prompt passage, lab protocol, or textbook chapter. The engine will check and verify student claims directly against the source material.
          </p>

          <div className="flex items-center gap-space-sm">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors cursor-pointer border border-surface-container">
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Upload PDF/DOCX/TXT</span>
              <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleRefUpload} />
            </label>
            {refFileName && (
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Loaded: <strong>{refFileName}</strong>
              </span>
            )}
          </div>

          <textarea
            rows={4}
            value={refText}
            onChange={(e) => setRefText(e.target.value)}
            className="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container font-body-sm text-body-sm text-on-surface focus:outline-none resize-y"
            placeholder="Paste source passage, chapter, or reference excerpt here..."
          />
        </div>
      </details>

      {/* Academic Honor Pledge & Certification (Student Mode) */}
      {role === 'student' && (
        <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container space-y-2">
          <label className="flex items-start gap-space-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={honorPledge}
              onChange={(e) => setHonorPledge(e.target.checked)}
              className="mt-0.5 rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            />
            <div className="text-xs space-y-1">
              <span className="font-bold text-on-surface block">
                Collegiate Academic Integrity &amp; Permanent Turn-In Pledge:
              </span>
              <p className="text-on-surface-variant leading-relaxed">
                I hereby certify that this draft represents my own original intellectual work and adheres to the Oakridge Academic Honor Code. I understand that once submitted, this assignment will be <strong>permanently locked</strong> against editing or resubmission.
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Rubric Selection & Submit Section */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-surface-container">
        <div className="space-y-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Evaluation Framework
          </span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Grading Criteria &amp; Scale</h2>
          <div className="pt-1">
            <select
              value={selectedRubric}
              onChange={(e) => setSelectedRubric(e.target.value)}
              className="bg-surface-container py-2 pl-3 pr-8 rounded-lg font-label-md text-label-md text-on-surface focus:outline-none focus:bg-surface-container-high cursor-pointer border border-surface-container text-xs sm:text-sm"
            >
              <option>AP Lit Analytical Synthesis (Default)</option>
              <option>STEM &amp; Scientific Lab Report Standard</option>
              <option>History Document-Based Question (DBQ)</option>
              <option>Business Case Study &amp; Strategy Brief</option>
              <option>Creative Prose &amp; Narrative Standard</option>
              <option>Standard High School Assignment Rubric</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isEvaluating}
          className={`px-space-xl py-space-md rounded-xl transition-all font-label-lg text-label-lg font-semibold shadow-md active:translate-y-0.5 flex items-center justify-center gap-2 self-stretch md:self-center ${
            role === 'student'
              ? 'bg-secondary text-on-secondary hover:bg-secondary-dim'
              : 'bg-primary-container text-on-primary hover:bg-primary'
          }`}
          type="button"
        >
          {isEvaluating ? (
            <>
              <span className="material-symbols-outlined text-[22px] animate-spin">progress_activity</span>
              <span>Evaluating &amp; Locking Assignment...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]">{role === 'student' ? 'lock' : 'ink_pen'}</span>
              <span>{role === 'student' ? 'Turn In & Lock Assignment' : 'Submit for AI Evaluation'}</span>
            </>
          )}
        </button>
      </div>
        </>
      )}
    </div>
  );
}
