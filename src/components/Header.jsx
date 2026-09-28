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
    <header className="fixed top-0 left-[260px] right-0 h-16 bg-gradient-to-r from-[#142132] via-[#1B2A3D] to-[#162538] shadow-[0_4px_24px_rgba(20,33,50,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] border-b border-[#2C3E55] backdrop-blur-xl z-40 flex items-center justify-between px-6 before:absolute before:inset-x-0 before:top-0 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-[#649EC4]/75 before:to-transparent">
      {/* Search Input Bar */}
      <div className="flex items-center gap-space-md w-full max-w-xl">
        <div className="relative w-full flex items-center">
          <span className="material-symbols-outlined absolute left-space-sm text-[#649EC4] text-[20px]">
            search
          </span>
          <input 
            className="w-full pl-9 pr-space-md py-space-xs rounded bg-[#25374D]/70 hover:bg-[#25374D]/90 focus:bg-[#25374D] text-[#F5F3EC] placeholder:text-[#9DAEBF] font-label-md text-label-md focus:outline-none border border-[#3A4E66]/70 focus:border-[#649EC4] focus:ring-2 focus:ring-[#3E6E8E]/30 transition-all text-xs sm:text-sm backdrop-blur-md shadow-inner" 
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
            className="px-2.5 py-1.5 rounded-lg bg-[#25374D]/70 hover:bg-[#25374D]/90 text-[#F5F3EC] font-label-sm text-xs border border-[#3A4E66]/70 focus:outline-none focus:border-[#649EC4] cursor-pointer max-w-[260px] truncate font-medium backdrop-blur-md transition-colors shadow-sm"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id} className="bg-[#1B2A3D] text-[#F5F3EC]">
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
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#25374D]/70 hover:bg-[#25374D]/90 text-[#E8ECF1] font-label-sm text-xs font-semibold border border-[#3A4E66]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] truncate max-w-[210px] cursor-pointer transition-colors backdrop-blur-md" 
            title={`${activeInstitution} • ${role === 'student' ? 'Student Portal' : 'Faculty'} (Click to view)`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#649EC4]">
              school
            </span>
            <span className="truncate">{activeInstitution}</span>
          </div>
        )}

        {/* Connectivity Status */}
        <div className="hidden md:flex items-center gap-space-xs font-label-sm text-label-sm text-[#E8ECF1] bg-[#25374D]/70 px-2.5 py-1 rounded-lg border border-[#3A4E66]/70 text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          <span>{role === 'student' ? 'Honor Code • Active' : 'Gradebook Sync • Active'}</span>
        </div>

        {/* Action: New Assignment button for Teachers */}
        {role === 'teacher' && (
          <button 
            onClick={onOpenNewAssignment}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#2F5672] via-[#3E6E8E] to-[#346080] hover:from-[#3E6E8E] hover:to-[#4A7D9F] text-white font-label-sm text-xs font-semibold shadow-[0_2px_10px_rgba(47,86,114,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] active:translate-y-0.5 transition-all border border-[#5287AB]/40"
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
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#25374D]/70 hover:bg-[#25374D]/90 transition-colors border border-[#3A4E66]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-[#F5F3EC] backdrop-blur-md"
            title="View & Switch Student Scholar"
            type="button"
          >
            <div className="w-6 h-6 rounded-full bg-[#B4872E] text-slate-900 text-[10px] font-bold flex items-center justify-center shadow-sm">
              {getInitials(studentProfile?.name || 'Aria Montgomery')}
            </div>
            <span className="hidden xl:inline text-xs font-semibold text-[#F5F3EC]">
              {studentProfile?.name ? studentProfile.name.split(' ')[0] : 'Scholar'} ({studentProfile?.rollNo || '11A-01'})
            </span>
            <span className="material-symbols-outlined text-[14px] text-[#9DAEBF]">arrow_drop_down</span>
          </button>
        ) : (
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#25374D]/70 hover:bg-[#25374D]/90 transition-colors border border-[#3A4E66]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-[#F5F3EC] backdrop-blur-md"
            title="Edit Teacher & Institution Profile"
            type="button"
          >
            <div className="w-6 h-6 rounded-full bg-[#3E6E8E] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
              {getInitials(teacherProfile?.name)}
            </div>
            <span className="hidden xl:inline text-xs font-semibold text-[#F5F3EC]">
              {teacherProfile?.name ? teacherProfile.name.split(' ').slice(0, 2).join(' ') : 'Educator'}
            </span>
            <span className="material-symbols-outlined text-[14px] text-[#9DAEBF]">arrow_drop_down</span>
          </button>
        )}

        {/* Role Indicator (Locked & Non-Switchable) */}
        <div 
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#25374D]/70 text-[#F5F3EC] font-label-sm text-xs border border-[#3A4E66]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] select-none cursor-default backdrop-blur-md"
          title={`Active Institutional Role: ${role === 'teacher' ? 'Faculty Instructor' : 'Student Scholar'} (Role locked)`}
        >
          <span className="material-symbols-outlined text-[15px] text-[#649EC4]">
            {role === 'teacher' ? 'school' : 'person'}
          </span>
          <span className="font-semibold text-[#F5F3EC]">{role === 'teacher' ? 'Faculty' : 'Student'}</span>
          <span className="material-symbols-outlined text-[13px] text-[#9DAEBF]" title="Role is permanently locked">
            lock
          </span>
        </div>
      </div>
    </header>
  );
}
