import React from 'react';

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  pendingCount = 0, 
  syncStatus = 'Synced',
  currentClassName = "III Sem CSBS 'A'",
  currentSubject = 'Object Oriented Programming',
  teacherProfile,
  studentProfile,
  role = 'teacher',
  onOpenProfileModal,
  onOpenStudentProfileModal,
  studentSubmissionsCount = 0
}) {
  const teacherNavItems = [
    { id: 'dashboard', label: 'Class Overview', icon: 'dashboard', badge: pendingCount > 0 ? `${pendingCount}` : null },
    { id: 'analytics', label: 'Assignments & Insight', icon: 'insights' },
    { id: 'report', label: 'Grading & Review', icon: 'rate_review', badge: 'Live' },
    { id: 'rubric', label: 'Grading Criteria', icon: 'tune' },
    { id: 'lms', label: 'Gradebook Sync', icon: 'sync_alt', badge: syncStatus === 'Synced' ? '✓' : null }
  ];

  const studentNavItems = [
    { id: 'student_submissions', label: 'Pending Assignments', icon: 'inventory_2', badge: pendingCount > 0 ? `${pendingCount}` : null },
    { id: 'submit', label: 'Turn In & Practice', icon: 'edit_note' },
    { id: 'report', label: 'Grading & Feedback', icon: 'rate_review', badge: studentSubmissionsCount > 0 ? `${studentSubmissionsCount}` : null },
    { id: 'rubric', label: 'Grading Criteria', icon: 'tune' }
  ];

  const navItems = role === 'student' ? studentNavItems : teacherNavItems;

  const getInitials = (name) => {
    if (!name) return 'PR';
    const parts = name.split(' ').filter(n => !n.includes('.'));
    return parts.length > 0 ? parts.map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'PR';
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[225px] bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between p-3.5 border-r border-surface-container/60">
      {/* Brand & Navigation */}
      <div className="flex flex-col gap-space-lg">
        {/* Brand Header */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => onTabChange(role === 'student' ? 'student_submissions' : 'dashboard')}>
            <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[18px]">ink_pen</span>
            </div>
            <div className="flex items-baseline">
              <span className="font-brand text-[21px] font-black text-primary tracking-tight leading-none">
                Rethorical
              </span>
              <span className="ml-1 text-[9px] font-sans font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 leading-none">
                AI
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 self-start px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider font-semibold truncate max-w-full">
            <span className={`w-1.5 h-1.5 rounded-full ${role === 'student' ? 'bg-secondary' : 'bg-primary'} shrink-0`}></span>
            <span className="truncate">{role === 'student' ? `${studentProfile?.grade || currentClassName} • Student` : (currentSubject || currentClassName)}</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-space-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                type="button"
                className={`flex items-center justify-between px-space-sm py-space-sm transition-all rounded font-label-md text-label-md text-left w-full ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isActive 
                      ? 'bg-on-primary text-primary-container' 
                      : 'bg-primary-fixed text-on-primary-fixed-variant'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Card */}
      <div className="pt-space-md bg-surface-container-low border-t border-surface-container">
        {role === 'student' ? (
          <div 
            onClick={onOpenStudentProfileModal}
            className="flex items-center gap-space-sm p-space-xs rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group"
            title="Click to view student scholar profile"
          >
            <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary font-label-md font-bold flex items-center justify-center shrink-0">
              {getInitials(studentProfile?.name || 'Pratyush Raj')}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate group-hover:text-secondary transition-colors">
                {studentProfile?.name || 'Pratyush Raj'}
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant truncate">
                {studentProfile?.rollNo || '33'} • Student Scholar
              </span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-secondary transition-colors">
              edit
            </span>
          </div>
        ) : (
          <div 
            onClick={onOpenProfileModal}
            className="flex items-center gap-space-sm p-space-xs rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group"
            title="Click to view & edit teacher profile & institution"
          >
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container font-label-md font-bold flex items-center justify-center shrink-0">
              {getInitials(teacherProfile?.name || 'Dr. D S Vinod')}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate group-hover:text-primary transition-colors">
                {teacherProfile?.name || 'Dr. D S Vinod'}
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant truncate">
                {teacherProfile?.institution || teacherProfile?.department || 'Department of ISE'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary transition-colors">
              edit
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
