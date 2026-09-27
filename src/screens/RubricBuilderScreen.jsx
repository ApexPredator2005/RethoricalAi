import React, { useState } from 'react';

const INITIAL_CRITERIA = [
  {
    id: 'CRIT-01',
    name: 'Thesis & Argumentative Defensibility',
    description: 'Formulates a nuanced, defensible thesis that establishes a clear line of literary reasoning and synthesizes prompt tensions without formulaic phrasing.',
    weight: 25,
    highAnchor: "Thesis offers unexpected tension between Gatsby's romantic idealism and moral decay, framing the valley of ashes as a self-inflicted purgatory.",
    highRange: '23–25 pts',
    midAnchor: 'Clear thesis statement articulating character motive, but relies on conventional thematic dualities without exploring internal prose friction.',
    midRange: '17–22 pts',
    lowAnchor: 'Restates prompt without distinct arguable claim or uses simple plot summary as assertion.',
    lowRange: '0–16 pts'
  },
  {
    id: 'CRIT-02',
    name: 'Textual Evidence & Synthesis',
    description: 'Synthesizes specific, evocative textual quotes embedded smoothly within analytical commentary to illuminate authorial choice and deeper motif layers.',
    weight: 35,
    highAnchor: 'Quotes seamlessly integrated with active verbs; close-reading unpacks figurative resonance and subtextual motifs without block quotations.',
    highRange: '32–35 pts',
    midAnchor: 'Adequate textual evidence citing key scenes, though occasional quotes stand alone or are paraphrased with surface-level explanation.',
    midRange: '25–31 pts',
    lowAnchor: 'Sparse textual quotation or evidence used purely as plot recap without analytical examination.',
    lowRange: '0–24 pts'
  },
  {
    id: 'CRIT-03',
    name: 'Organization & Structural Progression',
    description: 'Constructs an inevitable, sequential argumentative progression where each paragraph advances the central thesis through controlled transitional rhetoric.',
    weight: 20,
    highAnchor: 'Organic topic sentences and sophisticated transitions that interweave contrasting counter-motifs without artificial signposts.',
    highRange: '18–20 pts',
    midAnchor: 'Functional 5-paragraph structure with clear topic sentences; transitions rely on standard chronological connective adverbs.',
    midRange: '14–17 pts',
    lowAnchor: 'Disjointed sequence of observations; abrupt thematic shifts with redundant or missing conclusions.',
    lowRange: '0–13 pts'
  },
  {
    id: 'CRIT-04',
    name: 'Stylistic Voice & Rhetorical Register',
    description: 'Demonstrates precise literary vocabulary, mature syntactical variety, active voice discipline, and accurate grammatical mechanics.',
    weight: 20,
    highAnchor: 'High academic register with rhythmic variety, vivid verbs, and nuanced literary terminology (e.g. polysemy, hubris, juxtaposition).',
    highRange: '18–20 pts',
    midAnchor: 'Clear and grammatically sound prose with minor colloquialisms or repetitive sentence beginnings.',
    midRange: '14–17 pts',
    lowAnchor: 'Frequent mechanical errors, run-ons, comma splices, or informal register that distracts from argument.',
    lowRange: '0–13 pts'
  }
];

