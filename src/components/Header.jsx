import React from 'react';

export default function Header({ 
  classes, 
  selectedClassId, 
  onSelectClass, 
  role, 
  onToggleRole, 
  theme, 
  onToggleTheme, 
  onOpenSpecsModal,
  onOpenNewAssignment,
  searchQuery = '',
  onSearchChange
}) {
  return (
    <header className="fixed top-0 left-[260px] right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter border-b border-surface-container">
      {/* Search Input Bar */}
      <div className="flex items-center gap-space-md w-full max-w-lg">
        <div className="relative w-full flex items-center">
          <span className="material-symbols-outlined absolute left-space-sm text-on-surface-variant text-[20px]">
            search
          </span>
          <input 
            className="w-full pl-9 pr-space-md py-space-xs rounded bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-label-md text-label-md focus:outline-none focus:bg-surface-container border border-surface-container transition-all" 
            placeholder="Search students, rubrics, or essays..." 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>

        {/* Class Selector Dropdown */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <select
            value={selectedClassId}
            onChange={(e) => onSelectClass(e.target.value)}
            className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface font-label-sm text-label-sm border border-surface-container focus:outline-none cursor-pointer"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.students} Scholars)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Control Indicators & Role Actions */}
      <div className="flex items-center gap-space-md">
        {/* LMS Connectivity Status */}
        <div className="hidden md:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded border border-surface-container">
          <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
          <span>Google Classroom • Synced 12m ago</span>
        </div>

        {/* Action: New Assignment button for Teachers */}
        {role === 'teacher' && (
          <button 
            onClick={onOpenNewAssignment}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm hover:bg-primary shadow-sm active:translate-y-0.5 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Assignment</span>
          </button>
        )}

        {/* Role Toggle Switcher */}
        <button
          onClick={onToggleRole}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors border border-surface-container"
          title="Switch view between Educator and Student"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px] text-secondary">
            {role === 'teacher' ? 'school' : 'person'}
          </span>
          <span>{role === 'teacher' ? 'Teacher View' : 'Student View'}</span>
        </button>

        {/* Notification Bell */}
        <button 
          className="p-space-xs text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container transition-colors relative" 
          type="button"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></span>
        </button>

        {/* Specs Modal Trigger */}
        <button
          onClick={onOpenSpecsModal}
          className="p-space-xs text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container transition-colors"
          title="View Design Specs & System Archetypes"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">design_services</span>
        </button>
      </div>
    </header>
  );
}
