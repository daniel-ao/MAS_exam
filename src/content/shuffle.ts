import { CheckpointQuestion, Course } from '../types';

/** Small deterministic PRNG (mulberry32) seeded from a string, so a question’s order is stable across visits. */
const seeded = (key: string) => {
  let h = 1779033703 ^ key.length;
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(h ^ key.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Shuffle a question’s options (Fisher–Yates, seeded by its id) and remap correctAnswers
 * and whyOptionsIncorrect, so the correct answer is not always in the same position.
 */
export const shuffleQuestion = <Q extends CheckpointQuestion>(q: Q): Q => {
  const rand = seeded(q.id);
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const newIndex = (old: number) => order.indexOf(old);
  return {
    ...q,
    options: order.map(i => q.options[i]),
    correctAnswers: q.correctAnswers.map(newIndex).sort((a, b) => a - b),
    whyOptionsIncorrect: q.whyOptionsIncorrect
      ? Object.fromEntries(Object.entries(q.whyOptionsIncorrect).map(([k, v]) => [newIndex(Number(k)), v]))
      : undefined
  };
};

/** Apply the shuffle to every checkpoint of a course. */
export const shuffleCourse = (course: Course): Course => ({
  ...course,
  modules: course.modules.map(m => ({
    ...m,
    lessons: m.lessons.map(l => ({ ...l, checkpoints: l.checkpoints.map(shuffleQuestion) }))
  }))
});
