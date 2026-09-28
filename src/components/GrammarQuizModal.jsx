import React, { useState } from 'react';
import confetti from 'canvas-confetti';

const UNIVERSAL_PRACTICE_QUESTIONS = [
  {
    id: 'q1',
    type: 'Punctuation & Syntax',
    question: 'Which of the following sentences correctly remedies a comma splice between two independent clauses?',
    options: [
      { text: 'The empirical evidence was compelling, however the sample size was limited.', correct: false },
      { text: 'The empirical evidence was compelling; however, the sample size was limited.', correct: true },
      { text: 'The empirical evidence was compelling, therefore the sample size was limited.', correct: false },
      { text: 'The empirical evidence was compelling but however, the sample size was limited.', correct: false }
    ],
    explanation: 'A semicolon (or period) is required before a conjunctive adverb like "however" when connecting two complete independent clauses.'
  },
  {
    id: 'q2',
    type: 'Style & Voice',
    question: 'Which revision best converts the passive construction into direct, active academic prose?',
    options: [
      { text: 'A strong refutation of the counter-argument was presented by the researcher.', correct: false },
      { text: 'The researcher presented a decisive refutation of the counter-argument.', correct: true },
      { text: 'The counter-argument was being refuted with strong evidence by the researcher.', correct: false },
      { text: 'It was by the researcher that a refutation of the argument was made.', correct: false }
    ],
    explanation: 'Placing the agent ("The researcher") as the subject performing the active verb ("presented") eliminates wordiness and increases rhetorical impact.'
  },
  {
    id: 'q3',
    type: 'Parallel Structure',
    question: 'Identify the sentence that maintains flawless parallel grammatical structure:',
    options: [
      { text: 'The policy aimed to reduce carbon emissions, stimulate clean energy investments, and creating sustainable urban jobs.', correct: false },
      { text: 'The policy aimed to reduce carbon emissions, stimulate clean energy investments, and create sustainable urban jobs.', correct: true },
      { text: 'The policy aimed at reducing carbon emissions, to stimulate clean energy, and creating jobs.', correct: false },
      { text: 'The policy aimed to reduce carbon emissions, clean energy was stimulated, and to create jobs.', correct: false }
    ],
    explanation: 'Parallel series require matching verb forms: "to reduce", "[to] stimulate", and "[to] create".'
  }
];

export default function GrammarQuizModal({ onClose, submission }) {
  const studentName = submission?.studentName || 'Student';
  const questions = submission?.grammarQuiz || UNIVERSAL_PRACTICE_QUESTIONS;
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[currentQ] || questions[0];

  const handleSelect = (optionIdx) => {
    if (confirmed) return;
    setSelected(optionIdx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const isCorrect = q.options[selected].correct;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    setConfirmed(true);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
      if (score + (q.options[selected]?.correct ? 0 : 0) >= 2) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-surface-container-low px-space-lg py-space-md flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[24px]">quiz</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Writing Skills Diagnostic
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Targeting core syntax, active voice, and structural mechanics
              </span>
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

        {/* Modal Body */}
        <div className="p-space-lg space-y-space-md">
          {!finished ? (
            <>
              {/* Progress & Question Counter */}
              <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>Question {currentQ + 1} of {questions.length}</span>
                <span className="font-code-inline font-bold text-primary">Score: {score}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-primary font-label-sm text-xs font-bold uppercase tracking-wider">
                  {q.type}
                </span>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold pt-1">
                  {q.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-space-xs pt-1">
                {q.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  let optStyle = 'border-surface-container hover:bg-surface-container bg-surface-container-low';
                  if (isSelected && !confirmed) {
                    optStyle = 'border-primary ring-2 ring-primary/20 bg-primary-fixed/20 font-semibold';
                  } else if (confirmed) {
                    if (opt.correct) {
                      optStyle = 'border-tertiary bg-tertiary-fixed text-on-tertiary-container font-semibold';
                    } else if (isSelected && !opt.correct) {
                      optStyle = 'border-error bg-error-container text-on-error-container font-semibold';
                    } else {
                      optStyle = 'opacity-40 border-surface-container';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={confirmed}
                      className={`w-full p-space-sm rounded-xl text-left border transition-all flex items-start gap-space-sm ${optStyle}`}
                      type="button"
                    >
                      <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface flex-1">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (when confirmed) */}
              {confirmed && (
                <div className="p-space-sm rounded-xl bg-surface-container-low border border-surface-container space-y-1 animate-fade-in">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">lightbulb</span>
                    Analytical Explanation
                  </span>
                  <p className="font-annotation-note text-annotation-note text-on-surface-variant">
                    {q.explanation}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Results Screen */
            <div className="text-center py-space-md space-y-space-md animate-fade-in">
              <span className="material-symbols-outlined text-[64px] text-tertiary">
                celebration
              </span>
              <div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Diagnostic Complete!
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  You scored <strong className="text-primary">{score} out of {questions.length}</strong> on the targeted syntax and mechanics module.
                </p>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container text-left space-y-1 max-w-md mx-auto">
                <span className="font-label-sm text-xs font-bold text-tertiary uppercase">Recommended Revision Focus:</span>
                <p className="font-annotation-note text-annotation-note text-on-surface-variant">
                  {studentName} demonstrated solid understanding of parallel structure. Continue practicing active voice and transitional clarity in multi-clause sentences.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-surface-container-low px-space-lg py-space-sm flex items-center justify-between border-t border-surface-container">
          {!finished ? (
            <>
              <button
                onClick={onClose}
                className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                Close Diagnostic
              </button>
              {!confirmed ? (
                <button
                  onClick={handleConfirm}
                  disabled={selected === null}
                  className="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary disabled:opacity-50 transition-all"
                  type="button"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 transition-all flex items-center gap-1"
                  type="button"
                >
                  <span>{currentQ + 1 >= questions.length ? 'See Results' : 'Next Question'}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                Retake Diagnostic
              </button>
              <button
                onClick={onClose}
                className="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary transition-all"
                type="button"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
