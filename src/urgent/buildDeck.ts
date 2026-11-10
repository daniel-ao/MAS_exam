import { CheckpointQuestion, Course, CourseId, GlossaryItem, Lesson, UserProgress } from '../types';
import { formulasData, FormulaDetail } from '../content/formulas';
import { glossaryData } from '../content/glossary';
import { examQuestionsBank } from '../content/examQuestions';
import { parseSlideRef } from '../content/decks';

/**
 * Urgent Study deck — assembled entirely from existing course content:
 *   concept  ← lesson title / summary / key points
 *   formula  ← formulas.ts
 *   term     ← glossary.ts
 *   quiz     ← lesson checkpoints + exam question bank
 */

interface CardBase {
  id: string;
  courseId: CourseId;
  lessonId?: string;
  lessonTitle?: string;
  /** Deck + slide to open in the docked slide panel. */
  deck?: number;
  slide?: number;
}

export type UrgentCard =
  | (CardBase & { kind: 'concept'; lesson: Lesson })
  | (CardBase & { kind: 'formula'; formula: FormulaDetail })
  | (CardBase & { kind: 'term'; term: GlossaryItem })
  | (CardBase & { kind: 'quiz'; question: CheckpointQuestion });

export const CARD_SECONDS: Record<UrgentCard['kind'], number> = {
  concept: 40,
  formula: 30,
  term: 15,
  quiz: 40
};

/** Each lesson's concept card and its first quiz form the core pair; extras rank lower. */
const BASE_PRIORITY: Record<UrgentCard['kind'] | 'extraQuiz', number> = {
  concept: 3,
  quiz: 2.9,
  formula: 2.7,
  extraQuiz: 1.6,
  term: 1.3
};

/** Chapter number of a course ("course-2" → 2). */
export const chapterOf = (courseId: CourseId) => Number(courseId.slice(-1));

const parseSlide = (ref: string | undefined): { deck: number; slide: number } | null => {
  const p = parseSlideRef(ref);
  return p && p.pages.length > 0 ? { deck: p.deck, slide: p.pages[0] } : null;
};

/** Every card in the curriculum, in course → lesson order. */
export const buildFullDeck = (courses: Course[]): UrgentCard[] => {
  const cards: UrgentCard[] = [];
  const usedQuiz = new Set<string>();
  const usedFormula = new Set<string>();
  const usedTerm = new Set<string>();

  for (const course of courses) {
    const lessons = course.modules.flatMap(m => m.lessons);
    const lessonForSlide = (deck: number, slide: number) => lessons.find(l => l.deck === deck && l.sourcePages.includes(slide));

    for (const lesson of lessons) {
      const base = { courseId: course.id, lessonId: lesson.id, lessonTitle: lesson.title, deck: lesson.deck, slide: lesson.sourcePages[0] };
      cards.push({ ...base, id: `c:${lesson.id}`, kind: 'concept', lesson });

      formulasData
        .filter(f => f.course === course.id && !usedFormula.has(f.id))
        .filter(f => {
          const s = parseSlide(f.lectureSlide);
          return !!s && lessonForSlide(s.deck, s.slide)?.id === lesson.id;
        })
        .forEach(f => {
          usedFormula.add(f.id);
          cards.push({ ...base, id: `f:${f.id}`, kind: 'formula', formula: f, deck: parseSlide(f.lectureSlide)?.deck, slide: parseSlide(f.lectureSlide)?.slide });
        });

      glossaryData
        .filter(g => g.relatedLessonId === lesson.id && !usedTerm.has(g.term))
        .forEach(g => {
          usedTerm.add(g.term);
          cards.push({ ...base, id: `g:${g.term}`, kind: 'term', term: g });
        });

      const quizzes: CheckpointQuestion[] = [
        ...lesson.checkpoints,
        ...examQuestionsBank.filter(q => q.courseId === course.id && q.sourceSlide !== undefined && lessonForSlide(q.deck, q.sourceSlide)?.id === lesson.id)
      ];
      quizzes
        .filter(q => !usedQuiz.has(q.id))
        .forEach(q => {
          usedQuiz.add(q.id);
          cards.push({ ...base, id: `q:${q.id}`, kind: 'quiz', question: q, deck: 'deck' in q ? (q as { deck: number }).deck : base.deck, slide: q.sourceSlide ?? base.slide });
        });
    }

    // Course-level leftovers (formulas / exam questions that do not map onto a single lesson).
    formulasData
      .filter(f => f.course === course.id && !usedFormula.has(f.id))
      .forEach(f => {
        usedFormula.add(f.id);
        const s = parseSlide(f.lectureSlide);
        cards.push({ id: `f:${f.id}`, kind: 'formula', formula: f, courseId: course.id, deck: s?.deck, slide: s?.slide });
      });
    examQuestionsBank
      .filter(q => q.courseId === course.id && !usedQuiz.has(q.id))
      .forEach(q => {
        usedQuiz.add(q.id);
        cards.push({ id: `q:${q.id}`, kind: 'quiz', question: q, courseId: course.id, deck: q.deck, slide: q.sourceSlide });
      });
  }
  return cards;
};

