import React, { useState } from 'react';
import { ASSIGNMENT_TEMPLATES, FEEDBACK_TONES } from '../data/mockData';

export default function NewAssignmentModal({ classes, selectedClassId, onClose, onCreateAssignment }) {
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState(selectedClassId || (classes[0] && classes[0].id));
  const [selectedTemplateId, setSelectedTemplateId] = useState('ap_lit');
  const [selectedToneId, setSelectedToneId] = useState('standard');
  const [dueDate, setDueDate] = useState('2026-10-31');
  const [rubric, setRubric] = useState('Literature & Analytical Synthesis Standard');
  const [wordLimit, setWordLimit] = useState(1500);
  const [instructions, setInstructions] = useState('');
  const [saved, setSaved] = useState(false);

  const handleTemplateChange = (tmplId) => {
    setSelectedTemplateId(tmplId);
    const tmpl = ASSIGNMENT_TEMPLATES.find(t => t.id === tmplId);
    if (tmpl) {
      setWordLimit(tmpl.defaultWordLimit);
      setRubric(`${tmpl.name} Standard`);
      if (!title) {
        setTitle(`${tmpl.name} Benchmark #1`);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    if (onCreateAssignment) {
      onCreateAssignment({
        id: `asg-${Date.now()}`,
        classId: classId || 'c1',
        title: title || 'New Assignment',
        dueDate,
        submittedCount: 0,
        gradedCount: 0,
        rubricName: rubric,
        wordLimit,
        instructions
      });
    }
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-surface-container-low px-space-lg py-space-md flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[24px]">post_add</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Create New Assignment
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Configure assignment guidelines, subject discipline, and grading criteria
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-space-lg space-y-space-md overflow-y-auto">
          {saved && (
            <div className="p-space-sm rounded-lg bg-tertiary-fixed text-on-tertiary-container font-label-md text-label-md flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Assignment published to Classroom and ready for student drafting!
            </div>
          )}

          {/* Discipline Template Preset */}
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">category</span>
              Discipline Template
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-surface-container font-label-md text-label-md text-on-surface focus:outline-none"
            >
              {ASSIGNMENT_TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name} ({tmpl.category})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
              Assignment Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Macbeth: Ambition & Moral Dissolution"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-surface-container font-headline-sm text-headline-sm text-on-surface focus:outline-none focus:bg-surface-container"
            />
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                Target Section
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-surface-container font-label-md text-label-md text-on-surface focus:outline-none"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-surface-container font-label-md text-label-md text-on-surface focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                Feedback Tone
              </label>
              <select
                value={selectedToneId}
                onChange={(e) => setSelectedToneId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-surface-container font-label-md text-label-md text-on-surface focus:outline-none"
              >
                {FEEDBACK_TONES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                Word Limit
              </label>
              <input
                type="number"
                value={wordLimit}
                onChange={(e) => setWordLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-surface-container font-code-inline text-code-inline text-on-surface focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
              Assignment Prompt &amp; Instructions
            </label>
            <textarea
              rows={3}
              placeholder="Provide assignment details, guiding questions, or reference material..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-surface-container font-body-sm text-body-sm text-on-surface focus:outline-none resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-space-sm pt-2 border-t border-surface-container">
            <button
              onClick={onClose}
              type="button"
              className="px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary shadow-sm active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>Create Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
