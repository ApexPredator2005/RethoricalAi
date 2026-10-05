import React, { useState } from 'react';
import { ASSIGNMENT_TEMPLATES } from '../data/mockData';

const INITIAL_CRITERIA = [
  {
    id: 'CRIT-01',
    name: 'Problem Formulation & Architecture',
    description: 'Clearly identifies problem constraints, system boundaries, and foundational algorithmic/mathematical assumptions.',
    weight: 25,
    highAnchor: 'Comprehensive specification with formal constraints, system models, and edge condition handling.',
    highRange: '23–25 pts',
    midAnchor: 'Standard problem formulation with clear baseline requirements and minor gaps in edge case coverage.',
    midRange: '17–22 pts',
    lowAnchor: 'Incomplete problem definition without clear technical assumptions or constraint bounds.',
    lowRange: '0–16 pts'
  },
  {
    id: 'CRIT-02',
    name: 'Technical Methodology & Design',
    description: 'Systematic technical design, modular architecture, algorithmic efficiency, and verified correctness.',
    weight: 30,
    highAnchor: 'Optimal algorithmic design with formal proofs, clean component separation, and thorough modularity.',
    highRange: '27–30 pts',
    midAnchor: 'Functionally sound design with standard complexity trade-offs and minor coupling.',
    midRange: '21–26 pts',
    lowAnchor: 'Suboptimal architecture with unhandled failure modes or inefficient complexity.',
    lowRange: '0–20 pts'
  },
  {
    id: 'CRIT-03',
    name: 'Empirical Analysis & Quantitative Evidence',
    description: 'Precise benchmark metrics, test cases, statistical data analysis, and validation tables.',
    weight: 25,
    highAnchor: 'Exemplary quantitative benchmarking with statistical confidence intervals and rigorous validation test suites.',
    highRange: '23–25 pts',
    midAnchor: 'Adequate test coverage with standard benchmark metrics and expected performance ranges.',
    midRange: '17–22 pts',
    lowAnchor: 'Sparse empirical evidence with missing benchmark figures or incomplete testing.',
    lowRange: '0–16 pts'
  },
  {
    id: 'CRIT-04',
    name: 'Technical Clarity & Documentation',
    description: 'Clear technical documentation, accurate notations, UML schemas, and reproducible conclusions.',
    weight: 20,
    highAnchor: 'Publication-quality technical documentation with precise mathematical notation and clear architectural schemas.',
    highRange: '18–20 pts',
    midAnchor: 'Clear and technically sound presentation with minor diagrammatic ambiguities.',
    midRange: '14–17 pts',
    lowAnchor: 'Unclear explanations, missing schemas, or ambiguous technical notation.',
    lowRange: '0–13 pts'
  }
];

