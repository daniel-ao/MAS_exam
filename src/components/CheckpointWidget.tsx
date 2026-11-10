import React, { useState } from 'react';
import { CheckpointQuestion } from '../types';
import { RichText } from './RichText';
import { CheckCircle2, XCircle, HelpCircle, Lightbulb, ExternalLink } from 'lucide-react';

interface CheckpointWidgetProps {
  question: CheckpointQuestion;
  userAnswer?: number[];
  onAnswerSubmit: (questionId: string, answers: number[], isCorrect: boolean) => void;
  onOpenSlide?: (slideNum: number) => void;
}

export const CheckpointWidget: React.FC<CheckpointWidgetProps> = ({
  question,
  userAnswer,
  onAnswerSubmit,
  onOpenSlide
}) => {
  const [selected, setSelected] = useState<number[]>(userAnswer || []);
  const [submitted, setSubmitted] = useState<boolean>(!!userAnswer);
  const [showHint, setShowHint] = useState<boolean>(false);

  const isMultiple = question.type === 'multiple';

  const handleToggleOption = (idx: number) => {
    if (submitted) return;
    if (isMultiple) {
      setSelected(prev =>
        prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
      );
    } else {
      setSelected([idx]);
    }
  };

  const handleCheck = () => {
    if (selected.length === 0) return;
    const sortedSelected = [...selected].sort((a, b) => a - b);
    const sortedCorrect = [...question.correctAnswers].sort((a, b) => a - b);
    const isCorrect =
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((val, i) => val === sortedCorrect[i]);

    setSubmitted(true);
    onAnswerSubmit(question.id, selected, isCorrect);
  };

  const handleRetry = () => {
    setSubmitted(false);
    setSelected([]);
  };

  const isCorrect =
    submitted &&
    selected.length === question.correctAnswers.length &&
    selected.every(idx => question.correctAnswers.includes(idx));

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-xs my-4">
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
            Concept Checkpoint
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
            question.difficulty === 'challenge'
              ? 'bg-rose-100 text-rose-700'
              : question.difficulty === 'advanced'
              ? 'bg-purple-100 text-purple-700'
              : question.difficulty === 'intermediate'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-stone-200 text-stone-700'
          }`}>
            {question.difficulty}
          </span>
        </div>

        {question.sourceSlide && onOpenSlide && (
          <button
            onClick={() => onOpenSlide(question.sourceSlide!)}
            className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            Slide {question.sourceSlide} <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Question Text */}
      <h4 className="text-sm font-bold text-slate-800 leading-snug mb-3">
        <RichText text={question.question} inline />
      </h4>
      {isMultiple && !submitted && (
        <p className="-mt-2 mb-3 text-[11px] text-slate-500">Select all that apply.</p>
      )}

      {/* Options */}
      <div className="space-y-2 mb-4">
        {question.options.map((opt, idx) => {
          const isChosen = selected.includes(idx);
          const isAnswer = question.correctAnswers.includes(idx);

          let optionStyle = 'bg-white border-stone-200 text-slate-700 hover:border-teal-400';

          if (submitted) {
            if (isAnswer) {
              optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium';
            } else if (isChosen && !isAnswer) {
              optionStyle = 'bg-rose-50 border-rose-300 text-rose-950';
            } else {
              optionStyle = 'bg-white border-stone-200 text-slate-400 opacity-60';
            }
          } else if (isChosen) {
            optionStyle = 'bg-teal-50 border-teal-500 text-teal-950 font-medium shadow-xs';
          }

          return (
            <button
              type="button"
              key={idx}
              onClick={() => handleToggleOption(idx)}
              aria-pressed={isChosen}
              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${submitted ? 'cursor-default' : 'cursor-pointer'} ${optionStyle}`}
            >
              <div className={`w-4 h-4 rounded-full mt-0.5 shrink-0 flex items-center justify-center text-[10px] font-bold border ${
                submitted && isAnswer
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : submitted && isChosen && !isAnswer
                  ? 'bg-rose-600 border-rose-600 text-white'
                  : isChosen
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : 'border-stone-300 text-slate-500'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <div className="flex-1 leading-relaxed">
                <RichText text={opt} inline />
              </div>
              {submitted && isAnswer && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {submitted && isChosen && !isAnswer && (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Controls & Feedback */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200">
        <div className="flex items-center gap-2">
          {!submitted ? (
            <button
              onClick={handleCheck}
              disabled={selected.length === 0}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-xs ${
                selected.length === 0
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-teal-700 hover:bg-teal-800'
              }`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleRetry}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-200 hover:bg-stone-300 text-slate-700 transition-all"
            >
              Try Again
            </button>
          )}

          {question.hint && !submitted && (
            <button
              onClick={() => setShowHint(prev => !prev)}
              className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-medium"
            >
              <Lightbulb className="w-3.5 h-3.5" /> {showHint ? 'Hide Hint' : 'Hint'}
            </button>
          )}
        </div>

        {submitted && (
          <span className={`text-xs font-bold flex items-center gap-1 ${
            isCorrect ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            {isCorrect ? '✓ Correct Reasoning!' : '✗ Misconception Detected'}
          </span>
        )}
      </div>

      {/* Hint drawer */}
      {showHint && !submitted && question.hint && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <RichText text={question.hint} inline />
          </div>
        </div>
      )}

      {/* Submitted Detailed Explanations */}
      {submitted && (
        <div className="mt-4 pt-3 border-t border-stone-200 space-y-2.5">
          <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block mb-1">Detailed Solution & Rationale:</span>
            <RichText text={question.explanation} size="xs" />
          </div>

          {/* Option-by-option failure explanations */}
          {question.whyOptionsIncorrect && Object.keys(question.whyOptionsIncorrect).length > 0 && (
            <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 text-xs text-slate-700">
              <span className="font-bold text-rose-900 block mb-1.5">Why the other choices are incorrect:</span>
              <ul className="space-y-1.5 pl-1">
                {Object.entries(question.whyOptionsIncorrect).map(([key, reason]) => {
                  const optIdx = parseInt(key);
                  return (
                    <li key={key} className="flex items-start gap-1.5">
                      <span className="font-mono font-bold text-rose-800 shrink-0">
                        ({String.fromCharCode(65 + optIdx)}):
                      </span>
                      <span className="text-slate-600 flex-1">
                        <RichText text={reason} inline />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

