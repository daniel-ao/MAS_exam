import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { examQuestionsBank } from '../content/examQuestions';
import { ExamQuestion, UserProgress } from '../types';
import { deckLabel } from '../content/decks';
import MathView from './MathView';
import { RichText } from './RichText';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Flag,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart3,
  HelpCircle
} from 'lucide-react';

interface ExamModeViewProps {
  onOpenSlide: (deck: number, page: number) => void;
  onNavigateToLesson?: (lessonId: string) => void;
  onRecordAttempt: (attempt: UserProgress['examAttempts'][0]) => void;
  examHistory: UserProgress['examAttempts'];
}

type ExamState = 'setup' | 'active' | 'results';

export const ExamModeView: React.FC<ExamModeViewProps> = ({
  onOpenSlide,
  onNavigateToLesson,
  onRecordAttempt,
  examHistory
}) => {
  // Setup state
  const [examScope, setExamScope] = useState<'all' | 'course-1' | 'course-2' | 'course-3'>('all');
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [isTimed, setIsTimed] = useState<boolean>(true);
  const [timeMinutes, setTimeMinutes] = useState<number>(25);

  // Active state
  const [state, setState] = useState<ExamState>('setup');
  const [currentQuestions, setCurrentQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number[]>>({});
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);

  // Results review filter
  const [reviewFilter, setReviewFilter] = useState<'all' | 'missed' | 'flagged'>('all');

  // Timer countdown
  useEffect(() => {
    if (state !== 'active' || !isTimed) return;
    if (secondsRemaining <= 0) {
      handleFinishExam();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [state, isTimed, secondsRemaining]);

  // Start Exam
  const handleStartExam = (customQuestions?: ExamQuestion[]) => {
    let pool = customQuestions;
    if (!pool) {
      pool = examQuestionsBank.filter(q => examScope === 'all' || q.courseId === examScope);
      // Shuffle pool
      pool = [...pool];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      pool = pool.slice(0, Math.min(questionCount, pool.length));
    }

    if (pool.length === 0) return;

    setCurrentQuestions(pool);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedIds(new Set());
    setSecondsRemaining(timeMinutes * 60);
    setStartTime(Date.now());
    setShowConfirmSubmit(false);
    setState('active');
  };

  // Option selection
  const handleToggleOption = (qId: string, optIdx: number, type: string) => {
    setUserAnswers(prev => {
      const current = prev[qId] || [];
      if (type === 'multiple') {
        const next = current.includes(optIdx)
          ? current.filter(i => i !== optIdx)
          : [...current, optIdx].sort((a, b) => a - b);
        return { ...prev, [qId]: next };
      } else {
        return { ...prev, [qId]: [optIdx] };
      }
    });
  };

  const handleToggleFlag = (qId: string) => {
    setFlaggedIds(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  // Submit Exam
  const handleFinishExam = () => {
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    let correctCount = 0;
    const missed: string[] = [];

    currentQuestions.forEach(q => {
      const ans = userAnswers[q.id] || [];
      const isCorrect =
        ans.length === q.correctAnswers.length &&
        ans.every(val => q.correctAnswers.includes(val));
      if (isCorrect) {
        correctCount++;
      } else {
        missed.push(q.id);
      }
    });

    const scorePercent = Math.round((correctCount / currentQuestions.length) * 100);

    const attempt = {
      id: `attempt-${Date.now()}`,
      timestamp: Date.now(),
      courseId: examScope,
      totalQuestions: currentQuestions.length,
      correctCount,
      scorePercent,
      timeSpentSeconds: elapsedSeconds,
      missedQuestionIds: missed
    };

    onRecordAttempt(attempt);

    // Confetti on distinction
    if (scorePercent >= 80) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }

    setState('results');
  };

  // Results calculation
  const examStats = useMemo(() => {
    if (state !== 'results' || currentQuestions.length === 0) return null;

    let correctCount = 0;
    const missedList: ExamQuestion[] = [];
    const courseStats: Record<string, { total: number; correct: number }> = {
      'course-1': { total: 0, correct: 0 },
      'course-2': { total: 0, correct: 0 },
      'course-3': { total: 0, correct: 0 }
    };

    currentQuestions.forEach(q => {
      const ans = userAnswers[q.id] || [];
      const isCorrect =
        ans.length === q.correctAnswers.length &&
        ans.every(val => q.correctAnswers.includes(val));

      if (courseStats[q.courseId]) {
        courseStats[q.courseId].total++;
        if (isCorrect) courseStats[q.courseId].correct++;
      }

      if (isCorrect) {
        correctCount++;
      } else {
        missedList.push(q);
      }
    });

    const percent = Math.round((correctCount / currentQuestions.length) * 100);
    const frenchGrade = ((correctCount / currentQuestions.length) * 20).toFixed(1);

    let mention = 'Ajourné';
    let mentionColor = 'text-rose-700 bg-rose-50 border-rose-200';
    const numGrade = parseFloat(frenchGrade);
    if (numGrade >= 16) {
      mention = 'Très Bien (High Honors)';
      mentionColor = 'text-emerald-800 bg-emerald-50 border-emerald-200';
    } else if (numGrade >= 14) {
      mention = 'Bien (Honors)';
      mentionColor = 'text-teal-800 bg-teal-50 border-teal-200';
    } else if (numGrade >= 12) {
      mention = 'Assez Bien (Satisfactory)';
      mentionColor = 'text-blue-800 bg-blue-50 border-blue-200';
    } else if (numGrade >= 10) {
      mention = 'Passable (Pass)';
      mentionColor = 'text-amber-800 bg-amber-50 border-amber-200';
    }

    return {
      correctCount,
      totalCount: currentQuestions.length,
      percent,
      frenchGrade,
      mention,
      mentionColor,
      missedList,
      courseStats
    };
  }, [state, currentQuestions, userAnswers]);

  // Handle slide view from review
  const handleOpenSlideNumber = (deck: number, slidePage?: number) => {
    if (!slidePage) return;
    onOpenSlide(deck, slidePage);
  };

  // Retake missed
  const handleRetakeMissed = () => {
    if (!examStats || examStats.missedList.length === 0) return;
    handleStartExam(examStats.missedList);
  };

  // -------------------------------------------------------------
  // RENDER: SETUP SCREEN
  // -------------------------------------------------------------
  if (state === 'setup') {
    const totalAvailable = examQuestionsBank.filter(
      q => examScope === 'all' || q.courseId === examScope
    ).length;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-teal-700 text-sm font-semibold uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4" /> Examination Simulator
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Master 2 IA Exam Practice Simulator
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Simulate realistic exam conditions for the Multi-Agent Systems course (SMEIA305).
            Answers remain hidden until full submission, after which you receive complete French /20 grading,
            course-by-course analytics, and option-by-option failure explanations.
          </p>
        </div>

        {/* Configuration Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 space-y-6">
          <h2 className="text-lg font-serif font-bold text-slate-900 pb-3 border-b border-stone-100">
            Exam Configuration
          </h2>

          {/* Scope Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              Examination Scope:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExamScope('all')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  examScope === 'all'
                    ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-600'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                }`}
              >
                <div className="font-semibold text-sm text-slate-900">Comprehensive Final Exam</div>
                <div className="text-xs text-stone-500 mt-0.5">All 3 chapters (agents, mechanisms, modal logic)</div>
              </button>

              <button
                type="button"
                onClick={() => setExamScope('course-1')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  examScope === 'course-1'
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                }`}
              >
                <div className="font-semibold text-sm text-slate-900">Chapter 1: Agents & Organizations</div>
                <div className="text-xs text-stone-500 mt-0.5">Agent properties, architectures, BDI, environments, organizations</div>
              </button>

              <button
                type="button"
                onClick={() => setExamScope('course-2')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  examScope === 'course-2'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                }`}
              >
                <div className="font-semibold text-sm text-slate-900">Chapter 2: Reputation, Voting & Games</div>
                <div className="text-xs text-stone-500 mt-0.5">Beta reputation, Sybil, voting rules, Nash equilibrium, norms</div>
              </button>

              <button
                type="button"
                onClick={() => setExamScope('course-3')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  examScope === 'course-3'
                    ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                }`}
              >
                <div className="font-semibold text-sm text-slate-900">Chapter 3: Modal Logic & Manipulation</div>
                <div className="text-xs text-stone-500 mt-0.5">S5, KD45, Kripke, PDL/DEL/STIT/BIAT, KBE</div>
              </button>
            </div>
          </div>

          {/* Question Count & Timer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Number of Questions ({totalAvailable} available):
              </label>
              <div className="flex items-center gap-2">
                {[10, 15, 20, Math.min(30, totalAvailable), totalAvailable].filter((v, i, a) => a.indexOf(v) === i).map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      questionCount === count
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {count === totalAvailable ? `All (${count})` : count}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Examination Timer:
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTimed(true)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                    isTimed
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timed ({timeMinutes} min)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsTimed(false)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    !isTimed
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Untimed Practice
                </button>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Exam will draw {Math.min(questionCount, totalAvailable)} randomized questions from the chosen syllabus.
            </span>
            <button
              onClick={() => handleStartExam()}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
            >
              <span>Begin Examination</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Previous Attempts History */}
        {examHistory && examHistory.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-700" /> Previous Examination Attempts
            </h3>
            <div className="divide-y divide-stone-100">
              {examHistory.slice(0, 5).map(attempt => (
                <div key={attempt.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-800">
                      {attempt.courseId === 'all' ? 'Comprehensive Final' : attempt.courseId.toUpperCase()} • {attempt.totalQuestions} Questions
                    </div>
                    <div className="text-stone-400 text-[11px] mt-0.5">
                      {new Date(attempt.timestamp).toLocaleDateString()} at {new Date(attempt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {Math.round(attempt.timeSpentSeconds / 60)} min elapsed
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900">{attempt.scorePercent}%</span>
                      <span className="text-[11px] text-stone-500 ml-1">({attempt.correctCount}/{attempt.totalQuestions})</span>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      attempt.scorePercent >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      attempt.scorePercent >= 60 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {((attempt.scorePercent / 100) * 20).toFixed(1)}/20
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: ACTIVE EXAM SCREEN
  // -------------------------------------------------------------
  if (state === 'active') {
    const currentQ = currentQuestions[currentIndex];
    const userAns = userAnswers[currentQ.id] || [];
    const isFlagged = flaggedIds.has(currentQ.id);

    const answeredCount = Object.keys(userAnswers).filter(k => (userAnswers[k] || []).length > 0).length;
    const progressPercent = Math.round(((currentIndex + 1) / currentQuestions.length) * 100);

    const minutesLeft = Math.floor(secondsRemaining / 60);
    const secondsLeft = secondsRemaining % 60;
    const timerWarning = isTimed && secondsRemaining < 300;

    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Exam Navigation Header */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Question {currentIndex + 1} of {currentQuestions.length}
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-xs text-stone-600">
              Answered: <strong>{answeredCount}</strong>/{currentQuestions.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isTimed && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-bold border ${
                timerWarning
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                  : 'bg-stone-50 text-stone-700 border-stone-200'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
                </span>
              </div>
            )}

            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="text-xs font-semibold px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg shadow-sm transition-colors"
            >
              Finish Exam
            </button>
          </div>
        </div>

        {/* Quick Question Navigator Grid */}
        <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-sm mb-6">
          <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Quick Navigator:</span>
            <span className="flex items-center gap-3 text-[10px] normal-case text-stone-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-600 inline-block"></span> Answered</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Flagged</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-stone-200 inline-block"></span> Unanswered</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {currentQuestions.map((q, idx) => {
              const isAns = (userAnswers[q.id] || []).length > 0;
              const isFlg = flaggedIds.has(q.id);
              const isCurr = idx === currentIndex;

              let btnStyle = 'bg-stone-100 text-stone-600 border-stone-200';
              if (isCurr) {
                btnStyle = 'ring-2 ring-teal-600 bg-stone-900 text-white font-bold border-transparent';
              } else if (isFlg) {
                btnStyle = 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
              } else if (isAns) {
                btnStyle = 'bg-teal-50 text-teal-800 border-teal-300 font-medium';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 text-xs rounded-md border flex items-center justify-center transition-all ${btnStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Question Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          {/* Metadata Bar */}
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                {currentQ.category}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                {currentQ.difficulty}
              </span>
              {currentQ.type === 'multiple' && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Multiple Choices Apply
                </span>
              )}
            </div>

            <button
              onClick={() => handleToggleFlag(currentQ.id)}
              className={`text-xs font-medium px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
                isFlagged
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-600' : ''}`} />
              <span>{isFlagged ? 'Flagged' : 'Flag for review'}</span>
            </button>
          </div>

          {/* Question Text with KaTeX */}
          <div className="text-base sm:text-lg font-serif font-bold text-slate-900 leading-snug mb-6">
            <RichText text={currentQ.question} inline />
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = userAns.includes(optIdx);

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleToggleOption(currentQ.id, optIdx, currentQ.type)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-600 ring-1 ring-teal-600 text-slate-900 font-medium'
                      : 'bg-white border-stone-200 hover:border-stone-300 text-slate-700 hover:bg-stone-50/50'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'border-stone-300 text-stone-500 bg-stone-50'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <div className="flex-1 leading-relaxed">
                    <RichText text={opt} inline />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step Navigation Bar */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="text-xs font-semibold px-4 py-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentIndex < currentQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(currentQuestions.length - 1, prev + 1))}
                className="text-xs font-semibold px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <span>Next Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="text-xs font-semibold px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <span>Submit Exam</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
              <div className="flex items-center gap-3 text-amber-700 mb-3">
                <AlertCircle className="w-6 h-6" />
                <h3 className="font-serif font-bold text-lg text-slate-900">Confirm Exam Submission</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                You have answered <strong>{answeredCount}</strong> out of {currentQuestions.length} questions.
                {answeredCount < currentQuestions.length && (
                  <span className="block mt-1 text-rose-600 font-semibold">
                    Warning: You still have {currentQuestions.length - answeredCount} unanswered questions!
                  </span>
                )}
                Are you ready to submit your exam and receive your detailed grading?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Return to Exam
                </button>
                <button
                  onClick={handleFinishExam}
                  className="px-5 py-2 text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white rounded-lg shadow-sm transition-colors"
                >
                  Yes, Submit Exam
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: RESULTS & MISTAKE REVIEW SCREEN
  // -------------------------------------------------------------
  if (state === 'results' && examStats) {
    const filteredReviewQuestions = currentQuestions.filter(q => {
      const ans = userAnswers[q.id] || [];
      const isCorrect =
        ans.length === q.correctAnswers.length &&
        ans.every(val => q.correctAnswers.includes(val));

      if (reviewFilter === 'missed') return !isCorrect;
      if (reviewFilter === 'flagged') return flaggedIds.has(q.id);
      return true;
    });

    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Score Banner Hero */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" /> Examination Report Card
              </div>
              <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                Exam Evaluation & Diagnostic
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                Evaluation for {examScope === 'all' ? 'Comprehensive Master Syllabus' : examScope.toUpperCase()}
              </p>
            </div>

            {/* Score & Mention Display */}
            <div className="text-center sm:text-right shrink-0">
              <div className="text-4xl sm:text-5xl font-serif font-bold text-teal-800 tracking-tight">
                {examStats.frenchGrade}<span className="text-2xl text-stone-400 font-normal"> / 20</span>
              </div>
              <div className={`mt-2 text-xs font-bold px-3 py-1 rounded-full border inline-block ${examStats.mentionColor}`}>
                Mention: {examStats.mention} ({examStats.percent}%)
              </div>
            </div>
          </div>

          {/* Module Breakdown Analytics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-stone-500 uppercase">Ch. 1: Agents & Orgs</div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {examStats.courseStats['course-1'].correct} / {examStats.courseStats['course-1'].total}
              </div>
              <div className="text-xs text-stone-500">
                {examStats.courseStats['course-1'].total > 0
                  ? `${Math.round((examStats.courseStats['course-1'].correct / examStats.courseStats['course-1'].total) * 100)}% accuracy`
                  : 'No questions'}
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-stone-500 uppercase">Ch. 2: Mechanisms</div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {examStats.courseStats['course-2'].correct} / {examStats.courseStats['course-2'].total}
              </div>
              <div className="text-xs text-stone-500">
                {examStats.courseStats['course-2'].total > 0
                  ? `${Math.round((examStats.courseStats['course-2'].correct / examStats.courseStats['course-2'].total) * 100)}% accuracy`
                  : 'No questions'}
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-stone-500 uppercase">Ch. 3: Modal Logic</div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {examStats.courseStats['course-3'].correct} / {examStats.courseStats['course-3'].total}
              </div>
              <div className="text-xs text-stone-500">
                {examStats.courseStats['course-3'].total > 0
                  ? `${Math.round((examStats.courseStats['course-3'].correct / examStats.courseStats['course-3'].total) * 100)}% accuracy`
                  : 'No questions'}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-6 mt-6 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setState('setup')}
                className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Take Another Exam</span>
              </button>
              {examStats.missedList.length > 0 && (
                <button
                  onClick={handleRetakeMissed}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake {examStats.missedList.length} Missed Questions</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs font-medium">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1 rounded-md transition-all ${
                  reviewFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-stone-600 hover:text-slate-900'
                }`}
              >
                All ({currentQuestions.length})
              </button>
              <button
                onClick={() => setReviewFilter('missed')}
                className={`px-3 py-1 rounded-md transition-all ${
                  reviewFilter === 'missed' ? 'bg-white text-rose-700 shadow-sm' : 'text-stone-600 hover:text-rose-700'
                }`}
              >
                Missed Only ({examStats.missedList.length})
              </button>
              <button
                onClick={() => setReviewFilter('flagged')}
                className={`px-3 py-1 rounded-md transition-all ${
                  reviewFilter === 'flagged' ? 'bg-white text-amber-800 shadow-sm' : 'text-stone-600 hover:text-amber-800'
                }`}
              >
                Flagged ({flaggedIds.size})
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif font-bold text-slate-900">
            Question-by-Question Solution Breakdown & Error Rationale
          </h2>

          {filteredReviewQuestions.map((q, idx) => {
            const userAns = userAnswers[q.id] || [];
            const isCorrect =
              userAns.length === q.correctAnswers.length &&
              userAns.every(val => q.correctAnswers.includes(val));

            return (
              <div
                key={q.id}
                className={`bg-white border rounded-2xl p-6 shadow-sm transition-all ${
                  isCorrect ? 'border-emerald-200 hover:border-emerald-300' : 'border-rose-200 hover:border-rose-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {q.category}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                      {q.difficulty}
                    </span>
                  </div>

                  {q.sourceSlide && (
                    <button
                      onClick={() => handleOpenSlideNumber(q.deck, q.sourceSlide)}
                      className="text-xs text-stone-500 hover:text-teal-700 font-medium flex items-center gap-1 bg-stone-50 hover:bg-teal-50 px-2 py-1 rounded border border-stone-200 transition-colors"
                      title="Inspect original slide"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{deckLabel(q.deck)} · Slide {q.sourceSlide}</span>
                    </button>
                  )}
                </div>

                {/* Question */}
                <div className="text-base font-serif font-bold text-slate-900 leading-snug mb-4">
                  <RichText text={q.question} inline />
                </div>

                {/* Options Review */}
                <div className="space-y-2 mb-4">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAns.includes(optIdx);
                    const isRightAnswer = q.correctAnswers.includes(optIdx);

                    let cardClass = 'bg-stone-50/50 border-stone-200 text-slate-700';
                    let badgeClass = 'bg-stone-100 text-stone-500 border-stone-200';

                    if (isRightAnswer) {
                      cardClass = 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium';
                      badgeClass = 'bg-emerald-600 text-white border-emerald-600';
                    } else if (isSelected && !isRightAnswer) {
                      cardClass = 'bg-rose-50/70 border-rose-300 text-rose-950';
                      badgeClass = 'bg-rose-600 text-white border-rose-600';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-3 transition-colors ${cardClass}`}
                      >
                        <span className={`w-5 h-5 rounded-full border text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${badgeClass}`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <div className="flex-1 leading-relaxed">
                          <RichText text={opt} inline />
                          {/* Option specific failure reason */}
                          {!isRightAnswer && q.whyOptionsIncorrect && q.whyOptionsIncorrect[optIdx] && (
                            <div className="text-[11px] text-rose-700/90 mt-1 font-normal italic flex items-start gap-1">
                              <XCircle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                              <span className="flex-1">
                                <RichText text={q.whyOptionsIncorrect[optIdx]} inline />
                              </span>
                            </div>
                          )}
                        </div>
                        {isRightAnswer && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                            Correct Answer
                          </span>
                        )}
                        {isSelected && !isRightAnswer && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">
                            Your Selection
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs text-slate-700 leading-relaxed">
                  <strong className="font-semibold text-slate-900 block mb-1">
                    Academic Explanation & Slide Grounding:
                  </strong>
                  <RichText text={q.explanation} size="xs" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default ExamModeView;

