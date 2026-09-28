import React from 'react';
import { KEYBOARD_SHORTCUTS } from '../data/mockData';

export default function FlightControlModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-surface-container-low px-space-lg py-space-md flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[24px]">keyboard</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-2">
                Flight Control Mode
                <span className="px-2 py-0.5 rounded text-[11px] font-label-sm font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                  Active
                </span>
              </h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Keyboard shortcuts for zero-friction teacher speed-grading and navigation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="p-space-lg space-y-space-sm max-h-[70vh] overflow-y-auto">
          <div className="divide-y divide-surface-container border border-surface-container rounded-xl overflow-hidden">
            {KEYBOARD_SHORTCUTS.map((item, idx) => (
              <div
                key={idx}
                className="px-space-md py-space-sm flex items-center justify-between bg-surface-container-low/50 hover:bg-surface-container transition-colors"
              >
                <span className="font-body-md text-body-md text-on-surface font-medium">
                  {item.action}
                </span>
                <kbd className="px-2.5 py-1 rounded bg-surface-container-highest border border-surface-container font-code-inline text-code-inline text-on-surface font-bold shadow-xs">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="p-space-sm rounded-lg bg-tertiary-fixed/40 border border-tertiary/20 flex items-center gap-2 text-xs font-label-sm text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-tertiary shrink-0">tips_and_updates</span>
            <span>
              <strong>Tip:</strong> Press <kbd className="px-1 bg-surface-container-highest rounded font-bold">?</kbd> anytime to reveal or hide this flight control reference.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface-container-low px-space-lg py-space-sm flex items-center justify-end border-t border-surface-container">
          <button
            onClick={onClose}
            type="button"
            className="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary shadow-sm"
          >
            Got it (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
