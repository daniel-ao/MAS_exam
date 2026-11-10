import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AppView, CourseId, Course } from './types';
import { course1Data } from './content/course1';
import { course2Data } from './content/course2';
import { course3Data } from './content/course3';
import { useProgress } from './progress/useProgress';
import { ACHIEVEMENTS, getLevel, liveStreak, pushToast } from './gamification/xp';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LessonView } from './components/LessonView';
import { SlideViewerDrawer, clampPanelWidth } from './components/SlideViewerDrawer';
import { SearchModal } from './components/SearchModal';
import { GlossaryView } from './components/GlossaryView';
import { FormulaSheetView } from './components/FormulaSheetView';
import { ComparisonMatrixView } from './components/ComparisonMatrixView';
import { TraceabilityView } from './components/TraceabilityView';
import { ExamModeView } from './components/ExamModeView';
import { JourneyView } from './components/JourneyView';
import { UrgentStudyView } from './components/UrgentStudyView';
import { CheatSheetsView } from './components/CheatSheetsView';
import { ExamSheetView } from './components/ExamSheetView';
import { Toasts } from './components/Toasts';

const COURSES: Course[] = [course1Data, course2Data, course3Data];
const ALL_LESSONS = COURSES.flatMap(c => c.modules.flatMap(m => m.lessons));
const PANEL_WIDTH_KEY = 'mas_exam_slide_panel_width';
const DESKTOP_QUERY = '(min-width: 1024px)';

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = () => setMatches(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [query]);
  return matches;
};

const courseOfLesson = (lessonId: string): CourseId =>
  ALL_LESSONS.find(l => l.id === lessonId)?.courseId || 'course-1';

