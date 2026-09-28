import React, { useState } from 'react';

export default function LmsSyncScreen({ submissions = [] }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [lastSynced, setLastSynced] = useState('Never');
  const [selectedProvider, setSelectedProvider] = useState('google_classroom');
  const [syncLogs, setSyncLogs] = useState([]);

  const approvedSubmissions = submissions.filter(s => s.approved);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced('Just now');
      const now = new Date();
      const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const count = approvedSubmissions.length || submissions.length || 0;
      setSyncLogs(prev => [
        { 
          id: `l_${Date.now()}`, 
          timestamp: ts, 
          course: 'Primary Classroom', 
          assignment: submissions[0]?.title || "Assignment Gradebook Sync", 
          itemsSynced: count, 
          status: 'Success' 
        },
        ...prev
      ]);
    }, 1200);
  };

  const providers = [
    { id: 'google_classroom', name: 'Google Classroom', status: 'Active OAuth', icon: 'school', color: '#137333', active: true },
    { id: 'canvas', name: 'Canvas LMS', status: 'Ready (REST API)', icon: 'apps', color: '#E13F2B', active: false },
    { id: 'moodle', name: 'Moodle Core', status: 'Ready (Token)', icon: 'menu_book', color: '#F98012', active: false },
    { id: 'blackboard', name: 'Blackboard Learn', status: 'Ready (LTI 1.3)', icon: 'developer_board', color: '#000000', active: false }
  ];

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-sm border-b border-surface-container">
        <div className="space-y-space-xs max-w-2xl">
          <div className="flex items-center gap-space-sm">
            <span className="font-code-inline text-code-inline text-secondary font-medium tracking-wide uppercase">
              Gradebook Sync Hub
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Live Synchronizer</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Gradebook &amp; Classroom Sync
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Seamless two-way bridge transmitting validated assignment scores, per-criterion diagnostic breakdown summaries, and feedback directly into institutional gradebooks.
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 px-space-md py-space-sm rounded bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary shadow-sm font-semibold active:translate-y-0.5 transition-all self-start lg:self-auto"
          type="button"
        >
          <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>
            sync
          </span>
          <span>{isSyncing ? 'Syncing Gradebook...' : 'Sync Grades Now'}</span>
        </button>
      </div>

      {/* Provider Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
        {providers.map((p) => {
          const isSelected = selectedProvider === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProvider(p.id)}
              type="button"
              className={`p-space-md rounded-xl text-left transition-all border flex flex-col justify-between ${
                isSelected
                  ? 'bg-surface-container-lowest border-primary shadow-md ring-2 ring-primary/20'
                  : 'bg-surface-container-low border-surface-container hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="material-symbols-outlined text-[24px]" style={{ color: p.color }}>
                  {p.icon}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  p.active ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {p.active ? 'Active' : 'Supported'}
                </span>
              </div>
              <div>
                <span className="font-label-md text-label-md text-on-surface font-bold block">{p.name}</span>
                <span className="font-annotation-note text-annotation-note text-on-surface-variant">{p.status}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Primary Connected LMS Card */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container space-y-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary text-[28px]">school</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Google Classroom Grade Sync
                </h3>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-xs font-bold">
                  Connected
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Account: connected.educator@institution.edu • Scopes: coursework.students, courses.readonly
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Last synced: <strong className="text-on-surface">{lastSynced}</strong>
            </span>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-2">
          <div className="p-space-sm rounded-lg bg-surface-container-low border border-surface-container flex items-center justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface font-semibold block">Automatic Sync</span>
              <span className="font-annotation-note text-annotation-note text-on-surface-variant">Push on teacher score approval</span>
            </div>
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                autoSync ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
              type="button"
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${autoSync ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="p-space-sm rounded-lg bg-surface-container-low border border-surface-container">
            <span className="font-label-md text-label-md text-on-surface font-semibold block">Active Assignment</span>
            <span className="font-annotation-note text-annotation-note text-secondary font-medium truncate block">
              {submissions[0]?.title || 'All Approved Submissions'}
            </span>
          </div>

          <div className="p-space-sm rounded-lg bg-surface-container-low border border-surface-container">
            <span className="font-label-md text-label-md text-on-surface font-semibold block">Target Grade Category</span>
            <span className="font-annotation-note text-annotation-note text-on-surface-variant">
              Major Assignments (Standard Gradebook)
            </span>
          </div>
        </div>
      </div>

      {/* Sync Ledger History */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container overflow-hidden">
        <div className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-bold">
          <span>Audit Log • Sync Event</span>
          <span>Items Transmitted • Status</span>
        </div>
        {syncLogs.length === 0 ? (
          <div className="p-space-xl text-center flex flex-col items-center justify-center space-y-space-sm py-12">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[24px]">sync</span>
            </div>
            <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">No Synchronizations Yet</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
              Click 'Sync Grades Now' to transmit verified student evaluations and margin feedback to your gradebook.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container">
            {syncLogs.map((log) => (
              <div key={log.id} className="p-space-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
                <div className="space-y-0.5">
                  <span className="font-label-md text-label-md text-on-surface font-semibold block">{log.assignment}</span>
                  <span className="font-annotation-note text-annotation-note text-on-surface-variant">
                    {log.course} • {log.timestamp}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-code-inline text-code-inline text-on-surface">{log.itemsSynced} records</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-xs font-bold">
                    <span className="material-symbols-outlined text-[14px]">check</span> {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
