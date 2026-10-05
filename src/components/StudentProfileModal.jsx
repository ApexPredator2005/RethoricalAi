import React, { useState } from 'react';

export default function StudentProfileModal({ 
  studentProfile, 
  onSave, 
  onClose 
}) {
  const [name, setName] = useState(studentProfile?.name || 'Pratyush Raj');
  const [rollNo, setRollNo] = useState(studentProfile?.rollNo || '33');
  const [usn, setUsn] = useState(studentProfile?.usn || '01JST25UCBO65');
  const [email, setEmail] = useState(studentProfile?.email || '01jst25ucbo65@jssstuniv.in');
  const [grade, setGrade] = useState(studentProfile?.grade || "III Sem CSBS 'A'");
  const [department, setDepartment] = useState(studentProfile?.department || 'Department of Information Science & Engineering');
  const [institution, setInstitution] = useState(studentProfile?.institution || 'JSS Science and Technology University');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...studentProfile,
        name: name.trim() || 'Pratyush Raj',
        rollNo: rollNo.trim() || '33',
        usn: usn.trim() || '01JST25UCBO65',
        email: email.trim() || '01jst25ucbo65@jssstuniv.in',
        grade: grade.trim() || "III Sem CSBS 'A'",
        department: department.trim() || 'Department of Information Science & Engineering',
        institution: institution.trim() || 'JSS Science and Technology University'
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
            <span className="material-symbols-outlined text-secondary text-[26px]">school</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Student Scholar Profile
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Enrolled academic credentials &amp; student identity
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

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="p-space-lg space-y-space-md overflow-y-auto max-h-[70vh]">
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
              placeholder="e.g. Pratyush Raj"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">
                Roll Number
              </label>
              <input
                type="text"
                required
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface font-code-inline"
                placeholder="e.g. 33"
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">
                University Seat No. (USN)
              </label>
              <input
                type="text"
                required
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface font-code-inline"
                placeholder="e.g. 01JST25UCBO65"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">
                Class / Semester / Section
              </label>
              <input
                type="text"
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface"
                placeholder="e.g. III Sem CSBS 'A'"
              />
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
                placeholder="e.g. 01jst25ucbo65@jssstuniv.in"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold block">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface"
              placeholder="Department of Information Science & Engineering"
            />
          </div>

          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold block">
              Institution / University
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface"
              placeholder="JSS Science and Technology University"
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
