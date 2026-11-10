import React, { useMemo, useState } from 'react';
import { Course, CourseId } from '../types';
import { CheatSheetCard } from './CheatSheetCard';
import { Printer, ScrollText, Search } from 'lucide-react';

interface CheatSheetsViewProps {
  courses: Course[];
  initialCourseId: CourseId;
  completedLessons: string[];
  onNavigateToLesson: (lessonId: string) => void;
  onOpenSlide: (deck: number, page: number) => void;
}

export const CheatSheetsView: React.FC<CheatSheetsViewProps> = ({
  courses,
  initialCourseId,
  completedLessons,
  onNavigateToLesson,
  onOpenSlide
}) => {
  const [courseId, setCourseId] = useState<CourseId>(initialCourseId);
  const [query, setQuery] = useState('');
  const course = courses.find(c => c.id === courseId) || courses[0];

  const modules = useMemo(() => {
    const q = query.trim().toLowerCase();
    return course.modules
      .map(m => ({
        ...m,
        lessons: q
          ? m.lessons.filter(l =>
              [l.title, l.summary, ...l.understand.keyPoints].join(' ').toLowerCase().includes(q)
            )
          : m.lessons
      }))
      .filter(m => m.lessons.length > 0);
  }, [course, query]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-teal-700" /> Cheat Sheets
          </h1>
          <p className="text-sm text-slate-600">
            One card per lesson: the one-line idea, what to remember, key terms, formulas and quick recall questions.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-700"
          title="Print or save this course's cheat sheets as PDF (answers included)"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 print:hidden">
        {courses.map(c => (
          <button
            key={c.id}
            onClick={() => setCourseId(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              c.id === courseId
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-white text-slate-600 border-stone-300 hover:border-teal-400'
            }`}
          >
            Course {c.id.slice(-1)}
          </button>
        ))}
        <label className="relative flex-1 min-w-[180px] sm:max-w-xs sm:ml-auto">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filter lessons…"
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-teal-500"
          />
        </label>
      </div>

      <div id="cheatsheet-print" className="space-y-8">
        <h2 className="hidden print:block text-xl font-bold">{course.title}: Cheat Sheets</h2>
        {modules.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-12">No lesson matches “{query}”.</p>
        )}
        {modules.map(m => (
          <section key={m.id} className="space-y-3">
            <div className="flex items-baseline justify-between gap-3 border-b border-stone-200 pb-1.5">
              <h2 className="font-bold text-slate-800">{m.title}</h2>
              <span className="text-[11px] text-slate-400 shrink-0">{m.sourcePagesRange}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 items-start">
              {m.lessons.map(l => (
                <CheatSheetCard
                  key={l.id}
                  lesson={l}
                  eyebrow={completedLessons.includes(l.id) ? '✓ Mastered' : undefined}
                  onOpenLesson={() => onNavigateToLesson(l.id)}
                  onOpenSlide={page => onOpenSlide(l.deck, page)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default CheatSheetsView;
