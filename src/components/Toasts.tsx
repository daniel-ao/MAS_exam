import React, { useEffect, useState } from 'react';
import { ToastMessage, subscribeToasts } from '../gamification/xp';

const TONE_STYLES: Record<NonNullable<ToastMessage['tone']>, string> = {
  xp: 'bg-white border-teal-200 text-teal-900',
  level: 'bg-gradient-to-r from-indigo-700 to-teal-700 border-indigo-400 text-white',
  achievement: 'bg-amber-50 border-amber-300 text-amber-950',
  info: 'bg-white border-stone-200 text-slate-800'
};

const DURATION: Record<NonNullable<ToastMessage['tone']>, number> = {
  xp: 1800,
  level: 4500,
  achievement: 5000,
  info: 3000
};

export const Toasts: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return subscribeToasts(t => {
      setToasts(prev => {
        // Collapse consecutive XP toasts so rapid gains don't stack into a wall.
        const withoutOldXp = t.tone === 'xp' ? prev.filter(p => p.tone !== 'xp') : prev;
        return [...withoutOldXp, t].slice(-4);
      });
      window.setTimeout(() => {
        setToasts(prev => prev.filter(p => p.id !== t.id));
      }, DURATION[t.tone || 'info']);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[70] flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-2rem)] w-80">
      {toasts.map(t => (
        <div
          key={t.id}
          role="status"
          className={`animate-toast-in pointer-events-auto rounded-xl border shadow-lg px-3.5 py-2.5 flex items-start gap-2.5 ${TONE_STYLES[t.tone || 'info']}`}
        >
          {t.emoji && <span className="text-lg leading-none mt-0.5">{t.emoji}</span>}
          <div className="min-w-0">
            <div className="text-xs font-bold leading-snug">{t.title}</div>
            {t.body && <div className="text-[11px] opacity-80 leading-snug mt-0.5">{t.body}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};
