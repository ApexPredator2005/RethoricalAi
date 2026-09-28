import React from 'react';

export default function Header({ 
  classes = [], 
  selectedClassId, 
  onSelectClass, 
  role, 
  onToggleRole, 
  onOpenNewAssignment,
  teacherProfile,
  studentProfile,
  onOpenProfileModal,
  onOpenStudentProfileModal,
  searchQuery = '',
  onSearchChange
}) {
  const getInitials = (name) => {
    if (!name) return 'EV';
    const parts = name.split(' ').filter(n => !n.includes('.'));
    return parts.length > 0 ? parts.map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'EV';
  };

  const activeInstitution = role === 'student' 
    ? (studentProfile?.institution || teacherProfile?.institution) 
    : teacherProfile?.institution;

  return (
    <header className="fixed top-0 left-[260px] right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter border-b border-surface-container">
      {/* Search Input Bar */}
      <div className="flex items-center gap-space-md w-full max-w-xl">
        <div className="relative w-full flex items-center">
          <span className="material-symbols-outlined absolute left-space-sm text-on-surface-variant text-[20px]">
            search
          </span>
          <input 
            className="w-full pl-9 pr-space-md py-space-xs rounded bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-label-md text-label-md focus:outline-none focus:bg-surface-container border border-surface-container transition-all text-xs sm:text-sm" 
            placeholder={role === 'student' ? "Search assignments, rubrics, or topics..." : "Search students, roll numbers, or criteria..."} 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>

        {/* Multi-Class, Multi-Subject Selector Dropdown */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <select
            value={selectedClassId}
            onChange={(e) => onSelectClass(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-xs border border-surface-container focus:outline-none cursor-pointer max-w-[260px] truncate font-medium"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {role === 'student' 
                  ? `${cls.subject || cls.name} (${cls.name})` 
                  : `${cls.name} • ${cls.subject ? `${cls.subject.split(' ')[0]} ` : ''}(${cls.studentRoster?.length || cls.students || cls.studentCount || 0} Scholars)`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Control Indicators & Profile Actions */}
      <div className="flex items-center gap-space-sm">
        {/* Institution Badge */}
        {activeInstitution && (
          <div 
            onClick={role === 'student' ? onOpenStudentProfileModal : onOpenProfileModal}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-xs font-semibold border border-surface-container truncate max-w-[210px] cursor-pointer hover:bg-surface-container-high transition-colors" 
            title={`${activeInstitution} • ${role === 'student' ? 'Student Portal' : 'Faculty'} (Click to view)`}
          >
            <span className={`material-symbols-outlined text-[15px] ${role === 'student' ? 'text-secondary' : 'text-primary'}`}>
              school
            </span>
            <span className="truncate">{activeInstitution}</span>
          </div>
        )}

        {/* Connectivity Status */}
        <div className="hidden md:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-lg border border-surface-container text-xs">
          <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
          <span>{role === 'student' ? 'Honor Code • Active' : 'Gradebook Sync • Active'}</span>
        </div>

        {/* Action: New Assignment button for Teachers */}
        {role === 'teacher' && (
          <button 
            onClick={onOpenNewAssignment}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-sm text-xs font-semibold hover:bg-primary shadow-sm active:translate-y-0.5 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Assignment</span>
          </button>
        )}

        {/* Profile Quick Avatar Pill (Student or Teacher) */}
        {role === 'student' ? (
          <button
            onClick={onOpenStudentProfileModal}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors border border-surface-container"
            title="View & Switch Student Scholar"
            type="button"
          >
            <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center">
              {getInitials(studentProfile?.name || 'Aria Montgomery')}
            </div>
            <span className="hidden xl:inline text-xs font-semibold text-on-surface">
              {studentProfile?.name ? studentProfile.name.split(' ')[0] : 'Scholar'} ({studentProfile?.rollNo || '11A-01'})
            </span>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant">arrow_drop_down</span>
          </button>
        ) : (
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors border border-surface-container"
            title="Edit Teacher & Institution Profile"
            type="button"
          >
            <div className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold flex items-center justify-center">
              {getInitials(teacherProfile?.name)}
            </div>
            <span className="hidden xl:inline text-xs font-semibold text-on-surface">
              {teacherProfile?.name ? teacherProfile.name.split(' ').slice(0, 2).join(' ') : 'Educator'}
            </span>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant">arrow_drop_down</span>
          </button>
        )}

        {/* Role Indicator (Locked & Non-Switchable) */}
        <div 
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-label-sm text-xs border border-surface-container select-none cursor-default"
          title={`Active Institutional Role: ${role === 'teacher' ? 'Faculty Instructor' : 'Student Scholar'} (Role locked)`}
        >
          <span className={`material-symbols-outlined text-[15px] ${role === 'teacher' ? 'text-primary' : 'text-secondary'}`}>
            {role === 'teacher' ? 'school' : 'person'}
          </span>
          <span className="font-semibold">{role === 'teacher' ? 'Faculty' : 'Student'}</span>
          <span className="material-symbols-outlined text-[13px] text-on-surface-variant" title="Role is permanently locked">
            lock
          </span>
        </div>
      </div>
    </header>
  );
}
