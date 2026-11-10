import React from 'react';
import { Sparkles } from 'lucide-react';

interface LabFrameProps {
  title: string;
  subtitle: string;
  source: string;
  /** Optional controls rendered on the right of the header (presets, mode switch…). */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/** Common chrome for every interactive laboratory. */
export const LabFrame: React.FC<LabFrameProps> = ({ title, subtitle, source, actions, children }) => (
  <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6 max-w-5xl mx-auto my-6">
    <div className="flex flex-wrap items-start justify-between border-b border-stone-200 pb-4 mb-5 gap-3">
      <div className="min-w-0">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
          <Sparkles className="w-3.5 h-3.5" /> Interactive Laboratory ({source})
        </div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
    {children}
  </div>
);

/** Small pill-style toggle button used across labs. */
export const Pill: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; title?: string }> = ({ active, onClick, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
      active ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-slate-600 border-stone-300 hover:bg-stone-50'
    }`}
  >
    {children}
  </button>
);

export const TruthBadge: React.FC<{ value: boolean; small?: boolean }> = ({ value, small }) => (
  <span
    className={`inline-flex items-center justify-center font-mono font-bold rounded ${small ? 'w-5 h-5 text-[11px]' : 'w-7 h-6 text-xs'} ${
      value ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
    }`}
  >
    {value ? '1' : '0'}
  </span>
);
