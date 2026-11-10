import React, { useCallback, useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { Course, CourseId, UserProgress } from '../types';
import { UrgentCard, buildFullDeck, buildSprintDeck, estimateMinutes, chapterOf } from '../urgent/buildDeck';
import { deckLabel } from '../content/decks';
import { RichText } from './RichText';
import { MathView } from './MathView';
import { CheckpointWidget } from './CheckpointWidget';
import { LabHost } from './LabHost';
import {
  Zap,
  Clock,
  RotateCcw,
  Check,
  Image as ImageIcon,
  FlaskConical,
  X,
  ArrowRight,
  BookOpen,
  Flame,
  Target,
  CalendarClock,
  Sigma,
  Tag,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface UrgentStudyViewProps {
  /** The view stays mounted while hidden; keyboard shortcuts only apply while it is visible. */
  isActive: boolean;
  courses: Course[];
  progress: UserProgress;
  onRecordCard: (cardId: string, good: boolean) => void;
  onFinishSprint: () => void;
  onNavigateToLesson: (lessonId: string) => void;
  onOpenSlide: (deck: number, page: number) => void;
  onLabUsed: (labId: string) => void;
}

const BUDGETS = [15, 30, 60];
const MAX_REQUEUES = 2;

// Exam milestones (month is 0-based). Leave empty to hide the countdown.
const EXAM_DATES: { label: string; month: number; day: number }[] = [{ label: 'MAS exam (15:00, 1h30)', month: 10, day: 12 }];

const nextExam = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (const e of EXAM_DATES) {
    const d = new Date(now.getFullYear(), e.month, e.day);
    const days = Math.round((d.getTime() - today.getTime()) / 86400000);
    if (days >= 0) return { label: e.label, days, date: d };
  }
  return null;
};

const KIND_META: Record<UrgentCard['kind'], { label: string; icon: React.ElementType; tone: string }> = {
  concept: { label: 'Concept', icon: Lightbulb, tone: 'bg-teal-100 text-teal-800' },
  formula: { label: 'Formula', icon: Sigma, tone: 'bg-purple-100 text-purple-800' },
  term: { label: 'Definition', icon: Tag, tone: 'bg-blue-100 text-blue-800' },
  quiz: { label: 'Quick-fire', icon: HelpCircle, tone: 'bg-rose-100 text-rose-800' }
};

const COURSE_SHORT: Record<CourseId, string> = {
  'course-1': 'Agents & Organizations',
  'course-2': 'Reputation, Voting & Games',
  'course-3': 'Modal Logic & Manipulation'
};

const fmtTime = (s: number) => `${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2, '0')}`;

type Phase = 'setup' | 'sprint' | 'results';

export const UrgentStudyView: React.FC<UrgentStudyViewProps> = ({
  isActive,
  courses,
  progress,
  onRecordCard,
  onFinishSprint,
  onNavigateToLesson,
  onOpenSlide,
  onLabUsed
}) => {
  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedCourses, setSelectedCourses] = useState<CourseId[]>(['course-1', 'course-2', 'course-3']);
  const [minutes, setMinutes] = useState<number>(30);

  const [queue, setQueue] = useState<UrgentCard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);
  const [requeues, setRequeues] = useState<Record<string, number>>({});
  const [outcomes, setOutcomes] = useState<Record<string, 'good' | 'again'>>({});
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [labOpen, setLabOpen] = useState<string | null>(null);

  const fullDeckSize = useMemo(
    () => buildFullDeck(courses.filter(c => selectedCourses.includes(c.id))).length,
    [courses, selectedCourses]
  );
  const weakCount = useMemo(
    () => Object.values(progress.urgentCardStats || {}).filter(s => s.again > 0 && s.again >= s.good).length,
    [progress.urgentCardStats]
  );
  const exam = nextExam();
  // Preview of what a sprint would contain (only recomputed when the settings change).
  const preview = useMemo(
    () => (phase === 'setup' ? buildSprintDeck(courses, selectedCourses, minutes, progress) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, courses, selectedCourses, minutes]
  );

  useEffect(() => {
    if (!labOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        setLabOpen(null);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [labOpen]);

  useEffect(() => {
    if (phase !== 'sprint' || !isActive) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [phase, isActive]);

  const start = (onlyWeak = false) => {
    const deck = buildSprintDeck(courses, selectedCourses, minutes, progress, onlyWeak);
    if (deck.length === 0) return;
    setQueue(deck);
    setIndex(0);
    setFlipped(false);
    setQuizResult(null);
    setRequeues({});
    setOutcomes({});
    setCombo(0);
    setBestCombo(0);
    setStartedAt(Date.now());
    setNow(Date.now());
    setPhase('sprint');
    window.scrollTo({ top: 0 });
  };

  const card = queue[index];

  const finish = useCallback(() => {
    setPhase('results');
    onFinishSprint();
    confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
    window.scrollTo({ top: 0 });
  }, [onFinishSprint]);

  const answer = useCallback(
    (good: boolean) => {
      if (!card) return;
      onRecordCard(card.id, good);
      setOutcomes(prev => ({ ...prev, [card.id]: good ? (prev[card.id] === 'again' ? 'again' : 'good') : 'again' }));
      let nextQueue = queue;
      if (good) {
        setCombo(c => {
          const n = c + 1;
          setBestCombo(b => Math.max(b, n));
          return n;
        });
      } else {
        setCombo(0);
        const count = requeues[card.id] || 0;
        if (count < MAX_REQUEUES) {
          // Lightweight Leitner: a missed card comes back a few cards later.
          const insertAt = Math.min(queue.length, index + 4);
          nextQueue = [...queue.slice(0, insertAt), card, ...queue.slice(insertAt)];
          setQueue(nextQueue);
          setRequeues(prev => ({ ...prev, [card.id]: count + 1 }));
        }
      }
      if (index + 1 >= nextQueue.length) {
        finish();
      } else {
        setIndex(i => i + 1);
        setFlipped(false);
        setQuizResult(null);
      }
    },
    [card, queue, index, requeues, onRecordCard, finish]
  );

  // Keyboard: Space/Enter flips, 1 = review again, 2 = got it.
  useEffect(() => {
    if (!isActive || phase !== 'sprint' || !card || labOpen) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'BUTTON')) return;
      if (card.kind === 'quiz') {
        if (quizResult !== null && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          answer(quizResult);
        }
        return;
      }
      if ((e.key === ' ' || e.key === 'Enter') && !flipped) {
        e.preventDefault();
        setFlipped(true);
      } else if (flipped && e.key === '1') {
        answer(false);
      } else if (flipped && e.key === '2') {
        answer(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isActive, phase, card, flipped, quizResult, answer, labOpen]);

  // ------------------------------------------------------------------ SETUP
  if (phase === 'setup') {
    const kinds = preview.reduce<Record<string, number>>((acc, c) => ({ ...acc, [c.kind]: (acc[c.kind] || 0) + 1 }), {});

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1">
            <Zap className="w-3.5 h-3.5 fill-orange-400" /> Urgent Study
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Exam tomorrow? Sprint through the essentials.</h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            A time-boxed run through the most important material of each course: core ideas, formulas, definitions
            and quick-fire questions, all taken from the lessons. Cards you miss come back later in the sprint, and
            your weakest material is prioritised next time.
          </p>
        </div>

        {exam && (
          <div className={`flex items-center gap-3 p-4 rounded-2xl border ${exam.days <= 3 ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
            <CalendarClock className="w-6 h-6 shrink-0" />
            <div className="text-sm">
              <strong>{exam.label}</strong> is{' '}
              {exam.days === 0 ? <strong>today</strong> : <>in <strong>{exam.days} day{exam.days > 1 ? 's' : ''}</strong></>}{' '}
              ({exam.date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}).
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Courses</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {courses.map(c => {
                const on = selectedCourses.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() =>
                      setSelectedCourses(prev =>
                        on ? (prev.length > 1 ? prev.filter(id => id !== c.id) : prev) : [...prev, c.id]
                      )
                    }
                    className={`p-3 rounded-xl border text-left transition-all ${
                      on ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                    aria-pressed={on}
                  >
                    <div className="text-[10px] font-mono text-slate-500">Chapter {chapterOf(c.id)}</div>
                    <div className="text-sm font-semibold text-slate-900">{COURSE_SHORT[c.id]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Time budget</div>
            <div className="flex gap-2">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => setMinutes(b)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                    minutes === b ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-stone-300 text-slate-700 hover:bg-stone-50'
                  }`}
                >
                  {b} min
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
            <span><strong className="text-slate-900">{preview.length}</strong> of {fullDeckSize} cards selected</span>
            {Object.entries(kinds).map(([k, n]) => (
              <span key={k}>{n} {KIND_META[k as UrgentCard['kind']].label.toLowerCase()}</span>
            ))}
            <span>≈ {estimateMinutes(preview)} min</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => start(false)}
              disabled={preview.length === 0}
              className="flex-1 min-w-[12rem] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white text-sm font-black tracking-wide shadow-md disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" /> Start {minutes}-minute sprint
            </button>
            {weakCount > 0 && (
              <button
                onClick={() => start(true)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-sm font-bold"
              >
                <Target className="w-4 h-4" /> Drill {weakCount} weak card{weakCount > 1 ? 's' : ''}
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400">Keyboard: <kbd className="font-mono">Space</kbd> reveal · <kbd className="font-mono">1</kbd> review again · <kbd className="font-mono">2</kbd> got it</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- RESULTS
  if (phase === 'results') {
    const ids = Object.keys(outcomes);
    const good = ids.filter(id => outcomes[id] === 'good').length;
    const weak = queue.filter((c, i) => outcomes[c.id] === 'again' && queue.findIndex(x => x.id === c.id) === i);
    const byLesson = new Map<string, { title: string; lessonId?: string; cards: UrgentCard[] }>();
    weak.forEach(c => {
      const key = c.lessonId || c.courseId;
      const entry = byLesson.get(key) || { title: c.lessonTitle || COURSE_SHORT[c.courseId], lessonId: c.lessonId, cards: [] };
      entry.cards.push(c);
      byLesson.set(key, entry);
    });
    const elapsed = Math.round((now - startedAt) / 1000);

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in">
        <div className="text-center space-y-2">
          <div className="text-4xl">⚡</div>
          <h1 className="text-2xl font-bold text-slate-900">Sprint complete</h1>
          <p className="text-sm text-slate-600">Every card you marked “review again” is now prioritised in your next sprint.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Cards', value: ids.length },
            { label: 'Got it first time', value: good },
            { label: 'Best combo', value: bestCombo },
            { label: 'Time', value: fmtTime(elapsed) }
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-stone-200 p-4 text-center">
              <div className="text-2xl font-black text-slate-900 font-mono">{s.value}</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Target className="w-4 h-4 text-rose-600" /> Weak spots</h2>
          {byLesson.size === 0 ? (
            <p className="text-sm text-emerald-700">No weak spots this round. Clean sweep.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {[...byLesson.values()].map(entry => (
                <li key={entry.title} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{entry.title}</div>
                    <div className="text-[11px] text-slate-500">
                      {entry.cards.map(c => KIND_META[c.kind].label).join(' · ')}
                    </div>
                  </div>
                  {entry.lessonId && (
                    <button
                      onClick={() => onNavigateToLesson(entry.lessonId!)}
                      className="shrink-0 text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                    >
                      Open lesson <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={() => start(false)} className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold inline-flex items-center gap-2">
            <Zap className="w-4 h-4 fill-white" /> Another sprint
          </button>
          {weakCount > 0 && (
            <button onClick={() => start(true)} className="px-4 py-2 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 text-sm font-bold inline-flex items-center gap-2">
              <Target className="w-4 h-4" /> Drill weak cards
            </button>
          )}
          <button onClick={() => setPhase('setup')} className="px-4 py-2 rounded-xl border border-stone-300 bg-white text-slate-700 text-sm font-semibold">
            Change settings
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------- SPRINT
  if (!card) return null;
  const elapsed = Math.round((now - startedAt) / 1000);
  const remaining = minutes * 60 - elapsed;
  const meta = KIND_META[card.kind];
  const cardDeck = card.deck ?? (card.kind === 'concept' ? card.lesson.deck : 1);
  const pct = Math.round((index / queue.length) * 100);

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2 min-w-0">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${meta.tone}`}>
          <meta.icon className="w-3.5 h-3.5" /> {meta.label}
        </span>
        <span className="text-slate-500 truncate">{COURSE_SHORT[card.courseId]}{card.lessonTitle ? ` · ${card.lessonTitle}` : ''}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {card.slide && (
          <button
            onClick={() => onOpenSlide(cardDeck, card.slide!)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 font-semibold text-slate-700"
          >
            <ImageIcon className="w-3.5 h-3.5 text-teal-700" /> {deckLabel(cardDeck)} · Slide {card.slide}
          </button>
        )}
        {card.kind === 'concept' && card.lesson.labId && (
          <button
            onClick={() => setLabOpen(card.lesson.labId!)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 font-semibold text-indigo-800"
          >
            <FlaskConical className="w-3.5 h-3.5" /> Try the lab
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Sprint HUD */}
      <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/70 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600 font-mono">Card {index + 1} / {queue.length}</span>
          <div className="flex items-center gap-3">
            {combo >= 2 && (
              <span className="flex items-center gap-1 text-orange-600 font-black animate-pop-in" key={combo}>
                <Flame className="w-4 h-4 fill-orange-400" /> {combo} combo
              </span>
            )}
            <span className={`flex items-center gap-1 font-mono ${remaining < 0 ? 'text-rose-600' : remaining < 120 ? 'text-amber-600' : 'text-slate-600'}`}>
              <Clock className="w-3.5 h-3.5" /> {remaining < 0 ? `+${fmtTime(remaining)}` : fmtTime(remaining)}
            </span>
            <button onClick={finish} className="text-slate-400 hover:text-slate-700 font-semibold">End</button>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-stone-200 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        {remaining < 0 && (
          <p className="text-[11px] text-rose-600 font-semibold">Time budget reached. Finish the remaining cards or press End.</p>
        )}
      </div>

      {header}

      {/* Card */}
      {card.kind === 'quiz' ? (
        <div key={`${card.id}-${index}`} className="animate-pop-in">
          <CheckpointWidget
            question={card.question}
            onAnswerSubmit={(_, __, ok) => setQuizResult(ok)}
            onOpenSlide={p => onOpenSlide(cardDeck, p)}
          />
          {quizResult !== null && (
            <div className="flex justify-end">
              <button
                onClick={() => answer(quizResult)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white inline-flex items-center gap-2 ${quizResult ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-800 hover:bg-slate-900'}`}
              >
                {quizResult ? 'Nice, continue' : 'Got it, it will come back'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div key={`${card.id}-${index}`} className="flip-scene animate-pop-in">
          <div className={`flip-card ${flipped ? 'is-flipped' : ''}`}>
            {/* FRONT: prompt for active recall */}
            <button
              type="button"
              onClick={() => setFlipped(true)}
              className="flip-face text-left bg-white rounded-3xl border-2 border-stone-200 hover:border-orange-300 shadow-lg p-8 min-h-[18rem] flex flex-col justify-center items-center text-center gap-3 transition-colors"
              aria-hidden={flipped}
              tabIndex={flipped ? -1 : 0}
            >
              {card.kind === 'concept' && (
                <>
                  <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Recall the core ideas of</div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">{card.lesson.title}</h2>
                </>
              )}
              {card.kind === 'formula' && (
                <>
                  <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Write down the formula</div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">{card.formula.name}</h2>
                </>
              )}
              {card.kind === 'term' && (
                <>
                  <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Define</div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">{card.term.term}</h2>
                </>
              )}
              <span className="mt-4 text-xs text-slate-400">Think first, then click or press <kbd className="font-mono">Space</kbd> to reveal</span>
            </button>

            {/* BACK: the answer from the course */}
            <div
              className="flip-face flip-back bg-white rounded-3xl border-2 border-teal-200 shadow-lg p-6 sm:p-8 min-h-[18rem] overflow-y-auto"
              aria-hidden={!flipped}
            >
              {card.kind === 'concept' && (
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-slate-900">{card.lesson.title}</h2>
                  <div className="text-sm text-slate-700 leading-relaxed"><RichText text={card.lesson.summary} inline /></div>
                  {card.lesson.understand.keyPoints.length > 0 && (
                    <ul className="space-y-1.5 text-sm text-slate-700 pl-5 list-disc marker:text-teal-600">
                      {card.lesson.understand.keyPoints.map((pt, i) => (
                        <li key={i}><RichText text={pt} inline /></li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {card.kind === 'formula' && (
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-slate-900">{card.formula.name}</h2>
                  <MathView math={card.formula.latex} block />
                  <p className="text-sm text-slate-700 leading-relaxed"><RichText text={card.formula.explanation} inline /></p>
                  {card.formula.variables.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 border-t border-stone-100 pt-2">
                      {card.formula.variables.map((v, i) => (
                        <span key={i}><strong className="text-teal-700 font-mono">{v.symbol}</strong>: {v.meaning}</span>
                      ))}
                    </div>
                  )}
                  {card.formula.examTips && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <strong>Exam tip: </strong><RichText text={card.formula.examTips} inline />
                    </div>
                  )}
                </div>
              )}
              {card.kind === 'term' && (
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-slate-900">{card.term.term}</h2>
                  <p className="text-sm text-slate-700 leading-relaxed"><RichText text={card.term.definition} inline /></p>
                  {card.term.formula && <MathView math={card.term.formula} block />}
                  {card.term.sourceSlideRef && <div className="text-[11px] text-slate-400 font-mono">{card.term.sourceSlideRef}</div>}
                </div>
              )}
            </div>
          </div>

          {flipped && (
            <div className="mt-4 grid grid-cols-2 gap-3 animate-in fade-in">
              <button
                onClick={() => answer(false)}
                className="py-3 rounded-2xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-sm font-bold inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Review again <kbd className="hidden sm:inline text-[10px] font-mono opacity-60">1</kbd>
              </button>
              <button
                onClick={() => answer(true)}
                className="py-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-sm font-bold inline-flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Got it <kbd className="hidden sm:inline text-[10px] font-mono opacity-60">2</kbd>
              </button>
            </div>
          )}
        </div>
      )}

      {card.lessonId && (
        <div className="text-center">
          <button
            onClick={() => onNavigateToLesson(card.lessonId!)}
            className="text-[11px] text-slate-400 hover:text-teal-700 inline-flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3" /> Open the full lesson
          </button>
        </div>
      )}

      {/* Lab modal */}
      {labOpen && (
        <div
          className="fixed inset-0 z-[55] bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 overflow-y-auto animate-in fade-in"
          onMouseDown={e => {
            if (e.target === e.currentTarget) setLabOpen(null);
          }}
        >
          <div className="relative w-full max-w-4xl my-8 bg-[#FDFBF7] rounded-2xl shadow-2xl p-3 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2"><FlaskConical className="w-4 h-4" /> Quick lab</h3>
              <button onClick={() => setLabOpen(null)} className="p-1.5 rounded-lg hover:bg-stone-200 text-slate-500" aria-label="Close lab">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div onPointerDownCapture={() => onLabUsed(labOpen)}>
              <LabHost labId={labOpen} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
