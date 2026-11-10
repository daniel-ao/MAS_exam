import { CourseId } from '../types';

/**
 * Every source deck of the course. Each lecture part is its own slide deck,
 * rendered to `public/slides/<key>/slide-NN.jpg`.
 */
export interface DeckInfo {
  num: number;
  key: string;
  /** Short label used on chips: "1.1", "2.3", "TD". */
  short: string;
  courseId: CourseId;
  title: string;
  pages: number;
}

export const DECKS: DeckInfo[] = [
  { num: 1, key: 'ch1p1', short: '1.1', courseId: 'course-1', title: 'Part 1.1 · Foundations, Taxonomy & Architectures', pages: 65 },
  { num: 2, key: 'ch1p2', short: '1.2', courseId: 'course-1', title: 'Part 1.2 · Organizations in MAS', pages: 12 },
  { num: 3, key: 'ch2p1', short: '2.1', courseId: 'course-2', title: 'Part 2.1 · Reputation Systems', pages: 13 },
  { num: 4, key: 'ch2p2', short: '2.2', courseId: 'course-2', title: 'Part 2.2 · Voting Systems', pages: 20 },
  { num: 5, key: 'ch2p3', short: '2.3', courseId: 'course-2', title: 'Part 2.3 · Normative Systems & Game Theory', pages: 20 },
  { num: 6, key: 'ch3p1', short: '3.1', courseId: 'course-3', title: 'Part 3.1 · Knowledge with Epistemic Logic', pages: 45 },
  { num: 7, key: 'ch3p2', short: '3.2', courseId: 'course-3', title: 'Part 3.2 · Beliefs with Doxastic Logic', pages: 13 },
  { num: 8, key: 'ch3p3', short: '3.3', courseId: 'course-3', title: 'Part 3.3 · Action Effects: PDL, DEL, STIT, BIAT', pages: 31 },
  { num: 9, key: 'ch3p4', short: '3.4', courseId: 'course-3', title: 'Part 3.4 · Manipulation with KBE Logic', pages: 18 },
  { num: 10, key: 'td1', short: 'TD', courseId: 'course-3', title: 'TD · Modal logics, neighborhoods & STIT', pages: 4 }
];

export const TOTAL_SLIDES = DECKS.reduce((s, d) => s + d.pages, 0);

export const getDeck = (num: number): DeckInfo => DECKS.find(d => d.num === num) || DECKS[0];

/** "Part 2.1" or "TD". */
export const deckLabel = (num: number): string => {
  const d = getDeck(num);
  return d.short === 'TD' ? 'TD' : `Part ${d.short}`;
};

export const slideImagePath = (num: number, page: number): string =>
  `${import.meta.env.BASE_URL}slides/${getDeck(num).key}/slide-${String(page).padStart(2, '0')}.jpg`;

/** Compact "Slides 7–10" / "Slide 7" label for a list of pages. */
export const pagesLabel = (pages: number[]): string => {
  if (pages.length === 0) return '';
  if (pages.length === 1) return `Slide ${pages[0]}`;
  const sorted = [...pages].sort((a, b) => a - b);
  const contiguous = sorted.every((p, i) => i === 0 || p === sorted[i - 1] + 1);
  return contiguous ? `Slides ${sorted[0]}–${sorted[sorted.length - 1]}` : `Slides ${sorted.join(', ')}`;
};

/**
 * Parse a human reference such as "Part 2.1, Slides 7–10", "Part 3.1, Slide 22" or "TD, Slide 3".
 * Returns the deck number and every page mentioned.
 */
export const parseSlideRef = (ref?: string): { deck: number; pages: number[] } | null => {
  if (!ref) return null;
  const m = ref.match(/(?:Part\s+(\d)\.(\d)|(TD))\s*,\s*Slides?\s+(.+)/i);
  if (!m) return null;
  const short = m[3] ? 'TD' : `${m[1]}.${m[2]}`;
  const deck = DECKS.find(d => d.short === short);
  if (!deck) return null;
  const pages: number[] = [];
  m[4].split(/[,;]/).forEach(part => {
    const r = part.trim().match(/^(\d+)\s*[–-]\s*(\d+)/);
    if (r) {
      for (let p = Number(r[1]); p <= Number(r[2]); p++) pages.push(p);
    } else {
      const n = parseInt(part.trim(), 10);
      if (!Number.isNaN(n)) pages.push(n);
    }
  });
  return { deck: deck.num, pages };
};
