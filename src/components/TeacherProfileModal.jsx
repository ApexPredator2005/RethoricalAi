import React, { useState } from 'react';

export default function TeacherProfileModal({ teacherProfile, onSave, onClose }) {
  const [name, setName] = useState(teacherProfile?.name || 'Dr. D S Vinod');
  const [title, setTitle] = useState(teacherProfile?.title || 'Professor & Course Coordinator');
  const [institution, setInstitution] = useState(teacherProfile?.institution || 'JSS Science and Technology University');
  const [department, setDepartment] = useState(teacherProfile?.department || 'Department of Information Science & Engineering');
  const [academicYear, setAcademicYear] = useState(teacherProfile?.academicYear || '2026–2027 Academic Session (Sem III)');
  const [email, setEmail] = useState(teacherProfile?.email || 'dsvinod@jssstuniv.in');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        name: name.trim() || 'Dr. D S Vinod',
        title: title.trim() || 'Professor & Course Coordinator',
        institution: institution.trim() || 'JSS Science and Technology University',
        department: department.trim() || 'Department of Information Science & Engineering',
        academicYear: academicYear.trim() || '2026–2027 Academic Session (Sem III)',
        email: email.trim() || 'dsvinod@jssstuniv.in'
      });
    }
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 500);
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
                Faculty &amp; Course Coordinator Profile
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Configure faculty identity, institution name, and academic schedule
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
              Faculty / Coordinator Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. D S Vinod"
              required
              className="w-full px-space-md py-space-xs rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">
                Academic Title / Designation
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Professor & Course Coordinator"
                className="w-full px-space-md py-space-xs rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">
                Faculty Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. dsvinod@jssstuniv.in"
                className="w-full px-space-md py-space-xs rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold block">
              University / Institution Name
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. JSS Science and Technology University"
              className="w-full px-space-md py-space-xs rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Department of Information Science & Engineering"
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
                placeholder="e.g. 2026–2027 Academic Session (Sem III)"
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
