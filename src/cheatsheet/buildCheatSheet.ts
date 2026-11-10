import { Lesson } from '../types';
import { glossaryData } from '../content/glossary';
import { formulasData } from '../content/formulas';
import { parseSlideRef } from '../content/decks';

/**
 * Builds a one-glance revision sheet for a lesson purely from existing course content
 * (summary, key points, glossary, formulas, checkpoints). No new text is authored here.
 */

export interface CheatSheet {
  tldr: string;
  keyPoints: string[];
  terms: { term: string; definition: string }[];
  formulas: { name: string; latex: string; note?: string }[];
  recall: { question: string; answer: string }[];
}

const MAX_TERMS = 5;
const MAX_RECALL = 3;

/** First sentence of a text, without breaking inside $math$ or on abbreviations like "e.g.". */
export const firstSentence = (text: string): string => {
  let inMath = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '$') inMath = !inMath;
    if (inMath || !'.!?'.includes(ch)) continue;
    if (!/^\s+[A-Z($]/.test(text.slice(i + 1, i + 3))) continue;
    if (/(e\.g\.|i\.e\.|vs\.|etc\.|al\.)$/i.test(text.slice(Math.max(0, i - 4), i + 1))) continue;
    return text.slice(0, i + 1).trim();
  }
  return text.trim();
};

const coversLesson = (ref: string | undefined, lesson: Lesson) => {
  const parsed = parseSlideRef(ref);
  return !!parsed && parsed.deck === lesson.deck && parsed.pages.some(p => lesson.sourcePages.includes(p));
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Names a glossary entry can be recognised by: "Bag-of-Words (BoW)" → ["Bag-of-Words", "BoW"]. */
const aliasesOf = (term: string): { text: string; caseSensitive: boolean }[] => {
  const m = term.match(/^(.*?)\s*\((.*?)\)\s*$/);
  const base = (m ? m[1] : term).trim();
  const out = [{ text: base, caseSensitive: false }];
  if (m && /^[A-Za-z0-9_-]{2,6}$/.test(m[2]) && /[A-Z]{2}/.test(m[2])) out.push({ text: m[2], caseSensitive: true });
  return out;
};

const mentions = (haystack: string, alias: { text: string; caseSensitive: boolean }) =>
  new RegExp(`(^|[^A-Za-z])${escapeRe(alias.text)}(?![A-Za-z])`, alias.caseSensitive ? '' : 'i').test(haystack);

export const buildCheatSheet = (lesson: Lesson): CheatSheet => {
  const haystack = [lesson.title, lesson.summary, ...lesson.understand.keyPoints].join(' \n ');

  const isRelated = (g: (typeof glossaryData)[number]) => g.relatedLessonId === lesson.id || coversLesson(g.sourceSlideRef, lesson);
  const related = glossaryData.filter(isRelated);
  const mentioned = glossaryData.filter(g => !isRelated(g) && aliasesOf(g.term).some(a => mentions(haystack, a)));
  const terms = [...related, ...mentioned]
    .slice(0, MAX_TERMS)
    .map(g => ({ term: g.term, definition: firstSentence(g.definition) }));

  const recall = lesson.checkpoints.slice(0, MAX_RECALL).map(cp => ({
    question: cp.question,
    answer: cp.correctAnswers.map(i => cp.options[i]).filter(Boolean).join(' · ')
  }));

  return {
    tldr: firstSentence(lesson.summary),
    keyPoints: lesson.understand.keyPoints,
    terms,
    formulas: [
      ...(lesson.formulas || []).map(f => ({ name: f.name, latex: f.latex, note: firstSentence(f.explanation) })),
      ...formulasData
        .filter(f => f.course === lesson.courseId && coversLesson(f.lectureSlide, lesson))
        .filter(f => !(lesson.formulas || []).some(lf => lf.latex === f.latex))
        .map(f => ({ name: f.name, latex: f.latex, note: firstSentence(f.explanation) }))
    ],
    recall
  };
};
