import React from 'react';
import { sounds } from '../utils/soundEffects';

export default function AccessibilityToolbar({
  isDyslexic,
  onToggleDyslexic,
  isHighContrast,
  onToggleHighContrast,
  fontSize,
  onChangeFontSize,
  isSoundEnabled,
  onToggleSound
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-surface-container-low rounded-xl border border-surface-container shadow-xs text-xs font-label-sm">
      {/* Dyslexia-Friendly Font Mode */}
      <button
        type="button"
        onClick={() => {
          onToggleDyslexic();
          sounds.playPenScratch();
        }}
        className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all ${
          isDyslexic
            ? 'bg-primary text-white shadow-xs'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
        }`}
        title="Dyslexia-friendly typography with enhanced letter spacing and readable font"
      >
        <span className="material-symbols-outlined text-[16px]">menu_book</span>
        <span>Dyslexia Font</span>
      </button>

      {/* High-Contrast Mode */}
      <button
        type="button"
        onClick={() => {
          onToggleHighContrast();
          sounds.playPenScratch();
        }}
        className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all ${
          isHighContrast
            ? 'bg-black text-white shadow-xs'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
        }`}
        title="High contrast black-and-white mode with reinforced borders and bold focus"
      >
        <span className="material-symbols-outlined text-[16px]">contrast</span>
        <span>High Contrast</span>
      </button>

      <div className="h-4 w-px bg-surface-container-highest mx-0.5"></div>

      {/* Font Size Adjuster */}
      <div className="flex items-center gap-0.5 bg-surface-container p-0.5 rounded-lg">
        <button
          type="button"
          onClick={() => {
            onChangeFontSize('normal');
            sounds.playPaperRustle();
          }}
          className={`px-2 py-1 rounded text-xs font-semibold ${
            fontSize === 'normal'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          title="Normal Font Size"
        >
          A
        </button>
        <button
          type="button"
          onClick={() => {
            onChangeFontSize('large');
            sounds.playPaperRustle();
          }}
          className={`px-2 py-1 rounded text-sm font-semibold ${
            fontSize === 'large'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          title="Large Font Size (+15%)"
        >
          A+
        </button>
        <button
          type="button"
          onClick={() => {
            onChangeFontSize('xlarge');
            sounds.playPaperRustle();
          }}
          className={`px-2 py-1 rounded text-base font-bold ${
            fontSize === 'xlarge'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          title="Extra Large Font Size (+30%)"
        >
          A++
        </button>
      </div>

      <div className="h-4 w-px bg-surface-container-highest mx-0.5"></div>

      {/* Tactile Sound Effects Toggle */}
      <button
        type="button"
        onClick={() => {
          onToggleSound();
          sounds.playStampThud();
        }}
        className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all ${
          isSoundEnabled
            ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-xs'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
        }`}
        title={isSoundEnabled ? 'Paper sound effects active (click to mute)' : 'Unmute tactile paper sounds'}
      >
        <span className="material-symbols-outlined text-[16px]">
          {isSoundEnabled ? 'volume_up' : 'volume_off'}
        </span>
        <span>{isSoundEnabled ? 'Paper Sounds' : 'Muted'}</span>
      </button>
    </div>
  );
}
