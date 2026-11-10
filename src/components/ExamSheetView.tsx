import React from 'react';
import { examSheet } from '../cheatsheet/examSheet';
import { RichText } from './RichText';
import { FileText, Printer } from 'lucide-react';

const ACCENT: Record<1 | 2 | 3, string> = {
  1: 'text-teal-800 border-teal-600',
  2: 'text-purple-800 border-purple-600',
  3: 'text-amber-800 border-amber-600'
};

/** A recto/verso revision sheet, condensed from all three chapters. */
export const ExamSheetView: React.FC = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 space-y-6 animate-in fade-in duration-150">
    <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-teal-700" /> Exam Sheet (recto / verso)
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Everything worth copying onto one A4 sheet: definitions, formulas, key numbers and worked
          results, one or two lines each. Front = Chapters 1 and 2, back = Chapter 3 modal logic and the KBE theory of manipulation.
        </p>
      </div>
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-700"
        title="Print on one sheet, both sides"
      >
        <Printer className="w-4 h-4" /> Print (2 pages)
      </button>
    </div>

    <div id="examsheet-print" className="space-y-8">
      {examSheet.map((side, si) => (
        <section
          key={side.label}
          className="examsheet-page bg-white border border-stone-200 rounded-2xl shadow-xs p-4 sm:p-5"
        >
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-slate-800 pb-1 mb-3">
            <h2 className="font-bold text-slate-900 text-sm">{side.label}</h2>
            <span className="text-[10px] font-bold text-slate-500 shrink-0">
              {si === 0 ? 'RECTO' : 'VERSO'} · Multi-Agent Systems
            </span>
          </div>
          <div className="examsheet-cols columns-1 md:columns-2 lg:columns-3 gap-5 text-[11.5px] leading-snug text-slate-800">
            {side.sections.map(sec => (
              <div key={sec.title} className="mb-3">
                <h3 className={`font-bold uppercase tracking-wide text-[10.5px] border-b mb-1 break-after-avoid ${ACCENT[sec.course]}`}>
                  Ch{sec.course} · {sec.title}
                </h3>
                <ul className="space-y-0.5">
                  {sec.items.map(item => (
                    <li key={item.t} className="break-inside-avoid">
                      <span className="font-bold text-slate-950">{item.t}:</span>{' '}
                      <RichText text={item.d} inline />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  </div>
);

export default ExamSheetView;
