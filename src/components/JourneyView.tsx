import React, { useEffect, useMemo, useState } from 'react';
import { Course, CourseId, Lesson, UserProgress } from '../types';
import { ACHIEVEMENTS, ALL_LAB_IDS, LEVEL_COUNT, getLevel, liveStreak } from '../gamification/xp';
import { hasBoss } from './ModuleBoss';
import { ArrowRight, Flame, Lock, Swords, FlaskConical, CheckCircle2, Star } from 'lucide-react';
import { deckLabel, pagesLabel } from '../content/decks';

interface JourneyViewProps {
  courses: Course[];
  progress: UserProgress;
  onNavigateToLesson: (lessonId: string) => void;
}

interface StarNode {
  lesson: Lesson;
  courseId: CourseId;
  moduleId: string;
  moduleTitle: string;
  x: number;
  y: number;
  isModuleEnd: boolean;
}

const COURSE_COLORS: Record<CourseId, { star: string; glow: string; label: string }> = {
  'course-1': { star: '#5eead4', glow: '#14b8a6', label: 'Agents & Organizations' },
  'course-2': { star: '#a5b4fc', glow: '#6366f1', label: 'Reputation, Voting & Games' },
  'course-3': { star: '#fcd34d', glow: '#f59e0b', label: 'Modal Logic & Manipulation' }
};

