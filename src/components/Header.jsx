import React from 'react';

export default function Header({ 
  classes = [], 
  selectedClassId, 
  onSelectClass, 
  role, 
  onToggleRole, 
  onOpenSpecsModal,
  onOpenNewAssignment,
  teacherProfile,
  onOpenProfileModal,
  searchQuery = '',
  onSearchChange
}) {
  const getInitials = (name) => {
    if (!name) return 'EV';
    const parts = name.split(' ').filter(n => !n.includes('.'));
    return parts.length > 0 ? parts.map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'EV';
  };

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
            placeholder="Search students, roll numbers, or criteria..." 
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
            className="px-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-xs border border-surface-container focus:outline-none cursor-pointer max-w-[240px] truncate font-medium"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} • {cls.subject ? `${cls.subject.split(' ')[0]} ` : ''}({cls.studentRoster?.length || cls.students || cls.studentCount || 0} Scholars)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Control Indicators & Profile Actions */}
      <div className="flex items-center gap-space-sm">
        {/* Institution Badge */}
        {teacherProfile?.institution && (
          <div 
            onClick={onOpenProfileModal}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-xs font-semibold border border-surface-container truncate max-w-[190px] cursor-pointer hover:bg-surface-container-high transition-colors" 
            title={`${teacherProfile.institution} (Click to edit)`}
          >
            <span className="material-symbols-outlined text-[15px] text-primary">account_balance</span>
            <span className="truncate">{teacherProfile.institution}</span>
          </div>
        )}

        {/* Gradebook Connectivity Status */}
        <div className="hidden md:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-lg border border-surface-container text-xs">
          <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
          <span>Gradebook Sync • Active</span>
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

        {/* Teacher Profile Quick Avatar Pill */}
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

        {/* Role Toggle Switcher */}
        <button
          onClick={onToggleRole}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-label-sm text-xs hover:bg-surface-container-high transition-colors border border-surface-container"
          title="Switch view between Educator and Student"
          type="button"
        >
          <span className="material-symbols-outlined text-[15px] text-secondary">
            {role === 'teacher' ? 'school' : 'person'}
          </span>
          <span className="hidden sm:inline">{role === 'teacher' ? 'Teacher' : 'Student'}</span>
        </button>

        {/* Specs Modal Trigger */}
        <button
          onClick={onOpenSpecsModal}
          className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors"
          title="View Design Specs & System Archetypes"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">design_services</span>
        </button>
      </div>
    </header>
  );
}
