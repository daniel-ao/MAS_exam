import React, { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckpointQuestion, Course, Module } from '../types';
import { examQuestionsBank } from '../content/examQuestions';
import { RichText } from './RichText';
import { Swords, Heart, RotateCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface ModuleBossProps {
  module: Module;
  course: Course;
  isBeaten: boolean;
  onBeat: () => void;
}

const BOSS_HP = 3;
const PASS_MARK = 2;

const shuffle = <T,>(items: T[]): T[] => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Questions that belong to this module: exam-bank questions whose source slide lies in the
 *  module's slides, topped up with the module's own lesson checkpoints. */
const buildPool = (module: Module, course: Course): CheckpointQuestion[] => {
  const fromBank = examQuestionsBank.filter(
    q => q.courseId === course.id && q.sourceSlide !== undefined && module.lessons.some(l => l.deck === q.deck && l.sourcePages.includes(q.sourceSlide!))
  );
  const fromLessons = module.lessons.flatMap(l => l.checkpoints);
  const seen = new Set<string>();
  return [...shuffle(fromBank), ...shuffle(fromLessons)].filter(q => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });
};

/** A module only gets a boss when it has enough material for a full fight. */
export const hasBoss = (module: Module, course: Course) => buildPool(module, course).length >= BOSS_HP;

const isAnswerCorrect = (q: CheckpointQuestion, ans: number[]) =>
  ans.length === q.correctAnswers.length && ans.every(a => q.correctAnswers.includes(a));

export const ModuleBoss: React.FC<ModuleBossProps> = ({ module, course, isBeaten, onBeat }) => {
  const [phase, setPhase] = useState<'intro' | 'fight' | 'result'>('intro');
  const [round, setRound] = useState(0);
  const [questions, setQuestions] = useState<CheckpointQuestion[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [hits, setHits] = useState(0);

  const poolSize = useMemo(() => buildPool(module, course).length, [module, course]);
  const moduleName = module.title.replace(/^Module\s+[\d.]+:\s*/, '');

  if (poolSize < BOSS_HP) return null;

  const start = () => {
    setQuestions(buildPool(module, course).slice(0, BOSS_HP));
    setRound(0);
    setHits(0);
    setSelected([]);
    setLocked(false);
    setPhase('fight');
  };

  const q = questions[round];
  const isMultiple = q?.type === 'multiple';

  const lockIn = () => {
    if (!q || selected.length === 0) return;
    setLocked(true);
    if (isAnswerCorrect(q, selected)) setHits(h => h + 1);
  };

  const next = () => {
    if (round + 1 < questions.length) {
      setRound(r => r + 1);
      setSelected([]);
      setLocked(false);
    } else {
      setPhase('result');
      if (hits >= PASS_MARK) {
        if (!isBeaten) onBeat();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
      }
    }
  };

  const bossHp = BOSS_HP - hits;

  return (
    <section
      id="lesson-boss"
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 p-6 shadow-xl"
    >
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-amber-300" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Module Boss</div>
            <h2 className="text-base font-bold leading-tight">{moduleName}</h2>
          </div>
        </div>
        {phase !== 'intro' && (
          <div className="flex items-center gap-1" aria-label={`Boss health ${bossHp} of ${BOSS_HP}`}>
            {Array.from({ length: BOSS_HP }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 transition-all ${i < bossHp ? 'text-rose-400 fill-rose-400' : 'text-slate-600 scale-75'}`}
              />
            ))}
          </div>
        )}
      </div>

      {phase === 'intro' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            You reached the end of this module. Three questions drawn from the whole module stand between you
            and the next coalition. Land <strong className="text-white">{PASS_MARK} of {BOSS_HP}</strong> hits to defeat the boss.
          </p>
          <button
            onClick={start}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black uppercase tracking-wide transition-all"
          >
            <Swords className="w-4 h-4" /> {isBeaten ? 'Rematch' : 'Fight'}
          </button>
          {isBeaten && <span className="ml-3 text-xs text-emerald-300 font-semibold">✓ Already defeated</span>}
        </div>
      )}

      {phase === 'fight' && q && (
        <div className="space-y-3 animate-pop-in" key={q.id}>
          <div className="text-[11px] font-mono text-slate-400">Round {round + 1}/{questions.length}{isMultiple ? ' · select all that apply' : ''}</div>
          <h3 className="text-sm font-bold leading-snug"><RichText text={q.question} inline /></h3>
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              const chosen = selected.includes(idx);
              const correct = q.correctAnswers.includes(idx);
              let style = chosen ? 'border-amber-300 bg-amber-300/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/40';
              if (locked) {
                style = correct
                  ? 'border-emerald-400 bg-emerald-400/10'
                  : chosen
                  ? 'border-rose-400 bg-rose-400/10'
                  : 'border-slate-800 opacity-50';
              }
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={locked}
                  onClick={() =>
                    setSelected(prev =>
                      isMultiple ? (prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]) : [idx]
                    )
                  }
                  className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-start gap-2 transition-all ${style}`}
                >
                  <span className="font-mono font-bold text-slate-400 shrink-0">{String.fromCharCode(65 + idx)}</span>
                  <span className="flex-1 leading-relaxed"><RichText text={opt} inline /></span>
                  {locked && correct && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {locked && chosen && !correct && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {locked && (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300">
              <RichText text={q.explanation} size="xs" />
            </div>
          )}

          <div className="flex justify-end">
            {!locked ? (
              <button
                onClick={lockIn}
                disabled={selected.length === 0}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Strike
              </button>
            ) : (
              <button
                onClick={next}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-900 flex items-center gap-1"
              >
                {round + 1 < questions.length ? 'Next round' : 'See outcome'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="space-y-3 animate-pop-in">
          {hits >= PASS_MARK ? (
            <p className="text-sm">
              <strong className="text-emerald-300 text-base">Boss defeated!</strong>{' '}
              {hits}/{BOSS_HP} hits. A new badge now shines on your society map.
            </p>
          ) : (
            <p className="text-sm">
              <strong className="text-rose-300 text-base">The boss survived.</strong>{' '}
              {hits}/{BOSS_HP} hits. Revisit the module's lessons, then try again: questions are reshuffled.
            </p>
          )}
          <button
            onClick={start}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {hits >= PASS_MARK ? 'Rematch' : 'Try again'}
          </button>
        </div>
      )}
    </section>
  );
};
