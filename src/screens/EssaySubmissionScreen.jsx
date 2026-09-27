import React, { useState } from 'react';

const SAMPLE_ESSAY = `F. Scott Fitzgerald constructs Jay Gatsby not merely as an embodiment of romantic disillusionment, but as an architect of self-erasure. In Chapter 5, the reunion at Nick Carraway’s cottage exposes the fragile infrastructure of Gatsby’s persona: his mansion, his imported silk shirts, and his punctilious demeanor are not manifestations of genuine aristocratic confidence, but rather desperate armaments assembled to contest the immutable finality of time. When Fitzgerald writes that Gatsby "revalued everything in his house according to the measure of response it drew from her well-loved eyes," he explicitly subordinates material splendor to an unattainable spectral ideal.

Furthermore, the persistent chromatic motif of green—epitomized by the dock light across the bay—functions as both an compass for yearning and an indictment of the commodified American dream. Gatsby mistranslates moral elevation into geographic and economic accumulation; he presumes that by sheer momentum of will and bootleg lucre, the social chasm dividing West Egg's nouveau riche vulgarity from East Egg’s dynastic complacency can be erased. Yet Daisy's voice, famously described as "full of money," remains an auditory reminder that the aristocracy will never absorb him. Her tonal inflection possesses an ingrained security that capital alone cannot purchase.

Ultimately, Fitzgerald reveals that Gatsby's tragic hubris is rooted in the refusal to accept chronological linearity. To Nick’s cautious caution, "You can’t repeat the past," Gatsby’s defiant response—"Why of course you can!"—serves as the tragic apex of his delusion. By treating human biography as malleable script, Gatsby dooms himself to be crushed between the indifferent inertia of Tom Buchanan’s old-money ruthlessness and the phantom radiance of his own untamed imagination.`;

const DEFAULT_REFERENCE_TEXT = `He hadn't once ceased looking at Daisy, and I think he revalued everything in his house according to the measure of response it drew from her well-loved eyes. Sometimes, too, he stared around at his possessions in a dazed way, as though in her actual and astounding presence none of it was any longer real. Once he nearly toppled down a flight of stairs.

His bedroom was the simplest room of all—except where the dresser was garnished with a toilet set of pure dull gold. Daisy took the brush with delight, and smoothed her hair, whereupon Gatsby sat down and shaded his eyes and began to laugh.

"If it wasn't for the mist we could see your home across the bay," said Gatsby. "You always have a green light that burns all night at the end of your dock."

Daisy put her arm through his abruptly, but he seemed absorbed in what he had just said. Possibly it had occurred to him that the colossal significance of that light had now vanished forever. Compared to the great distance that had separated him from Daisy it had seemed very near to her, almost touching her. It had seemed as close as a star to the moon. Now it was again a green light on a dock. His count of enchanted objects had diminished by one.`;