export const App: React.FC = () => {
  // Navigation & View state
  const [activeCourseId, setActiveCourseId] = useState<CourseId>('course-1');
  const [activeLessonId, setActiveLessonId] = useState<string>(course1Data.modules[0].lessons[0].id);
  const [activeView, setActiveView] = useState<AppView>('lessons');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => window.matchMedia(DESKTOP_QUERY).matches);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  // Slide panel state
  const [slideDrawerState, setSlideDrawerState] = useState<{
    isOpen: boolean;
    deck: number;
    initialPage: number;
    nonce: number;
  }>({
    isOpen: false,
    deck: 1,
    initialPage: 1,
    nonce: 0
  });
  const [panelWidth, setPanelWidth] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem(PANEL_WIDTH_KEY));
      if (saved > 0) return clampPanelWidth(saved);
    } catch {
      /* ignore */
    }
    return clampPanelWidth(window.innerWidth * 0.42);
  });
  const sidebarAutoCollapsed = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(PANEL_WIDTH_KEY, String(panelWidth));
    } catch {
      /* ignore */
    }
  }, [panelWidth]);

  useEffect(() => {
    const onResize = () => setPanelWidth(w => clampPanelWidth(w));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // User progress from local storage
  const {
    progress,
    toggleLessonCompleted,
    markLessonVisited,
    toggleBookmark,
    saveNote,
    setConfidence,
    submitCheckpoint,
    markLabUsed,
    markBossBeaten,
    recordExamAttempt,
    recordUrgentCard,
    finishUrgentSprint,
    unlockAchievements,
    resetProgress,
    exportProgressJson,
    importProgressJson
  } = useProgress();

  // ------------------------------------------------------------------ rewards feedback
  const prevXp = useRef<number>(progress.xp || 0);
  useEffect(() => {
    const xp = progress.xp || 0;
    const delta = xp - prevXp.current;
    const before = getLevel(prevXp.current);
    prevXp.current = xp;
    if (delta <= 0) return;
    const after = getLevel(xp);
    if (after.index > before.index) {
      pushToast({ tone: 'level', emoji: '🚀', title: `Level ${after.index + 1}: ${after.name}`, body: 'Your agent just grew smarter. Keep going!' });
      confetti({ particleCount: 140, spread: 100, origin: { y: 0.4 } });
    } else {
      pushToast({ tone: 'xp', emoji: '⭐', title: `+${delta} XP`, body: `${after.nextXp !== null ? after.nextXp - xp : 0} XP to ${after.nextXp !== null ? 'next level' : 'max'}` });
    }
  }, [progress.xp]);

  const announced = useRef<Set<string>>(new Set(progress.achievements || []));
  useEffect(() => {
    const fresh = ACHIEVEMENTS.filter(a => !announced.current.has(a.id) && a.check(progress, COURSES));
    if (fresh.length === 0) return;
    fresh.forEach(a => {
      announced.current.add(a.id);
      pushToast({ tone: 'achievement', emoji: a.emoji, title: `Achievement unlocked: ${a.title}`, body: a.description });
    });
    unlockAchievements(fresh.map(a => a.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // ------------------------------------------------------------------ lookups
  const currentCourse = useMemo(() => {
    return COURSES.find(c => c.id === activeCourseId) || course1Data;
  }, [activeCourseId]);

  const currentLesson = useMemo(() => {
    return ALL_LESSONS.find(l => l.id === activeLessonId) || ALL_LESSONS[0];
  }, [activeLessonId]);

  useEffect(() => {
    if (activeView === 'lessons') markLessonVisited(currentLesson.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, currentLesson.id]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ------------------------------------------------------------------ navigation
  const changeView = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (courseId: CourseId) => {
    setActiveCourseId(courseId);
    const targetCourse = COURSES.find(c => c.id === courseId) || course1Data;
    if (targetCourse.modules.length > 0 && targetCourse.modules[0].lessons.length > 0) {
      setActiveLessonId(targetCourse.modules[0].lessons[0].id);
    }
    changeView('lessons');
  };

  const handleSelectLesson = (lessonId: string) => {
    setActiveCourseId(courseOfLesson(lessonId));
    setActiveLessonId(lessonId);
    changeView('lessons');
    if (!window.matchMedia(DESKTOP_QUERY).matches) setIsSidebarOpen(false);
  };

  // Previous / Next walk the whole curriculum, so the last lesson of a course leads into the next course.
  const globalIndex = ALL_LESSONS.findIndex(l => l.id === currentLesson.id);
  const prevLesson = globalIndex > 0 ? ALL_LESSONS[globalIndex - 1] : undefined;
  const nextLesson = globalIndex < ALL_LESSONS.length - 1 ? ALL_LESSONS[globalIndex + 1] : undefined;
  const nextLabel = nextLesson && nextLesson.courseId !== currentLesson.courseId
    ? `Start Course ${nextLesson.courseId.slice(-1)}`
    : 'Next Lesson';

  // ------------------------------------------------------------------ slide panel
  const openSlides = useCallback((deck: number, page: number) => {
    setSlideDrawerState(prev => ({ isOpen: true, deck, initialPage: page, nonce: prev.nonce + 1 }));
  }, []);

  /** Open a slide of a given deck (deck numbers: see content/decks.ts). */
  const handleOpenSlide = (deck: number, page: number) => openSlides(deck, page);

  const closeSlides = useCallback(() => {
    setSlideDrawerState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const toggleSlides = () => {
    if (slideDrawerState.isOpen) closeSlides();
    else openSlides(currentLesson.deck, currentLesson.sourcePages[0] || 1);
  };

  const isPanelDocked = slideDrawerState.isOpen && isDesktop;

  // Give the lesson column room: collapse the sidebar while the panel is docked on medium desktops.
  useEffect(() => {
    if (isPanelDocked && window.innerWidth < 1536 && isSidebarOpen) {
      sidebarAutoCollapsed.current = true;
      setIsSidebarOpen(false);
    } else if (!slideDrawerState.isOpen && sidebarAutoCollapsed.current) {
      sidebarAutoCollapsed.current = false;
      setIsSidebarOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPanelDocked, slideDrawerState.isOpen]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Academic Navigation Bar */}
      <Navbar
        activeCourseId={activeCourseId}
        onSelectCourse={handleSelectCourse}
        activeView={activeView}
        onChangeView={changeView}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleSlideDrawer={toggleSlides}
        isSlideDrawerOpen={slideDrawerState.isOpen}
        totalCompletedCount={progress.completedLessons.length}
        totalLessonsCount={ALL_LESSONS.length}
        xp={progress.xp || 0}
        streak={liveStreak(progress.streak)}
        onExportProgress={exportProgressJson}
        onImportProgress={importProgressJson}
        onResetProgress={resetProgress}
        onToggleSidebar={() => {
          sidebarAutoCollapsed.current = false;
          setIsSidebarOpen(prev => !prev);
        }}
      />

      {/* Main Layout Area — shrinks to the left while the slide panel is docked on the right */}
      <div className="flex-1 flex min-w-0" style={isPanelDocked ? { paddingRight: panelWidth } : undefined}>
        {activeView === 'lessons' && (
          <Sidebar
            course={currentCourse}
            activeLessonId={activeLessonId}
            completedLessons={progress.completedLessons}
            bossesBeaten={progress.bossesBeaten}
            onSelectLesson={handleSelectLesson}
            isOpen={isSidebarOpen}
            onToggleOpen={() => {
              sidebarAutoCollapsed.current = false;
              setIsSidebarOpen(prev => !prev);
            }}
          />
        )}

        {/* Content Viewer Router */}
        <main className="flex-1 min-w-0 pb-16">
          {activeView === 'lessons' && currentLesson && (
            <LessonView
              key={currentLesson.id}
              lesson={currentLesson}
              course={currentCourse}
              isCompleted={progress.completedLessons.includes(currentLesson.id)}
              isBookmarked={progress.bookmarks.includes(currentLesson.id)}
              userConfidence={progress.confidenceRatings[currentLesson.id] || 0}
              userNote={progress.notes[currentLesson.id] || ''}
              onToggleComplete={() => toggleLessonCompleted(currentLesson.id)}
              onToggleBookmark={() => toggleBookmark(currentLesson.id)}
              onSetConfidence={(rating) => setConfidence(currentLesson.id, rating)}
              onSaveNote={(text) => saveNote(currentLesson.id, text)}
              onAnswerCheckpoint={submitCheckpoint}
              onOpenSlideDrawer={(page) => openSlides(currentLesson.deck, page)}
              onNavigatePrev={prevLesson ? () => handleSelectLesson(prevLesson.id) : undefined}
              onNavigateNext={nextLesson ? () => handleSelectLesson(nextLesson.id) : undefined}
              nextLabel={nextLabel}
              checkpointAnswers={progress.checkpointAnswers}
              isLabUsed={!!currentLesson.labId && (progress.labsUsed || []).includes(currentLesson.labId.split('#')[0])}
              onLabUsed={markLabUsed}
              isBossBeaten={(progress.bossesBeaten || []).includes(currentLesson.moduleId)}
              onBossBeaten={markBossBeaten}
            />
          )}

          {/* Exam & Urgent stay mounted so an in-progress exam or sprint survives a quick look at a lesson. */}
          <div className={activeView === 'exam' ? '' : 'hidden'}>
            <ExamModeView
              onOpenSlide={handleOpenSlide}
              onNavigateToLesson={handleSelectLesson}
              onRecordAttempt={recordExamAttempt}
              examHistory={progress.examAttempts}
            />
          </div>

          <div className={activeView === 'urgent' ? '' : 'hidden'}>
            <UrgentStudyView
              isActive={activeView === 'urgent'}
              courses={COURSES}
              progress={progress}
              onRecordCard={recordUrgentCard}
              onFinishSprint={finishUrgentSprint}
              onNavigateToLesson={handleSelectLesson}
              onOpenSlide={handleOpenSlide}
              onLabUsed={markLabUsed}
            />
          </div>

          {activeView === 'journey' && (
            <JourneyView courses={COURSES} progress={progress} onNavigateToLesson={handleSelectLesson} />
          )}

          {activeView === 'cheatsheets' && (
            <CheatSheetsView
              courses={COURSES}
              initialCourseId={activeCourseId}
              completedLessons={progress.completedLessons}
              onNavigateToLesson={handleSelectLesson}
              onOpenSlide={handleOpenSlide}
            />
          )}

          {activeView === 'examsheet' && <ExamSheetView />}

          {activeView === 'formulas' && (
            <FormulaSheetView onOpenSlide={handleOpenSlide} />
          )}

          {activeView === 'glossary' && (
            <GlossaryView
              onNavigateToLesson={handleSelectLesson}
              onOpenSlide={handleOpenSlide}
            />
          )}

          {activeView === 'comparisons' && (
            <ComparisonMatrixView
              onNavigateToLesson={handleSelectLesson}
              onOpenSlide={handleOpenSlide}
            />
          )}

          {activeView === 'traceability' && (
            <TraceabilityView
              courses={COURSES}
              onNavigateToLesson={handleSelectLesson}
              onOpenSlide={handleOpenSlide}
            />
          )}
        </main>
      </div>

      {/* Slide panel: docked beside the content on desktop, floating on small screens */}
      <SlideViewerDrawer
        isOpen={slideDrawerState.isOpen}
        onClose={closeSlides}
        deck={slideDrawerState.deck}
        initialPage={slideDrawerState.initialPage}
        openNonce={slideDrawerState.nonce}
        docked={isDesktop}
        width={panelWidth}
        onWidthChange={setPanelWidth}
      />

      {/* Global Search Modal (Cmd+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        courses={COURSES}
        onSelectResult={(_courseId, lessonId) => {
          handleSelectLesson(lessonId);
          setIsSearchOpen(false);
        }}
      />

      <Toasts />
    </div>
  );
};

export default App;