const priorityOf = (card: UrgentCard, p: UserProgress, isExtraQuiz: boolean): number => {
  let score = isExtraQuiz ? BASE_PRIORITY.extraQuiz : BASE_PRIORITY[card.kind];
  if (card.lessonId) {
    if (!p.completedLessons.includes(card.lessonId)) score += 1;
    const conf = p.confidenceRatings[card.lessonId] || 0;
    if (conf > 0 && conf <= 2) score += 1;
    if (conf >= 4) score -= 1;
  }
  const stats = p.urgentCardStats?.[card.id];
  if (!stats) score += 0.4; // rotate unseen material into upcoming sprints
  if (stats) {
    if (stats.again > stats.good) score += 2;
    else if (stats.good > 0 && stats.again === 0) score -= 1.5;
  }
  if (card.kind === 'quiz') {
    const ans = p.checkpointAnswers[card.question.id];
    if (ans && !ans.isCorrect) score += 1.5;
    if (ans?.isCorrect) score -= 0.5;
  }
  return score;
};

/**
 * Pick the highest-value cards that fit into the time budget, then restore curriculum order
 * so the sprint reads like a condensed version of the course.
 */
export const buildSprintDeck = (
  courses: Course[],
  courseIds: CourseId[],
  minutes: number,
  progress: UserProgress,
  onlyWeak = false
): UrgentCard[] => {
  const full = buildFullDeck(courses.filter(c => courseIds.includes(c.id)));
  const pool = onlyWeak
    ? full.filter(c => {
        const s = progress.urgentCardStats?.[c.id];
        return s && s.again > 0 && s.again >= s.good;
      })
    : full;

  const budget = minutes * 60;
  const firstQuizOfLesson = new Set<string>();
  const seenLesson = new Set<string>();
  pool.forEach(c => {
    if (c.kind === 'quiz' && c.lessonId && !seenLesson.has(c.lessonId)) {
      seenLesson.add(c.lessonId);
      firstQuizOfLesson.add(c.id);
    }
  });

  type Ranked = { card: UrgentCard; order: number; score: number };
  type Unit = { cards: Ranked[]; courseId: CourseId; score: number; cost: number };
  const ranked: Ranked[] = pool.map((card, order) => ({
    card,
    order,
    score: priorityOf(card, progress, card.kind === 'quiz' && !firstQuizOfLesson.has(card.id)) + Math.random() * 0.3
  }));

  // Units: a lesson's concept card travels together with its first quiz (learn it → test it).
  const coreByLesson = new Map<string, Ranked[]>();
  const formulaUnits: Unit[] = [];
  const extraUnits: Unit[] = [];
  const single = (r: Ranked): Unit => ({ cards: [r], courseId: r.card.courseId, score: r.score, cost: CARD_SECONDS[r.card.kind] });
  ranked.forEach(r => {
    const isCore = r.card.kind === 'concept' || firstQuizOfLesson.has(r.card.id);
    if (isCore && r.card.lessonId) {
      coreByLesson.set(r.card.lessonId, [...(coreByLesson.get(r.card.lessonId) || []), r]);
    } else if (r.card.kind === 'formula') {
      formulaUnits.push(single(r));
    } else {
      extraUnits.push(single(r));
    }
  });
  const coreUnits: Unit[] = [...coreByLesson.values()].map(cards => ({
    cards,
    courseId: cards[0].card.courseId,
    score: Math.max(...cards.map(c => c.score)),
    cost: cards.reduce((a, c) => a + CARD_SECONDS[c.card.kind], 0)
  }));

  const picked: Ranked[] = [];
  let used = 0;

  // Fill the budget in phases (cumulative caps) so a sprint always mixes ideas, formulas and practice;
  // within a phase, take units round-robin across courses in priority order.
  const fill = (units: Unit[], cap: number) => {
    const queues = courseIds
      .map(cid => units.filter(u => u.courseId === cid).sort((a, b) => b.score - a.score))
      .filter(q => q.length > 0);
    let moved = true;
    while (moved) {
      moved = false;
      for (const q of queues) {
        const i = q.findIndex(u => used + u.cost <= budget * cap);
        if (i >= 0) {
          const [u] = q.splice(i, 1);
          picked.push(...u.cards);
          used += u.cost;
          units.splice(units.indexOf(u), 1);
          moved = true;
        }
      }
    }
  };
  fill(coreUnits, 0.6);
  fill(formulaUnits, 0.85);
  fill(extraUnits, 1);
  fill([...coreUnits, ...formulaUnits, ...extraUnits], 1);

  return picked.sort((a, b) => a.order - b.order).map(r => r.card);
};

export const estimateMinutes = (cards: UrgentCard[]) =>
  Math.round(cards.reduce((acc, c) => acc + CARD_SECONDS[c.kind], 0) / 60);
