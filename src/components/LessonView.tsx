import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Lesson, Course, UserProgress } from '../types';
import { LessonProgressRail, RailStep } from './LessonProgressRail';
import { ModuleBoss } from './ModuleBoss';
import { MathView } from './MathView';
import { RichText } from './RichText';
import { CheckpointWidget } from './CheckpointWidget';
import { LabHost } from './LabHost';
import { CheatSheetCard } from './CheatSheetCard';
import { deckLabel, pagesLabel } from '../content/decks';
import {
  BookOpen,
  Bookmark,
  CheckCircle,
  Eye,
  Sparkles,
  AlertOctagon,
  FileText,
  Star,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Image as ImageIcon,
  ScrollText
} from 'lucide-react';

const CHEATSHEET_OPEN_KEY = 'mas_exam_cheatsheet_open';
const readCheatOpen = () => {
  try {
    return localStorage.getItem(CHEATSHEET_OPEN_KEY) === '1';
  } catch {
    return false;
  }
};

interface LessonViewProps {
  lesson: Lesson;
  course: Course;
  isCompleted: boolean;
  isBookmarked: boolean;
  userConfidence: number;
  userNote: string;
  onToggleComplete: () => void;
  onToggleBookmark: () => void;
  onSetConfidence: (rating: number) => void;
  onSaveNote: (text: string) => void;
  onAnswerCheckpoint: (questionId: string, answers: number[], isCorrect: boolean) => void;
  onOpenSlideDrawer: (page: number) => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  nextLabel?: string;
  checkpointAnswers: UserProgress['checkpointAnswers'];
  isLabUsed: boolean;
  onLabUsed: (labId: string) => void;
  isBossBeaten: boolean;
  onBossBeaten: (moduleId: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  course,
  isCompleted,
  isBookmarked,
  userConfidence,
  userNote,
  onToggleComplete,
  onToggleBookmark,
  onSetConfidence,
  onSaveNote,
  onAnswerCheckpoint,
  onOpenSlideDrawer,
  onNavigatePrev,
  onNavigateNext,
  nextLabel = 'Next Lesson',
  checkpointAnswers,
  isLabUsed,
  onLabUsed,
  isBossBeaten,
  onBossBeaten
}) => {
  // LessonView is keyed by lesson id in App, so local state starts fresh for every lesson.
  const [noteText, setNoteText] = useState<string>(userNote || '');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [theoryRead, setTheoryRead] = useState(false);
  const [exampleRead, setExampleRead] = useState(false);
  const [cheatOpen, setCheatOpen] = useState<boolean>(readCheatOpen);

  const toggleCheat = () => {
    setCheatOpen(prev => {
      try {
        localStorage.setItem(CHEATSHEET_OPEN_KEY, prev ? '0' : '1');
      } catch {
        /* storage unavailable: keep it per-session */
      }
      return !prev;
    });
  };

  const handleNoteBlur = () => {
    if (noteText === (userNote || '')) return;
    onSaveNote(noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  // Tick "read" sections once their end has scrolled into view.
  useEffect(() => {
    const watch = (id: string, cb: () => void) => {
      const el = document.getElementById(id);
      if (!el) return undefined;
      const io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) {
          cb();
          io.disconnect();
        }
      });
      io.observe(el);
      return io;
    };
    const a = watch('lesson-theory-end', () => setTheoryRead(true));
    const b = watch('lesson-example-end', () => setExampleRead(true));
    return () => {
      a?.disconnect();
      b?.disconnect();
    };
  }, []);

  const currentModule = course.modules.find(m => m.id === lesson.moduleId);
  const isLastInModule = !!currentModule && currentModule.lessons[currentModule.lessons.length - 1]?.id === lesson.id;
  const solvedCheckpoints = lesson.checkpoints.filter(cp => checkpointAnswers[cp.id]?.isCorrect).length;
  const allCheckpointsSolved = lesson.checkpoints.length > 0 && solvedCheckpoints === lesson.checkpoints.length;

  const handleToggleComplete = () => {
    if (!isCompleted) {
      confetti({ particleCount: 70, spread: 60, startVelocity: 35, origin: { y: 0.25 }, colors: ['#0f766e', '#14b8a6', '#6366f1', '#f59e0b'] });
    }
    onToggleComplete();
  };

  const railSteps: RailStep[] = [
    { id: 'lesson-theory', label: 'Theory', done: theoryRead },
    ...(lesson.labId ? [{ id: 'lesson-lab', label: 'Lab', done: isLabUsed }] : []),
    ...(lesson.workedExample ? [{ id: 'lesson-example', label: 'Example', done: exampleRead }] : []),
    ...(lesson.checkpoints.length > 0
      ? [{ id: 'lesson-checkpoints', label: 'Checkpoints', done: allCheckpointsSolved, detail: `${solvedCheckpoints}/${lesson.checkpoints.length}` }]
      : []),
    { id: 'lesson-finish', label: 'Mastered', done: isCompleted }
  ];

  return (
    <div ref={rootRef} className="max-w-4xl mx-auto pb-8 px-4 sm:px-6 space-y-8 animate-in fade-in duration-150">
      <LessonProgressRail containerRef={rootRef} steps={railSteps} />

      {/* Breadcrumb & Navigation Topbar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-teal-800">{course.title}</span>
          <span>/</span>
          <span>{currentModule?.title.split(':')[0]}</span>
          <span>/</span>
          <span className="font-medium text-slate-700">{lesson.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Slide badge */}
          <button
            onClick={() => onOpenSlideDrawer(lesson.sourcePages[0])}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-slate-700 font-semibold transition-all border border-stone-300"
            title="Inspect corresponding lecture slide in side-by-side drawer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-teal-700" />
            <span>{deckLabel(lesson.deck)} · {pagesLabel(lesson.sourcePages)}</span>
          </button>

          {/* Bookmark toggle */}
          <button
            onClick={onToggleBookmark}
            className={`p-1.5 rounded-md border transition-all ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-white border-stone-300 text-slate-400 hover:text-slate-700'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            {lesson.title}
          </h1>

          <button
            onClick={handleToggleComplete}
            title={isCompleted ? 'Click to mark as not done' : 'Mark this lesson as mastered (+50 XP)'}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isCompleted
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-stone-300 hover:border-emerald-300'
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${isCompleted ? 'fill-white text-emerald-600' : ''}`} />
            {isCompleted ? 'Mastered' : 'Mark as Done'}
          </button>
        </div>

        <div className="text-sm text-slate-600 leading-relaxed font-sans">
          <RichText text={lesson.summary} inline />
        </div>

        {/* Confidence rating stars + cheat sheet toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Self-Assessed Mastery:</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onSetConfidence(star)}
                className="p-0.5 hover:scale-110 transition-transform"
                title={`Rate understanding ${star}/5`}
              >
                <Star
                  className={`w-4 h-4 ${
                    star <= userConfidence
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-stone-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

          <button
            onClick={toggleCheat}
            aria-expanded={cheatOpen}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              cheatOpen
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-stone-300 text-slate-700 hover:border-emerald-300 hover:text-emerald-800'
            }`}
            title="One-glance summary of this lesson"
          >
            <ScrollText className="w-3.5 h-3.5" />
            {cheatOpen ? 'Hide cheat sheet' : 'Cheat sheet'}
          </button>
        </div>
      </div>

      {cheatOpen && (
        <div className="animate-in fade-in duration-150">
          <CheatSheetCard lesson={lesson} embedded />
        </div>
      )}

      {/* STAGE 1: UNDERSTAND (Core Academic Exposition) */}
      <section id="lesson-theory" className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100 text-teal-800">
          <BookOpen className="w-5 h-5 text-teal-700" />
          <h2 className="text-lg font-bold">1. Understand the Theory</h2>
        </div>

        {/* Intuitive Overview Card */}
        <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100 text-teal-950">
          <strong className="block mb-1.5 text-teal-900 font-bold uppercase tracking-wider text-[11px]">
            Intuitive Core Idea
          </strong>
          <RichText text={lesson.understand.overview} size="sm" />
        </div>

        {/* Detailed Textbook Explanation */}
        <div className="pt-2">
          <RichText text={lesson.understand.detailedExplanation} size="base" />
        </div>

        {/* Key Takeaways */}
        {lesson.understand.keyPoints.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">Key Concepts to Remember</h4>
            <ul className="space-y-2 text-sm leading-6 text-slate-700 pl-5 list-disc marker:text-teal-600">
              {lesson.understand.keyPoints.map((pt, i) => (
                <li key={i}><RichText text={pt} inline /></li>
              ))}
            </ul>
          </div>
        )}
        <div id="lesson-theory-end" aria-hidden className="h-px" />
      </section>

      {/* STAGE 2: VISUALIZE */}
      {lesson.visualize && (
        <section className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 text-sky-800">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-sky-700" />
              <h2 className="text-lg font-bold">2. Visualize the Idea</h2>
            </div>
            <button
              onClick={() => onOpenSlideDrawer(lesson.sourcePages[0])}
              className="text-xs text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1"
            >
              Compare with {deckLabel(lesson.deck)}, Slide {lesson.sourcePages[0]}
            </button>
          </div>

          <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100 text-xs text-slate-700">
            <h3 className="font-bold text-sky-950 mb-1"><RichText text={lesson.visualize.title} inline /></h3>
            <RichText text={lesson.visualize.description} size="sm" />
          </div>
        </section>
      )}

      {/* STAGE 3: INTERACTIVE LEARNING LABORATORY */}
      {lesson.labId && (
        <section id="lesson-lab" className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-indigo-900 px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-700" />
              <h2 className="text-lg font-bold">3. Interactive Learning Laboratory</h2>
            </div>
            {!isLabUsed && (
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-2 py-0.5">
                Experiment to earn +15 XP
              </span>
            )}
          </div>
          <div onPointerDownCapture={() => !isLabUsed && onLabUsed(lesson.labId!)} onKeyDownCapture={() => !isLabUsed && onLabUsed(lesson.labId!)}>
            <LabHost labId={lesson.labId} />
          </div>
        </section>
      )}

      {/* STAGE 4: WORK THROUGH IT (Step-by-Step Numerical Example) */}
      {lesson.workedExample && (
        <section id="lesson-example" className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100 text-purple-900">
            <Calculator className="w-5 h-5 text-purple-700" />
            <h2 className="text-lg font-bold">4. Step-by-Step Worked Example</h2>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm"><RichText text={lesson.workedExample.title} inline /></h3>
            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs text-purple-950">
              <strong className="block text-purple-900 mb-1">Problem Statement:</strong>
              <RichText text={lesson.workedExample.problem} size="xs" />
            </div>
          </div>

          <div className="space-y-3">
            {lesson.workedExample.steps.map((st, i) => (
              <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-mono">
                    {i + 1}
                  </span>
                  <span><RichText text={st.title} inline /></span>
                </div>
                <div className="text-slate-600 pl-7">
                  <RichText text={st.explanation} size="xs" />
                </div>
                {st.math && (
                  <div className="pl-7 pt-1">
                    <MathView math={st.math} block={true} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
            <strong>Conclusion: </strong><RichText text={lesson.workedExample.conclusion} inline />
          </div>
          <div id="lesson-example-end" aria-hidden className="h-px" />
        </section>
      )}

      {/* STAGE 5: CHECK UNDERSTANDING (Checkpoints) */}
      {lesson.checkpoints.length > 0 && (
        <section id="lesson-checkpoints" className="space-y-3">
          <div className="flex items-center justify-between text-teal-900 px-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-700" />
              <h2 className="text-lg font-bold">5. Check Your Understanding</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {solvedCheckpoints}/{lesson.checkpoints.length} solved
            </span>
          </div>

          <div className="space-y-4">
            {lesson.checkpoints.map(cp => (
              <CheckpointWidget
                key={cp.id}
                question={cp}
                userAnswer={checkpointAnswers[cp.id]?.answers}
                onAnswerSubmit={onAnswerCheckpoint}
                onOpenSlide={onOpenSlideDrawer}
              />
            ))}
          </div>

          {allCheckpointsSolved && !isCompleted && (
            <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50 flex flex-wrap items-center justify-between gap-3 animate-pop-in">
              <div className="text-sm text-emerald-900">
                <strong>All checkpoints solved.</strong> Ready to light up this star?
              </div>
              <button
                onClick={handleToggleComplete}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Mark as Mastered · +50 XP
              </button>
            </div>
          )}
        </section>
      )}

      {/* STAGE 6: EXAM PITFALLS & COMMON MISCONCEPTIONS */}
      {lesson.examPitfalls && lesson.examPitfalls.length > 0 && (
        <section className="bg-rose-50/60 border border-rose-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-rose-200 text-rose-900">
            <AlertOctagon className="w-5 h-5 text-rose-700" />
            <h2 className="text-lg font-bold">6. University Exam Pitfalls & Misconceptions</h2>
          </div>

          <ul className="space-y-2 text-xs text-rose-950 pl-4 list-disc">
            {lesson.examPitfalls.map((pit, idx) => (
              <li key={idx} className="leading-relaxed font-sans"><RichText text={pit} inline /></li>
            ))}
          </ul>
        </section>
      )}

      {/* STAGE 7: FORMULAS SHEET ENTRY */}
      {lesson.formulas && lesson.formulas.length > 0 && (
        <section className="bg-stone-50 rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-200 text-slate-800">
            <Calculator className="w-5 h-5 text-teal-700" />
            <h2 className="text-lg font-bold">7. Mathematical Formulas Reference</h2>
          </div>

          <div className="space-y-4">
            {lesson.formulas.map((f, i) => (
              <div key={i} className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">{f.name}</span>
                <MathView math={f.latex} block={true} />
                <p className="text-xs text-slate-600 leading-relaxed"><RichText text={f.explanation} inline /></p>
                {f.variables.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-slate-500">
                    {f.variables.map((v, vi) => (
                      <span key={vi}>
                        <strong className="text-teal-700">{v.symbol}</strong>: {v.description}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STAGE 8: SCHOLARLY CITATIONS */}
      {lesson.references && lesson.references.length > 0 && (
        <section className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-slate-600 space-y-2">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
            Academic Citations (Original Slides):
          </span>
          <ul className="space-y-1 pl-4 list-disc">
            {lesson.references.map((ref, idx) => (
              <li key={idx} className="leading-relaxed"><RichText text={ref} inline /></li>
            ))}
          </ul>
        </section>
      )}

      {/* Module Boss — closes each module with a short mixed quiz */}
      {isLastInModule && currentModule && (
        <ModuleBoss
          module={currentModule}
          course={course}
          isBeaten={isBossBeaten}
          onBeat={() => onBossBeaten(currentModule.id)}
        />
      )}

      {/* Personal Study Notes */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800">
            <FileText className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold">Personal Study Notes</h3>
          </div>
          {noteSaved && (
            <span className="text-[11px] text-emerald-600 font-bold animate-pulse">
              ✓ Saved locally
            </span>
          )}
        </div>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onBlur={handleNoteBlur}
          rows={3}
          className="w-full text-xs font-sans bg-stone-50 border border-stone-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder-slate-400"
          placeholder="Record personal derivations, exam thoughts, or questions to review..."
        />
      </section>

      {/* Bottom Navigation Buttons */}
      <div id="lesson-finish" className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-stone-200">
        {onNavigatePrev ? (
          <button
            onClick={onNavigatePrev}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-slate-700 transition-all shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Lesson
          </button>
        ) : <div />}

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {!isCompleted && (
            <button
              onClick={() => {
                handleToggleComplete();
                onNavigateNext?.();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 transition-all shadow-xs"
            >
              <CheckCircle className="w-4 h-4" /> {onNavigateNext ? 'Mark done & continue' : 'Mark as done'}
            </button>
          )}
          {onNavigateNext && (
            <button
              onClick={onNavigateNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-xs font-bold text-white transition-all shadow-xs"
            >
              {nextLabel} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

