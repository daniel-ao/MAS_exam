import { Course, UserProgress } from '../types';

// ---------------------------------------------------------------------------
// Rewards
// ---------------------------------------------------------------------------

export const XP_REWARDS = {
  lessonCompleted: 50,
  checkpointFirstTry: 20,
  checkpointRetry: 10,
  labUsed: 15,
  bossBeaten: 60,
  examCorrectAnswer: 10,
  urgentCardGood: 5,
  urgentSprintFinished: 40
} as const;

// ---------------------------------------------------------------------------
// Levels — named after the course arc, from a lone reactive agent to KBE logic
// ---------------------------------------------------------------------------

export interface LevelInfo {
  index: number;
  name: string;
  minXp: number;
  nextXp: number | null;
  progressPct: number;
}

const LEVELS: { name: string; minXp: number }[] = [
  { name: 'Lone Agent', minXp: 0 },
  { name: 'Reflex Agent', minXp: 100 },
  { name: 'Subsumption Robot', minXp: 250 },
  { name: 'Flocking Boid', minXp: 450 },
  { name: 'BDI Mind', minXp: 700 },
  { name: 'Coalition Builder', minXp: 1000 },
  { name: 'Trusted Witness', minXp: 1400 },
  { name: 'Nash Strategist', minXp: 1900 },
  { name: 'Kripke Walker', minXp: 2600 },
  { name: 'KBE Logician', minXp: 3400 }
];

export const getLevel = (xp: number): LevelInfo => {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) index = i;
  }
  const minXp = LEVELS[index].minXp;
  const nextXp = index < LEVELS.length - 1 ? LEVELS[index + 1].minXp : null;
  const progressPct = nextXp === null ? 100 : Math.round(((xp - minXp) / (nextXp - minXp)) * 100);
  return { index, name: LEVELS[index].name, minXp, nextXp, progressPct };
};

export const LEVEL_COUNT = LEVELS.length;

// ---------------------------------------------------------------------------
// Streak helpers
// ---------------------------------------------------------------------------

export const dayKey = (d: Date = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const bumpStreak = (streak: UserProgress['streak']): NonNullable<UserProgress['streak']> => {
  const today = dayKey();
  if (!streak) return { count: 1, lastDay: today };
  if (streak.lastDay === today) return streak;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (streak.lastDay === dayKey(yesterday)) return { count: streak.count + 1, lastDay: today };
  return { count: 1, lastDay: today };
};

/** A streak only counts as alive if the last active day is today or yesterday. */
export const liveStreak = (streak: UserProgress['streak']): number => {
  if (!streak) return 0;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return streak.lastDay === dayKey() || streak.lastDay === dayKey(yesterday) ? streak.count : 0;
};

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  check: (p: UserProgress, courses: Course[]) => boolean;
}

export const ALL_LAB_IDS = [
  'subsumption-lab',
  'flocking-lab',
  'bdi-lab',
  'environment-lab',
  'organization-lab',
  'reputation-lab',
  'voting-lab',
  'game-lab',
  'kripke-lab',
  'proof-lab',
  'agency-lab',
  'manipulation-lab'
];

const courseDone = (p: UserProgress, c?: Course) =>
  !!c && c.modules.every(m => m.lessons.every(l => p.completedLessons.includes(l.id)));

const anyModuleDone = (p: UserProgress, courses: Course[]) =>
  courses.some(c => c.modules.some(m => m.lessons.every(l => p.completedLessons.includes(l.id))));

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-light',
    title: 'First Agent Online',
    description: 'Complete your first lesson. The first agent joins your society.',
    emoji: '🤖',
    check: p => p.completedLessons.length >= 1
  },
  {
    id: 'constellation',
    title: 'Coalition Formed',
    description: 'Complete every lesson of a module.',
    emoji: '🤝',
    check: anyModuleDone
  },
  {
    id: 'clean-gradient',
    title: 'Positive Introspection',
    description: 'Answer 5 checkpoints correctly in a row on the first try. You know that you know.',
    emoji: '🧠',
    check: p => (p.firstTryStreak || 0) >= 5
  },
  {
    id: 'lab-rat',
    title: 'Lab Rat',
    description: `Experiment in all ${ALL_LAB_IDS.length} interactive laboratories.`,
    emoji: '🧪',
    check: p => ALL_LAB_IDS.every(id => (p.labsUsed || []).includes(id))
  },
  {
    id: 'boss-slayer',
    title: 'Boss Slayer',
    description: 'Defeat your first Module Boss.',
    emoji: '⚔️',
    check: p => (p.bossesBeaten || []).length >= 1
  },
  {
    id: 'society-architect',
    title: 'Society Architect',
    description: 'Finish Chapter 1 — Agents, Architectures & Organizations.',
    emoji: '🏛️',
    check: (p, cs) => courseDone(p, cs.find(c => c.id === 'course-1'))
  },
  {
    id: 'sybil-hunter',
    title: 'Sybil Hunter',
    description: 'Finish Chapter 2 — Reputation, Voting & Normative Games.',
    emoji: '🛡️',
    check: (p, cs) => courseDone(p, cs.find(c => c.id === 'course-2'))
  },
  {
    id: 's5-sage',
    title: 'S5 Sage',
    description: 'Finish Chapter 3 — Modal Logic & Manipulation.',
    emoji: '🔮',
    check: (p, cs) => courseDone(p, cs.find(c => c.id === 'course-3'))
  },
  {
    id: 'hot-streak',
    title: 'Persistent Intention',
    description: 'Study 3 days in a row.',
    emoji: '🔥',
    check: p => (p.streak?.count || 0) >= 3
  },
  {
    id: 'annotator',
    title: 'Annotator',
    description: 'Write personal notes on 3 different lessons.',
    emoji: '📝',
    check: p => Object.values(p.notes || {}).filter(n => n && n.trim()).length >= 3
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Score 100% on a mock exam.',
    emoji: '🏆',
    check: p => p.examAttempts.some(a => a.scorePercent === 100)
  },
  {
    id: 'speedrunner',
    title: 'Speedrunner',
    description: 'Finish an Urgent Study sprint.',
    emoji: '⚡',
    check: p => (p.urgentSprintsCompleted || 0) >= 1
  },
  {
    id: 'full-network',
    title: 'The Full Society',
    description: 'Complete all three chapters. Every agent is coordinating.',
    emoji: '🌐',
    check: (p, cs) => cs.every(c => courseDone(p, c))
  }
];

// ---------------------------------------------------------------------------
// Toast bus — tiny pub/sub so any component can celebrate without prop drilling
// ---------------------------------------------------------------------------

export interface ToastMessage {
  id: number;
  title: string;
  body?: string;
  emoji?: string;
  tone?: 'xp' | 'level' | 'achievement' | 'info';
}

type ToastListener = (t: ToastMessage) => void;
const listeners = new Set<ToastListener>();
let toastSeq = 0;

export const pushToast = (t: Omit<ToastMessage, 'id'>) => {
  const msg = { ...t, id: ++toastSeq };
  listeners.forEach(l => l(msg));
};

export const subscribeToasts = (l: ToastListener) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