export default function EssaySubmissionScreen({ onSubmitted }) {
  const [inputMode, setInputMode] = useState('type'); // 'type' | 'upload'
  const [essayText, setEssayText] = useState(SAMPLE_ESSAY);
  const [fileName, setFileName] = useState('Gatsby_Draft_page1.jpg');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [selectedRubric, setSelectedRubric] = useState('AP Lit Analytical Synthesis (Default)');

  // Reference Document State
  const [refText, setRefText] = useState(DEFAULT_REFERENCE_TEXT);
  const [refFileName, setRefFileName] = useState('The_Great_Gatsby_Chapter_5_Excerpts.pdf');

  const words = essayText.trim().split(/\s+/).filter(Boolean).length;
  const chars = essayText.length;
  const paragraphs = essayText.split(/\n+/).filter(Boolean).length;
  const readTime = (words / 220).toFixed(1);

  const refWords = refText.trim().split(/\s+/).filter(Boolean).length;
  const refMode = refWords <= 3000 ? 'direct' : 'chunked';

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      if (onSubmitted) onSubmitted();
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setInputMode('type');
    }
  };

  const handleRefUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setRefFileName(file.name);
    }
  };

  return (
    <div className="w-full px-gutter lg:px-margin-desktop py-space-xl space-y-space-xl animate-fade-in">
      {/* Header & Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-space-lg">
        <div className="space-y-space-xs max-w-2xl">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span>Student Submission</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Submit Assignment: The Great Gatsby Analysis
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Submit your completed assignment text or scan for AI-assisted evaluation and source verification.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm shrink-0">
          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Word Limit</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
              {words} <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">/ 1,500</span>
            </span>
          </div>
          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Target Level</span>
            <span className="font-headline-sm text-headline-sm text-tertiary font-bold">Grade A Target</span>
          </div>
          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Draft Version</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
              v1.3 <span className="font-label-sm text-label-sm text-secondary font-normal">(Revised)</span>
            </span>
          </div>
          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Read Time</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
              ~{readTime} <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">min</span>
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Input Mode Tabs */}
      <div className="flex items-center justify-between bg-surface-container p-1 rounded-xl shadow-inner border border-surface-container-high">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => setInputMode('type')}
            type="button"
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-space-md py-2.5 rounded-lg font-label-md text-label-md transition-all duration-200 ${
              inputMode === 'type'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-primary">edit_note</span>
            <span>Paste or Type Text</span>
          </button>
          <button
            onClick={() => setInputMode('upload')}
            type="button"
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-space-md py-2.5 rounded-lg font-label-md text-label-md transition-all duration-200 ${
              inputMode === 'upload'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">photo_camera</span>
            <span>Upload Document, Scan or Photo</span>
          </button>
        </div>
        <div className="hidden md:flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm pr-space-sm">
          <span className="material-symbols-outlined text-[16px] text-tertiary">verified</span>
          <span>Stationery Mode Active</span>
        </div>
      </div>

      {/* Upload Zone (Visible if upload mode chosen) */}
      {inputMode === 'upload' && (
        <div className="p-space-xl border-2 border-dashed border-primary/40 rounded-xl bg-surface-container-lowest flex flex-col items-center justify-center gap-space-sm text-center animate-fade-in shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-primary">cloud_upload</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Upload Assignment, PDF, or Photo Scan</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
            Our multi-modal vision OCR automatically digitizes handwritten pages, typed assignments, and documents into clear text.
          </p>
          <label className="mt-space-sm px-space-md py-space-xs rounded bg-primary-container text-on-primary font-label-md text-label-md cursor-pointer hover:bg-primary shadow-sm">
            Choose File from Device
            <input type="file" className="hidden" accept="image/*,.pdf,.docx,.txt" onChange={handleFileUpload} />
          </label>
        </div>
      )}

      {/* OCR Scan Notification & Sync Banner */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-surface-container">
        <div className="flex items-center gap-space-md min-w-0">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-[28px]">document_scanner</span>
            <div className="absolute bottom-0 inset-x-0 bg-tertiary/90 text-on-tertiary text-center text-[9px] font-label-sm uppercase py-0.5 font-bold">
              Scanned
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                {fileName}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-label-sm font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                98.4% OCR Confidence
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              Handwriting converted into editable transcription below. Stylistic line breaks and paragraph indentations preserved.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-sm shrink-0">
          <label className="px-space-sm py-1.5 rounded-lg bg-surface-container font-label-sm text-label-sm text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer">
            Replace File
            <input type="file" className="hidden" accept="image/*,.pdf,.txt" onChange={handleFileUpload} />
          </label>
          <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary font-semibold">
            <span className="material-symbols-outlined text-[16px]">check_circle</span> Transcribed
          </span>
        </div>
      </div>

      {/* Ruled Notebook Editor Sheet */}
      <div className="relative bg-[#FFFDF5] rounded-xl shadow-md overflow-hidden flex flex-col border border-[#E8DFC8]">
        {/* Sheet Header Bar / Controls */}
        <div className="bg-[#FBF3DC] px-space-lg py-space-sm flex items-center justify-between border-b border-[#E8DFC8]">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-error/70 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-secondary-container inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-tertiary-container inline-block"></span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase font-semibold">
              Assignment Sheet • AP Literature &amp; Comp
            </span>
          </div>
          <div className="flex items-center gap-space-sm">
            <button className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest" title="Spellcheck & Grammar rules" type="button">
              <span className="material-symbols-outlined text-[18px]">spellcheck</span>
            </button>
            <div className="h-4 w-px bg-surface-container-highest"></div>
            <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Live Count
            </span>
          </div>
        </div>

        {/* Ruled Paper Body */}
        <div 
          className="relative w-full p-space-lg sm:pl-20 sm:pr-space-xl overflow-hidden min-h-[460px]"
          style={{
            background: 'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(228, 217, 192, 0.45) 27px, rgba(228, 217, 192, 0.45) 28px)',
            backgroundColor: '#FFFDF5'
          }}
        >
          {/* Red vertical margin guide line */}
          <div className="hidden sm:block absolute left-14 top-0 bottom-0 w-[1.5px] bg-[#FE5D26]/30 pointer-events-none"></div>

          {/* Lined Paper Text Area */}
          <textarea
            className="w-full bg-transparent resize-y outline-none font-body-md text-body-md text-on-surface leading-[28px] focus:outline-none min-h-[420px] pt-1"
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            placeholder="Enter or paste your assignment text here..."
            spellCheck="false"
          />
        </div>

        {/* Bottom Status Bar inside Editor */}
        <div className="bg-surface-container-low px-space-lg py-2.5 flex flex-wrap items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-[#E8DFC8]">
          <div className="flex items-center gap-space-md">
            <span className="font-semibold text-on-surface">{words} words</span>
            <span>•</span>
            <span>{chars} characters</span>
            <span>•</span>
            <span>{paragraphs} paragraphs</span>
          </div>
          <div className="flex items-center gap-space-sm font-label-sm">
            <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
            <span>Writing Rhythm: Balanced</span>
            <span className="mx-1">•</span>
            <span>Est. Reading: {readTime} min</span>
          </div>
        </div>
      </div>

      {/* Reference Material / Source Document (Optional Grounding) */}
      <details className="group bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container" open>
        <summary className="flex items-center justify-between cursor-pointer list-none select-none text-on-surface font-label-md text-label-md font-bold">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary transition-transform group-open:rotate-90">
              arrow_right
            </span>
            <span className="material-symbols-outlined text-[20px] text-secondary">
              library_books
            </span>
            <span>Reference Material / Source Document (Optional Source Grounding)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded font-label-sm text-xs font-bold uppercase ${
              refMode === 'direct' 
                ? 'bg-tertiary-fixed text-on-tertiary-container' 
                : 'bg-secondary-fixed text-on-secondary-fixed'
            }`}>
              {refMode === 'direct' ? 'Mode A: Direct Check' : 'Mode B: Search Chunk Retrieval'}
            </span>
            <span className="font-annotation-note text-on-surface-variant">
              ({refWords} words)
            </span>
          </div>
        </summary>

        <div className="pt-space-md space-y-space-md">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Upload the primary text, prompt passage, or chapter. The engine will automatically check and verify student claims directly against the source material.
          </p>

          <div className="flex items-center gap-space-sm">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors cursor-pointer border border-surface-container">
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Upload PDF/DOCX/TXT</span>
              <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleRefUpload} />
            </label>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Loaded: <strong>{refFileName}</strong>
            </span>
          </div>

          <textarea
            rows={4}
            value={refText}
            onChange={(e) => setRefText(e.target.value)}
            className="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container font-body-sm text-body-sm text-on-surface focus:outline-none resize-y"
            placeholder="Paste source passage or reference excerpt here..."
          />
        </div>
      </details>

      {/* Rubric Selection & Submit Section */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-surface-container">
        <div className="space-y-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Evaluation Framework
          </span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Grading Criteria &amp; Scale</h2>
          <div className="pt-1">
            <select
              value={selectedRubric}
              onChange={(e) => setSelectedRubric(e.target.value)}
              className="bg-surface-container py-2 pl-3 pr-8 rounded-lg font-label-md text-label-md text-on-surface focus:outline-none focus:bg-surface-container-high cursor-pointer border border-surface-container"
            >
              <option>AP Lit Analytical Synthesis (Default)</option>
              <option>AP Lang Rhetorical Analysis (6-Point Scale)</option>
              <option>Comparative Literature &amp; Motif Study</option>
              <option>Standard High School Assignment Rubric</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isEvaluating}
          className="px-space-xl py-space-md rounded-xl bg-primary-container text-on-primary hover:bg-primary transition-all font-label-lg text-label-lg font-semibold shadow-md active:translate-y-0.5 flex items-center justify-center gap-2 self-stretch md:self-center"
          type="button"
        >
          {isEvaluating ? (
            <>
              <span className="material-symbols-outlined text-[22px] animate-spin">progress_activity</span>
              <span>Evaluating Assignment...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]">ink_pen</span>
              <span>Submit for AI Evaluation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
