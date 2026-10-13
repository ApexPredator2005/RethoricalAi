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
    <header className="fixed top-0 left-[225px] right-0 h-16 bg-[#CFFFB3] shadow-[0_2px_14px_rgba(30,59,34,0.08)] border-b border-[#ADE25D] z-40 flex items-center justify-between px-6 before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-[#ADE25D] before:via-[#FCEC52] before:to-[#ADE25D]">
      {/* Search Input Bar */}
      <div className="flex items-center gap-space-md w-full max-w-xl">
        <div className="relative w-full flex items-center">
          <input 
            className="w-full px-3.5 py-space-xs rounded-lg bg-white/90 hover:bg-white focus:bg-white text-[#16381C] placeholder:text-[#16381C]/50 font-label-md text-label-md focus:outline-none border border-[#ADE25D] focus:border-[#3A5743] focus:ring-2 focus:ring-[#ADE25D]/40 transition-all text-xs sm:text-sm shadow-xs font-medium" 
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
            className="px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-white text-[#16381C] font-label-sm text-xs border border-[#ADE25D] focus:outline-none focus:border-[#3A5743] cursor-pointer max-w-[260px] truncate font-semibold transition-colors shadow-xs"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id} className="bg-white text-[#16381C]">
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
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-[#16381C] font-label-sm text-xs font-bold border border-[#ADE25D] shadow-xs truncate max-w-[240px] cursor-pointer transition-colors" 
            title={`${activeInstitution} • ${role === 'student' ? 'Student Portal' : 'Faculty'} (Click to view)`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#3A5743]">
              school
            </span>
            <span className="truncate">{activeInstitution}</span>
          </div>
        )}

        {/* Connectivity Status */}
        <div className="hidden md:flex items-center gap-space-xs font-label-sm text-label-sm text-[#16381C] bg-white/80 px-2.5 py-1 rounded-lg border border-[#ADE25D] text-xs shadow-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse shadow-[0_0_8px_rgba(46,125,50,0.7)]"></span>
          <span>{role === 'student' ? 'Honor Code • Active' : 'Gradebook Sync • Active'}</span>
        </div>

        {/* Action: New Assignment button for Teachers */}
        {role === 'teacher' && (
          <button 
            onClick={onOpenNewAssignment}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FCEC52] hover:bg-[#ebd738] text-[#332A00] font-label-sm text-xs font-bold shadow-xs active:translate-y-0.5 transition-all border border-[#DEC925]"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-[#332A00]">add</span>
            <span>Assignment</span>
          </button>
        )}
      </div>
    </header>
  );
}
