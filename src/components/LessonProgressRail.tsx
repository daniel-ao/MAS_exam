import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

export interface RailStep {
  id: string;
  label: string;
  done: boolean;
  /** Optional "3/4"-style counter */
  detail?: string;
}

interface LessonProgressRailProps {
  containerRef: React.RefObject<HTMLElement | null>;
  steps: RailStep[];
}

/** Slim sticky reading-progress bar + section checklist shown at the top of each lesson. */
export const LessonProgressRail: React.FC<LessonProgressRailProps> = ({ containerRef, steps }) => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight + 64;
      const scrolled = -rect.top + 64;
      setPct(total <= 0 ? 100 : Math.max(0, Math.min(100, (scrolled / total) * 100)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [containerRef]);

  const jump = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const y = target.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const doneCount = steps.filter(s => s.done).length;

  return (
    <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/70">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          {doneCount}/{steps.length}
        </span>
        {steps.map(s => (
          <button
            key={s.id}
            onClick={() => jump(s.id)}
            className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${
              s.done
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-stone-200 text-slate-500 hover:text-slate-800 hover:border-stone-300'
            }`}
          >
            {s.done ? <Check className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />}
            {s.label}
            {s.detail && <span className="font-mono opacity-70">{s.detail}</span>}
          </button>
        ))}
      </div>
      <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-transparent">
        <div className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 transition-[width] duration-150" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};
