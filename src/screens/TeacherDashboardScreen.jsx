import React from 'react';

export default function TeacherDashboardScreen({
  classes,
  selectedClassId,
  onOpenNewAssignment,
  onNavigateToReport,
  onNavigateToLms
}) {
  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* Action Bar / Editorial Desk Greeting */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-lg">
        <div className="space-y-space-xs max-w-2xl">
          <div className="flex items-center gap-space-sm">
            <span className="font-code-inline text-code-inline text-secondary font-medium tracking-wide uppercase">
              Desk / Term 1 Autumn Review
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Week 8 of 16</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-semibold">
            Welcome back, Ms. Holloway
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            {currentClass.name} — 49 registered scholars.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-space-sm">
          <button 
            onClick={onNavigateToLms}
            className="group flex items-center gap-space-xs px-space-md py-space-sm rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-all shadow-[0_2px_0_rgba(31,27,21,0.06)] active:translate-y-0.5" 
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">cloud_sync</span>
            <span className="font-label-md text-label-md">Import from Classroom</span>
          </button>
          
          <button 
            onClick={onOpenNewAssignment}
            className="group flex items-center gap-space-xs px-space-md py-space-sm rounded bg-primary-container text-on-primary hover:bg-primary transition-all shadow-[0_3px_0_rgba(86,20,0,0.3)] active:translate-y-0.5" 
            type="button"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">add</span>
            <span className="font-label-md text-label-md tracking-wide font-medium">+ New Assignment</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Tactile Papers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {/* Card 1: Class Average */}
        <div className="relative bg-surface-container-lowest p-space-lg rounded shadow-[0_3px_10px_rgba(31,27,21,0.04),0_1px_2px_rgba(31,27,21,0.06)] flex flex-col justify-between overflow-hidden border border-surface-container">
          <div className="absolute top-0 left-0 right-0 h-1 bg-tertiary-fixed-dim"></div>
          <div className="flex items-start justify-between">
            <div className="space-y-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Class Performance
              </span>
              <div className="font-headline-sm text-headline-sm text-on-surface">Class Average</div>
            </div>
            <span className="p-space-xs rounded bg-tertiary-fixed text-on-tertiary-container">
              <span className="material-symbols-outlined text-[20px]">analytics</span>
            </span>
          </div>
          <div className="mt-space-lg flex items-baseline justify-between">
            <div className="font-display-lg text-display-lg text-on-surface font-semibold tracking-tight">
              88.4<span className="font-body-sm text-body-sm font-normal text-on-surface-variant">%</span>
            </div>
            <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +2.4% vs last cycle
            </span>
          </div>
          <p className="mt-space-sm font-annotation-note text-annotation-note text-on-surface-variant">
            Based on 142 graded assignments across both periods.
          </p>
        </div>

        {/* Card 2: Submissions Needing Review */}
        <div className="relative bg-surface-container-lowest p-space-lg rounded shadow-[0_3px_10px_rgba(31,27,21,0.04),0_1px_2px_rgba(31,27,21,0.06)] flex flex-col justify-between overflow-hidden border border-surface-container">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container"></div>
          <div className="flex items-start justify-between">
            <div className="space-y-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                Needs Attention
              </span>
              <div className="font-headline-sm text-headline-sm text-on-surface">Submissions to Review</div>
            </div>
            <span className="p-space-xs rounded bg-primary-fixed text-on-primary-fixed-variant">
              <span className="material-symbols-outlined text-[20px]">draw</span>
            </span>
          </div>
          <div className="mt-space-lg flex items-baseline justify-between">
            <div className="font-display-lg text-display-lg text-primary font-semibold tracking-tight">
              7 <span className="font-body-md text-body-md text-on-surface-variant font-normal">submissions</span>
            </div>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold tracking-wide">
              Action needed
            </span>
          </div>
          <p className="mt-space-sm font-annotation-note text-annotation-note text-on-surface-variant">
            5 Gatsby assignments • 2 King Lear writing tasks.
          </p>
        </div>

        {/* Card 3: Gradebook Sync */}
        <div className="relative bg-surface-container-lowest p-space-lg rounded shadow-[0_3px_10px_rgba(31,27,21,0.04),0_1px_2px_rgba(31,27,21,0.06)] flex flex-col justify-between overflow-hidden border border-surface-container">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>
          <div className="flex items-start justify-between">
            <div className="space-y-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                Gradebook Sync
              </span>
              <div className="font-headline-sm text-headline-sm text-on-surface">Synced to Gradebook</div>
            </div>
            <span className="p-space-xs rounded bg-secondary-fixed text-on-secondary-container">
              <span className="material-symbols-outlined text-[20px]">sync_saved_locally</span>
            </span>
          </div>
          <div className="mt-space-lg flex items-baseline justify-between">
            <div className="font-display-lg text-display-lg text-on-surface font-semibold tracking-tight">
              42 <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">/ 49</span>
            </div>
            <div className="flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
              Auto-sync active
            </div>
          </div>
          <div className="mt-space-md w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div className="bg-tertiary h-full rounded-full" style={{ width: '85.7%' }}></div>
          </div>
        </div>
      </div>

      {/* Active Assignments & Course Work Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Active Assignments List (7 cols) */}
        <div className="xl:col-span-7 space-y-space-md">
          <div className="flex items-center justify-between pb-space-xs">
            <div className="flex items-center gap-space-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface">Active Assignments</h2>
              <span className="px-space-xs py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant">
                3 Active
              </span>
            </div>
            <button 
              onClick={onOpenNewAssignment}
              className="font-label-sm text-label-sm text-primary hover:text-on-primary-container flex items-center gap-1 transition-colors" 
              type="button"
            >
              + Create Prompt <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Card: The Great Gatsby */}
          <div className="bg-surface-container-lowest p-space-lg rounded shadow-[0_2px_8px_rgba(31,27,21,0.04)] hover:shadow-[0_6px_16px_rgba(31,27,21,0.06)] transition-all flex flex-col gap-space-md border border-surface-container">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-space-sm">
                  <span className="px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-container font-label-sm text-label-sm font-medium">
                    Analytical Essay
                  </span>
                  <span className="font-annotation-note text-annotation-note text-error flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Due Yesterday, 11:59 PM
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  The Great Gatsby: Character Moral Ambiguity
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Synthesize textual evidence examining whether Fitzgerald constructs Jay Gatsby as a sympathetic romantic idealist or a cynical racketeer.
                </p>
              </div>
              <button 
                onClick={onNavigateToReport}
                className="self-start shrink-0 px-space-md py-space-xs rounded bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md shadow-[0_2px_0_rgba(86,20,0,0.2)] active:translate-y-0.5 transition-all" 
                type="button"
              >
                Grade Submissions (5)
              </button>
            </div>
            <div className="pt-space-sm flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low p-space-sm rounded">
              <div className="flex items-center gap-space-md">
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                  <span><strong>28</strong> submitted</span>
                </div>
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-primary">
                  <span className="material-symbols-outlined text-[16px]">pending</span>
                  <span><strong>5</strong> to grade</span>
                </div>
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-secondary">grade</span>
                  <span>Avg: <strong>88%</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-space-xs">
                <button className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container" type="button">
                  <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card: King Lear */}
          <div className="bg-surface-container-lowest p-space-lg rounded shadow-[0_2px_8px_rgba(31,27,21,0.04)] hover:shadow-[0_6px_16px_rgba(31,27,21,0.06)] transition-all flex flex-col gap-space-md border border-surface-container">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-space-sm">
                  <span className="px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-label-sm font-medium">
                    Argumentative
                  </span>
                  <span className="font-annotation-note text-annotation-note text-on-surface-variant">
                    Due Oct 24 • Period 3
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  King Lear: Madness vs. Wisdom
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Analyze Shakespeare's linguistic inversion of the Fool and Lear regarding the epistemology of courtly insight and blind pride.
                </p>
              </div>
              <button 
                onClick={onNavigateToReport}
                className="self-start shrink-0 px-space-md py-space-xs rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-all shadow-[0_1px_2px_rgba(31,27,21,0.06)]" 
                type="button"
              >
                Continue Grading (2)
              </button>
            </div>
            <div className="pt-space-sm flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low p-space-sm rounded">
              <div className="flex items-center gap-space-md">
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                  <span><strong>24</strong> submitted</span>
                </div>
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-primary">
                  <span className="material-symbols-outlined text-[16px]">pending</span>
                  <span><strong>2</strong> to grade</span>
                </div>
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-secondary">grade</span>
                  <span>Avg: <strong>82%</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-space-xs">
                <button className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container" type="button">
                  <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card: Personal Narrative */}
          <div className="bg-surface-container-lowest p-space-lg rounded shadow-[0_2px_8px_rgba(31,27,21,0.04)] hover:shadow-[0_6px_16px_rgba(31,27,21,0.06)] transition-all flex flex-col gap-space-md opacity-90 border border-surface-container">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-space-sm">
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-medium">
                    Formative
                  </span>
                  <span className="font-annotation-note text-annotation-note text-secondary font-medium">
                    Drafting Workshop • Closes Nov 2
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Personal Narrative: Formative Memoir Drafts
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  First reflective prose piece exploring sensory anchoring, voice modulation, and intentional pacing without chronological linearity.
                </p>
              </div>
              <button 
                onClick={onNavigateToReport}
                className="self-start shrink-0 px-space-md py-space-xs rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-all shadow-[0_1px_2px_rgba(31,27,21,0.06)]" 
                type="button"
              >
                View Working Drafts
              </button>
            </div>
            <div className="pt-space-sm flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low p-space-sm rounded">
              <div className="flex items-center gap-space-md">
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">edit_document</span>
                  <span><strong>18</strong> drafts received</span>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">
                  Peer Review Session starts tomorrow
                </div>
              </div>
              <div className="flex items-center gap-space-xs">
                <button className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container" type="button">
                  <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Submissions & Editorial Stream (5 cols) */}
        <div className="xl:col-span-5 space-y-space-md">
          <div className="flex items-center justify-between pb-space-xs">
            <div className="flex items-center gap-space-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface">Grading Ledger</h2>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Recent Live Submissions</span>
            </div>
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">history_edu</span>
          </div>

          {/* Desk Ledger Paper Card */}
          <div className="bg-surface-container-lowest rounded shadow-[0_2px_12px_rgba(31,27,21,0.05)] overflow-hidden border border-surface-container">
            {/* Column Headings */}
            <div className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              <span>Student &amp; Passage Note</span>
              <span>Score • Assessment</span>
            </div>

            {/* Submission Rows */}
            <div className="divide-y-0 flex flex-col">
              {/* Row 1: Julian Vance */}
              <div 
                onClick={onNavigateToReport}
                className="p-space-md hover:bg-surface-container-low transition-colors group flex items-start justify-between gap-space-sm cursor-pointer"
              >
                <div className="flex items-start gap-space-sm min-w-0">
                  <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-md text-label-md shrink-0 font-bold">
                    JV
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-md text-label-md text-on-surface font-semibold truncate">Julian Vance</span>
                      <span className="font-annotation-note text-annotation-note text-on-surface-variant">• 20m ago</span>
                    </div>
                    <div className="font-annotation-note text-annotation-note text-on-surface-variant italic truncate max-w-[200px] sm:max-w-xs">
                      “Fitzgerald uses the green light not as aspiration, but as an indictment...”
                    </div>
                    <div className="pt-0.5">
                      <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[13px]">verified</span> Strong thesis
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 gap-1">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    91<span className="font-label-sm text-label-sm text-on-surface-variant font-normal">/100</span>
                  </span>
                  <span className="font-label-sm text-label-sm text-primary group-hover:underline flex items-center gap-0.5">
                    Report <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </span>
                </div>
              </div>

              {/* Ruled divider line */}
              <div className="h-px bg-surface-container mx-space-md"></div>

              {/* Row 2: Maya Lin */}
              <div 
                onClick={onNavigateToReport}
                className="p-space-md hover:bg-surface-container-low transition-colors group flex items-start justify-between gap-space-sm cursor-pointer"
              >
                <div className="flex items-start gap-space-sm min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-md text-label-md shrink-0 font-bold">
                    ML
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-md text-label-md text-on-surface font-semibold truncate">Maya Lin</span>
                      <span className="font-annotation-note text-annotation-note text-on-surface-variant">• 1h ago</span>
                    </div>
                    <div className="font-annotation-note text-annotation-note text-on-surface-variant italic truncate max-w-[200px] sm:max-w-xs">
                      “The geography of West Egg versus East Egg directly manifests class antagonism...”
                    </div>
                    <div className="pt-0.5">
                      <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[13px]">verified</span> Exemplary evidence
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 gap-1">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    94<span className="font-label-sm text-label-sm text-on-surface-variant font-normal">/100</span>
                  </span>
                  <span className="font-label-sm text-label-sm text-primary group-hover:underline flex items-center gap-0.5">
                    Report <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </span>
                </div>
              </div>

              {/* Ruled divider line */}
              <div className="h-px bg-surface-container mx-space-md"></div>

              {/* Row 3: Marcus Sterling (Needs Review) */}
              <div 
                onClick={onNavigateToReport}
                className="p-space-md hover:bg-surface-container-low transition-colors group flex items-start justify-between gap-space-sm cursor-pointer"
              >
                <div className="flex items-start gap-space-sm min-w-0">
                  <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-label-md text-label-md shrink-0 font-bold">
                    MS
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-md text-label-md text-on-surface font-semibold truncate">Marcus Sterling</span>
                      <span className="font-annotation-note text-annotation-note text-on-surface-variant">• 2h ago</span>
                    </div>
                    <div className="font-annotation-note text-annotation-note text-on-surface-variant italic truncate max-w-[200px] sm:max-w-xs">
                      “Gatsby attempts to conquer the dimension of time through decorative wealth...”
                    </div>
                    <div className="pt-0.5">
                      <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[13px]">pending</span> Thesis scope review
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 gap-1">
                  <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">
                    Grade Now
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Pending</span>
                </div>
              </div>

              {/* Ruled divider line */}
              <div className="h-px bg-surface-container mx-space-md"></div>

              {/* Row 4: Sofia Rodriguez */}
              <div 
                onClick={onNavigateToReport}
                className="p-space-md hover:bg-surface-container-low transition-colors group flex items-start justify-between gap-space-sm cursor-pointer"
              >
                <div className="flex items-start gap-space-sm min-w-0">
                  <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-label-md text-label-md shrink-0 font-bold">
                    SR
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-md text-label-md text-on-surface font-semibold truncate">Sofia Rodriguez</span>
                      <span className="font-annotation-note text-annotation-note text-on-surface-variant">• 4h ago</span>
                    </div>
                    <div className="font-annotation-note text-annotation-note text-on-surface-variant italic truncate max-w-[200px] sm:max-w-xs">
                      “Daisy's voice described as 'full of money' signifies the commodification of intimacy...”
                    </div>
                    <div className="pt-0.5">
                      <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[13px]">verified</span> High academic register
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 gap-1">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    95<span className="font-label-sm text-label-sm text-on-surface-variant font-normal">/100</span>
                  </span>
                  <span className="font-label-sm text-label-sm text-primary group-hover:underline flex items-center gap-0.5">
                    Report <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