export default function RubricBuilderScreen() {
  const [criteria, setCriteria] = useState(INITIAL_CRITERIA);
  const [rubricTitle, setRubricTitle] = useState('Grading Criteria: STEM & Technical Coursework');
  const [rubricDesc, setRubricDesc] = useState('Calibrated for technical coursework, algorithm analysis, software engineering specs, and data-driven lab reports.');
  const [selectedTemplateId, setSelectedTemplateId] = useState('stem_lab');
  const [savedNotification, setSavedNotification] = useState(false);

  const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weight || 0), 0);
  const isWeightValid = totalWeight === 100;

  const handleTemplatePresetChange = (templateId) => {
    setSelectedTemplateId(templateId);
    const tmpl = ASSIGNMENT_TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;

    setRubricTitle(`Grading Criteria: ${tmpl.name}`);
    setRubricDesc(`Standardized rubric benchmark for ${tmpl.category}. Configured with ${tmpl.criteria.length} calibrated analytical dimensions.`);

    const convertedCriteria = tmpl.criteria.map((c, i) => {
      const w = c.weight;
      const highMin = Math.round(w * 0.9);
      const midMin = Math.round(w * 0.7);
      return {
        id: `CRIT-0${i + 1}`,
        name: c.name,
        description: c.description,
        weight: w,
        highAnchor: `Demonstrates exemplary mastery of ${c.name.toLowerCase()} with compelling precision and technical depth.`,
        highRange: `${highMin}–${w} pts`,
        midAnchor: `Satisfactory execution of ${c.name.toLowerCase()} with standard clarity and minor gaps.`,
        midRange: `${midMin}–${highMin - 1} pts`,
        lowAnchor: `Emerging development; lacks consistent evidence or execution for ${c.name.toLowerCase()}.`,
        lowRange: `0–${midMin - 1} pts`
      };
    });
    setCriteria(convertedCriteria);
  };

  const handleWeightChange = (index, val) => {
    const next = [...criteria];
    next[index].weight = Number(val) || 0;
    setCriteria(next);
  };

  const handleFieldChange = (index, field, val) => {
    const next = [...criteria];
    next[index][field] = val;
    setCriteria(next);
  };

  const handleAddCriterion = () => {
    const newId = `CRIT-0${criteria.length + 1}`;
    setCriteria([
      ...criteria,
      {
        id: newId,
        name: 'New Custom Dimension',
        description: 'Define specific evaluation criteria and required standards.',
        weight: 10,
        highAnchor: 'Exemplary demonstration exceeding standard expectations.',
        highRange: '9–10 pts',
        midAnchor: 'Competent execution meeting core baseline standards.',
        midRange: '7–8 pts',
        lowAnchor: 'Insufficient evidence or significant conceptual errors.',
        lowRange: '0–6 pts'
      }
    ]);
  };

  const handleDeleteCriterion = (index) => {
    if (criteria.length <= 1) return;
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
    }, 4000);
  };

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-space-lg pb-space-xs">
        <div className="space-y-space-xs max-w-3xl">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Grading Criteria Specification</span>
          </div>
          <input
            type="text"
            value={rubricTitle}
            onChange={(e) => setRubricTitle(e.target.value)}
            className="font-headline-lg text-headline-lg text-on-surface tracking-tight bg-transparent border-b border-transparent hover:border-surface-container focus:border-primary focus:outline-none w-full font-bold"
          />
          <textarea
            rows={2}
            value={rubricDesc}
            onChange={(e) => setRubricDesc(e.target.value)}
            className="font-body-md text-body-md text-on-surface-variant bg-transparent resize-none focus:outline-none w-full"
          />
        </div>

        {/* Action Station */}
        <div className="flex items-center gap-space-sm shrink-0 self-start">
          <button 
            type="button"
            onClick={() => alert('Criteria template duplicated to draft repository!')}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors rounded shadow-sm font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span>Duplicate Criteria</span>
          </button>
          <button 
            type="button"
            id="save-btn"
            onClick={handleSave}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-primary-container text-on-primary hover:opacity-90 active:translate-y-0.5 transition-all rounded shadow-md font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">ink_pen</span>
            <span>Save Criteria</span>
          </button>
        </div>
      </div>

      {/* Preset Loader Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-sm">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-[22px]">auto_stories</span>
          <div>
            <span className="font-label-md text-label-md font-bold text-on-surface">Load Preset Template</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Switch subject criteria across STEM, Computing, Business &amp; Humanities in 1 click.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedTemplateId}
            onChange={(e) => handleTemplatePresetChange(e.target.value)}
            className="bg-surface-container py-2 px-3 rounded-lg font-label-md text-label-md text-on-surface border border-surface-container focus:outline-none focus:bg-surface-container-high cursor-pointer font-medium"
          >
            {ASSIGNMENT_TEMPLATES.map(tmpl => (
              <option key={tmpl.id} value={tmpl.id}>
                {tmpl.name} ({tmpl.category.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Save Notification Toast */}
      {savedNotification && (
        <div className="p-space-sm rounded bg-tertiary-fixed text-on-tertiary-container font-label-md text-label-md flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>Rubric criteria calibrated &amp; updated successfully for active evaluation!</span>
          </div>
          <span className="font-mono text-xs opacity-75">Weights: 100% verified</span>
        </div>
      )}

      {/* Control Summary Banner */}
      <div className="flex flex-wrap items-center justify-between gap-space-md p-space-md bg-surface-container-low rounded-xl border border-surface-container">
        <div className="flex flex-wrap items-center gap-space-md font-label-sm text-label-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Grade Scale: <strong className="font-mono text-on-surface ml-1">100-Point Analytic</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">category</span>
            Discipline: <strong className="text-on-surface ml-1">Computing &amp; Engineering</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">event</span>
            Active Term: <strong className="text-on-surface ml-1">2026–2027 Academic Session</strong>
          </span>
        </div>

        {/* Live Weight Validation Indicator */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-space-sm py-1 rounded text-xs font-bold font-mono tracking-tight ${
            isWeightValid
              ? 'bg-tertiary-fixed text-on-tertiary-container'
              : 'bg-error-container text-on-error-container animate-pulse'
          }`}>
            <span className="material-symbols-outlined text-[15px]">
              {isWeightValid ? 'check_circle' : 'warning'}
            </span>
            <span>Weights: {totalWeight}%</span>
          </span>
          {!isWeightValid && (
            <span className="font-label-sm text-xs text-error font-medium">
              (Must equal exactly 100%)
            </span>
          )}
        </div>
      </div>

      {/* Criteria Card Stack */}
      <div className="space-y-space-md">
        <div className="flex items-center justify-between text-on-surface">
          <h2 className="font-headline-sm text-headline-sm font-bold flex items-center gap-2">
            <span>Grading Criteria</span>
            <span className="font-mono text-xs font-normal px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
              {criteria.length} Criteria
            </span>
          </h2>
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">drag_indicator</span>
            Grab handles to reorder sections
          </span>
        </div>

        <div className="space-y-space-md">
          {criteria.map((crit, idx) => (
            <div 
              key={crit.id} 
              className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-surface-container space-y-space-md transition-all hover:border-primary/40 group"
            >
              {/* Card Header: Drag, ID, Name, Weights */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm border-b border-surface-container">
                <div className="flex items-center gap-space-sm flex-1">
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary cursor-grab text-[20px]">
                    drag_indicator
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant">
                    {crit.id}
                  </span>
                  <input
                    type="text"
                    value={crit.name}
                    onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                    className="font-headline-sm text-headline-sm font-bold text-on-surface bg-transparent hover:bg-surface-container px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-primary flex-1 max-w-md"
                  />
                </div>

                <div className="flex items-center gap-space-md">
                  {/* Weight Slider / Input */}
                  <div className="flex items-center gap-2 bg-surface-container p-1.5 rounded-lg">
                    <span className="font-label-sm text-xs font-semibold text-on-surface-variant">Weight:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={crit.weight}
                      onChange={(e) => handleWeightChange(idx, e.target.value)}
                      className="w-14 bg-surface-container-lowest text-center font-mono font-bold text-xs p-1 rounded border border-surface-container text-on-surface focus:outline-none focus:border-primary"
                    />
                    <span className="font-mono text-xs font-bold text-on-surface-variant">%</span>
                  </div>

                  {/* Max Scale */}
                  <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded-lg text-xs font-mono">
                    <span className="text-on-surface-variant">Max Scale:</span>
                    <strong className="text-on-surface">0 – {crit.weight} pts</strong>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteCriterion(idx)}
                    disabled={criteria.length <= 1}
                    className="p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Remove this criterion"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Criterion Description */}
              <div className="space-y-1">
                <label className="font-label-sm text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Criterion Dimension Objective
                </label>
                <textarea
                  rows={2}
                  value={crit.description}
                  onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container font-body-md text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary"
                />
              </div>

              {/* Score Anchor Level Descriptors */}
              <details className="group/anchor" open>
                <summary className="cursor-pointer list-none flex items-center justify-between text-xs font-bold text-on-surface-variant uppercase tracking-wider select-none py-1">
                  <span className="flex items-center gap-1 hover:text-on-surface">
                    <span className="material-symbols-outlined text-[16px] transition-transform group-open/anchor:rotate-90">arrow_right</span>
                    Score Level Anchors &amp; Performance Descriptors
                  </span>
                  <span className="text-[11px] font-normal lowercase font-sans text-outline hover:underline">toggle descriptors</span>
                </summary>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm pt-space-sm">
                  {/* High Anchor (Green) */}
                  <div className="p-space-sm rounded-xl bg-[#E6F4EA] dark:bg-[#132A1C] border border-[#CEEAD6] dark:border-[#1E462E] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-xs font-bold text-[#137333] dark:text-[#81C995] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#137333] dark:bg-[#81C995]"></span>
                        Exemplary / High Anchor
                      </span>
                      <span className="font-mono text-xs font-bold text-[#137333] dark:text-[#81C995]">
                        {crit.highRange || `${Math.round(crit.weight * 0.9)}–${crit.weight} pts`}
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={crit.highAnchor}
                      onChange={(e) => handleFieldChange(idx, 'highAnchor', e.target.value)}
                      className="w-full bg-transparent text-xs text-on-surface font-body-sm leading-relaxed resize-none focus:outline-none"
                    />
                  </div>

                  {/* Mid Anchor (Yellow / Amber) */}
                  <div className="p-space-sm rounded-xl bg-[#FEF7E0] dark:bg-[#2C2412] border border-[#FEEFC3] dark:border-[#42361B] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-xs font-bold text-[#B06000] dark:text-[#FDD663] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#F29900]"></span>
                        Proficient / Mid Anchor
                      </span>
                      <span className="font-mono text-xs font-bold text-[#B06000] dark:text-[#FDD663]">
                        {crit.midRange || `${Math.round(crit.weight * 0.7)}–${Math.round(crit.weight * 0.9) - 1} pts`}
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={crit.midAnchor}
                      onChange={(e) => handleFieldChange(idx, 'midAnchor', e.target.value)}
                      className="w-full bg-transparent text-xs text-on-surface font-body-sm leading-relaxed resize-none focus:outline-none"
                    />
                  </div>

                  {/* Low Anchor (Red / Emerging) */}
                  <div className="p-space-sm rounded-xl bg-[#FCE8E6] dark:bg-[#2E1616] border border-[#FAD2CF] dark:border-[#4B2323] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-xs font-bold text-[#C5221F] dark:text-[#F28B82] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#D93025]"></span>
                        Developing / Low Anchor
                      </span>
                      <span className="font-mono text-xs font-bold text-[#C5221F] dark:text-[#F28B82]">
                        {crit.lowRange || `0–${Math.round(crit.weight * 0.7) - 1} pts`}
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={crit.lowAnchor}
                      onChange={(e) => handleFieldChange(idx, 'lowAnchor', e.target.value)}
                      className="w-full bg-transparent text-xs text-on-surface font-body-sm leading-relaxed resize-none focus:outline-none"
                    />
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* Add Dimension Row */}
        <button
          type="button"
          onClick={handleAddCriterion}
          className="w-full py-space-md rounded-2xl border-2 border-dashed border-surface-container hover:border-primary text-on-surface-variant hover:text-primary font-label-md text-sm font-bold flex items-center justify-center gap-2 transition-all bg-surface-container-low/50 hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Add Custom Grading Dimension</span>
        </button>
      </div>
    </div>
  );
}
