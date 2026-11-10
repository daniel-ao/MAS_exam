import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Course, CourseId } from '../types';
import { toPlainText } from './RichText';
import { Search, X, BookOpen, Layers, ArrowRight } from 'lucide-react';
import { deckLabel, pagesLabel } from '../content/decks';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSelectResult: (courseId: CourseId, lessonId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  courses,
  onSelectResult
}) => {
  const [query, setQuery] = useState<string>('');
  const [highlight, setHighlight] = useState<number>(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Start every search fresh.
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setHighlight(0);
    }
  }, [isOpen]);

  // Lock page scroll behind the modal.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matches: Array<{
      courseId: CourseId;
      courseTitle: string;
      lessonId: string;
      lessonTitle: string;
      moduleTitle: string;
      snippet: string;
      sourcePages: number[];
      deck: number;
    }> = [];

    courses.forEach(course => {
      course.modules.forEach(mod => {
        mod.lessons.forEach(lesson => {
          const inTitle = lesson.title.toLowerCase().includes(q);
          const inSummary = lesson.summary.toLowerCase().includes(q);
          const inExplanation = lesson.understand.detailedExplanation.toLowerCase().includes(q);
          const inKeyPoints = lesson.understand.keyPoints.some(p => p.toLowerCase().includes(q));

          if (inTitle || inSummary || inExplanation || inKeyPoints) {
            let snippet = toPlainText(lesson.summary);
            if (inExplanation) {
              const idx = lesson.understand.detailedExplanation.toLowerCase().indexOf(q);
              const start = Math.max(0, idx - 40);
              const end = Math.min(lesson.understand.detailedExplanation.length, idx + 100);
              snippet = '...' + toPlainText(lesson.understand.detailedExplanation.slice(start, end)) + '...';
            }

            matches.push({
              courseId: course.id,
              courseTitle: course.title,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              moduleTitle: mod.title,
              snippet,
              sourcePages: lesson.sourcePages,
              deck: lesson.deck
            });
          }
        });
      });
    });

    return matches;
  }, [query, courses]);

  useEffect(() => setHighlight(0), [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${highlight}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlight]);

  if (!isOpen) return null;

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight(h => Math.min(searchResults.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(h => Math.max(0, h - 1));
    } else if (e.key === 'Enter' && searchResults[highlight]) {
      e.preventDefault();
      const res = searchResults[highlight];
      onSelectResult(res.courseId, res.lessonId);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-stone-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-100"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-label="Search the syllabus" className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Box */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3 bg-stone-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKey}
            autoFocus
            className="w-full bg-transparent text-sm font-sans focus:outline-none text-slate-800 placeholder-slate-400"
            placeholder="Search all lessons (e.g. 'Sybil', 'Borda', 'Nash', 'Euclidean', 'BIAT')..."
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono text-slate-500 bg-white border border-stone-300 rounded hover:bg-stone-100"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 divide-y divide-stone-100">
          {searchResults.length > 0 ? (
            searchResults.map((res, i) => (
              <div
                key={res.lessonId}
                data-idx={i}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => {
                  onSelectResult(res.courseId, res.lessonId);
                  onClose();
                }}
                className={`p-3 rounded-xl cursor-pointer transition-colors group ${i === highlight ? 'bg-teal-50/80' : 'hover:bg-teal-50/60'}`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-semibold text-teal-800">{res.courseTitle.split(':')[0]}</span>
                  <span className="font-mono">{deckLabel(res.deck)} · {pagesLabel(res.sourcePages)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                    {res.lessonTitle}
                  </h4>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-700 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {res.snippet}
                </p>
              </div>
            ))
          ) : query.trim() ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching lessons or formulas found for "{query}".
            </div>
          ) : (
            <div className="p-8 text-center space-y-2 text-xs text-slate-500">
              <BookOpen className="w-6 h-6 text-slate-300 mx-auto" />
              <p>Type keywords to search all lectures, equations, worked examples, and definitions.</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[11px]">
                <span className="text-slate-400">Popular:</span>
                {['BDI', 'Sybil', 'Borda', 'Nash', 'Euclidean', 'KD45', 'STIT', 'neighborhood'].map(k => (
                  <button
                    key={k}
                    onClick={() => setQuery(k)}
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded border border-stone-200"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

