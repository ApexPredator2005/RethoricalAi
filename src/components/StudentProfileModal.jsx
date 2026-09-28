import React, { useState } from 'react';

export default function StudentProfileModal({ 
  studentProfile, 
  onSave, 
  onClose,
  classes = [],
  selectedClassId,
  onSelectStudent
}) {
  const [name, setName] = useState(studentProfile?.name || 'Aria Montgomery');
  const [rollNo, setRollNo] = useState(studentProfile?.rollNo || '11A-01');
  const [email, setEmail] = useState(studentProfile?.email || 'aria.m@oakridge.edu');
  const [grade, setGrade] = useState(studentProfile?.grade || 'Grade 11 - Section A');
  const [institution, setInstitution] = useState(studentProfile?.institution || 'Oakridge International Collegiate Academy');
  const [saved, setSaved] = useState(false);

  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const roster = currentClass?.studentRoster || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...studentProfile,
        name: name.trim() || 'Scholar',
        rollNo: rollNo.trim() || '11A-00',
        email: email.trim() || 'scholar@oakridge.edu',
        grade: grade.trim() || 'Grade 11',
        institution: institution.trim() || 'Oakridge International Collegiate Academy'
      });
    }
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleQuickSwitch = (scholar) => {
    if (onSelectStudent) {
      onSelectStudent({
        id: scholar.id,
        name: scholar.name,
        rollNo: scholar.rollNo,
        email: scholar.email,
        grade: currentClass.name,
        institution: institution
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-surface-container-low px-space-lg py-space-md flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[26px]">school</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Student Scholar Profile
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Enrolled academic credentials &amp; active scholar identity
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

        {/* Quick Switch Scholar Selector */}
        {roster.length > 0 && (
          <div className="bg-surface-container/60 px-space-lg py-space-sm border-b border-surface-container">
            <span className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-2">
              Quick Switch Enrolled Scholar ({currentClass?.name}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {roster.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleQuickSwitch(s)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    studentProfile?.name === s.name
                      ? 'bg-secondary text-on-secondary font-bold shadow-xs'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                  <span>{s.name}</span>
                  <span className="text-[10px] opacity-75 font-code-inline">({s.rollNo})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="p-space-lg space-y-space-md overflow-y-auto max-h-[60vh]">
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold block">
              Scholar Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface"
              placeholder="e.g. Aria Montgomery"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">
                Roll / Scholar ID
              </label>
              <input
                type="text"
                required
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface font-code-inline"
                placeholder="e.g. 11A-01"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">
                Enrolled Grade &amp; Section
              </label>
              <input
                type="text"
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface"
                placeholder="e.g. Grade 11 - Section A"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold block">
              Institutional Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface font-code-inline"
              placeholder="e.g. aria.m@oakridge.edu"
            />
          </div>

          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold block">
              Institution / Academy Name
            </label>
            <input
              type="text"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface"
              placeholder="e.g. Oakridge International Collegiate Academy"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-label-md text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-dim font-label-md text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              {saved ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Updated!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
