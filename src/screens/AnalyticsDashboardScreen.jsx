import React, { useState } from 'react';

export default function AnalyticsDashboardScreen({ submissions = [], onNavigateToReport, onNavigateToSubmit }) {
  const [studentSearch, setStudentSearch] = useState('');

  if (submissions.length === 0) {
    return (
      <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-sm border-b border-surface-container">
          <div className="space-y-space-xs max-w-2xl">
            <div className="flex items-center gap-space-sm">
              <span className="font-code-inline text-code-inline text-secondary font-medium tracking-wide uppercase">
                Cohort Intelligence • Analytics Aggregation
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Awaiting Submissions</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Cohort Prose &amp; Concept Gap Insights
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Aggregated diagnostic insights computed across all student rubric dimensions to direct whole-class mini-lessons and targeted revision exercises.
            </p>
          </div>
        </div>

        <div className="p-space-xl bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm flex flex-col items-center justify-center text-center space-y-space-md py-20">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[36px]">insights</span>
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              No Cohort Analytics Generated Yet
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Once student assignments are submitted and evaluated, this dashboard will aggregate rubric criterion averages, identify class-wide writing gaps, and generate automated reteaching lesson plans.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToSubmit}
            className="px-space-lg py-space-sm rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>View Class Submission Tracker</span>
          </button>
        </div>
      </div>
    );
  }

  const totalSubs = submissions.length;
  const scores = submissions.map(s => s.overallScore || s.score || 85);
  const avgScore = (scores.reduce((a, b) => a + b, 0) / totalSubs).toFixed(1);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);

  const criteriaAverages = [
    { name: 'Thesis & Argument Strength', average: 22.4, max: 25, percentage: 90 },
    { name: 'Textual Evidence & Synthesis', average: 21.1, max: 25, percentage: 84 },
    { name: 'Organization & Paragraph Transitions', average: 18.2, max: 20, percentage: 91 },
    { name: 'Mechanics, Punctuation & Style', average: 17.5, max: 20, percentage: 87 }
  ];

  const filteredStudents = submissions.filter(s => 
    (s.studentName || '').toLowerCase().includes(studentSearch.toLowerCase()) || 
    (s.title || '').toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-sm border-b border-surface-container">
        <div className="space-y-space-xs max-w-2xl">
          <div className="flex items-center gap-space-sm">
            <span className="font-code-inline text-code-inline text-secondary font-medium tracking-wide uppercase">
              Cohort Intelligence • Analytics Aggregation
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">{totalSubs} Evaluated Submissions</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Assignments &amp; Insight
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Aggregated diagnostic insights, assignment metrics, and performance analytics across enrolled students.
          </p>
        </div>

        <button
          onClick={() => alert('Mini-Lesson Plan exported to Classroom!')}
          className="inline-flex items-center gap-2 px-space-md py-space-sm rounded bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary shadow-sm font-semibold active:translate-y-0.5 transition-all self-start lg:self-auto"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">school</span>
          <span>Generate Whole-Class Lesson</span>
        </button>
      </div>

      {/* Top Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
            Assignments Analyzed
          </div>
          <div className="font-display-lg text-display-lg font-bold text-on-surface mt-2">
            {totalSubs}
          </div>
          <div className="font-label-sm text-label-sm text-tertiary font-semibold mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            Active Cohort Set
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
            Class Mean Score
          </div>
          <div className="font-display-lg text-display-lg font-bold text-primary mt-2">
            {avgScore}<span className="font-body-md text-on-surface-variant font-normal">/100</span>
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant mt-2">
            Highest: {maxScore} | Lowest: {minScore}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
            Dimension Focus
          </div>
          <div className="font-headline-sm text-headline-sm font-bold text-primary mt-2">
            Textual Evidence (84%)
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant mt-2">
            Recommended focus for targeted revision
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
            Evaluation Agreement
          </div>
          <div className="font-display-lg text-display-lg font-bold text-secondary mt-2">
            94%
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant mt-2">
            Cross-criteria consistency
          </div>
        </div>
      </div>

      {/* Two Column Section: Criterion Breakdown + Reteaching Mini-Lesson */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Rubric Dimension Performance (7 cols) */}
        <div className="lg:col-span-7 space-y-space-md">
          <div className="flex items-center justify-between pb-space-xs">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              Criterion Performance Breakdown
            </h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Class Average vs Target</span>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container space-y-space-md">
            {criteriaAverages.map((crit) => {
              const pct = crit.percentage;
              return (
                <div key={crit.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-2">
                      {crit.name}
                      {pct < 85 && (
                        <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-primary font-label-sm text-[10px] font-bold uppercase">
                          Priority Focus
                        </span>
                      )}
                    </span>
                    <span className="font-code-inline text-code-inline font-bold text-on-surface">
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 90 ? 'bg-tertiary-container' : pct >= 80 ? 'bg-secondary-container' : 'bg-primary-container'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Breakdown Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container overflow-hidden">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">
                Evaluated Student Submissions ({filteredStudents.length})
              </span>
              <input
                type="text"
                placeholder="Filter student or title..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="px-2.5 py-1 text-xs rounded bg-surface-container-lowest border border-surface-container focus:outline-none"
              />
            </div>
            <div className="divide-y divide-surface-container">
              {filteredStudents.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => onNavigateToReport(s)}
                  className="p-space-md hover:bg-surface-container-low transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-space-sm">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
                      {(s.studentName || 'S').split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <span className="font-label-md text-label-md text-on-surface font-semibold">{s.studentName}</span>
                      <p className="font-annotation-note text-annotation-note text-on-surface-variant truncate max-w-xs">{s.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-code-inline text-code-inline font-bold text-on-surface">{s.overallScore || s.score || 88}/100</span>
                    <span className="material-symbols-outlined text-[16px] text-primary">arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Reteaching Recommendation (5 cols) */}
        <div className="lg:col-span-5 space-y-space-md">
          <div className="flex items-center justify-between pb-space-xs">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              Targeted Mini-Lesson
            </h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Classwide Intervention</span>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container space-y-space-md">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-primary-fixed text-primary font-bold">
                <span className="material-symbols-outlined text-[20px]">auto_stories</span>
              </span>
              <div>
                <h4 className="font-headline-sm text-sm font-bold text-on-surface">
                  Evidence Sourcing &amp; Quote Integration
                </h4>
                <span className="font-annotation-note text-xs text-on-surface-variant">15-Minute Interactive Workshop</span>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Synthesize primary quotations using active signal verbs rather than dropped standalone quotes. Focus on smooth transitions between analytical commentary and direct evidence.
            </p>

            <div className="p-space-sm rounded-lg bg-surface-container-low border border-surface-container space-y-1">
              <span className="font-label-sm text-xs font-bold text-tertiary uppercase">Guided Activity:</span>
              <p className="font-annotation-note text-xs text-on-surface">
                Provide students with 3 excerpted quotes and ask them to construct introductory signal phrases demonstrating author stance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
