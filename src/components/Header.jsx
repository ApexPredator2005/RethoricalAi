import React from 'react';

export default function Header({ 
  classes = [], 
  selectedClassId, 
  onSelectClass, 
  role, 
  onOpenNewAssignment,
  teacherProfile,
  studentProfile,
  onOpenProfileModal,
  onOpenStudentProfileModal,
  searchQuery = '',
  onSearchChange
}) {
  const activeInstitution = role === 'student' 
    ? (studentProfile?.institution || teacherProfile?.institution) 
    : teacherProfile?.institution;

  return (
    <header className="fixed top-0 left-[225px] right-0 h-16 bg-gradient-to-r from-[#142132] via-[#1B2A3D] to-[#162538] shadow-[0_4px_24px_rgba(20,33,50,0.35),inset_0_1px_0_rgba(255,255,255,0.18)] border-b border-white/10 backdrop-blur-xl z-40 flex items-center justify-between px-6 before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent">
      {/* Search Input Bar */}
      <div className="flex items-center gap-space-md w-full max-w-xl">
        <div className="relative w-full flex items-center">
          <input 
            className="w-full px-3.5 py-space-xs rounded bg-white/10 hover:bg-white/[0.15] focus:bg-white/[0.20] text-white placeholder:text-white/60 font-label-md text-label-md focus:outline-none border border-white/20 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-xs sm:text-sm backdrop-blur-md shadow-inner" 
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
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/[0.18] text-white font-label-sm text-xs border border-white/20 focus:outline-none focus:border-white/50 cursor-pointer max-w-[260px] truncate font-medium backdrop-blur-md transition-colors shadow-sm"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id} className="bg-[#1B2A3D] text-white">
                {role === 'student' 
                  ? `${cls.subject || cls.name} (${cls.name})` 
                  : `${cls.name} • ${cls.subject ? `${cls.subject.split(' ')[0]} ` : ''}(${cls.studentRoster?.length || cls.students || cls.studentCount || 0} Scholars)`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Control Indicators */}
      <div className="flex items-center gap-space-sm">
        {/* Institution Badge */}
        {activeInstitution && (
          <div 
            onClick={role === 'student' ? onOpenStudentProfileModal : onOpenProfileModal}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-label-sm text-xs font-semibold border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] truncate max-w-[240px] cursor-pointer transition-colors backdrop-blur-md" 
            title={`${activeInstitution} • ${role === 'student' ? 'Student Portal' : 'Faculty'} (Click to view)`}
          >
            <span className="material-symbols-outlined text-[15px] text-white">
              school
            </span>
            <span className="truncate">{activeInstitution}</span>
          </div>
        )}

        {/* Connectivity Status */}
        <div className="hidden md:flex items-center gap-space-xs font-label-sm text-label-sm text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/20 text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          <span>{role === 'student' ? 'Honor Code • Active' : 'Gradebook Sync • Active'}</span>
        </div>

        {/* Action: New Assignment button for Teachers */}
        {role === 'teacher' && (
          <button 
            onClick={onOpenNewAssignment}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-white/90 text-[#142132] font-label-sm text-xs font-bold shadow-[0_2px_10px_rgba(0,0,0,0.25)] active:translate-y-0.5 transition-all border border-white/40"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-[#142132]">add</span>
            <span>Assignment</span>
          </button>
        )}
      </div>
    </header>
  );
}
