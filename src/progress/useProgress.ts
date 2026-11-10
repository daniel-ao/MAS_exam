import { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { XP_REWARDS, bumpStreak } from '../gamification/xp';

const STORAGE_KEY = 'mas_exam_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  checkpointAnswers: {},
  bookmarks: [],
  notes: {},
  confidenceRatings: {},
  examAttempts: [],
  xp: 0,
  achievements: [],
  labsUsed: [],
  bossesBeaten: [],
  visitedLessons: [],
  firstTryStreak: 0,
  urgentSprintsCompleted: 0,
  urgentCardStats: {}
};

const isObj = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object' && !Array.isArray(v);
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/** Merge any (possibly older / partial / hand-edited) saved JSON onto the defaults. */
const normalizeProgress = (raw: unknown): UserProgress => {
  const p = isObj(raw) ? raw : {};
  return {
    completedLessons: arr<string>(p.completedLessons),
    checkpointAnswers: isObj(p.checkpointAnswers) ? p.checkpointAnswers : {},
    bookmarks: arr<string>(p.bookmarks),
    notes: isObj(p.notes) ? p.notes : {},
    confidenceRatings: isObj(p.confidenceRatings) ? p.confidenceRatings : {},
    examAttempts: arr<UserProgress['examAttempts'][0]>(p.examAttempts),
    xp: typeof p.xp === 'number' ? p.xp : 0,
    streak: isObj(p.streak) && typeof p.streak.count === 'number' ? (p.streak as UserProgress['streak']) : undefined,
    achievements: arr<string>(p.achievements),
    labsUsed: arr<string>(p.labsUsed),
    bossesBeaten: arr<string>(p.bossesBeaten),
    visitedLessons: arr<string>(p.visitedLessons),
    firstTryStreak: typeof p.firstTryStreak === 'number' ? p.firstTryStreak : 0,
    urgentSprintsCompleted: typeof p.urgentSprintsCompleted === 'number' ? p.urgentSprintsCompleted : 0,
    urgentCardStats: isObj(p.urgentCardStats) ? p.urgentCardStats : {}
  };
};

/** Every rewarded activity also keeps the daily streak alive. */
const reward = (prev: UserProgress, amount: number): Pick<UserProgress, 'xp' | 'streak'> => ({
  xp: Math.max(0, (prev.xp || 0) + amount),
  streak: amount > 0 ? bumpStreak(prev.streak) : prev.streak
});

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return normalizeProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load user progress from localStorage:', e);
    }
    return DEFAULT_PROGRESS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save user progress to localStorage:', e);
    }
  }, [progress]);

  const toggleLessonCompleted = (lessonId: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) {
        return {
          ...prev,
          ...reward(prev, -XP_REWARDS.lessonCompleted),
          completedLessons: prev.completedLessons.filter(id => id !== lessonId)
        };
      }
      return {
        ...prev,
        ...reward(prev, XP_REWARDS.lessonCompleted),
        completedLessons: [...prev.completedLessons, lessonId]
      };
    });
  };

  const markLessonVisited = (lessonId: string) => {
    setProgress(prev => {
      const visited = prev.visitedLessons || [];
      if (visited.includes(lessonId)) return prev;
      return { ...prev, visitedLessons: [...visited, lessonId] };
    });
  };

  const toggleBookmark = (lessonId: string) => {
    setProgress(prev => {
      const exists = prev.bookmarks.includes(lessonId);
      return {
        ...prev,
        bookmarks: exists
          ? prev.bookmarks.filter(id => id !== lessonId)
          : [...prev.bookmarks, lessonId]
      };
    });
  };

  const saveNote = (lessonId: string, text: string) => {
    setProgress(prev => {
      if ((prev.notes[lessonId] || '') === text) return prev;
      return {
        ...prev,
        notes: {
          ...prev.notes,
          [lessonId]: text
        }
      };
    });
  };

  const setConfidence = (lessonId: string, rating: number) => {
    setProgress(prev => ({
      ...prev,
      confidenceRatings: {
        ...prev.confidenceRatings,
        [lessonId]: rating
      }
    }));
  };

  const submitCheckpoint = (questionId: string, answers: number[], isCorrect: boolean) => {
    setProgress(prev => {
      const previous = prev.checkpointAnswers[questionId];
      const isFirstTry = !previous;
      const alreadyEarned = !!previous?.isCorrect;
      const gained = isCorrect && !alreadyEarned
        ? (isFirstTry ? XP_REWARDS.checkpointFirstTry : XP_REWARDS.checkpointRetry)
        : 0;
      const firstTryStreak = isFirstTry
        ? (isCorrect ? (prev.firstTryStreak || 0) + 1 : 0)
        : prev.firstTryStreak || 0;
      return {
        ...prev,
        ...(gained ? reward(prev, gained) : { streak: bumpStreak(prev.streak) }),
        firstTryStreak,
        checkpointAnswers: {
          ...prev.checkpointAnswers,
          // Once a checkpoint was solved, keep it marked as solved even if a later retry fails.
          [questionId]: {
            answers,
            isCorrect: isCorrect || alreadyEarned,
            timestamp: Date.now()
          }
        }
      };
    });
  };

  const markLabUsed = (rawLabId: string) => {
    // "kripke-lab#td1" opens a lab on a preset; progress tracks the lab itself.
    const labId = rawLabId.split('#')[0];
    setProgress(prev => {
      const used = prev.labsUsed || [];
      if (used.includes(labId)) return prev;
      return { ...prev, ...reward(prev, XP_REWARDS.labUsed), labsUsed: [...used, labId] };
    });
  };

  const markBossBeaten = (moduleId: string) => {
    setProgress(prev => {
      const beaten = prev.bossesBeaten || [];
      if (beaten.includes(moduleId)) return prev;
      return { ...prev, ...reward(prev, XP_REWARDS.bossBeaten), bossesBeaten: [...beaten, moduleId] };
    });
  };

  const recordExamAttempt = (attempt: UserProgress['examAttempts'][0]) => {
    setProgress(prev => ({
      ...prev,
      ...reward(prev, attempt.correctCount * XP_REWARDS.examCorrectAnswer),
      examAttempts: [attempt, ...prev.examAttempts]
    }));
  };

  const recordUrgentCard = (cardId: string, good: boolean) => {
    setProgress(prev => {
      const stats = prev.urgentCardStats || {};
      const s = stats[cardId] || { good: 0, again: 0, last: 0 };
      return {
        ...prev,
        ...reward(prev, good ? XP_REWARDS.urgentCardGood : 0),
        urgentCardStats: {
          ...stats,
          [cardId]: {
            good: s.good + (good ? 1 : 0),
            again: s.again + (good ? 0 : 1),
            last: Date.now()
          }
        }
      };
    });
  };

  const finishUrgentSprint = () => {
    setProgress(prev => ({
      ...prev,
      ...reward(prev, XP_REWARDS.urgentSprintFinished),
      urgentSprintsCompleted: (prev.urgentSprintsCompleted || 0) + 1
    }));
  };

  const unlockAchievements = (ids: string[]) => {
    if (ids.length === 0) return;
    setProgress(prev => {
      const have = prev.achievements || [];
      const fresh = ids.filter(id => !have.includes(id));
      if (fresh.length === 0) return prev;
      return { ...prev, achievements: [...have, ...fresh] };
    });
  };

  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const exportProgressJson = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `mas_exam_progress_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const importProgressJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (isObj(parsed)) {
        setProgress(normalizeProgress(parsed));
        return true;
      }
    } catch (e) {
      console.error('Import parse error:', e);
    }
    return false;
  };

  return {
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
  };
};
