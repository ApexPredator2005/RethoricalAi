import React, { useState } from 'react';

export default function TeacherProfileModal({ teacherProfile, onSave, onClose }) {
  const [name, setName] = useState(teacherProfile?.name || 'Dr. Eleanor Vance');
  const [title, setTitle] = useState(teacherProfile?.title || 'Faculty Lead & Rhetoric Chair');
  const [institution, setInstitution] = useState(teacherProfile?.institution || 'Oakridge International Collegiate Academy');
  const [department, setDepartment] = useState(teacherProfile?.department || 'Department of Humanities & Rhetoric');
  const [academicYear, setAcademicYear] = useState(teacherProfile?.academicYear || '2026–2027 Academic Session');
  const [email, setEmail] = useState(teacherProfile?.email || 'e.vance@oakridge.edu');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        name: name.trim() || 'Educator',
        title: title.trim() || 'Instructor',
        institution: institution.trim() || 'Educational Institution',
        department: department.trim() || 'Academic Department',
        academicYear: academicYear.trim() || 'Current Term',
        email: email.trim() || 'educator@institution.edu'
      });
    }
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-surface-container-low px-space-lg py-space-md flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[24px]">badge</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Teacher &amp; Institution Profile
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Configure faculty identity, institution name, and academic calendar
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
        <form onSubmit={handleSubmit} className="p-space-lg space-y-space-md">
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold block">
              Teacher / Instructor Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Eleanor Vance"
              required
              className="w-full px-space-md py-space-xs rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">
                Academic Title / Role
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Faculty & Rhetoric Chair"
                className="w-full px-space-md py-space-xs rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. e.vance@oakridge.edu"
                className="w-full px-space-md py-space-xs rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold block">
              Name of Institution / University / School
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. Oakridge International Collegiate Academy"
              required
              className="w-full px-space-md py-space-xs rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">
                Department / Faculty Division
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Department of Humanities & Rhetoric"
                className="w-full px-space-md py-space-xs rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">
                Academic Session / Term
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="e.g. 2026–2027 Academic Session"
                className="w-full px-space-md py-space-xs rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
          </div>

          {saved && (
            <div className="p-2 rounded bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Footer */}
          <div className="pt-space-sm flex items-center justify-end gap-space-sm border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-space-md py-space-xs rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-space-lg py-space-xs rounded-lg bg-primary-container text-on-primary font-label-md text-sm font-semibold hover:bg-primary transition-all shadow-sm"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
