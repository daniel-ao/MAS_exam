import React, { useEffect, useRef, useState } from 'react';
import { AppView, CourseId } from '../types';
import { getLevel } from '../gamification/xp';
import {
  GraduationCap,
  Search,
  BookOpen,
  Calculator,
  FileCheck2,
  Image as ImageIcon,
  Download,
  Upload,
  RotateCcw,
  Menu,
  Sparkles,
  GitCompare,
  Zap,
  Flame,
  Orbit,
  MoreHorizontal,
  ScrollText,
  FileText
} from 'lucide-react';
import { TOTAL_SLIDES } from '../content/decks';

interface NavbarProps {
  activeCourseId: CourseId;
  onSelectCourse: (id: CourseId) => void;
  activeView: AppView;
  onChangeView: (view: AppView) => void;
  onOpenSearch: () => void;
  onToggleSlideDrawer: () => void;
  isSlideDrawerOpen: boolean;
  totalCompletedCount: number;
  totalLessonsCount: number;
  xp: number;
  streak: number;
  onExportProgress: () => void;
  onImportProgress: (json: string) => boolean;
  onResetProgress: () => void;
  onToggleSidebar: () => void;
}

const COURSE_TABS: { id: CourseId; label: string; short: string }[] = [
  { id: 'course-1', label: '1. Agents & Organizations', short: '1. Agents' },
  { id: 'course-2', label: '2. Reputation, Voting & Games', short: '2. Mechanisms' },
  { id: 'course-3', label: '3. Modal Logic & Manipulation', short: '3. Modal Logic' }
];

const TOOL_VIEWS: { view: AppView; label: string; icon: React.ElementType; active: string }[] = [
  { view: 'examsheet', label: 'Exam Sheet', icon: FileText, active: 'bg-slate-900 text-white border-slate-900' },
  { view: 'cheatsheets', label: 'Cheat Sheets', icon: ScrollText, active: 'bg-emerald-700 text-white border-emerald-700' },
  { view: 'formulas', label: 'Formulas', icon: Calculator, active: 'bg-purple-700 text-white border-purple-700' },
  { view: 'glossary', label: 'Glossary', icon: BookOpen, active: 'bg-blue-700 text-white border-blue-700' },
  { view: 'comparisons', label: 'Comparisons', icon: GitCompare, active: 'bg-amber-700 text-white border-amber-700' },
  { view: 'traceability', label: `${TOTAL_SLIDES}-Slide Matrix`, icon: FileCheck2, active: 'bg-teal-700 text-white border-teal-700' }
];

