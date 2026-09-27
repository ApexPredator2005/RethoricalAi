import React from 'react';

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  pendingCount = 0, 
  syncStatus = 'Synced',
  theme = 'day',
  onToggleTheme,
  currentClassName = 'AP Literature & Comp'
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'menu_book', badge: pendingCount > 0 ? `${pendingCount}` : null },
    { id: 'rubric', label: 'Grading Criteria', icon: 'tune' },
    { id: 'submit', label: 'Submit Assignment', icon: 'edit_note' },
    { id: 'report', label: 'Grading & Feedback', icon: 'rate_review', badge: 'Live' },
    { id: 'analytics', label: 'Class Insights', icon: 'insights' },
    { id: 'lms', label: 'Gradebook Sync', icon: 'sync_alt', badge: syncStatus === 'Synced' ? '✓' : null }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between p-space-md border-r border-surface-container">
      {/* Brand & Navigation */}
      <div className="flex flex-col gap-space-lg">
        {/* Brand Header */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <span className="material-symbols-outlined text-primary text-[28px]">ink_pen</span>
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">RethoricalAI</span>
          </div>
          <div className="inline-flex items-center self-start px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">
            {currentClassName}
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

      {/* Footer Controls: Grading Ambience & Teacher Profile */}
      <div className="flex flex-col gap-space-md pt-space-md bg-surface-container-low border-t border-surface-container">
        {/* Day / Night Ambience Toggle */}
        <div className="flex items-center justify-between p-space-xs rounded bg-surface-container">
          <span className="font-label-sm text-label-sm text-on-surface-variant px-space-xs">Grading Ambience</span>
          <div className="flex items-center bg-surface-container-highest p-0.5 rounded">
            <button
              onClick={() => theme !== 'day' && onToggleTheme && onToggleTheme()}
              className={`px-space-xs py-0.5 rounded font-label-sm text-label-sm transition-all ${
                theme === 'day' 
                  ? 'bg-surface-container-lowest text-on-surface shadow-[0_1px_2px_rgba(0,0,0,0.05)] font-semibold' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              Day
            </button>
            <button
              onClick={() => theme !== 'night' && onToggleTheme && onToggleTheme()}
              className={`px-space-xs py-0.5 rounded font-label-sm text-label-sm transition-all ${
                theme === 'night' 
                  ? 'bg-surface-container-lowest text-on-surface shadow-[0_1px_2px_rgba(0,0,0,0.05)] font-semibold' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              Night
            </button>
          </div>
        </div>

        {/* Teacher Profile Card */}
        <div className="flex items-center gap-space-sm p-space-xs rounded bg-surface-container hover:bg-surface-container-high transition-colors">
          <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container font-label-md font-bold flex items-center justify-center shrink-0">
            CH
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-md text-label-md text-on-surface font-semibold truncate">Ms. Claire Holloway</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant truncate">Westlake High School</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
