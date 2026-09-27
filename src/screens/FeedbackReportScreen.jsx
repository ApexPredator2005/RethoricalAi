import React, { useState } from 'react';

const SAMPLE_SOURCE_ALIGNMENTS = [
  {
    essay_claim: "Gatsby revalues every object in his estate solely through Daisy's gaze.",
    source_excerpt: "He hadn't once ceased looking at Daisy, and I think he revalued everything in his house according to the measure of response it drew from her well-loved eyes.",
    verdict: "supported"
  },
  {
    essay_claim: "The green light motif operates as an unattainable spectral beacon.",
    source_excerpt: "You always have a green light that burns all night at the end of your dock.",
    verdict: "supported"
  },
  {
    essay_claim: "Gatsby directly tells Nick that Daisy never loved Tom Buchanan.",
    source_excerpt: null,
    verdict: "unverified_against_source"
  }
];

export default function FeedbackReportScreen({ onOpenQuiz }) {
  const [activeNote, setActiveNote] = useState(null);
  const [pushedToLms, setPushedToLms] = useState(false);

  const handlePushGrade = () => {
    setPushedToLms(true);
    setTimeout(() => setPushedToLms(false), 3500);
  };

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* Top Banner / Assessment Identity Header */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg pb-space-sm border-b border-surface-container">
        <div className="space-y-space-xs max-w-2xl">
          <div className="flex items-center gap-space-sm">
            <span className="font-code-inline text-code-inline text-secondary font-medium tracking-wide uppercase">
              Graded Submission • Period 3 AP Lit
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Archived 20m ago</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Assignment Feedback: Julian Vance — The Great Gatsby Analysis
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Evaluated against AP Literature Analytical Synthesis Rubric (100-Point Analytic Scale). Assessed on September 24, 2026.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-lg shrink-0">
          {/* Grade Circle Badge */}
          <div className="relative flex items-center justify-center p-space-sm">
            <svg className="w-28 h-28 transform -rotate-12" viewBox="0 0 120 120">
              <circle
                className="text-primary-container opacity-85"
                cx="60"
                cy="60"
                fill="none"
                r="52"
                stroke="currentColor"
                strokeDasharray="14 4 10 3 12 5"
                strokeWidth="2.5"
              />
              <circle
                className="text-primary opacity-60"
                cx="60"
                cy="60"
                fill="none"
                r="48"
                stroke="currentColor"
                strokeDasharray="6 3 24 4"
                strokeWidth="1.5"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold leading-none">
                91
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                / 100 (A-)
              </span>
              <span className="font-annotation-note text-annotation-note text-primary font-medium tracking-tight mt-0.5">
                Top 20% of Class
              </span>
            </div>
          </div>

          {/* Actions Station */}
          <div className="flex flex-col gap-space-xs w-full sm:w-auto">
            <button
              onClick={handlePushGrade}
              className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:brightness-105 active:translate-y-0.5 transition-all font-semibold"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              {pushedToLms ? 'Grade Pushed Successfully! ✓' : 'Push Grade to Classroom'}
            </button>

            <div className="flex items-center gap-space-xs">
              <button
                onClick={onOpenQuiz}
                className="flex-1 inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded bg-tertiary-fixed text-on-tertiary-container hover:bg-tertiary-fixed-dim transition-colors font-label-md text-label-md font-semibold border border-tertiary/20"
                type="button"
                title="Launch practice questions based on Julian's flagged writing patterns"
              >
                <span className="material-symbols-outlined text-[17px]">quiz</span>
                Practice Writing Skills
              </button>
              <button
                onClick={() => alert('Annotated Submission PDF generated!')}
                className="p-space-xs rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors border border-surface-container"
                title="Export Annotated PDF"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              </button>
              <button
                onClick={() => window.print()}
                className="p-space-xs rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors border border-surface-container"
                title="Print Submission"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Rubric Diagnostic Bands */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Criterion 1 */}
        <div className="flex flex-col justify-between p-space-md rounded-lg bg-surface-container-lowest shadow-[0_2px_8px_rgba(31,27,21,0.03)] gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Thesis &amp; Argument</span>
            <span className="font-code-inline text-code-inline text-tertiary font-bold">24 / 25</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full bg-tertiary-container rounded-full" style={{ width: '96%' }}></div>
          </div>
          <p className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Exemplary line of reasoning
          </p>
        </div>

        {/* Criterion 2 */}
        <div className="flex flex-col justify-between p-space-md rounded-lg bg-surface-container-lowest shadow-[0_2px_8px_rgba(31,27,21,0.03)] gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Textual Evidence &amp; Synthesis</span>
            <span className="font-code-inline text-code-inline text-secondary font-bold">32 / 35</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full bg-secondary-container rounded-full" style={{ width: '91%' }}></div>
          </div>
          <p className="font-label-sm text-label-sm text-secondary flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">auto_stories</span>
            Strong integration of quotes
          </p>
        </div>

        {/* Criterion 3 */}
        <div className="flex flex-col justify-between p-space-md rounded-lg bg-surface-container-lowest shadow-[0_2px_8px_rgba(31,27,21,0.03)] gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Organization &amp; Flow</span>
            <span className="font-code-inline text-code-inline text-secondary font-bold">17 / 20</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full bg-secondary-container rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 truncate" title="Solid topic sentences; paragraph 3 needs smoother pivot">
            <span className="material-symbols-outlined text-[14px]">swap_calls</span>
            Paragraph 3 needs pivot tuning
          </p>
        </div>

        {/* Criterion 4 */}
        <div className="flex flex-col justify-between p-space-md rounded-lg bg-surface-container-lowest shadow-[0_2px_8px_rgba(31,27,21,0.03)] gap-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Voice, Style &amp; Mechanics</span>
            <span className="font-code-inline text-code-inline text-tertiary font-bold">18 / 20</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full bg-tertiary-container rounded-full" style={{ width: '90%' }}></div>
          </div>
          <p className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            High academic register
          </p>
        </div>
      </section>

      {/* Key Diagnostic Cards: Strengths vs Opportunities */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        {/* Strengths Card */}
        <div className="flex flex-col gap-space-sm p-space-lg rounded-xl bg-surface-container-low shadow-[0_2px_12px_rgba(31,27,21,0.04)] relative border border-surface-container">
          <div className="flex items-center gap-space-xs text-secondary">
            <span className="material-symbols-outlined text-[20px]">thumb_up</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Demonstrated Strengths</h2>
          </div>
          <div className="flex flex-col gap-space-xs pt-space-xs">
            <div className="p-space-sm rounded bg-surface-container-lowest flex items-start gap-space-sm border border-surface-container">
              <span className="w-2 h-2 rounded-full bg-secondary-container mt-2 shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Clear Analysis &amp; Point of View</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Julian formulates an articulate stance detailing how Gatsby treats social respectability as an engineered stage performance rather than simple social climbing.
                </p>
              </div>
            </div>
            <div className="p-space-sm rounded bg-surface-container-lowest flex items-start gap-space-sm border border-surface-container">
              <span className="w-2 h-2 rounded-full bg-secondary-container mt-2 shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Effective Use of Symbols</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Skillful textual analysis connecting the dock's green light to the siren-like quality of Daisy Buchanan's voice ("full of money").
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Areas to Improve Card */}
        <div className="flex flex-col gap-space-sm p-space-lg rounded-xl bg-surface-container-low shadow-[0_2px_12px_rgba(31,27,21,0.04)] relative border border-surface-container">
          <div className="flex items-center gap-space-xs text-primary">
            <span className="material-symbols-outlined text-[20px]">edit_attributes</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Target Areas for Revision</h2>
          </div>
          <div className="flex flex-col gap-space-xs pt-space-xs">
            <div className="p-space-sm rounded bg-surface-container-lowest flex items-start gap-space-sm border border-surface-container">
              <span className="w-2 h-2 rounded-full bg-primary-container mt-2 shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Unclear Pronoun References</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Clarify ambiguous pronoun references in paragraph 2 ("In doing this, it demonstrates..."). Replace empty fillers with the direct symbolic agent.
                </p>
              </div>
            </div>
            <div className="p-space-sm rounded bg-surface-container-lowest flex items-start gap-space-sm border border-surface-container">
              <span className="w-2 h-2 rounded-full bg-primary-container mt-2 shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Connective Rhetoric in Section Transitions</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Smooth the abrupt pivot between paragraph 2's socio-economic geography and paragraph 3's psychological time distortion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Source Alignment & Textual Verification Section */}
      <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container space-y-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs border-b border-surface-container">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[22px] text-secondary">fact_check</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Source Alignment &amp; Textual Verification
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-container font-label-sm text-xs font-bold uppercase">
            Mode A: Direct Ingest Active
          </span>
        </div>

        {/* Source Alignment Note (Honest Uncertainty Framing) */}
        <div className="p-space-sm rounded-lg bg-surface-container-low border border-surface-container flex items-start gap-2 text-on-surface-variant font-annotation-note text-annotation-note">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">info</span>
          <span>
            Source alignment checks are based on <strong>full document</strong> and should be spot-checked by the teacher, especially any 'contradicted' verdicts before treating them as fact.
          </span>
        </div>

        {/* Alignment Claims List */}
        <div className="space-y-space-xs">
          {SAMPLE_SOURCE_ALIGNMENTS.map((item, idx) => {
            const isSupported = item.verdict === 'supported';
            const isContradicted = item.verdict === 'contradicted';

            return (
              <div
                key={idx}
                className="p-space-md rounded-xl bg-surface-container-low border border-surface-container space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase tracking-wider">
                    Student Claim #{idx + 1}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded font-label-sm text-xs font-bold uppercase ${
                      isSupported
                        ? 'bg-tertiary-fixed text-on-tertiary-container'
                        : isContradicted
                        ? 'bg-primary-fixed text-primary'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    {isSupported ? '✓ Supported by Source' : isContradicted ? '✗ Contradicted' : '? Unverified Against Source'}
                  </span>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface font-semibold">
                  “{item.essay_claim}”
                </p>

                {item.source_excerpt ? (
                  <div className="border-l-2 border-tertiary pl-3 py-1 bg-surface-container-lowest rounded-r">
                    <span className="font-label-sm text-[11px] font-bold text-tertiary block">
                      Exact Verbatim Source Excerpt:
                    </span>
                    <span className="font-annotation-note text-annotation-note text-on-surface-variant italic">
                      “{item.source_excerpt}”
                    </span>
                  </div>
                ) : (
                  <div className="border-l-2 border-outline-variant pl-3 py-1 bg-surface-container-lowest rounded-r">
                    <span className="font-annotation-note text-annotation-note text-on-surface-variant italic">
                      No matching direct quotation found in provided source text. Retained for teacher spot-check.
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Signature Visual: Annotated Manuscript on Ruled Notebook Canvas */}
      <section className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">history_edu</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Annotated Submission (Draft 2)</h2>
          </div>
          <div className="hidden sm:flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">3 teacher notes attached</span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Word count: 1,420</span>
          </div>
        </div>

        {/* Ruled Paper Desk Container */}
        <div className="relative bg-[#FAEDCA] p-4 md:p-8 lg:p-12 rounded-2xl shadow-[0_8px_30px_rgba(31,27,21,0.08)] overflow-hidden border border-[#D9C49B]">
          {/* Background Ruled Desk Visual Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, #5b4139 0px, #5b4139 1px, transparent 1px, transparent 32px)' }}
          ></div>

          {/* Document Sheet (heavy cotton white paper with left margin guide) */}
          <div className="relative max-w-5xl mx-auto bg-surface-container-lowest rounded-sm shadow-[0_4px_24px_rgba(43,38,32,0.12)] p-6 md:p-12 lg:p-16 border border-[#EBE1D7]">
            {/* Red left margin guide line */}
            <div className="hidden md:block absolute left-20 top-0 bottom-0 w-[1.5px] bg-red-300 opacity-60 pointer-events-none"></div>

            {/* Essay Content & Margin Annotations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
              {/* Essay Body Column */}
              <div className="lg:col-span-8 flex flex-col gap-space-lg text-on-surface md:pl-8">
                <header className="flex flex-col pb-space-sm border-b border-surface-container">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Julian Vance • AP English Literature</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Teacher: Ms. Claire Holloway</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-space-sm font-bold">
                    The Gilded Mirage: Fabricated Identity and Commodification in Fitzgerald's West Egg
                  </h3>
                </header>

                <p className="font-body-lg text-body-lg text-on-surface leading-loose">
                  Throughout F. Scott Fitzgerald's 1925 masterpiece, the American Dream undergoes relentless deconstruction. Rather than portraying Gatsby as an authentic visionary, the novel posits that his fortune and personal history are commodified artifacts constructed to mimic hereditary privilege.
                </p>

                {/* Paragraph 2 with Sage Praise Highlight */}
                <p className="font-body-lg text-body-lg text-on-surface leading-loose">
                  The geography of Long Island serves as an external projection of class antagonism. While East Egg glistens with careless aristocratic indifference, West Egg acts as a loud carnival of imitation.{' '}
                  <mark
                    onClick={() => setActiveNote('note-1')}
                    className={`px-1 py-0.5 rounded cursor-pointer transition-colors relative inline ${
                      activeNote === 'note-1'
                        ? 'bg-tertiary text-on-tertiary font-medium shadow-sm'
                        : 'bg-tertiary-fixed text-on-surface hover:bg-tertiary-fixed-dim'
                    }`}
                  >
                    Fitzgerald establishes the green light not merely as an aspirational beacon, but as an indictment of Gatsby's tragic reduction of love to material conquest.
                  </mark>{' '}
                  Daisy is never simply a long-lost romance; she represents the physical embodiment of the unattainable past that Gatsby insists on purchasing through bootlegger profits.
                </p>

                {/* Paragraph 3 with Burnt Orange Syntax Revision Highlight */}
                <p className="font-body-lg text-body-lg text-on-surface leading-loose">
                  <mark
                    onClick={() => setActiveNote('note-2')}
                    className={`px-1 py-0.5 rounded cursor-pointer transition-colors relative inline ${
                      activeNote === 'note-2'
                        ? 'bg-primary text-on-primary font-medium shadow-sm'
                        : 'bg-primary-fixed text-on-surface hover:bg-primary-fixed-dim'
                    }`}
                  >
                    In doing this, it demonstrates how Gatsby was trapped in his own constructed mythology.
                  </mark>{' '}
                  His lavish weekend galas do not invite human connection; they are elaborate bait traps designed to catch Daisy's distant gaze across the bay.
                </p>

                {/* Paragraph 4 with Amber Diction Highlight */}
                <p className="font-body-lg text-body-lg text-on-surface leading-loose">
                  Crucially, the socio-economic topography between the two wealthy peninsulas reinforces this moral emptiness.{' '}
                  <mark
                    onClick={() => setActiveNote('note-3')}
                    className={`px-1 py-0.5 rounded cursor-pointer transition-colors relative inline ${
                      activeNote === 'note-3'
                        ? 'bg-secondary text-on-secondary font-medium shadow-sm'
                        : 'bg-secondary-fixed text-on-surface hover:bg-secondary-fixed-dim'
                    }`}
                  >
                    Between the dazzling bays, the valley of ashes functions as a moral wasteland,
                  </mark>{' '}
                  where George Wilson and the hollow eyes of Doctor T.J. Eckleburg bear silent witness to the industrial human detritus discarded by Tom Buchanan's social class.
                </p>

                <p className="font-body-lg text-body-lg text-on-surface-variant italic leading-loose pt-2">
                  [Section continues: Examination of Chapter 7 Plaza Hotel confrontation and the climactic pool scene...]
                </p>
              </div>

              {/* Sticky Annotations Margin Column */}
              <div className="lg:col-span-4 flex flex-col gap-space-lg lg:pt-16">
                {/* Margin Note 1: Sage Praise */}
                <div
                  onClick={() => setActiveNote('note-1')}
                  className={`relative p-space-md rounded bg-[#FFFDF5] shadow-[0_4px_16px_rgba(43,38,32,0.08)] transition-all cursor-pointer border ${
                    activeNote === 'note-1'
                      ? 'border-tertiary ring-2 ring-tertiary/20 -translate-y-1'
                      : 'border-[#E8DFC8] hover:-translate-y-0.5'
                  }`}
                >
                  <div className="absolute -left-2 top-4 w-1.5 h-10 rounded-full bg-tertiary-container"></div>
                  <div className="flex items-center justify-between pb-space-xs">
                    <span className="font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">draw</span>
                      Ms. Holloway
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Line 14</span>
                  </div>
                  <p className="font-annotation-note text-annotation-note text-on-surface leading-snug">
                    Insightful phrasing here! You effectively elevate this beyond standard plot summary into authentic conceptual critique.
                  </p>
                  <div className="mt-space-xs flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] uppercase font-semibold">
                      Thematic Synthesis
                    </span>
                  </div>
                </div>

                {/* Margin Note 2: Burnt Orange Syntax revision */}
                <div
                  onClick={() => setActiveNote('note-2')}
                  className={`relative p-space-md rounded bg-[#FFFDF5] shadow-[0_4px_16px_rgba(43,38,32,0.08)] transition-all cursor-pointer border ${
                    activeNote === 'note-2'
                      ? 'border-primary ring-2 ring-primary/20 -translate-y-1'
                      : 'border-[#E8DFC8] hover:-translate-y-0.5'
                  }`}
                >
                  <div className="absolute -left-2 top-4 w-1.5 h-10 rounded-full bg-primary-container"></div>
                  <div className="flex items-center justify-between pb-space-xs">
                    <span className="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                      Ms. Holloway
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Line 28</span>
                  </div>
                  <p className="font-annotation-note text-annotation-note text-on-surface leading-snug">
                    Passive pronoun structure here weakens your authorial momentum. Try revising: <em>“By enacting this ritual, Gatsby traps himself...”</em>
                  </p>
                  <div className="mt-space-xs flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-[10px] uppercase font-semibold">
                      Syntax &amp; Precision
                    </span>
                  </div>
                </div>

                {/* Margin Note 3: Amber Diction Note */}
                <div
                  onClick={() => setActiveNote('note-3')}
                  className={`relative p-space-md rounded bg-[#FFFDF5] shadow-[0_4px_16px_rgba(43,38,32,0.08)] transition-all cursor-pointer border ${
                    activeNote === 'note-3'
                      ? 'border-secondary ring-2 ring-secondary/20 -translate-y-1'
                      : 'border-[#E8DFC8] hover:-translate-y-0.5'
                  }`}
                >
                  <div className="absolute -left-2 top-4 w-1.5 h-10 rounded-full bg-secondary-container"></div>
                  <div className="flex items-center justify-between pb-space-xs">
                    <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">auto_stories</span>
                      Ms. Holloway
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Line 41</span>
                  </div>
                  <p className="font-annotation-note text-annotation-note text-on-surface leading-snug">
                    Brilliant connection with Eckleburg's gaze. Consider developing this as a recurring motif of industrial secular judgment in Chapter 8.
                  </p>
                  <div className="mt-space-xs flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-[10px] uppercase font-semibold">
                      Motif Analysis
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