export default function RubricBuilderScreen() {
  const [criteria, setCriteria] = useState(INITIAL_CRITERIA);
  const [rubricTitle, setRubricTitle] = useState('Rubric Builder: AP Literature Analytical Synthesis');
  const [rubricDesc, setRubricDesc] = useState('Crafted for multi-source comparative prose analysis. Balances argumentative rigor, close-reading textual defense, and rhetorical cadence.');
  const [savedNotification, setSavedNotification] = useState(false);

  const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weight || 0), 0);
  const isWeightValid = totalWeight === 100;

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
        name: 'New Custom Assessment Dimension',
        description: 'Specify clear evaluative criteria, student observable behaviors, and expected mastery level.',
        weight: 10,
        highAnchor: 'Mastery exemplar demonstrates exceptional nuance and technical command.',
        highRange: '9–10 pts',
        midAnchor: 'Proficient standard meets expectations with minor areas for refinement.',
        midRange: '7–8 pts',
        lowAnchor: 'Emerging attempt lacks supporting evidence or consistent execution.',
        lowRange: '0–6 pts'
      }
    ]);
  };

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-space-lg pb-space-xs">
        <div className="space-y-space-xs max-w-3xl">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Archival Assessment Specification</span>
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
            onClick={() => alert('Rubric template duplicated to draft repository!')}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors rounded shadow-sm font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span>Duplicate Template</span>
          </button>
          <button 
            type="button"
            id="save-btn"
            onClick={handleSave}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-primary-container text-on-primary hover:opacity-90 active:translate-y-0.5 transition-all rounded shadow-md font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">ink_pen</span>
            <span>Save Rubric</span>
          </button>
        </div>
      </div>

      {/* Save Notification Toast */}
      {savedNotification && (
        <div className="p-space-sm rounded bg-tertiary-fixed text-on-tertiary-container font-label-md text-label-md flex items-center justify-between shadow-sm animate-fade-in">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Rubric specifications successfully locked and synchronized with Gemini grading anchors!
          </span>
          <span className="font-code-inline text-xs">v2.4 Active</span>
        </div>
      )}

      {/* Ledger Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-md bg-surface-container-low px-space-md py-space-sm rounded-lg border border-surface-container">
        <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
            <span className="text-on-surface">Grade Scale:</span>
            <span className="font-code-inline text-code-inline text-on-surface bg-surface-container-lowest px-1.5 py-0.5 rounded">
              100-Point Analytic
            </span>
          </div>
          <span className="opacity-30">•</span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">library_books</span>
            <span className="text-on-surface">Target Course:</span>
            <span className="font-semibold text-on-surface">AP English Literature &amp; Comp</span>
          </div>
          <span className="opacity-30">•</span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-outline">calendar_today</span>
            <span>Active Term: Fall 2024</span>
          </div>
        </div>

        {/* Dynamic Weight Pill */}
        <div className={`inline-flex items-center gap-1.5 px-space-sm py-1 rounded font-label-md text-label-md shadow-sm ${
          isWeightValid 
            ? 'bg-tertiary-fixed text-on-tertiary-fixed' 
            : 'bg-error-container text-on-error-container'
        }`}>
          <span className="material-symbols-outlined text-[16px]">
            {isWeightValid ? 'check_circle' : 'warning'}
          </span>
          <span className="tracking-wide">
            Weights: {totalWeight}% {isWeightValid ? '✓' : '(Must Equal 100%)'}
          </span>
        </div>
      </div>

      {/* Criteria Workspace */}
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between px-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="font-label-lg text-label-lg text-on-surface font-semibold">Evaluation Strata</span>
            <span className="font-code-inline text-code-inline text-on-surface-variant bg-surface-container px-space-xs rounded">
              {criteria.length} Criteria
            </span>
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">drag_indicator</span>
            <span>Grab handles to reorder sections</span>
          </div>
        </div>

        {/* List of Criteria Cards */}
        {criteria.map((crit, idx) => (
          <article
            key={crit.id}
            className="bg-surface-container-lowest shadow-sm rounded-xl p-space-md transition-shadow hover:shadow-md flex flex-col gap-space-md relative border border-surface-container"
          >
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex items-start gap-space-sm flex-1">
                <button
                  className="mt-1 text-outline hover:text-on-surface cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-surface-container"
                  title="Drag to reorder"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
                </button>
                <div className="flex flex-col gap-space-xs flex-1">
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <span className="font-code-inline text-code-inline text-primary bg-primary-fixed px-1.5 py-0.5 rounded font-bold">
                      {crit.id}
                    </span>
                    <input
                      className="font-headline-sm text-headline-sm text-on-surface bg-transparent focus:bg-surface-container px-1 py-0.5 rounded focus:outline-none flex-1 min-w-[240px] font-semibold"
                      type="text"
                      value={crit.name}
                      onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                    />
                  </div>
                  <textarea
                    className="font-body-sm text-body-sm text-on-surface-variant bg-transparent hover:bg-surface-container-low focus:bg-surface-container px-1.5 py-1 rounded focus:outline-none resize-none w-full"
                    rows={2}
                    value={crit.description}
                    onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                  />
                </div>
              </div>

              {/* Weight & Scale Control */}
              <div className="flex items-center gap-space-md shrink-0 bg-surface-container-low p-space-xs rounded-lg border border-surface-container">
                <div className="flex flex-col items-end">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Weight Allocation</span>
                  <div className="flex items-center gap-1">
                    <input
                      className="w-14 text-right font-code-inline text-code-inline font-bold text-on-surface bg-surface-container-lowest px-1 py-0.5 rounded focus:outline-none focus:bg-surface-container border border-surface-container"
                      max="100"
                      min="0"
                      type="number"
                      value={crit.weight}
                      onChange={(e) => handleWeightChange(idx, e.target.value)}
                    />
                    <span className="font-label-md text-label-md text-on-surface">%</span>
                  </div>
                </div>
                <div className="h-7 w-px bg-surface-container-highest"></div>
                <div className="flex flex-col items-start pr-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Max Scale</span>
                  <span className="font-code-inline text-code-inline text-secondary font-semibold">
                    0 – {crit.weight} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Collapsible Tier Anchors */}
            <details className="group bg-surface-container-low rounded-lg p-space-sm border border-surface-container" open>
              <summary className="flex items-center justify-between cursor-pointer list-none select-none text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm font-semibold">
                <span className="inline-flex items-center gap-1 font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-primary transition-transform group-open:rotate-90">
                    arrow_right
                  </span>
                  Anchor Benchmarks (3 Score Bands for LLM Calibration)
                </span>
                <span className="text-outline font-normal">Toggle descriptors</span>
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm pt-space-sm">
                {/* High Anchor */}
                <div className="bg-surface-container-lowest p-space-sm rounded flex flex-col gap-1 relative overflow-hidden border border-surface-container">
                  <div className="w-full h-1 bg-tertiary-container absolute top-0 left-0"></div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-label-sm text-label-sm font-bold text-on-tertiary-container">High Anchor</span>
                    <span className="font-code-inline text-code-inline text-tertiary font-bold">{crit.highRange}</span>
                  </div>
                  <textarea
                    rows={3}
                    value={crit.highAnchor}
                    onChange={(e) => handleFieldChange(idx, 'highAnchor', e.target.value)}
                    className="font-annotation-note text-annotation-note text-on-surface-variant bg-transparent resize-none focus:outline-none"
                  />
                </div>

                {/* Mid Anchor */}
                <div className="bg-surface-container-lowest p-space-sm rounded flex flex-col gap-1 relative overflow-hidden border border-surface-container">
                  <div className="w-full h-1 bg-secondary-container absolute top-0 left-0"></div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-label-sm text-label-sm font-bold text-on-secondary-container">Mid Anchor</span>
                    <span className="font-code-inline text-code-inline text-secondary font-bold">{crit.midRange}</span>
                  </div>
                  <textarea
                    rows={3}
                    value={crit.midAnchor}
                    onChange={(e) => handleFieldChange(idx, 'midAnchor', e.target.value)}
                    className="font-annotation-note text-annotation-note text-on-surface-variant bg-transparent resize-none focus:outline-none"
                  />
                </div>

                {/* Low Anchor */}
                <div className="bg-surface-container-lowest p-space-sm rounded flex flex-col gap-1 relative overflow-hidden border border-surface-container">
                  <div className="w-full h-1 bg-error-container absolute top-0 left-0"></div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-label-sm text-label-sm font-bold text-on-error-container">Low Anchor</span>
                    <span className="font-code-inline text-code-inline text-error font-bold">{crit.lowRange}</span>
                  </div>
                  <textarea
                    rows={3}
                    value={crit.lowAnchor}
                    onChange={(e) => handleFieldChange(idx, 'lowAnchor', e.target.value)}
                    className="font-annotation-note text-annotation-note text-on-surface-variant bg-transparent resize-none focus:outline-none"
                  />
                </div>
              </div>
            </details>
          </article>
        ))}

        {/* Add New Criterion Button */}
        <button
          onClick={handleAddCriterion}
          className="w-full py-space-md border-2 border-dashed border-surface-container-highest hover:border-primary rounded-xl flex items-center justify-center gap-space-sm text-on-surface-variant hover:text-primary transition-all font-label-md text-label-md bg-surface-container-low/50"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">draw</span>
          <span>+ Add New Evaluation Criterion</span>
        </button>
      </div>
    </div>
  );
}