// Deterministic pseudo-random so the sky looks the same every visit.
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const useIsWide = () => {
  const query = '(min-width: 768px)';
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = () => setWide(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return wide;
};

const layoutStars = (courses: Course[], wide: boolean) => {
  const W = wide ? 1200 : 420;
  const regionLen = wide ? 400 : 640;
  const H = wide ? 640 : regionLen * courses.length;
  const nodes: StarNode[] = [];

  courses.forEach((course, ci) => {
    const lessons = course.modules.flatMap(m => m.lessons.map((l, li) => ({ l, m, isEnd: li === m.lessons.length - 1 })));
    const n = lessons.length;
    lessons.forEach(({ l, m, isEnd }, i) => {
      const t = n > 1 ? i / (n - 1) : 0.5;
      const wobble = Math.sin(i * 1.15 + ci * 2) * 0.32 + (rand(ci * 100 + i) - 0.5) * 0.18;
      if (wide) {
        // Each course flows top → bottom inside its own column.
        const cx = ci * regionLen + regionLen / 2;
        nodes.push({ lesson: l, courseId: course.id, moduleId: m.id, moduleTitle: m.title, x: cx + wobble * (regionLen * 0.62), y: 60 + t * (H - 120), isModuleEnd: isEnd });
      } else {
        const cy = ci * regionLen;
        nodes.push({ lesson: l, courseId: course.id, moduleId: m.id, moduleTitle: m.title, x: W / 2 + wobble * (W * 0.75), y: cy + 60 + t * (regionLen - 110), isModuleEnd: isEnd });
      }
    });
  });

  const background = Array.from({ length: wide ? 140 : 110 }).map((_, i) => ({
    x: rand(i * 3 + 1) * W,
    y: rand(i * 7 + 2) * H,
    r: rand(i * 11 + 3) * 1.1 + 0.2,
    o: rand(i * 13 + 4) * 0.5 + 0.15
  }));

  return { W, H, nodes, background, regionLen };
};

export const JourneyView: React.FC<JourneyViewProps> = ({ courses, progress, onNavigateToLesson }) => {
  const wide = useIsWide();
  const { W, H, nodes, background, regionLen } = useMemo(() => layoutStars(courses, wide), [courses, wide]);
  const [hovered, setHovered] = useState<StarNode | null>(null);

  const completed = new Set(progress.completedLessons);
  const visited = new Set(progress.visitedLessons || []);
  const bosses = new Set(progress.bossesBeaten || []);
  const nextStar = nodes.find(n => !completed.has(n.lesson.id));
  const xp = progress.xp || 0;
  const level = getLevel(xp);
  const streak = liveStreak(progress.streak);
  const unlocked = new Set(progress.achievements || []);
  const allCheckpoints = courses.flatMap(c => c.modules.flatMap(m => m.lessons.flatMap(l => l.checkpoints)));
  const solved = allCheckpoints.filter(q => progress.checkpointAnswers[q.id]?.isCorrect).length;
  const bossModules = useMemo(
    () => courses.flatMap(c => c.modules.filter(m => hasBoss(m, c)).map(m => m.id)),
    [courses]
  );
  const courseDone = (cid: CourseId) => nodes.filter(n => n.courseId === cid).every(n => completed.has(n.lesson.id));

  // Edges: the learning path, plus short "synapses" between lessons of the same module.
  const edges: { a: StarNode; b: StarNode; kind: 'path' | 'synapse' | 'bridge' }[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    edges.push({ a, b, kind: a.courseId === b.courseId ? 'path' : 'bridge' });
    const c = nodes[i + 2];
    if (c && c.moduleId === a.moduleId) edges.push({ a, b: c, kind: 'synapse' });
  }

  const focus = hovered || nextStar || null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-700">Your Journey</div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">The Agent Society</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Every lesson is an agent waiting to come online. Master it and it activates; finish a module and its agents
            form a coalition; complete a chapter and the whole organization starts exchanging messages. Activate all {nodes.length} agents to complete the society.
          </p>
        </div>
        {nextStar && (
          <button
            onClick={() => onNavigateToLesson(nextStar.lesson.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md"
          >
            Continue: {nextStar.lesson.title.length > 38 ? nextStar.lesson.title.slice(0, 36) + '…' : nextStar.lesson.title}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-3">
        <div className="col-span-2 bg-white rounded-2xl border border-indigo-200 p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Level {level.index + 1} / {LEVEL_COUNT}</span>
            <span className="font-mono">{xp} XP</span>
          </div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{level.name}</div>
          <div className="mt-2 h-2 rounded-full bg-indigo-100 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-teal-500" style={{ width: `${level.progressPct}%` }} />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {level.nextXp !== null ? `${level.nextXp - xp} XP to the next level` : 'Maximum level reached'}
          </div>
        </div>
        {[
          { icon: Star, label: 'Agents online', value: `${completed.size}/${nodes.length}`, tone: 'text-amber-500' },
          { icon: CheckCircle2, label: 'Checkpoints', value: `${solved}/${allCheckpoints.length}`, tone: 'text-emerald-600' },
          { icon: Flame, label: 'Day streak', value: streak, tone: 'text-orange-500' },
          { icon: FlaskConical, label: 'Labs explored', value: `${(progress.labsUsed || []).filter(l => ALL_LAB_IDS.includes(l)).length}/${ALL_LAB_IDS.length}`, tone: 'text-indigo-600' },
          { icon: Swords, label: 'Bosses defeated', value: `${bossModules.filter(id => bosses.has(id)).length}/${bossModules.length}`, tone: 'text-rose-600' }
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-stone-200 p-4">
            <s.icon className={`w-4 h-4 ${s.tone}`} />
            <div className="text-xl font-black text-slate-900 font-mono mt-1">{s.value}</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Constellation */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#0f172a_55%,_#020617_100%)] shadow-xl">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Society map of all lessons">
          <defs>
            {(Object.keys(COURSE_COLORS) as CourseId[]).map(cid => (
              <radialGradient key={cid} id={`glow-${cid}`}>
                <stop offset="0%" stopColor={COURSE_COLORS[cid].glow} stopOpacity="0.8" />
                <stop offset="100%" stopColor={COURSE_COLORS[cid].glow} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {background.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#fff" opacity={b.o} />
          ))}

          {/* Course labels */}
          {courses.map((c, ci) => (
            <text
              key={c.id}
              x={wide ? ci * regionLen + regionLen / 2 : W / 2}
              y={wide ? 30 : ci * regionLen + 30}
              textAnchor="middle"
              className="font-sans"
              fontSize="13"
              fontWeight="700"
              letterSpacing="2"
              fill={COURSE_COLORS[c.id].star}
              opacity={0.85}
            >
              {`CHAPTER ${ci + 1} · ${COURSE_COLORS[c.id].label.toUpperCase()}`}
            </text>
          ))}

          {/* Edges */}
          {edges.map(({ a, b, kind }, i) => {
            const lit = completed.has(a.lesson.id) && completed.has(b.lesson.id);
            const firing = lit && kind !== 'bridge' && courseDone(a.courseId);
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={lit ? COURSE_COLORS[a.courseId].star : '#64748b'}
                strokeOpacity={lit ? (kind === 'synapse' ? 0.45 : 0.8) : kind === 'synapse' ? 0.12 : 0.25}
                strokeWidth={kind === 'synapse' ? 1 : lit ? 1.8 : 1}
                strokeDasharray={kind === 'bridge' && !lit ? '3 5' : undefined}
                className={firing ? 'animate-edge-flow' : undefined}
              />
            );
          })}

          {/* Stars */}
          {nodes.map(n => {
            const done = completed.has(n.lesson.id);
            const seen = visited.has(n.lesson.id);
            const isNext = nextStar?.lesson.id === n.lesson.id;
            const color = COURSE_COLORS[n.courseId];
            const r = done ? 6.5 : isNext ? 6 : seen ? 4 : 3;
            return (
              <g
                key={n.lesson.id}
                transform={`translate(${n.x} ${n.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(n)}
                onBlur={() => setHovered(null)}
                onClick={() => onNavigateToLesson(n.lesson.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') onNavigateToLesson(n.lesson.id);
                }}
                tabIndex={0}
                role="link"
                aria-label={`${n.lesson.title}${done ? ' (mastered)' : ''}`}
              >
                <circle r={18} fill="transparent" />
                {(done || isNext) && <circle r={done ? 18 : 15} fill={`url(#glow-${n.courseId})`} className={isNext ? 'animate-star-pulse' : undefined} />}
                {isNext && <circle r={11} fill="none" stroke={color.star} strokeWidth={1.2} strokeDasharray="2 3" className="animate-star-pulse" />}
                <circle r={r} fill={done ? color.star : seen ? '#cbd5e1' : '#475569'} stroke={hovered?.lesson.id === n.lesson.id ? '#fff' : 'none'} strokeWidth={1.5} />
                {n.isModuleEnd && bosses.has(n.moduleId) && (
                  <text x={9} y={-8} fontSize="11">⚔️</text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Info strip */}
        {focus && (
          <div className="absolute left-3 right-3 bottom-3 sm:left-auto sm:right-4 sm:bottom-4 sm:w-80 rounded-2xl bg-slate-900/85 backdrop-blur border border-slate-700 p-3.5 text-slate-100 pointer-events-none">
            <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: COURSE_COLORS[focus.courseId].star }}>
              {hovered ? focus.moduleTitle : 'Next agent to activate'}
            </div>
            <div className="text-sm font-bold leading-snug mt-0.5">{focus.lesson.title}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              {completed.has(focus.lesson.id) ? '✓ Mastered' : visited.has(focus.lesson.id) ? 'Visited, not mastered yet' : 'Unexplored'}
              {' · '}{deckLabel(focus.lesson.deck)} · {pagesLabel(focus.lesson.sourcePages)}
            </div>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Achievements <span className="text-sm font-mono text-slate-400">{unlocked.size}/{ACHIEVEMENTS.length}</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map(a => {
            const has = unlocked.has(a.id);
            return (
              <div
                key={a.id}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                  has ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-200 opacity-70'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${has ? 'bg-white shadow-xs' : 'bg-stone-100 grayscale'}`}>
                  {has ? a.emoji : <Lock className="w-4 h-4 text-slate-400" />}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-bold ${has ? 'text-amber-950' : 'text-slate-600'}`}>{a.title}</div>
                  <div className="text-xs text-slate-500 leading-snug">{a.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