export const Navbar: React.FC<NavbarProps> = ({
  activeCourseId,
  onSelectCourse,
  activeView,
  onChangeView,
  onOpenSearch,
  onToggleSlideDrawer,
  isSlideDrawerOpen,
  totalCompletedCount,
  totalLessonsCount,
  xp,
  streak,
  onExportProgress,
  onImportProgress,
  onResetProgress,
  onToggleSidebar
}) => {
  const [showProgressMenu, setShowProgressMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!showProgressMenu) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowProgressMenu(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowProgressMenu(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [showProgressMenu]);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const ok = onImportProgress(text);
          alert(ok ? 'Progress imported successfully!' : 'Invalid progress JSON file.');
        }
        setShowProgressMenu(false);
      };
      reader.readAsText(file);
    }
    // Allow re-importing the same file later.
    input.value = '';
  };

  const handleConfirmReset = () => {
    if (window.confirm('Are you sure you want to reset all lesson progress, checkpoints, notes, XP and achievements? This action cannot be undone.')) {
      onResetProgress();
      setShowProgressMenu(false);
    }
  };

  const overallPct = Math.round((totalCompletedCount / (totalLessonsCount || 1)) * 100);
  const level = getLevel(xp);
  const toggleView = (view: AppView) => onChangeView(activeView === view ? 'lessons' : view);

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200">
      <div className="px-3 sm:px-5 h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Branding & Course Title */}
        <div className="flex items-center gap-2 min-w-0">
          {activeView === 'lessons' && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-stone-200 lg:hidden"
              title="Toggle curriculum"
              aria-label="Toggle curriculum"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => onChangeView('lessons')}
            className="flex items-center gap-2 select-none text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white hidden sm:flex items-center justify-center shadow-xs shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm tracking-tight whitespace-nowrap">Multi-Agent Systems</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">M2 IA</span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans hidden 2xl:block">Exam Preparation & Interactive Course</p>
            </div>
          </button>
        </div>

        {/* Center: Course Selector */}
        <div className="hidden lg:flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold shrink-0">
          {COURSE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onSelectCourse(tab.id)}
              className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeCourseId === tab.id && activeView === 'lessons'
                  ? 'bg-white text-teal-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="hidden 2xl:inline">{tab.label}</span>
              <span className="2xl:hidden">{tab.short}</span>
            </button>
          ))}
        </div>
        <select
          value={activeCourseId}
          onChange={e => onSelectCourse(e.target.value as CourseId)}
          className="lg:hidden min-w-0 max-w-[9rem] sm:max-w-none text-xs font-semibold bg-stone-100 border border-stone-200 rounded-lg px-2 py-1.5 text-slate-700"
          aria-label="Select course"
        >
          {COURSE_TABS.map(tab => (
            <option key={tab.id} value={tab.id}>{tab.short}</option>
          ))}
        </select>

        {/* Right: Study Tools & Views */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 p-1.5 sm:px-2.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-stone-300 hover:border-stone-400 rounded-xl transition-all shadow-2xs"
            title="Search entire syllabus (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <kbd className="hidden xl:inline text-[10px] font-mono bg-stone-100 text-slate-500 px-1 py-0.2 rounded border">⌘K</kbd>
          </button>

          {/* Urgent Study */}
          <button
            onClick={() => toggleView('urgent')}
            className={`flex items-center gap-1 p-1.5 sm:px-2.5 text-xs font-bold rounded-xl transition-all shadow-xs border ${
              activeView === 'urgent'
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-gradient-to-r from-orange-50 to-rose-50 hover:from-orange-100 hover:to-rose-100 text-orange-800 border-orange-300'
            }`}
            title="Urgent Study — condensed interactive revision before the exam"
          >
            <Zap className={`w-3.5 h-3.5 ${activeView === 'urgent' ? 'fill-white' : 'fill-orange-400'}`} />
            <span className="hidden sm:inline">Urgent</span>
          </button>

          {/* Exam Mode */}
          <button
            onClick={() => toggleView('exam')}
            className={`flex items-center gap-1 p-1.5 sm:px-2.5 text-xs font-bold rounded-xl transition-all shadow-xs ${
              activeView === 'exam'
                ? 'bg-rose-700 text-white'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
            }`}
            title="Mock exam"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exam</span>
          </button>

          {/* Journey / Level chip */}
          <button
            onClick={() => toggleView('journey')}
            className={`flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl border transition-all ${
              activeView === 'journey'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white hover:bg-indigo-50 text-slate-800 border-indigo-200'
            }`}
            title={`Your Journey — Level ${level.index + 1}: ${level.name} (${xp} XP)`}
          >
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black ${
              activeView === 'journey' ? 'bg-white text-slate-900' : 'bg-indigo-600 text-white'
            }`}>
              {level.index + 1}
            </span>
            <span className="hidden md:flex flex-col items-start leading-none gap-1">
              <span className="text-[10px] font-bold whitespace-nowrap">{level.name}</span>
              <span className={`w-16 h-1 rounded-full overflow-hidden ${activeView === 'journey' ? 'bg-white/20' : 'bg-indigo-100'}`}>
                <span className="block h-full bg-gradient-to-r from-indigo-500 to-teal-500" style={{ width: `${level.progressPct}%` }} />
              </span>
            </span>
            {streak > 0 && (
              <span className="flex items-center text-[11px] font-bold text-orange-500" title={`${streak}-day study streak`}>
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                {streak}
              </span>
            )}
            <Orbit className="w-3.5 h-3.5 hidden 2xl:block opacity-60" />
          </button>

          {/* Secondary tools (inline on desktop, inside the menu on mobile) */}
          <div className="hidden md:flex items-center gap-1">
            {TOOL_VIEWS.map(t => (
              <button
                key={t.view}
                onClick={() => toggleView(t.view)}
                className={`flex items-center gap-1 p-1.5 2xl:px-2.5 text-xs font-semibold rounded-xl transition-all border ${
                  activeView === t.view ? t.active : 'bg-white hover:bg-stone-100 text-slate-700 border-stone-300'
                }`}
                title={t.label}
              >
                <t.icon className="w-3.5 h-3.5" />
                <span className="hidden 2xl:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Slide Drawer Toggle */}
          <button
            onClick={onToggleSlideDrawer}
            className={`p-1.5 xl:px-2.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1 ${
              isSlideDrawerOpen
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200'
            }`}
            title={isSlideDrawerOpen ? 'Close slide panel' : 'Open slide panel'}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Slides</span>
          </button>

          {/* Progress Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowProgressMenu(prev => !prev)}
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-mono font-bold bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl transition-all"
              title="Progress & Options"
              aria-haspopup="menu"
              aria-expanded={showProgressMenu}
            >
              <span className="hidden sm:inline">{overallPct}%</span>
              <MoreHorizontal className="w-3.5 h-3.5 sm:hidden" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 hidden sm:inline-block"></span>
            </button>

            {showProgressMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white border border-stone-200 rounded-xl shadow-xl p-2 z-50 text-xs space-y-1 animate-in fade-in" role="menu">
                <div className="px-3 py-2 border-b border-stone-100">
                  <div className="font-bold text-slate-800">Mastery Progress</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {totalCompletedCount} of {totalLessonsCount} lessons mastered ({overallPct}%)
                  </div>
                  <div className="text-[11px] text-indigo-700 font-mono mt-0.5">
                    {xp} XP · Lv {level.index + 1} {level.name}
                  </div>
                </div>

                <div className="md:hidden border-b border-stone-100 pb-1 mb-1">
                  {TOOL_VIEWS.map(t => (
                    <button
                      key={t.view}
                      onClick={() => { onChangeView(t.view); setShowProgressMenu(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-stone-50 rounded-lg flex items-center gap-2 text-slate-700"
                    >
                      <t.icon className="w-3.5 h-3.5" /> {t.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => { onExportProgress(); setShowProgressMenu(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-stone-50 rounded-lg flex items-center gap-2 text-slate-700"
                >
                  <Download className="w-3.5 h-3.5" /> Export Progress (JSON)
                </button>

                <label className="w-full text-left px-3 py-1.5 hover:bg-stone-50 rounded-lg flex items-center gap-2 text-slate-700 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" /> Import Progress
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleConfirmReset}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-700 rounded-lg flex items-center gap-2 font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset All Progress
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
