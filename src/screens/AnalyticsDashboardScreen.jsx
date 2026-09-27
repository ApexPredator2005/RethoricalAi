import React, { useState } from 'react';
import { CLASS_ANALYTICS } from '../data/mockData';

export default function AnalyticsDashboardScreen({ onNavigateToReport }) {
  const analytics = CLASS_ANALYTICS;
  const [selectedTopicRank, setSelectedTopicRank] = useState(1);
  const [studentSearch, setStudentSearch] = useState('');

  const activeReteach = analytics.rankedReteachTopics.find(t => t.rank === selectedTopicRank) || analytics.rankedReteachTopics[0];

  const filteredStudents = analytics.studentDrilldown.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
    s.struggle.toLowerCase().includes(studentSearch.toLowerCase())
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
            <span className="font-label-sm text-label-sm text-on-surface-variant">28 Graded Submissions</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            {analytics.className} — Prose &amp; Concept Gaps
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Aggregated diagnostic insights computed across all student rubric dimensions to direct whole-class mini-lessons and targeted revision exercises.
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
            28<span className="font-body-md text-on-surface-variant font-normal">/28</span>
          </div>
          <div className="font-label-sm text-label-sm text-tertiary font-semibold mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            100% Submission Complete
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
            Class Mean Score
          </div>
          <div className="font-display-lg text-display-lg font-bold text-primary mt-2">
            88.4<span className="font-body-md text-on-surface-variant font-normal">/100</span>
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant mt-2">
            Highest: 95 | Lowest: 68
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
            Weakest Dimension
          </div>
          <div className="font-headline-sm text-headline-sm font-bold text-primary mt-2">
            Textual Evidence (76%)
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant mt-2">
            12 of 28 scholars need quote embed practice
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
          <div className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
            Prose Improvement
          </div>
          <div className="font-display-lg text-display-lg font-bold text-secondary mt-2">
            +3.4%
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant mt-2">
            Compared to Assignment #1 baseline
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
            <span className="font-label-sm text-label-sm text-on-surface-variant">Class Average vs Benchmark</span>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container space-y-space-md">
            {(analytics.criteriaAverages || []).map((crit) => {
              const pct = crit.percentage;
              const isWeakest = crit.name.includes('Textual Evidence') || pct < 80;
              return (
                <div key={crit.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-2">
                      {crit.name}
                      {isWeakest && (
                        <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-primary font-label-sm text-[10px] font-bold uppercase">
                          Priority Focus
                        </span>
                      )}
                    </span>
                    <span className="font-code-inline text-code-inline font-bold text-on-surface">
                      {crit.average} / {crit.max} ({pct}%)
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
                Student Revision Roster
              </span>
              <input
                type="text"
                placeholder="Filter student or gap..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="px-2.5 py-1 text-xs rounded bg-surface-container-lowest border border-surface-container focus:outline-none"
              />
            </div>
            <div className="divide-y divide-surface-container">
              {filteredStudents.map((s) => (
                <div 
                  key={s.name}
                  onClick={onNavigateToReport}
                  className="p-space-md hover:bg-surface-container-low transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-space-sm">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
                      {s.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <span className="font-label-md text-label-md text-on-surface font-semibold">{s.name}</span>
                      <p className="font-annotation-note text-annotation-note text-on-surface-variant">{s.struggle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-code-inline text-code-inline font-bold text-on-surface">{s.score}/100</span>
                    <span className="material-symbols-outlined text-[16px] text-primary">arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Remediation Mini-Lessons (5 cols) */}
        <div className="lg:col-span-5 space-y-space-md">
          <div className="flex items-center justify-between pb-space-xs">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              Suggested Mini-Lessons
            </h2>
            <span className="material-symbols-outlined text-[20px] text-secondary">auto_stories</span>
          </div>

          {/* Reteach Tabs */}
          <div className="flex gap-1 bg-surface-container p-1 rounded-lg">
            {analytics.rankedReteachTopics.map((topic) => (
              <button
                key={topic.rank}
                onClick={() => setSelectedTopicRank(topic.rank)}
                type="button"
                className={`flex-1 py-1.5 text-xs font-label-md rounded font-semibold transition-all ${
                  selectedTopicRank === topic.rank
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Focus Topic #{topic.rank}
              </button>
            ))}
          </div>

          {/* Active Lesson Card */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container space-y-space-md">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-primary font-label-sm text-xs font-bold">
                {activeReteach.frequency} of Class Affected
              </span>
              <span className="font-label-sm text-on-surface-variant font-medium">15-Minute Mini-Lesson</span>
            </div>

            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                {activeReteach.topic}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {activeReteach.rationale}
              </p>
            </div>

            {/* Lesson Architecture */}
            <div className="bg-surface-container-low p-space-md rounded-lg space-y-2 border border-surface-container">
              <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase tracking-wider">
                Quick Activity Plan
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {activeReteach.lessonPlan}
              </p>
            </div>

            {/* Anchor Snippet */}
            <div className="border-l-2 border-primary pl-3 py-1 bg-primary-fixed/20 rounded-r">
              <span className="font-label-sm text-xs font-bold text-primary block">Example Correction:</span>
              <span className="font-annotation-note text-annotation-note text-on-surface italic">
                {activeReteach.sampleFix}
              </span>
            </div>

            <button
              onClick={() => alert(`Exported "${activeReteach.topic}" handout to classroom!`)}
              className="w-full py-2 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-semibold border border-surface-container"
              type="button"
            >
              Export Mini-Lesson Handout (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
