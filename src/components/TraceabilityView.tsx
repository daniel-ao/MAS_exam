import React, { useMemo, useState } from 'react';
import { Course, ManifestEntry } from '../types';
import { DECKS, TOTAL_SLIDES, deckLabel, slideImagePath } from '../content/decks';
import { SLIDE_TITLES } from '../content/slideTitles';
import { CheckCircle2, Search, ExternalLink, ArrowRight, ShieldCheck, LayoutGrid, Table, AlertTriangle } from 'lucide-react';

interface TraceabilityViewProps {
  courses: Course[];
  onNavigateToLesson: (lessonId: string) => void;
  onOpenSlide: (deck: number, page: number) => void;
}

/** One row per slide of every deck, mapped to the lesson whose sourcePages include it. */
export const buildManifest = (courses: Course[]): ManifestEntry[] => {
  const lessons = courses.flatMap(c => c.modules.flatMap(m => m.lessons));
  const entries: ManifestEntry[] = [];
  DECKS.forEach(d => {
    for (let page = 1; page <= d.pages; page++) {
      const lesson = lessons.find(l => l.deck === d.num && l.sourcePages.includes(page));
      entries.push({
        course: d.courseId,
        deck: d.num,
        page,
        title: SLIDE_TITLES[d.key]?.[page - 1] || `Slide ${page}`,
        destination_module: lesson?.moduleId || '',
        destination_lesson: lesson?.id || ''
      });
    }
  });
  return entries;
};

export const TraceabilityView: React.FC<TraceabilityViewProps> = ({ courses, onNavigateToLesson, onOpenSlide }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeck, setSelectedDeck] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const manifest = useMemo(() => buildManifest(courses), [courses]);
  const lessonTitle = useMemo(() => {
    const map = new Map<string, string>();
    courses.forEach(c => c.modules.forEach(m => m.lessons.forEach(l => map.set(l.id, l.title))));
    return map;
  }, [courses]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return manifest.filter(e => {
      if (selectedDeck !== 'all' && e.deck !== selectedDeck) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        (lessonTitle.get(e.destination_lesson) || '').toLowerCase().includes(q) ||
        deckLabel(e.deck).toLowerCase().includes(q) ||
        String(e.page) === q
      );
    });
  }, [manifest, searchQuery, selectedDeck, lessonTitle]);

  const covered = manifest.filter(e => e.destination_lesson).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-teal-700 text-sm font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" /> Curriculum audit
        </div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">{TOTAL_SLIDES}-Slide Traceability Matrix</h1>
        <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Every slide of the nine lecture parts and the TD is mapped to the lesson that teaches it. Click a thumbnail to open the
          slide beside you, or jump straight to the lesson.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total coverage</div>
          <div className="text-2xl font-bold font-serif text-teal-700 mt-1">
            {covered} / {TOTAL_SLIDES}
          </div>
          <div className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${covered === TOTAL_SLIDES ? 'text-emerald-600' : 'text-amber-600'}`}>
            {covered === TOTAL_SLIDES ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {Math.round((covered / TOTAL_SLIDES) * 100)}% mapped
          </div>
        </div>
        {courses.map((c, i) => {
          const decks = DECKS.filter(d => d.courseId === c.id);
          const total = decks.reduce((s, d) => s + d.pages, 0);
          const done = manifest.filter(e => e.course === c.id && e.destination_lesson).length;
          const tone = ['text-blue-700', 'text-emerald-700', 'text-amber-700'][i];
          return (
            <div key={c.id} className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Chapter {i + 1}</div>
              <div className={`text-2xl font-bold font-serif mt-1 ${tone}`}>
                {done} / {total}
              </div>
              <div className="text-[11px] text-stone-500 mt-1 truncate">{decks.map(d => d.short).join(' · ')}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by slide title, slide number or lesson..."
              className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-slate-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm"
            />
          </div>
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-stone-600'}`}
            >
              <Table className="w-4 h-4" /> <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-stone-600'}`}
            >
              <LayoutGrid className="w-4 h-4" /> <span className="hidden sm:inline">Slide grid</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-500 mr-1">Part:</span>
          <button
            onClick={() => setSelectedDeck('all')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium ${selectedDeck === 'all' ? 'bg-teal-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
          >
            All ({TOTAL_SLIDES})
          </button>
          {DECKS.map(d => (
            <button
              key={d.num}
              onClick={() => setSelectedDeck(d.num)}
              title={d.title}
              className={`text-xs px-3 py-1.5 rounded-full font-medium ${selectedDeck === d.num ? 'bg-teal-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
            >
              {d.short} ({d.pages})
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-3 py-2 text-left w-28">Slide</th>
                <th className="px-3 py-2 text-left w-24">Source</th>
                <th className="px-3 py-2 text-left">Slide title</th>
                <th className="px-3 py-2 text-left">Taught in lesson</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(e => (
                <tr key={`${e.deck}-${e.page}`} className="hover:bg-stone-50/80">
                  <td className="px-3 py-2">
                    <button onClick={() => onOpenSlide(e.deck, e.page)} className="block w-24 rounded border border-stone-200 overflow-hidden hover:ring-2 hover:ring-teal-500">
                      <img src={slideImagePath(e.deck, e.page)} alt={`Slide ${e.page}`} loading="lazy" className="w-full aspect-video object-cover" />
                    </button>
                  </td>
                  <td className="px-3 py-2 text-xs font-mono text-slate-500 whitespace-nowrap">
                    {deckLabel(e.deck)}
                    <br />
                    Slide {e.page}
                  </td>
                  <td className="px-3 py-2 text-slate-800 font-medium">{e.title}</td>
                  <td className="px-3 py-2">
                    {e.destination_lesson ? (
                      <button onClick={() => onNavigateToLesson(e.destination_lesson)} className="text-left text-xs text-teal-800 hover:text-teal-950 font-semibold inline-flex items-start gap-1">
                        <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {lessonTitle.get(e.destination_lesson)}
                      </button>
                    ) : (
                      <span className="text-xs text-amber-700 font-semibold">Not mapped</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(e => (
            <div key={`${e.deck}-${e.page}`} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <button onClick={() => onOpenSlide(e.deck, e.page)} className="relative block group">
                <img src={slideImagePath(e.deck, e.page)} alt={e.title} loading="lazy" className="w-full aspect-video object-cover" />
                <span className="absolute top-1.5 left-1.5 text-[10px] font-mono font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">
                  {deckLabel(e.deck)} · {e.page}
                </span>
                <span className="absolute inset-0 bg-teal-900/0 group-hover:bg-teal-900/10 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
                </span>
              </button>
              <div className="p-3 flex-1 flex flex-col gap-2">
                <div className="text-xs font-semibold text-slate-800 leading-snug">{e.title}</div>
                {e.destination_lesson && (
                  <button onClick={() => onNavigateToLesson(e.destination_lesson)} className="mt-auto text-left text-[11px] text-teal-800 hover:text-teal-950 font-semibold">
                    → {lessonTitle.get(e.destination_lesson)}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
