import React from 'react';
import { Course, Lesson } from '../types';
import { CheckCircle2, Circle, ChevronDown, ChevronRight, BookOpen, Layers } from 'lucide-react';
import { deckLabel, pagesLabel } from '../content/decks';

interface SidebarProps {
  course: Course;
  activeLessonId: string;
  completedLessons: string[];
  bossesBeaten?: string[];
  onSelectLesson: (lessonId: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  course,
  activeLessonId,
  completedLessons,
  bossesBeaten = [],
  onSelectLesson,
  isOpen,
  onToggleOpen
}) => {
  const [openModules, setOpenModules] = React.useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    course.modules.forEach(m => { map[m.id] = true; });
    return map;
  });

  // Keep the module containing the active lesson expanded when navigating (e.g. via search or Next).
  React.useEffect(() => {
    const mod = course.modules.find(m => m.lessons.some(l => l.id === activeLessonId));
    if (mod) setOpenModules(prev => (prev[mod.id] === false ? { ...prev, [mod.id]: true } : prev));
  }, [activeLessonId, course]);

  // Scroll the active lesson into view inside the sidebar.
  const activeRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeLessonId, isOpen]);

  const toggleModule = (modId: string) => {
    setOpenModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedInCourse = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter(l => completedLessons.includes(l.id)).length,
    0
  );
  const progressPct = Math.round((completedInCourse / (totalLessons || 1)) * 100);

  if (!isOpen) {
    return (
      <div className="hidden lg:flex flex-col items-center py-4 px-2 border-r border-stone-200 bg-stone-50/80 w-14 shrink-0 h-[calc(100vh-64px)] sticky top-16">
        <button
          onClick={onToggleOpen}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-stone-200 rounded-lg transition-all"
          title="Expand Curriculum Navigation"
        >
          <Layers className="w-5 h-5" />
        </button>
        <div className="mt-8 transform -rotate-90 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
          {course.title.split(' ')[0]}
        </div>
      </div>
    );
  }

  return (
    <>
    {/* Mobile / tablet: the sidebar floats over the content with a scrim. */}
    <div className="lg:hidden fixed inset-0 top-16 z-30 bg-slate-900/30" onClick={onToggleOpen} aria-hidden />
    <aside className="w-80 max-w-[85vw] shrink-0 border-r border-stone-200 bg-stone-50 lg:bg-stone-50/60 h-[calc(100vh-64px)] fixed lg:sticky left-0 top-16 z-30 lg:z-auto overflow-y-auto flex flex-col justify-between shadow-xl lg:shadow-none">
      <div className="p-4 space-y-4">
        {/* Course Header */}
        <div className="pb-3 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {course.code.split(' ')[0]}
            </span>
            <span className="text-xs font-mono font-bold text-slate-600">
              {completedInCourse}/{totalLessons} ({progressPct}%)
            </span>
          </div>
          <h2 className="text-sm font-bold text-slate-800 mt-1 leading-snug">{course.title}</h2>
          
          {/* Progress bar */}
          <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Modules Accordion */}
        <div className="space-y-3">
          {course.modules.map((mod) => {
            const isModOpen = openModules[mod.id] ?? true;
            const modLessonsCount = mod.lessons.length;
            const modCompleted = mod.lessons.filter(l => completedLessons.includes(l.id)).length;

            return (
              <div key={mod.id} className="rounded-xl border border-stone-200 bg-white shadow-2xs overflow-hidden">
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full text-left px-3 py-2.5 bg-stone-50/80 hover:bg-stone-100/80 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5 flex-1 pr-2">
                    {isModOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">{mod.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-normal shrink-0 flex items-center gap-1">
                    {bossesBeaten.includes(mod.id) && <span title="Module Boss defeated">⚔️</span>}
                    {modCompleted === modLessonsCount && modLessonsCount > 0 ? (
                      <span className="text-emerald-600 font-bold">✓</span>
                    ) : (
                      <>{modCompleted}/{modLessonsCount}</>
                    )}
                  </span>
                </button>

                {isModOpen && (
                  <div className="divide-y divide-stone-100">
                    {mod.lessons.map((les) => {
                      const isActive = les.id === activeLessonId;
                      const isDone = completedLessons.includes(les.id);

                      return (
                        <button
                          key={les.id}
                          ref={isActive ? activeRef : undefined}
                          onClick={() => onSelectLesson(les.id)}
                          className={`w-full text-left px-3 py-2 flex items-start gap-2.5 text-xs transition-colors ${
                            isActive
                              ? 'bg-teal-50/70 text-teal-900 font-bold border-l-3 border-teal-600 pl-[9px]'
                              : 'text-slate-600 hover:bg-stone-50 hover:text-slate-900'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50" />
                            ) : (
                              <Circle className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-stone-300'}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="truncate block leading-tight">{les.title}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {deckLabel(les.deck)} · {pagesLabel(les.sourcePages)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-stone-200 text-center">
        <button
          onClick={onToggleOpen}
          className="text-xs text-slate-500 hover:text-slate-800 font-medium"
        >
          Collapse Sidebar ◂
        </button>
      </div>
    </aside>
    </>
  );
};

