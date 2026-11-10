import React, { useMemo, useState } from 'react';
import { Lesson } from '../types';
import { buildCheatSheet } from '../cheatsheet/buildCheatSheet';
import { RichText } from './RichText';
import { MathView } from './MathView';
import { ArrowRight, BookA, Calculator, HelpCircle, Image as ImageIcon, ListChecks, ScrollText, Zap } from 'lucide-react';

interface CheatSheetCardProps {
  lesson: Lesson;
  /** Shown above the title in the all-lessons view. */
  eyebrow?: string;
  /** Embedded in its own lesson page: the title and summary are already shown just above. */
  embedded?: boolean;
  onOpenLesson?: () => void;
  onOpenSlide?: (page: number) => void;
}

const Heading: React.FC<{ icon: React.ElementType; children: React.ReactNode }> = ({ icon: Icon, children }) => (
  <h4 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
    <Icon className="w-3 h-3" /> {children}
  </h4>
);

export const CheatSheetCard: React.FC<CheatSheetCardProps> = ({ lesson, eyebrow, embedded = false, onOpenLesson, onOpenSlide }) => {
  const sheet = useMemo(() => buildCheatSheet(lesson), [lesson]);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const allRevealed = sheet.recall.length > 0 && revealed.size === sheet.recall.length;

  const toggle = (i: number) =>
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <article className="cheatsheet-card min-w-0 break-words bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-5 space-y-4 text-sm">
      {embedded ? (
        <header className="flex items-center gap-2 text-emerald-800">
          <ScrollText className="w-4 h-4" />
          <h3 className="font-bold">Cheat sheet</h3>
          <span className="text-[11px] font-normal text-slate-400">everything to remember, at a glance</span>
        </header>
      ) : (
        <header className="space-y-1.5">
          {eyebrow && <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700">{eyebrow}</div>}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-slate-900 leading-snug">{lesson.title}</h3>
            <div className="flex items-center gap-1 shrink-0 print:hidden">
              {onOpenSlide && (
                <button
                  onClick={() => onOpenSlide(lesson.sourcePages[0])}
                  className="p-1.5 rounded-md border border-stone-200 text-slate-500 hover:text-teal-700 hover:border-teal-300"
                  title={`Open slide ${lesson.sourcePages[0]}`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
              )}
              {onOpenLesson && (
                <button
                  onClick={onOpenLesson}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-stone-200 text-[11px] font-semibold text-slate-600 hover:text-teal-700 hover:border-teal-300"
                  title="Open the full lesson"
                >
                  Lesson <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          <p className="flex gap-2 rounded-lg bg-teal-50 border border-teal-100 px-3 py-2 text-teal-900 leading-snug">
            <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0 text-teal-600" />
            <span><RichText text={sheet.tldr} inline /></span>
          </p>
        </header>
      )}

      {sheet.keyPoints.length > 0 && (
        <section>
          <Heading icon={ListChecks}>Remember</Heading>
          <ul className="space-y-1 text-slate-700 leading-snug">
            {sheet.keyPoints.map((kp, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                <span><RichText text={kp} inline /></span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {sheet.terms.length > 0 && (
        <section>
          <Heading icon={BookA}>Key terms</Heading>
          <dl className="space-y-1.5 leading-snug">
            {sheet.terms.map(t => (
              <div key={t.term}>
                <dt className="inline font-semibold text-slate-900">{t.term}: </dt>
                <dd className="inline text-slate-600"><RichText text={t.definition} inline /></dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {sheet.formulas.length > 0 && (
        <section>
          <Heading icon={Calculator}>Formulas</Heading>
          <div className="space-y-2">
            {sheet.formulas.map(f => (
              <div key={f.name} className="rounded-lg bg-stone-50 border border-stone-200 px-3 py-2">
                <div className="text-[11px] font-semibold text-slate-600">{f.name}</div>
                <div className="overflow-x-auto no-scrollbar text-slate-900">
                  <MathView math={f.latex} block className="!my-1 text-[0.95em]" />
                </div>
                {f.note && <div className="text-[11px] text-slate-500 leading-snug"><RichText text={f.note} inline /></div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {sheet.recall.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <Heading icon={HelpCircle}>Quick recall</Heading>
            <button
              onClick={() => setRevealed(allRevealed ? new Set() : new Set(sheet.recall.map((_, i) => i)))}
              className="text-[10px] font-semibold text-teal-700 hover:underline mb-1.5 print:hidden"
            >
              {allRevealed ? 'Hide answers' : 'Reveal all'}
            </button>
          </div>
          <ol className="space-y-1.5">
            {sheet.recall.map((r, i) => (
              <li key={i}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full text-left rounded-lg border border-stone-200 hover:border-teal-300 px-3 py-2 transition-colors"
                  aria-expanded={revealed.has(i)}
                >
                  <div className="text-slate-700 leading-snug"><RichText text={r.question} inline /></div>
                  <div
                    className={`mt-1 text-emerald-800 font-semibold leading-snug ${revealed.has(i) ? 'block' : 'hidden'} print:block`}
                  >
                    → <RichText text={r.answer} inline />
                  </div>
                  {!revealed.has(i) && (
                    <div className="mt-1 text-[11px] text-slate-400 print:hidden">Think, then tap to reveal</div>
                  )}
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
    </article>
  );
};

export default CheatSheetCard;
